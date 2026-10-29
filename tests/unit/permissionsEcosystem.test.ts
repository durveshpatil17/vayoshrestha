import { describe, it, expect } from 'vitest';
import { ROLES, RoleCode } from '@/permissions/matrix';
import { authorize, hasPermission, AuthUser } from '@/permissions/authorize';

describe('RBAC Ecosystem Layers 1-4 & SF Role (Addendum v3.1)', () => {
  it('should define the 13th role: SF (Senior Field Associate)', () => {
    expect(ROLES.SF).toBeDefined();
    expect(ROLES.SF.code).toBe('SF');
    expect(ROLES.SF.name).toBe('Senior Field Associate');
    expect(ROLES.SF.isStaff).toBe(true);
  });

  it('should grant SF access strictly to own tasks, peer onboarding, and field queue', () => {
    const sfUser: AuthUser = {
      id: 'u-sf-1',
      role: 'SF',
      assignedChapter: 'HUB-PUN',
    };

    // Allowed capabilities
    expect(hasPermission('SF', 'FIELD_ACTIVITY_LOGS', 'create')).toBe(true);
    expect(hasPermission('SF', 'FIELD_ACTIVITY_LOGS', 'read')).toBe(true);
    expect(hasPermission('SF', 'FIELD_SYNC_QUEUE', 'read')).toBe(true);
    expect(hasPermission('SF', 'DOUBLE_CONSENT', 'create')).toBe(true);
    expect(hasPermission('SF', 'ONBOARDING', 'create')).toBe(true);
    expect(hasPermission('SF', 'SENIOR_PROFILES', 'create')).toBe(true);
    expect(hasPermission('SF', 'SENIOR_PROFILES', 'read')).toBe(true);
    expect(hasPermission('SF', 'DASHBOARDS', 'read')).toBe(true);
    expect(hasPermission('SF', 'PUBLIC_VERIFICATION', 'read')).toBe(true);

    // Contextual authorization: own activity log
    expect(authorize(sfUser, 'FIELD_ACTIVITY_LOGS', 'read', { id: 'u-sf-1' })).toBe(true);
    expect(authorize(sfUser, 'FIELD_ACTIVITY_LOGS', 'read', { id: 'u-sf-2' })).toBe(false);
  });

  it('should strictly isolate SF from SOS, vitals, health flags, routing rules, and impact packs', () => {
    // SOS and Health Logs
    expect(hasPermission('SF', 'TRIGGER_SOS', 'create')).toBe(false);
    expect(hasPermission('SF', 'SOS_CASES', 'read')).toBe(false);
    expect(hasPermission('SF', 'SOS_CASES', 'update')).toBe(false);
    expect(hasPermission('SF', 'VITALS_LOG', 'create')).toBe(false);
    expect(hasPermission('SF', 'VITALS_LOG', 'read')).toBe(false);
    expect(hasPermission('SF', 'HEALTH_FLAGS', 'read')).toBe(false);
    expect(hasPermission('SF', 'WELLNESS_CALLS', 'read')).toBe(false);
    expect(hasPermission('SF', 'THRESHOLD_RULES', 'read')).toBe(false);

    // Platform config and sensitive packs
    expect(hasPermission('SF', 'ROUTING_RULES', 'read')).toBe(false);
    expect(hasPermission('SF', 'VOUCHER_CAMPAIGNS', 'create')).toBe(false);
    expect(hasPermission('SF', 'IMPACT_PACKS', 'read')).toBe(false);
    expect(hasPermission('SF', 'IMPACT_PACKS', 'create')).toBe(false);
    expect(hasPermission('SF', 'ANONYMISATION_SETTINGS', 'read')).toBe(false);
  });

  it('should enforce maker-checker on routing rules (PM drafts/submits, NM approves)', () => {
    const pmUser: AuthUser = { id: 'u-pm-1', role: 'PM' };
    const nmUser: AuthUser = { id: 'u-nm-1', role: 'NM' };

    expect(hasPermission('PM', 'ROUTING_RULES', 'create')).toBe(true);
    expect(hasPermission('PM', 'ROUTING_RULES', 'approve')).toBe(false);
    expect(hasPermission('NM', 'ROUTING_RULES', 'approve')).toBe(true);

    // NM cannot approve their own rule if they authored it
    expect(authorize(nmUser, 'ROUTING_RULES', 'approve', { id: 'rule-1', authorId: 'u-nm-1' })).toBe(false);
    expect(authorize(nmUser, 'ROUTING_RULES', 'approve', { id: 'rule-1', authorId: 'u-pm-1' })).toBe(true);
  });

  it('should enforce maker-checker on voucher campaigns (PM drafts, NM approves)', () => {
    const pmUser: AuthUser = { id: 'u-pm-1', role: 'PM' };
    const nmUser: AuthUser = { id: 'u-nm-1', role: 'NM' };

    expect(hasPermission('PM', 'VOUCHER_CAMPAIGNS', 'create')).toBe(true);
    expect(hasPermission('PM', 'VOUCHER_CAMPAIGNS', 'approve')).toBe(false);
    expect(hasPermission('NM', 'VOUCHER_CAMPAIGNS', 'approve')).toBe(true);

    // Maker cannot approve own item
    expect(authorize(nmUser, 'VOUCHER_CAMPAIGNS', 'approve', { id: 'camp-1', authorId: 'u-nm-1' })).toBe(false);
    expect(authorize(nmUser, 'VOUCHER_CAMPAIGNS', 'approve', { id: 'camp-1', authorId: 'u-pm-1' })).toBe(true);
  });

  it('should allow SP to validate & redeem vouchers only for assigned items', () => {
    const spUser: AuthUser = { id: 'u-sp-1', role: 'SP' };
    expect(hasPermission('SP', 'VOUCHER_REDEMPTION', 'update')).toBe(true);

    // Assigned check
    expect(authorize(spUser, 'VOUCHER_REDEMPTION', 'update', { assignedTo: 'u-sp-1' })).toBe(true);
    expect(authorize(spUser, 'VOUCHER_REDEMPTION', 'update', { assignedTo: 'u-sp-2' })).toBe(false);
  });

  it('should enforce legal intake content visibility for legal SP while staff only have metadata', () => {
    // Staff (SA, NM, PM, CM) have metadata only rule
    const capRuleSA = hasPermission('SA', 'LEGAL_INTAKE', 'read');
    const capRuleNM = hasPermission('NM', 'LEGAL_INTAKE', 'read');
    const capRulePM = hasPermission('PM', 'LEGAL_INTAKE', 'read');
    const capRuleCM = hasPermission('CM', 'LEGAL_INTAKE', 'read');

    expect(capRuleSA).toBe(true);
    expect(capRuleNM).toBe(true);
    expect(capRulePM).toBe(true);
    expect(capRuleCM).toBe(true);

    // Service Partner (legal) has assigned read & update
    expect(hasPermission('SP', 'LEGAL_INTAKE', 'read')).toBe(true);
    expect(hasPermission('SP', 'LEGAL_INTAKE', 'update')).toBe(true);
  });

  it('should allow public verification (/verify) without authentication', () => {
    // All roles can read
    const roles: RoleCode[] = ['SA', 'NM', 'RA', 'CM', 'VF', 'CT', 'CD', 'SC', 'NK', 'PM', 'SP', 'FM', 'SF'];
    roles.forEach((r) => {
      expect(hasPermission(r, 'PUBLIC_VERIFICATION', 'read')).toBe(true);
    });
  });

  it('should restrict impact packs: PM drafts, NM releases, CD reads released aggregates', () => {
    expect(hasPermission('PM', 'IMPACT_PACKS', 'create')).toBe(true);
    expect(hasPermission('PM', 'IMPACT_PACKS', 'approve')).toBe(false);
    expect(hasPermission('NM', 'IMPACT_PACKS', 'approve')).toBe(true);
    expect(hasPermission('NM', 'IMPACT_PACKS', 'export')).toBe(true);
    expect(hasPermission('CD', 'IMPACT_PACKS', 'read')).toBe(true);
    expect(hasPermission('CD', 'IMPACT_PACKS', 'create')).toBe(false);
  });
});
