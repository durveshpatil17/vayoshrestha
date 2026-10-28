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
import { ComplaintsPage } from '@/pages/admin/ComplaintsPage';
import { ComplaintNewPage } from '@/pages/admin/ComplaintNewPage';
import { DataGovernancePage } from '@/pages/admin/DataGovernancePage';

// Expanded Modules
import { ChapterListPage } from '@/pages/chapters/ChapterListPage';
import { ChapterDetailPage } from '@/pages/chapters/ChapterDetailPage';
import { ChapterNewPage } from '@/pages/chapters/ChapterNewPage';
import { ChapterEditPage } from '@/pages/chapters/ChapterEditPage';

import { ProgrammeListPage } from '@/pages/programmes/ProgrammeListPage';
import { ProgrammeDetailPage } from '@/pages/programmes/ProgrammeDetailPage';
import { ProgrammeNewPage } from '@/pages/programmes/ProgrammeNewPage';
import { ProgrammeEditPage } from '@/pages/programmes/ProgrammeEditPage';
import { ScheduleCalendarPage } from '@/pages/programmes/ScheduleCalendarPage';
import { SessionDetailPage } from '@/pages/programmes/SessionDetailPage';

import { AttendanceHubPage } from '@/pages/attendance/AttendanceHubPage';
import { AttendanceSessionPage } from '@/pages/attendance/AttendanceSessionPage';
import { AttendanceCorrectionsPage } from '@/pages/attendance/AttendanceCorrectionsPage';
import { AttendanceHistoryPage } from '@/pages/attendance/AttendanceHistoryPage';

import { CommunicationHubPage } from '@/pages/communication/CommunicationHubPage';
import { TemplatesListPage } from '@/pages/communication/TemplatesListPage';
import { TemplateDetailPage } from '@/pages/communication/TemplateDetailPage';
import { TemplateNewPage } from '@/pages/communication/TemplateNewPage';
import { AnnouncementsPage } from '@/pages/communication/AnnouncementsPage';
import { AnnouncementNewPage } from '@/pages/communication/AnnouncementNewPage';
import { DeliveryLogPage } from '@/pages/communication/DeliveryLogPage';
import { ConsentsPage } from '@/pages/communication/ConsentsPage';

import { ServiceListPage } from '@/pages/services/ServiceListPage';
import { ServiceDetailPage } from '@/pages/services/ServiceDetailPage';
import { ServiceNewPage } from '@/pages/services/ServiceNewPage';
import { ServiceRequestsPage } from '@/pages/services/ServiceRequestsPage';

import { ReferralListPage } from '@/pages/referrals/ReferralListPage';
import { ReferralDetailPage } from '@/pages/referrals/ReferralDetailPage';
import { ReferralNewPage } from '@/pages/referrals/ReferralNewPage';

import { PartnerListPage } from '@/pages/partners/PartnerListPage';
import { PartnerDetailPage } from '@/pages/partners/PartnerDetailPage';
import { PartnerNewPage } from '@/pages/partners/PartnerNewPage';

import { PartnerHomePage } from '@/pages/partnerPortal/PartnerHomePage';
import { PartnerReferralsPage } from '@/pages/partnerPortal/PartnerReferralsPage';
import { PartnerProfilePage } from '@/pages/partnerPortal/PartnerProfilePage';
import { PartnerReportsPage } from '@/pages/partnerPortal/PartnerReportsPage';

import { FeedbackHubPage } from '@/pages/feedback/FeedbackHubPage';
import { FeedbackFormsPage } from '@/pages/feedback/FeedbackFormsPage';
import { FeedbackNewPage } from '@/pages/feedback/FeedbackNewPage';
import { FollowUpsPage } from '@/pages/feedback/FollowUpsPage';
import { EngagementIndexPage } from '@/pages/feedback/EngagementIndexPage';

import { SupportRequestsPage } from '@/pages/support/SupportRequestsPage';
import { SupportEscalationsPage } from '@/pages/support/SupportEscalationsPage';
import { SupportEscalationDetailPage } from '@/pages/support/SupportEscalationDetailPage';
import { SupportRulesPage } from '@/pages/support/SupportRulesPage';
import { SupportVoiceCheckinsPage } from '@/pages/support/SupportVoiceCheckinsPage';
import { SupportHandoverPage } from '@/pages/support/SupportHandoverPage';

import { ReportsOverviewPage } from '@/pages/reports/ReportsOverviewPage';
import { ChapterReportsPage } from '@/pages/reports/ChapterReportsPage';
import { ProgrammeReportsPage } from '@/pages/reports/ProgrammeReportsPage';
import { SeniorReportsPage } from '@/pages/reports/SeniorReportsPage';
import { AttendanceReportsPage } from '@/pages/reports/AttendanceReportsPage';
import { OutcomesReportsPage } from '@/pages/reports/OutcomesReportsPage';
import { CsrReportBuilderPage } from '@/pages/reports/CsrReportBuilderPage';
import { ExportsPage } from '@/pages/reports/ExportsPage';

import { SeniorDuplicatesPage } from '@/pages/seniors/SeniorDuplicatesPage';
import { SeniorCardPage } from '@/pages/seniors/SeniorCardPage';

import { ScPortal } from '@/pages/seniors/ScPortal';
import {
  ScProgrammesPage,
  ScBookingsPage,
  ScMessagesPage,
  ScServicesPage,
  ScProfilePage,
  ScHealthPage,
  ScFeedbackPage,
  ScHelpPage,
  ScFamilyPage,
} from '@/pages/seniors/ScPortalSubPages';

import { FmPortal } from '@/pages/family/FmPortal';
import {
  FmSeniorOverviewPage,
  FmLinksPage,
} from '@/pages/family/FmPortalSubPages';

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

      // Chapters (Ekta Hubs) (FR-10–13)
      { path: 'chapters', element: <ChapterListPage /> },
      { path: 'chapters/new', element: <ChapterNewPage /> },
      { path: 'chapters/:id', element: <ChapterDetailPage /> },
      { path: 'chapters/:id/edit', element: <ChapterEditPage /> },

      // Programmes & Sessions (FR-14–18)
      { path: 'programmes', element: <ProgrammeListPage /> },
      { path: 'programmes/new', element: <ProgrammeNewPage /> },
      { path: 'programmes/:id', element: <ProgrammeDetailPage /> },
      { path: 'programmes/:id/edit', element: <ProgrammeEditPage /> },
      { path: 'schedule', element: <ScheduleCalendarPage /> },
      { path: 'sessions/:id', element: <SessionDetailPage /> },

      // Attendance (FR-19–22)
      { path: 'attendance', element: <AttendanceHubPage /> },
      { path: 'attendance/session/:id', element: <AttendanceSessionPage /> },
      { path: 'attendance/corrections', element: <AttendanceCorrectionsPage /> },
      { path: 'attendance/history', element: <AttendanceHistoryPage /> },

      // Communication Hub (FR-23–29)
      { path: 'communication', element: <CommunicationHubPage /> },
      { path: 'communication/templates', element: <TemplatesListPage /> },
      { path: 'communication/templates/new', element: <TemplateNewPage /> },
      { path: 'communication/templates/:id', element: <TemplateDetailPage /> },
      { path: 'communication/announcements', element: <AnnouncementsPage /> },
      { path: 'communication/announcements/new', element: <AnnouncementNewPage /> },
      { path: 'communication/delivery', element: <DeliveryLogPage /> },
      { path: 'communication/consents', element: <ConsentsPage /> },

      // Services & Referrals (FR-30–33)
      { path: 'services', element: <ServiceListPage /> },
      { path: 'services/new', element: <ServiceNewPage /> },
      { path: 'services/:id', element: <ServiceDetailPage /> },
      { path: 'service-requests', element: <ServiceRequestsPage /> },
      { path: 'referrals', element: <ReferralListPage /> },
      { path: 'referrals/new', element: <ReferralNewPage /> },
      { path: 'referrals/:id', element: <ReferralDetailPage /> },
      { path: 'partners', element: <PartnerListPage /> },
      { path: 'partners/new', element: <PartnerNewPage /> },
      { path: 'partners/:id', element: <PartnerDetailPage /> },

      // Partner Portal (/partner/*)
      { path: 'partner/home', element: <PartnerHomePage /> },
      { path: 'partner/referrals', element: <PartnerReferralsPage /> },
      { path: 'partner/referrals/:id', element: <PartnerReferralsPage /> },
      { path: 'partner/profile', element: <PartnerProfilePage /> },
      { path: 'partner/reports', element: <PartnerReportsPage /> },

      // Feedback & Follow-ups (FR-34–35)
      { path: 'feedback', element: <FeedbackHubPage /> },
      { path: 'feedback/forms', element: <FeedbackFormsPage /> },
      { path: 'feedback/new', element: <FeedbackNewPage /> },
      { path: 'follow-ups', element: <FollowUpsPage /> },
      { path: 'engagement', element: <EngagementIndexPage /> },

      // Assisted Health Support (FR-37)
      { path: 'support/requests', element: <SupportRequestsPage /> },
      { path: 'support/escalations', element: <SupportEscalationsPage /> },
      { path: 'support/escalations/:id', element: <SupportEscalationDetailPage /> },
      { path: 'support/rules', element: <SupportRulesPage /> },
      { path: 'support/voice-checkins', element: <SupportVoiceCheckinsPage /> },
      { path: 'support/handover', element: <SupportHandoverPage /> },

      // Reports Expansion (FR-38–46)
      { path: 'reports', element: <ReportsOverviewPage /> },
      { path: 'reports/overview', element: <ReportsOverviewPage /> },
      { path: 'reports/chapters', element: <ChapterReportsPage /> },
      { path: 'reports/programmes', element: <ProgrammeReportsPage /> },
      { path: 'reports/seniors', element: <SeniorReportsPage /> },
      { path: 'reports/attendance', element: <AttendanceReportsPage /> },
      { path: 'reports/outcomes', element: <OutcomesReportsPage /> },
      { path: 'reports/csr', element: <CsrReportBuilderPage /> },
      { path: 'reports/csr/:id', element: <CsrReportBuilderPage /> },
      { path: 'reports/exports', element: <ExportsPage /> },

      // Admin Additions (FR-52–53)
      { path: 'admin/complaints', element: <ComplaintsPage /> },
      { path: 'complaints/new', element: <ComplaintNewPage /> },
      { path: 'admin/data-governance', element: <DataGovernancePage /> },

      // Senior Additions (FR-13–14)
      { path: 'seniors/duplicates', element: <SeniorDuplicatesPage /> },
      { path: 'seniors/:id/card', element: <SeniorCardPage /> },

      // Senior Citizen Portal (/me/*)
      { path: 'me', element: <ScPortal /> },
      { path: 'me/programmes', element: <ScProgrammesPage /> },
      { path: 'me/bookings', element: <ScBookingsPage /> },
      { path: 'me/messages', element: <ScMessagesPage /> },
      { path: 'me/services', element: <ScServicesPage /> },
      { path: 'me/profile', element: <ScProfilePage /> },
      { path: 'me/health', element: <ScHealthPage /> },
      { path: 'me/feedback', element: <ScFeedbackPage /> },
      { path: 'me/help', element: <ScHelpPage /> },
      { path: 'me/family', element: <ScFamilyPage /> },

      // Family Member Portal (/family/*)
      { path: 'family', element: <FmPortal /> },
      { path: 'family/:seniorId', element: <FmSeniorOverviewPage /> },
      { path: 'family/links', element: <FmLinksPage /> },
    ],
  },

  // 404 Fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
