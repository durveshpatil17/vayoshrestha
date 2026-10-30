import { create } from 'zustand';
import { UserAccount } from '@/api/contracts';
import { RoleCode } from '@/permissions/matrix';
import { mockStore } from '@/mock/store';

export interface AuthState {
  user: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRegionId: string | null;
  activeChapterId: string | null;
  activeCentreId: string | null; // backwards-compatible alias for activeChapterId
  textSize: 'normal' | 'large' | 'xlarge';
  chimeEnabled: boolean;
  idleWarningOpen: boolean;
  idleCountdown: number;
  openSosCount: number;
  favourites: string[];
  recentVisits: { title: string; path: string; category?: string; timestamp: number }[];

  // Actions
  loginWithPassword: (email: string, pass: string) => { success: boolean; requiresMfa?: boolean; error?: string };
  loginWithOtp: (phone: string, otp: string) => { success: boolean; error?: string };
  verifyMfa: (code: string) => { success: boolean; error?: string };
  switchPersona: (roleCode: RoleCode) => void;
  setActiveRegion: (regionId: string) => void;
  setActiveChapter: (chapterId: string) => void;
  setActiveCentre: (centreId: string) => void; // alias
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  toggleChime: () => void;
  setOpenSosCount: (count: number) => void;
  toggleFavourite: (appIdOrPath: string) => void;
  addRecentVisit: (visit: { title: string; path: string; category?: string }) => void;
  logout: () => void;
  resetFailedAttempts: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Pre-seed initial default user for prototype immediate readiness: Regional Admin (Arjun Nambiar)
  const defaultUsers = mockStore.getData().users;
  const initialUser = defaultUsers.find((u) => u.role === 'RA') || defaultUsers[0];

  const sosCount = mockStore.getData().sosEvents.filter((e) => e.status === 'Triggered' || e.status === 'Acknowledged').length;

  return {
    user: initialUser,
    token: 'mock-jwt-initial-token',
    isAuthenticated: true,
    activeRegionId: initialUser.assignedRegion || 'REG-W',
    activeChapterId: initialUser.assignedChapter || initialUser.assignedCentres[0] || 'HUB-PUN',
    activeCentreId: initialUser.assignedChapter || initialUser.assignedCentres[0] || 'HUB-PUN',
    textSize: 'normal',
    chimeEnabled: false, // off by default per brief
    idleWarningOpen: false,
    idleCountdown: 60,
    openSosCount: sosCount,
    favourites: ['/sos', '/seniors', '/health', '/programmes'],
    recentVisits: [
      { title: 'Emergency SOS Board', path: '/sos', category: 'Emergency', timestamp: Date.now() - 360000 },
      { title: 'Seniors Directory', path: '/seniors', category: 'Seniors', timestamp: Date.now() - 720000 },
      { title: 'Care Overview', path: '/health', category: 'Care', timestamp: Date.now() - 1080000 },
      { title: 'Community Programmes', path: '/programmes', category: 'Community', timestamp: Date.now() - 1440000 },
    ],

    loginWithPassword: (email, pass) => {
      const users = mockStore.getData().users;
      const targetUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!targetUser) {
        return { success: false, error: 'Invalid email or password.' };
      }

      if (targetUser.lockoutUntil && new Date(targetUser.lockoutUntil) > new Date()) {
        return { success: false, error: 'Account is temporarily locked due to excessive failed attempts. Please retry later or contact administrator.' };
      }

      if (pass !== 'Demo@1234') {
        mockStore.updateData((data) => {
          const u = data.users.find((x) => x.id === targetUser.id);
          if (u) {
            u.failedLoginAttempts += 1;
            if (u.failedLoginAttempts >= 5) {
              u.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            }
          }
        });
        return { success: false, error: 'Invalid email or password.' };
      }

      // Check MFA for SA and NM
      if (targetUser.role === 'SA' || targetUser.role === 'NM') {
        return { success: true, requiresMfa: true };
      }

      set({
        user: targetUser,
        token: `mock-jwt-token-${targetUser.id}`,
        isAuthenticated: true,
        activeRegionId: targetUser.assignedRegion || 'REG-W',
        activeChapterId: targetUser.assignedChapter || targetUser.assignedCentres[0] || 'HUB-PUN',
        activeCentreId: targetUser.assignedChapter || targetUser.assignedCentres[0] || 'HUB-PUN',
      });

      mockStore.writeAudit(
        targetUser.id,
        targetUser.fullName,
        targetUser.role,
        'APPROVE',
        'USER',
        targetUser.id,
        `User logged in successfully via password authentication.`
      );

      return { success: true };
    },

    loginWithOtp: (phone, otp) => {
      const cleanPhone = phone.replace(/\D/g, '');
      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP. Please enter the 6-digit verification code.' };
      }

      const users = mockStore.getData().users;
      const matchedUser = users.find((u) => u.phone?.replace(/\D/g, '') === cleanPhone);
      const targetUser =
        matchedUser ||
        (cleanPhone.endsWith('01') ? users.find((u) => u.role === 'SF') : null) ||
        users.find((u) => u.role === 'SC') ||
        users[0];

      set({
        user: targetUser,
        token: `mock-otp-jwt-${cleanPhone}`,
        isAuthenticated: true,
        activeRegionId: targetUser.assignedRegion || 'REG-W',
        activeChapterId: targetUser.assignedChapter || 'HUB-PUN',
        activeCentreId: targetUser.assignedChapter || 'HUB-PUN',
        textSize: targetUser.role === 'SC' ? 'large' : 'normal',
      });

      return { success: true };
    },

    verifyMfa: (code) => {
      if (code !== '123456') {
        return { success: false, error: 'Invalid 6-digit MFA code.' };
      }

      const user = get().user;
      if (user) {
        set({ isAuthenticated: true, token: `mock-mfa-jwt-${user.id}` });
        return { success: true };
      }
      return { success: false, error: 'Session expired. Please log in again.' };
    },

    switchPersona: (roleCode) => {
      const users = mockStore.getData().users;
      const targetUser = users.find((u) => u.role === roleCode) || users[0];

      set({
        user: targetUser,
        token: `mock-jwt-${targetUser.id}`,
        isAuthenticated: true,
        activeRegionId: targetUser.assignedRegion || 'REG-W',
        activeChapterId: targetUser.assignedChapter || targetUser.assignedCentres[0] || 'HUB-PUN',
        activeCentreId: targetUser.assignedChapter || targetUser.assignedCentres[0] || 'HUB-PUN',
        textSize: roleCode === 'SC' ? 'large' : 'normal',
      });
    },

    setActiveRegion: (regionId) => set({ activeRegionId: regionId }),
    setActiveChapter: (chapterId) => set({ activeChapterId: chapterId, activeCentreId: chapterId }),
    setActiveCentre: (centreId) => set({ activeChapterId: centreId, activeCentreId: centreId }),
    setTextSize: (size) => set({ textSize: size }),
    toggleChime: () => set((state) => ({ chimeEnabled: !state.chimeEnabled })),
    setOpenSosCount: (count) => set({ openSosCount: count }),

    toggleFavourite: (appIdOrPath) => {
      set((state) => {
        const exists = state.favourites.includes(appIdOrPath);
        return {
          favourites: exists
            ? state.favourites.filter((f) => f !== appIdOrPath)
            : [...state.favourites, appIdOrPath],
        };
      });
    },

    addRecentVisit: (visit) => {
      set((state) => {
        const filtered = state.recentVisits.filter((v) => v.path !== visit.path);
        const updated = [{ ...visit, timestamp: Date.now() }, ...filtered].slice(0, 8);
        return { recentVisits: updated };
      });
    },

    logout: () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },

    resetFailedAttempts: (email) => {
      mockStore.updateData((data) => {
        const u = data.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (u) {
          u.failedLoginAttempts = 0;
          u.lockoutUntil = null;
        }
      });
    },
  };
});
