import { create } from 'zustand';
import { UserAccount } from '@/api/contracts';
import { RoleCode } from '@/permissions/matrix';
import { mockStore } from '@/mock/store';

export interface AuthState {
  user: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  activeCentreId: string | null;
  textSize: 'normal' | 'large' | 'xlarge';
  idleWarningOpen: boolean;
  idleCountdown: number;

  // Actions
  loginWithPassword: (email: string, pass: string) => { success: boolean; requiresMfa?: boolean; error?: string };
  loginWithOtp: (phone: string, otp: string) => { success: boolean; error?: string };
  verifyMfa: (code: string) => { success: boolean; error?: string };
  switchPersona: (roleCode: RoleCode) => void;
  setActiveCentre: (centreId: string) => void;
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  logout: () => void;
  resetFailedAttempts: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Pre-seed initial default user for prototype immediate readiness: Programme Manager (Arjun Nambiar)
  const defaultUsers = mockStore.getData().users;
  const initialUser = defaultUsers.find((u) => u.role === 'PM') || defaultUsers[0];

  return {
    user: initialUser,
    token: 'mock-jwt-initial-token',
    isAuthenticated: true,
    activeCentreId: initialUser.assignedCentres[0] || 'HUB-PUN',
    textSize: 'normal',
    idleWarningOpen: false,
    idleCountdown: 60,

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
        activeCentreId: targetUser.assignedCentres[0] || 'HUB-PUN',
      });

      mockStore.writeAudit(
        targetUser.id,
        targetUser.fullName,
        targetUser.role,
        'UPDATE',
        'UserAccount',
        targetUser.id,
        'Staff login successful'
      );

      return { success: true };
    },

    loginWithOtp: (phone, otp) => {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const users = mockStore.getData().users;
      const targetUser = users.find((u) => u.phone && u.phone.includes(cleanPhone));

      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP. Please enter 123456.' };
      }

      const activeUser = targetUser || users.find((u) => u.role === 'SC')!;
      set({
        user: activeUser,
        token: `mock-jwt-otp-${activeUser.id}`,
        isAuthenticated: true,
        activeCentreId: activeUser.assignedCentres[0] || 'HUB-PUN',
        textSize: activeUser.role === 'SC' || activeUser.role === 'FM' ? 'large' : 'normal',
      });

      return { success: true };
    },

    verifyMfa: (code) => {
      if (code !== '123456') {
        return { success: false, error: 'Invalid 6-digit TOTP code. Try 123456.' };
      }
      return { success: true };
    },

    switchPersona: (roleCode) => {
      const users = mockStore.getData().users;
      const match = users.find((u) => u.role === roleCode);
      if (match) {
        set({
          user: match,
          token: `mock-jwt-persona-${match.id}`,
          isAuthenticated: true,
          activeCentreId: match.assignedCentres[0] || 'HUB-PUN',
          textSize: roleCode === 'SC' || roleCode === 'FM' ? 'large' : 'normal',
        });

        mockStore.writeAudit(
          match.id,
          match.fullName,
          match.role,
          'UPDATE',
          'Session',
          match.id,
          `Persona switched to ${roleCode}`
        );
      }
    },

    setActiveCentre: (centreId) => {
      set({ activeCentreId: centreId });
    },

    setTextSize: (size) => {
      set({ textSize: size });
    },

    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
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
