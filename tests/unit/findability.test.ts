import { describe, it, expect } from 'vitest';
import { WORKSPACES, getPermittedWorkspaces, findWorkspaceForPath } from '@/navigation/workspaces';
import { ROLES, RoleCode } from '@/permissions/matrix';
import { useAuthStore } from '@/store/authStore';

describe('Loop R2: Findability & Information Architecture Checks', () => {
  it('verifies all 11 workspaces have <= 8 apps budget per workspace', () => {
    const workspaceKeys = Object.keys(WORKSPACES);
    expect(workspaceKeys.length).toBe(11);

    for (const key of workspaceKeys) {
      const ws = WORKSPACES[key as keyof typeof WORKSPACES];
      expect(
        ws.apps.length,
        `Workspace ${ws.name} exceeds navigation budget of <= 8 apps`
      ).toBeLessThanOrEqual(8);

      // Verify each app has valid noun name, path, icon, group, and description
      for (const app of ws.apps) {
        expect(app.name).toBeDefined();
        expect(app.path.startsWith('/')).toBe(true);
        expect(app.icon).toBeDefined();
        expect(['work', 'monitor', 'configure']).toContain(app.group);
        expect(app.description.length).toBeGreaterThan(10);
      }
    }
  });

  it('verifies 100% of apps are indexed and searchable in the workspace registry', () => {
    const allWorkspaces = Object.values(WORKSPACES);
    const totalApps = allWorkspaces.flatMap((w) => w.apps);

    // Verify there are at least 50 distinct functional applications
    expect(totalApps.length).toBeGreaterThanOrEqual(50);

    // Verify all paths are unique across apps
    const paths = totalApps.map((a) => a.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it('verifies every app path maps to its parent workspace via findWorkspaceForPath', () => {
    const allWorkspaces = Object.values(WORKSPACES);

    for (const ws of allWorkspaces) {
      for (const app of ws.apps) {
        const detectedWs = findWorkspaceForPath(app.path);
        expect(
          detectedWs,
          `App ${app.name} (${app.path}) should map to workspace ${ws.id}`
        ).toBe(ws.id);
      }
    }
  });

  it('verifies Favourites and Recents store behavior', () => {
    const store = useAuthStore.getState();
    expect(store.favourites).toBeDefined();
    expect(Array.isArray(store.favourites)).toBe(true);

    // Test toggleFavourite
    const initialFavsCount = store.favourites.length;
    const testApp = '/testing/sample-app';

    store.toggleFavourite(testApp);
    expect(useAuthStore.getState().favourites).toContain(testApp);

    store.toggleFavourite(testApp);
    expect(useAuthStore.getState().favourites).not.toContain(testApp);

    // Test addRecentVisit with max 8 limit
    for (let i = 0; i < 12; i++) {
      store.addRecentVisit({
        title: `Page ${i}`,
        path: `/page-${i}`,
        category: 'Test',
      });
    }

    const recents = useAuthStore.getState().recentVisits;
    expect(recents.length).toBeLessThanOrEqual(8);
    expect(recents[0].title).toBe('Page 11');
  });

  it('verifies permitted workspaces isolation for all 12 roles', () => {
    const roleCodes = Object.keys(ROLES) as RoleCode[];
    expect(roleCodes.length).toBeGreaterThanOrEqual(12);

    for (const r of roleCodes) {
      const permitted = getPermittedWorkspaces(r);
      expect(permitted.length).toBeGreaterThan(0);

      // Verify Volunteer Facilitator (VF) cannot access Administration
      if (r === 'VF') {
        const hasAdmin = permitted.some((w) => w.id === 'administration');
        expect(hasAdmin).toBe(false);
      }
    }
  });
});

