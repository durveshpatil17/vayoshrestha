import { describe, it, expect } from 'vitest';
import { PERMISSION_MATRIX, ROLES, RoleCode } from '@/permissions/matrix';
import { authorize, hasPermission } from '@/permissions/authorize';

describe('RBAC Permission Engine', () => {
  it('should have all 10 roles defined', () => {
    const roles: RoleCode[] = ['SA', 'NM', 'PM', 'CC', 'VF', 'SP', 'CT', 'CD', 'SC', 'FM'];
    roles.forEach((r) => {
      expect(ROLES[r]).toBeDefined();
      expect(ROLES[r].code).toBe(r);
    });
  });

  it('should enforce default-deny for undefined or unmapped capabilities', () => {
    // @ts-expect-error test invalid capability
    const res = hasPermission('VF', 'NON_EXISTENT_CAPABILITY', 'read');
    expect(res).toBe(false);
  });

  it('should strictly deny System Administrator (SA) any clinical or health data access', () => {
    expect(PERMISSION_MATRIX.HEALTH_REQUESTS.SA.allowed).toBe(false);
    expect(hasPermission('SA', 'HEALTH_REQUESTS', 'read')).toBe(false);
    expect(hasPermission('SA', 'HEALTH_REQUESTS', 'update')).toBe(false);
  });

  it('should restrict Centre Coordinator (CC) and Field Volunteer (VF) strictly to assigned centres', () => {
    expect(PERMISSION_MATRIX.MEMBER_PROFILES.CC.scope).toBe('assigned_centres');
    expect(PERMISSION_MATRIX.MEMBER_PROFILES.VF.scope).toBe('assigned_centres');
    expect(PERMISSION_MATRIX.ATTENDANCE.CC.scope).toBe('assigned_centres');

    // Scope check: CC with centre 'HUB-PUN' attempting to access 'HUB-NSK'
    const ccUser = { id: 'u-cc', role: 'CC' as RoleCode, assignedCentres: ['HUB-PUN'] };
    const memberPun = { id: 'm-1', centreId: 'HUB-PUN' };
    const memberNsk = { id: 'm-2', centreId: 'HUB-NSK' };

    expect(authorize(ccUser, 'MEMBER_PROFILES', 'read', memberPun)).toBe(true);
    expect(authorize(ccUser, 'MEMBER_PROFILES', 'read', memberNsk)).toBe(false);
  });

  it('should restrict Senior Citizen (SC) to own record only', () => {
    expect(PERMISSION_MATRIX.MEMBER_PROFILES.SC.scope).toBe('own');
    const scUser = { id: 'm-100', role: 'SC' as RoleCode };
    const ownMember = { id: 'm-100' };
    const otherMember = { id: 'm-200' };

    expect(authorize(scUser, 'MEMBER_PROFILES', 'read', ownMember)).toBe(true);
    expect(authorize(scUser, 'MEMBER_PROFILES', 'read', otherMember)).toBe(false);
  });

  it('should restrict Family Member (FM) strictly to linked & consented seniors', () => {
    expect(PERMISSION_MATRIX.MEMBER_PROFILES.FM.scope).toBe('linked_only');
    const fmUser = { id: 'u-fm-1', role: 'FM' as RoleCode, linkedSeniors: ['m-101'] };
    const consentedSenior = { id: 'm-101' };
    const unlinkedSenior = { id: 'm-999' };

    expect(authorize(fmUser, 'MEMBER_PROFILES', 'read', consentedSenior)).toBe(true);
    expect(authorize(fmUser, 'MEMBER_PROFILES', 'read', unlinkedSenior)).toBe(false);
  });

  it('should restrict CSR Reviewer (CD) to aggregates only with no PII access', () => {
    expect(PERMISSION_MATRIX.MEMBER_PROFILES.CD.allowed).toBe(false);
    expect(PERMISSION_MATRIX.CSR_REPORTS.CD.allowed).toBe(true);
    expect(PERMISSION_MATRIX.CSR_REPORTS.CD.scope).toBe('aggregates_only');

    const cdUser = { id: 'u-cd', role: 'CD' as RoleCode };
    expect(authorize(cdUser, 'MEMBER_PROFILES', 'read')).toBe(false);
    expect(authorize(cdUser, 'CSR_REPORTS', 'read')).toBe(true);
  });

  it('should enforce maker-checker separation: maker cannot approve own submission', () => {
    const pmUser = { id: 'u-pm-1', role: 'PM' as RoleCode };
    const nmUser = { id: 'u-nm-1', role: 'NM' as RoleCode };
    const templateCreatedByPm = { id: 'tpl-1', authorId: 'u-pm-1', status: 'Submitted' };

    // PM cannot approve their own submission
    expect(authorize(pmUser, 'MESSAGE_TEMPLATES', 'approve', templateCreatedByPm)).toBe(false);
    // NM can approve
    expect(authorize(nmUser, 'MESSAGE_TEMPLATES', 'approve', templateCreatedByPm)).toBe(true);
  });
});
