import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Forbidden403 } from '@/components/feedback/Forbidden403';
import { useAuthStore } from '@/store/authStore';
import { CapabilityKey } from '@/permissions/matrix';
import { hasPermission } from '@/permissions/authorize';

// Auth Pages (Group A)
import { LoginPage } from '@/pages/auth/LoginPage';
import { MfaPage } from '@/pages/auth/MfaPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { FirstLoginPage } from '@/pages/auth/FirstLoginPage';
import { PrivacyPage } from '@/pages/auth/PrivacyPage';
import { SessionExpiredPage } from '@/pages/auth/SessionExpiredPage';
import { NotFoundPage } from '@/pages/auth/NotFoundPage';
import { OfflinePage } from '@/pages/auth/OfflinePage';

// Shell Pages (Group B & C)
import { DashboardRouter } from '@/pages/dashboard/DashboardRouter';
import { NotificationsPage } from '@/pages/shell/NotificationsPage';
import { AccountPage } from '@/pages/shell/AccountPage';
import { HelpPage } from '@/pages/shell/HelpPage';

// Module 1: Emergency SOS Routing (Group D)
import { SosBoardPage } from '@/pages/sos/SosBoardPage';
import { SosCaseDetailPage } from '@/pages/sos/SosCaseDetailPage';
import { SosHistoryPage } from '@/pages/sos/SosHistoryPage';
import { SosSettingsPage } from '@/pages/sos/SosSettingsPage';
import { SosDrillsPage } from '@/pages/sos/SosDrillsPage';
import { SmsLogPage } from '@/pages/sos/SmsLogPage';

// Module 2: Preventive Health (Group E)
import { HealthOverviewPage } from '@/pages/health/HealthOverviewPage';
import { HealthSchedulesPage } from '@/pages/health/HealthSchedulesPage';
import { ReminderTemplatesPage } from '@/pages/health/ReminderTemplatesPage';
import { ReminderEditorPage } from '@/pages/health/ReminderEditorPage';
import { HealthLogsPage } from '@/pages/health/HealthLogsPage';
import { HealthFlagsPage } from '@/pages/health/HealthFlagsPage';
import { WellnessCallsPage } from '@/pages/health/WellnessCallsPage';
import { ThresholdRulesPage } from '@/pages/health/ThresholdRulesPage';

// Module 3: Civic & Onboarding (Group F)
import { OnboardingFunnelPage } from '@/pages/onboarding/OnboardingFunnelPage';
import { AssistedOnboardingPage } from '@/pages/onboarding/AssistedOnboardingPage';
import { OnboardingScriptPage } from '@/pages/onboarding/OnboardingScriptPage';
import { SeniorListPage } from '@/pages/seniors/SeniorListPage';
import { SeniorDetailPage } from '@/pages/seniors/SeniorDetailPage';
import { SeniorEditPage } from '@/pages/seniors/SeniorEditPage';

// WhatsApp Simulator (Group G)
import { SimulatorPage } from '@/pages/simulator/SimulatorPage';

// Reports (Group H)
import { PilotReportsPage } from '@/pages/reports/PilotReportsPage';
import { DefinitionsPage } from '@/pages/reports/DefinitionsPage';

// Admin (Group I)
import { UserDirectoryPage } from '@/pages/admin/UserDirectoryPage';
import { UserNewPage } from '@/pages/admin/UserNewPage';
import { UserDetailPage } from '@/pages/admin/UserDetailPage';
import { RolesMatrixPage } from '@/pages/admin/RolesMatrixPage';
import { ChaptersPage } from '@/pages/admin/ChaptersPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { ApprovalsPage } from '@/pages/admin/ApprovalsPage';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';
import { IntegrationsPage } from '@/pages/admin/IntegrationsPage';
import { DesignGalleryPage } from '@/pages/design/DesignGalleryPage';

/**
 * Route Permission Guard
 * Validates session, authenticated status, and role capabilities
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  capability?: CapabilityKey;
  action?: 'read' | 'create' | 'update' | 'delete' | 'approve' | 'export';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  capability,
  action = 'read',
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Capability-based permission verification
  if (capability) {
    const isAllowed = hasPermission(user.role, capability, action);
    if (!isAllowed) {
      return (
        <Forbidden403
          requiredRole={capability}
          message={`Your role (${user.role}) lacks ${action.toUpperCase()} permission for ${capability}.`}
        />
      );
    }
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  // Public & Authentication Routes (Group A)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/mfa',
    element: <MfaPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },
  {
    path: '/first-login',
    element: <FirstLoginPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/session-expired',
    element: <SessionExpiredPage />,
  },
  {
    path: '/offline',
    element: <OfflinePage />,
  },
  {
    path: '/403',
    element: <Forbidden403 requiredRole="Authorized Role" />,
  },
  {
    path: '/design',
    element: <DesignGalleryPage />,
  },

  // Authenticated App Shell Routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      // Role Dashboard Homes (Group C)
      {
        index: true,
        element: <DashboardRouter />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },

      // Module 1: Emergency SOS Routing (Group D)
      {
        path: 'sos',
        element: (
          <ProtectedRoute capability="SOS_CASES">
            <SosBoardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sos/:id',
        element: (
          <ProtectedRoute capability="SOS_CASES">
            <SosCaseDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sos/history',
        element: (
          <ProtectedRoute capability="SOS_CASES">
            <SosHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sos/settings',
        element: (
          <ProtectedRoute capability="SOS_SETTINGS">
            <SosSettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sos/drills',
        element: (
          <ProtectedRoute capability="DRILL_MODE">
            <SosDrillsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sms-log',
        element: (
          <ProtectedRoute capability="SOS_FALLBACK_LOG">
            <SmsLogPage />
          </ProtectedRoute>
        ),
      },

      // Module 2: Preventive Health (Group E)
      {
        path: 'health',
        element: (
          <ProtectedRoute capability="VITALS_LOG">
            <HealthOverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/schedules',
        element: (
          <ProtectedRoute capability="MEDICATION_SCHEDULES">
            <HealthSchedulesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/reminders',
        element: (
          <ProtectedRoute capability="REMINDER_TEMPLATES">
            <ReminderTemplatesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/reminders/:id',
        element: (
          <ProtectedRoute capability="REMINDER_TEMPLATES">
            <ReminderEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/logs',
        element: (
          <ProtectedRoute capability="VITALS_LOG">
            <HealthLogsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/flags',
        element: (
          <ProtectedRoute capability="HEALTH_FLAGS">
            <HealthFlagsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/calls',
        element: (
          <ProtectedRoute capability="WELLNESS_CALLS">
            <WellnessCallsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'health/rules',
        element: (
          <ProtectedRoute capability="THRESHOLD_RULES">
            <ThresholdRulesPage />
          </ProtectedRoute>
        ),
      },

      // Module 3: Civic & Onboarding (Group F)
      {
        path: 'onboarding',
        element: (
          <ProtectedRoute capability="ONBOARDING">
            <OnboardingFunnelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'onboarding/new',
        element: (
          <ProtectedRoute capability="ONBOARDING" action="create">
            <AssistedOnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'onboarding/script',
        element: (
          <ProtectedRoute capability="ONBOARDING_SCRIPT">
            <OnboardingScriptPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'seniors',
        element: (
          <ProtectedRoute capability="SENIOR_PROFILES">
            <SeniorListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'seniors/:id',
        element: (
          <ProtectedRoute capability="SENIOR_PROFILES">
            <SeniorDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'seniors/:id/edit',
        element: (
          <ProtectedRoute capability="SENIOR_PROFILES" action="update">
            <SeniorEditPage />
          </ProtectedRoute>
        ),
      },

      // Simulator (Group G)
      {
        path: 'simulator',
        element: <SimulatorPage />,
      },

      // Reports (Group H)
      {
        path: 'reports/pilot',
        element: (
          <ProtectedRoute capability="PILOT_REPORTS">
            <PilotReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports/definitions',
        element: <DefinitionsPage />,
      },

      // Admin & Infrastructure (Group I)
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute capability="SYSTEM_SETTINGS">
            <UserDirectoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users/new',
        element: (
          <ProtectedRoute capability="SYSTEM_SETTINGS" action="create">
            <UserNewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users/:id',
        element: (
          <ProtectedRoute capability="SYSTEM_SETTINGS">
            <UserDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/roles',
        element: (
          <ProtectedRoute capability="SYSTEM_SETTINGS">
            <RolesMatrixPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/chapters',
        element: (
          <ProtectedRoute capability="CHAPTERS_ROSTERS">
            <ChaptersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <ProtectedRoute capability="SYSTEM_SETTINGS">
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/approvals',
        element: (
          <ProtectedRoute capability="APPROVALS_QUEUE">
            <ApprovalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/audit-logs',
        element: (
          <ProtectedRoute capability="AUDIT_LOGS">
            <AuditLogsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/integrations',
        element: (
          <ProtectedRoute capability="INTEGRATION_MONITOR">
            <IntegrationsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 404 Fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
