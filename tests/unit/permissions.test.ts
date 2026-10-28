import { describe, it, expect } from 'vitest';
import { PERMISSION_MATRIX, ROLES, RoleCode } from '@/permissions/matrix';
import { authorize, hasPermission } from '@/permissions/authorize';

describe('RBAC Permission Engine (v2 Pilot)', () => {
  it('should have all roles defined', () => {
    const roles: RoleCode[] = ['SA', 'NM', 'RA', 'CM', 'VF', 'CT', 'CD', 'SC', 'NK'];
    roles.forEach((r) => {
      expect(ROLES[r]).toBeDefined();
      expect(ROLES[r].code).toBe(r);
    });
  });

  it('should enforce default-deny for undefined or unmapped capabilities', () => {
    // @ts-expect-error test invalid capability
    const res = hasPermission('VF', 'NON_EXISTENT_CAPABILITY', 'read');
    expect(res).toBe(false);
    expect(authorize(null, 'SENIOR_PROFILES', 'read')).toBe(false);
    expect(authorize({ id: 'u1', role: 'INVALID' as RoleCode }, 'SENIOR_PROFILES', 'read')).toBe(false);
  });

  it('should strictly deny System Administrator (SA) any clinical or health data access', () => {
    expect(hasPermission('SA', 'VITALS_LOG', 'read')).toBe(false);
    expect(hasPermission('SA', 'HEALTH_FLAGS', 'read')).toBe(false);
    expect(hasPermission('SA', 'WELLNESS_CALLS', 'read')).toBe(false);
    expect(hasPermission('SA', 'MEDICATION_SCHEDULES', 'read')).toBe(false);
  });

  it('should restrict Regional Admin (RA) strictly to assigned region', () => {
    const raUser = { id: 'u-ra', role: 'RA' as RoleCode, assignedRegion: 'REG-W' };
    const memberWest = { id: 'm-1', regionId: 'REG-W' };
    const memberSouth = { id: 'm-2', regionId: 'REG-S' };

    expect(authorize(raUser, 'SENIOR_PROFILES', 'read', memberWest)).toBe(true);
    expect(authorize(raUser, 'SENIOR_PROFILES', 'read', memberSouth)).toBe(false);
    expect(authorize(raUser, 'SENIOR_PROFILES', 'read', undefined)).toBe(true); // generic view
  });

  it('should restrict Chapter Manager (CM) strictly to assigned chapter', () => {
    const cmUser = { id: 'u-cm', role: 'CM' as RoleCode, assignedChapter: 'HUB-PUN', assignedCentres: ['HUB-PUN'] };
    const memberPun = { id: 'm-1', chapterId: 'HUB-PUN' };
    const memberNsk = { id: 'm-2', chapterId: 'HUB-NSK' };

    expect(authorize(cmUser, 'SENIOR_PROFILES', 'read', memberPun)).toBe(true);
    expect(authorize(cmUser, 'SENIOR_PROFILES', 'read', memberNsk)).toBe(false);
    expect(authorize(cmUser, 'SENIOR_PROFILES', 'read', undefined)).toBe(true); // generic view
  });

  it('should evaluate assigned scope correctly', () => {
    const ctUser = { id: 'u-ct-1', role: 'CT' as RoleCode };
    const assignedItem = { id: 'task-1', assignedTo: 'u-ct-1' };
    const unassignedItem = { id: 'task-2', assignedTo: 'u-ct-2' };

    expect(authorize(ctUser, 'WELLNESS_CALLS', 'read', assignedItem)).toBe(true);
    expect(authorize(ctUser, 'WELLNESS_CALLS', 'read', unassignedItem)).toBe(false);
    expect(authorize(ctUser, 'WELLNESS_CALLS', 'read', undefined)).toBe(true);
  });

  it('should evaluate own scope correctly', () => {
    const scUser = { id: 'm-1', role: 'SC' as RoleCode };
    expect(authorize(scUser, 'SENIOR_PROFILES', 'read', { id: 'm-1' })).toBe(true);
    expect(authorize(scUser, 'SENIOR_PROFILES', 'read', { memberId: 'm-1' })).toBe(true);
    expect(authorize(scUser, 'SENIOR_PROFILES', 'read', { id: 'm-2' })).toBe(false);
    expect(authorize(scUser, 'SENIOR_PROFILES', 'read', undefined)).toBe(true);
  });

  it('should enforce Care Team (CT) emergency contact access only during open cases, expiring 24h post-closure', () => {
    const ctUser = { id: 'u-ct-1', role: 'CT' as RoleCode };

    // Open case
    const openCase = { id: 'c-1', status: 'Triggered' };
    expect(authorize(ctUser, 'EMERGENCY_CONTACTS', 'read', openCase)).toBe(true);

    // Case resolved 2 hours ago (within 24h grace period)
    const recentlyResolved = {
      id: 'c-2',
      status: 'Resolved',
      resolvedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    };
    expect(authorize(ctUser, 'EMERGENCY_CONTACTS', 'read', recentlyResolved)).toBe(true);

    // Case resolved 25 hours ago (expired!)
    const expiredCase = {
      id: 'c-3',
      status: 'Resolved',
      resolvedAt: new Date(Date.now() - 25 * 3600000).toISOString(),
    };
    expect(authorize(ctUser, 'EMERGENCY_CONTACTS', 'read', expiredCase)).toBe(false);

    // Closed case without resolvedAt timestamp -> strictly false
    const closedWithoutTimestamp = {
      id: 'c-4',
      status: 'Closed',
    };
    expect(authorize(ctUser, 'EMERGENCY_CONTACTS', 'read', closedWithoutTimestamp)).toBe(false);
  });

  it('should enforce maker-checker rule: maker cannot approve own item by authorId or requesterId', () => {
    const nmUser = { id: 'u-nm-1', role: 'NM' as RoleCode };

    // Item authored by another user
    const otherItem = { id: 'tmpl-1', authorId: 'u-ra-1' };
    expect(authorize(nmUser, 'REMINDER_TEMPLATES', 'approve', otherItem)).toBe(true);

    // Item authored by the same user -> DENIED
    const ownItem = { id: 'tmpl-2', authorId: 'u-nm-1' };
    expect(authorize(nmUser, 'REMINDER_TEMPLATES', 'approve', ownItem)).toBe(false);

    // Item requested by the same user -> DENIED
    const requestedItem = { id: 'tmpl-3', requesterId: 'u-nm-1' };
    expect(authorize(nmUser, 'REMINDER_TEMPLATES', 'approve', requestedItem)).toBe(false);
  });
});
