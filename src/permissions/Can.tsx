import React from 'react';
import { CapabilityCode, CapabilityKey, ActionCode, normalizeCapability } from './matrix';
import { authorize, ResourceContext } from './authorize';
import { useAuthStore } from '@/store/authStore';

export interface CanProps {
  capability: CapabilityCode | CapabilityKey;
  action?: ActionCode;
  resource?: ResourceContext;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Declarative component gate enforcing RBAC at the UI level.
 * Hides children if active user lacks permission or fails scope check.
 */
export const Can: React.FC<CanProps> = ({
  capability,
  action = 'read',
  resource,
  children,
  fallback = null,
}) => {
  const user = useAuthStore((state) => state.user);
  const normalizedCap = normalizeCapability(capability);

  const isAllowed = authorize(user, normalizedCap, action, resource);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
