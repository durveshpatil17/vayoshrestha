import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  PERMISSION_MATRIX,
  ROLES,
  RoleCode,
  CapabilityCode,
  ActionCode,
} from '@/permissions/matrix';
import { authorize, hasPermission, AuthUser, ResourceContext } from '@/permissions/authorize';

const ALL_ROLES: RoleCode[] = ['SA', 'NM', 'PM', 'CC', 'VF', 'SP', 'CT', 'CD', 'SC', 'FM'];
const ALL_CAPABILITIES = Object.keys(PERMISSION_MATRIX) as CapabilityCode[];
const ALL_ACTIONS: ActionCode[] = ['create', 'read', 'update', 'delete', 'approve', 'export'];

describe('P3: RBAC Property-Based Tests (fast-check) & Exhaustive Matrix Validation', () => {
  it('exhaustively verifies all 310 matrix cells (10 roles × 31 capabilities)', () => {
    let cellsChecked = 0;
    ALL_CAPABILITIES.forEach((cap) => {
      ALL_ROLES.forEach((role) => {
        const rule = PERMISSION_MATRIX[cap][role];
        expect(rule).toBeDefined();
        expect(typeof rule.allowed).toBe('boolean');
        expect(Array.isArray(rule.actions)).toBe(true);
        expect(rule.scope).toBeDefined();
        cellsChecked++;
      });
    });
    expect(cellsChecked).toBe(310);
  });

  it('Property: disallowed capability is strictly denied regardless of action or resource', () => {
    // Generate arbitrary role, capability, action, and resource
    const roleArbitrary = fc.constantFrom(...ALL_ROLES);
    const capArbitrary = fc.constantFrom(...ALL_CAPABILITIES);
    const actionArbitrary = fc.constantFrom(...ALL_ACTIONS);
    const resourceArbitrary = fc.record({
      id: fc.string(),
      centreId: fc.string(),
      authorId: fc.string(),
      requesterId: fc.string(),
      assignedTo: fc.string(),
    });

    fc.assert(
      fc.property(
        roleArbitrary,
        capArbitrary,
        actionArbitrary,
        resourceArbitrary,
        (role, cap, action, resource) => {
          const rule = PERMISSION_MATRIX[cap][role];
          const user: AuthUser = {
            id: 'test-user',
            role,
            assignedCentres: ['HUB-1'],
            linkedSeniors: ['SEN-1'],
          };

          if (!rule.allowed || !rule.actions.includes(action)) {
            // Must strictly be false
            const staticResult = hasPermission(role, cap, action);
            const authResult = authorize(user, cap, action, resource);
            expect(staticResult).toBe(false);
            expect(authResult).toBe(false);
          }
        }
      ),
      { numRuns: 500 }
    );
  });

  it('Property: SA is strictly barred from clinical/health request capabilities', () => {
    const actionArbitrary = fc.constantFrom(...ALL_ACTIONS);
    fc.assert(
      fc.property(actionArbitrary, (action) => {
        const saUser: AuthUser = { id: 'sa-user', role: 'SA' };
        expect(hasPermission('SA', 'HEALTH_REQUESTS', action)).toBe(false);
        expect(authorize(saUser, 'HEALTH_REQUESTS', action)).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('Property: CD is strictly barred from personal member profiles', () => {
    const actionArbitrary = fc.constantFrom(...ALL_ACTIONS);
    fc.assert(
      fc.property(actionArbitrary, (action) => {
        const cdUser: AuthUser = { id: 'cd-user', role: 'CD' };
        expect(hasPermission('CD', 'MEMBER_PROFILES', action)).toBe(false);
        expect(authorize(cdUser, 'MEMBER_PROFILES', action)).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('Property: scope isolation for CC/VF across arbitrary distinct centres', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'CC' | 'VF'>('CC', 'VF'),
        fc.string({ minLength: 3 }),
        fc.string({ minLength: 3 }),
        (role, userCentre, targetCentre) => {
          fc.pre(userCentre !== targetCentre);

          const user: AuthUser = {
            id: 'field-user',
            role,
            assignedCentres: [userCentre],
          };

          const targetResource: ResourceContext = {
            id: 'res-1',
            centreId: targetCentre,
          };

          // In MEMBER_PROFILES or ATTENDANCE, accessing a different centre must always be rejected
          expect(authorize(user, 'MEMBER_PROFILES', 'read', targetResource)).toBe(false);
          expect(authorize(user, 'ATTENDANCE', 'read', targetResource)).toBe(false);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('Property: maker cannot approve own submission under any user ID', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<RoleCode>('PM', 'NM', 'CC'),
        fc.string({ minLength: 1 }),
        (role, userId) => {
          const user: AuthUser = { id: userId, role };
          const resourceAsAuthor: ResourceContext = { id: 'item-1', authorId: userId };
          const resourceAsRequester: ResourceContext = { id: 'item-2', requesterId: userId };

          expect(authorize(user, 'MESSAGE_TEMPLATES', 'approve', resourceAsAuthor)).toBe(false);
          expect(authorize(user, 'ATTENDANCE_CORRECTIONS', 'approve', resourceAsRequester)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
