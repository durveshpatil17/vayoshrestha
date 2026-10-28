import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Can } from '@/permissions/Can';
import { useAuthStore } from '@/store/authStore';

describe('Can Component RBAC UI Gate', () => {
  beforeEach(() => {
    // Reset to RA persona by default
    useAuthStore.getState().switchPersona('RA');
  });

  it('renders children when the active user has capability permission', () => {
    render(
      <Can capability="SENIOR_PROFILES" action="read">
        <div data-testid="allowed-content">Senior Citizen Directory</div>
      </Can>
    );

    expect(screen.getByTestId('allowed-content')).toBeInTheDocument();
  });

  it('renders nothing when the active user lacks capability permission', () => {
    // Switch to Volunteer who cannot delete members
    useAuthStore.getState().switchPersona('VF');

    render(
      <Can capability="SENIOR_PROFILES" action="delete">
        <div data-testid="delete-btn">Delete Profile</div>
      </Can>
    );

    expect(screen.queryByTestId('delete-btn')).toBeNull();
  });

  it('renders custom fallback when unauthorized', () => {
    useAuthStore.getState().switchPersona('CD'); // Donor reviewer cannot create members

    render(
      <Can
        capability="SENIOR_PROFILES"
        action="create"
        fallback={<span data-testid="denied-fallback">No Creation Allowed</span>}
      >
        <div>Create New Member</div>
      </Can>
    );

    expect(screen.getByTestId('denied-fallback')).toBeInTheDocument();
  });

  it('enforces scope isolation with resource prop', () => {
    useAuthStore.getState().switchPersona('CM'); // CM assigned to Pune
    const ownCentreResource = { id: 'm-1', chapterId: 'HUB-PUN' };
    const otherCentreResource = { id: 'm-2', chapterId: 'HUB-NSK' };

    const { rerender } = render(
      <Can capability="SENIOR_PROFILES" action="read" resource={ownCentreResource}>
        <div data-testid="centre-content">Pune Member Details</div>
      </Can>
    );
    expect(screen.getByTestId('centre-content')).toBeInTheDocument();

    rerender(
      <Can capability="SENIOR_PROFILES" action="read" resource={otherCentreResource}>
        <div data-testid="centre-content">Nashik Member Details</div>
      </Can>
    );
    expect(screen.queryByTestId('centre-content')).toBeNull();
  });
});
