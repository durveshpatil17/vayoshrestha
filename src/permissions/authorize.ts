import {
  PERMISSION_MATRIX,
  CapabilityCode,
  RoleCode,
  ActionCode,
} from './matrix';

export interface AuthUser {
  id: string;
  role: RoleCode;
  name?: string;
  assignedCentres?: string[];
  linkedSeniors?: string[];
}

export interface ResourceContext {
  id?: string;
  centreId?: string;
  authorId?: string;
  requesterId?: string;
  assignedTo?: string;
  memberId?: string;
  status?: string;
}

/**
 * Checks if a role has static capability permission for an action.
 */
export function hasPermission(
  role: RoleCode,
  capability: CapabilityCode,
  action: ActionCode = 'read'
): boolean {
  const capRules = PERMISSION_MATRIX[capability];
  if (!capRules) return false;

  const roleRule = capRules[role];
  if (!roleRule || !roleRule.allowed) return false;

  return roleRule.actions.includes(action);
}

/**
 * Authorizes a user against a capability, action, and resource context.
 * Enforces scope isolation:
 * - 'assigned_centres': CC and VF can only access resources matching assigned centres
 * - 'own': SC can only access own record
 * - 'linked_only': FM can only access linked seniors
 * - 'assigned_items': SP / CT can only access items assigned to them
 * - 'aggregates_only': CD can only read aggregate reporting
 * - Maker-checker: user cannot approve resource they authored/requested
 */
export function authorize(
  user: AuthUser | null | undefined,
  capability: CapabilityCode,
  action: ActionCode = 'read',
  resource?: ResourceContext
): boolean {
  if (!user || !user.role) return false;

  const capRules = PERMISSION_MATRIX[capability];
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

    case 'assigned_centres': {
      if (!resource || !resource.centreId) return true; // generic view
      const userCentres = user.assignedCentres || [];
      return userCentres.includes(resource.centreId);
    }

    case 'own': {
      if (!resource || !resource.id) return true;
      return resource.id === user.id;
    }

    case 'linked_only': {
      if (!resource || !resource.id) return true;
      const linked = user.linkedSeniors || [];
      return linked.includes(resource.id);
    }

    case 'assigned_items': {
      if (!resource) return true;
      if (resource.assignedTo && resource.assignedTo !== user.id) {
        return false;
      }
      return true;
    }

    case 'aggregates_only':
      return true;

    case 'published_only':
    case 'public_only':
      return true;

    case 'masked':
      return true;

    default:
      return false;
  }
}
