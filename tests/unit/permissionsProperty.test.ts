import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  PERMISSION_MATRIX,
  RoleCode,
  CapabilityCode,
  ActionCode,
} from '@/permissions/matrix';
import { authorize, AuthUser } from '@/permissions/authorize';

const ALL_ROLES: RoleCode[] = ['SA', 'NM', 'RA', 'CM', 'VF', 'CT', 'CD', 'SC', 'NK', 'PM', 'SP', 'FM', 'SF'];
const ALL_CAPABILITIES = Object.keys(PERMISSION_MATRIX) as CapabilityCode[];
const ALL_ACTIONS: ActionCode[] = ['create', 'read', 'update', 'delete', 'approve', 'export'];

describe('P3: RBAC Property-Based Tests (fast-check) & Exhaustive Matrix Validation', () => {
  it('exhaustively verifies all 585 matrix cells (13 roles × 45 capabilities)', () => {
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
    expect(cellsChecked).toBe(585);
  });

  it('Property: disallowed capability is strictly denied regardless of action or resource', () => {
    const roleArbitrary = fc.constantFrom(...ALL_ROLES);
    const capArbitrary = fc.constantFrom(...ALL_CAPABILITIES);
    const actionArbitrary = fc.constantFrom(...ALL_ACTIONS);
    const resourceArbitrary = fc.record({
      id: fc.string(),
      regionId: fc.string(),
      chapterId: fc.string(),
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
            assignedRegion: 'REG-W',
            assignedChapter: 'HUB-PUN',
            assignedCentres: ['HUB-PUN'],
          };

          if (!rule.allowed || !rule.actions.includes(action)) {
            expect(authorize(user, cap, action, resource)).toBe(false);
          }
        }
      ),
      { numRuns: 300 }
    );
  });

  it('Property: Maker cannot approve own item under any circumstance', () => {
    const approverRoles: RoleCode[] = ['NM'];
    const roleArbitrary = fc.constantFrom(...approverRoles);
    const capArbitrary = fc.constantFrom(...ALL_CAPABILITIES);
    const userIdArbitrary = fc.string({ minLength: 1 });

    fc.assert(
      fc.property(roleArbitrary, capArbitrary, userIdArbitrary, (role, cap, userId) => {
        const user: AuthUser = {
          id: userId,
          role,
        };
        const resource = {
          id: 'item-1',
          authorId: userId, // Maker is the author!
        };
        expect(authorize(user, cap, 'approve', resource)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
