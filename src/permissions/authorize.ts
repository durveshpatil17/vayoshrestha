import {
  PERMISSION_MATRIX,
  CapabilityCode,
  CapabilityKey,
  RoleCode,
  ActionCode,
  normalizeCapability,
} from './matrix';

export interface AuthUser {
  id: string;
  role: RoleCode;
  name?: string;
  assignedRegion?: string;
  assignedChapter?: string;
  assignedCentres?: string[]; // backwards compatible with chapter/centre id
  assignedSeniors?: string[];
  linkedSeniors?: string[];
}

export interface ResourceContext {
  id?: string;
  regionId?: string;
  chapterId?: string;
  centreId?: string;
  authorId?: string;
  requesterId?: string;
  assignedTo?: string;
  memberId?: string;
  status?: string;
  resolvedAt?: string; // ISO date string when case was resolved
}

/**
 * Checks if a role has static capability permission for an action.
 */
export function hasPermission(
  role: RoleCode,
  capability: CapabilityCode | CapabilityKey,
  action: ActionCode = 'read'
): boolean {
  const normalizedCap = normalizeCapability(capability);
  const capRules = PERMISSION_MATRIX[normalizedCap];
  if (!capRules) return false;

  const roleRule = capRules[role];
  if (!roleRule || !roleRule.allowed) return false;

  return roleRule.actions.includes(action);
}

/**
 * Authorizes a user against a capability, action, and resource context.
 * Enforces:
 * - Default deny
 * - Scope isolation (region, chapter, own, assigned, open_case_only)
 * - Maker-checker rule (cannot approve own item)
 * - CT 24h post-closure case expiry rule
 */
export function authorize(
  user: AuthUser | null | undefined,
  capability: CapabilityCode | CapabilityKey,
  action: ActionCode = 'read',
  resource?: ResourceContext
): boolean {
  if (!user || !user.role) return false;

  const normalizedCap = normalizeCapability(capability);
  const capRules = PERMISSION_MATRIX[normalizedCap];

  if (!capRules) return false;

  const rule = capRules[user.role];
  if (!rule || !rule.allowed) return false;

  if (!rule.actions.includes(action)) return false;

  // Maker-checker enforcement: Maker cannot approve own item
  if (action === 'approve' && resource) {
    if (resource.authorId && resource.authorId === user.id) {
      return false;
    }
    if (resource.requesterId && resource.requesterId === user.id) {
      return false;
    }
  }

  // Scope evaluation
  switch (rule.scope) {
    case 'all':
      return true;

    case 'region': {
      if (!resource || !resource.regionId) return true; // generic view
      return user.assignedRegion === resource.regionId;
    }

    case 'chapter': {
      const targetChapter = resource?.chapterId || resource?.centreId;
      if (!targetChapter) return true; // generic view
      if (user.assignedChapter && user.assignedChapter === targetChapter) return true;
      if (user.assignedCentres && user.assignedCentres.includes(targetChapter)) return true;
      return false;
    }

    case 'own': {
      if (!resource) return true;
      const targetId = resource.id || resource.memberId;
      if (!targetId) return true;
      return targetId === user.id;
    }

    case 'assigned': {
      if (!resource) return true;
      if (resource.assignedTo && resource.assignedTo !== user.id) {
        return false;
      }
      return true;
    }

    case 'open_case_only': {
      if (!resource) return true;
      // If case is closed, check if 24 hours have elapsed
      if (resource.status === 'Resolved' || resource.status === 'Closed' || resource.status === 'Cancelled') {
        if (resource.resolvedAt) {
          const resolvedTime = new Date(resource.resolvedAt).getTime();
          const elapsed = Date.now() - resolvedTime;
          const twentyFourHoursMs = 24 * 60 * 60 * 1000;
          if (elapsed > twentyFourHoursMs) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    }

    case 'aggregates_only':
      return true;

    case 'masked':
      return true;

    default:
      return false;
  }
}
