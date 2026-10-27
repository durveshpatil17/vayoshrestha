import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Forbidden403 } from '@/components/feedback/Forbidden403';
import { useAuthStore } from '@/store/authStore';
import { CapabilityKey } from '@/permissions/matrix';
import { hasPermission } from '@/permissions/authorize';

// Auth Pages (Group A)
import { LoginPage } from '@/pages/auth/LoginPage';
import { VerifyOtpPage } from '@/pages/auth/VerifyOtpPage';
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

// Members (Group D)
import { MemberListPage } from '@/pages/members/MemberListPage';
import { MemberNewPage } from '@/pages/members/MemberNewPage';
import { MemberDetailPage } from '@/pages/members/MemberDetailPage';
import { MemberEditPage } from '@/pages/members/MemberEditPage';
import { MemberCardPage } from '@/pages/members/MemberCardPage';
import { MemberDuplicatesPage } from '@/pages/members/MemberDuplicatesPage';

// Centres (Group E)
import { CentreListPage } from '@/pages/centres/CentreListPage';
import { CentreNewEditPage } from '@/pages/centres/CentreNewEditPage';
import { CentreDetailPage } from '@/pages/centres/CentreDetailPage';

// Programmes & Schedule (Group F)
import { ProgrammeListPage } from '@/pages/programmes/ProgrammeListPage';
import { ProgrammeNewEditPage } from '@/pages/programmes/ProgrammeNewEditPage';
import { ProgrammeDetailPage } from '@/pages/programmes/ProgrammeDetailPage';
import { SchedulePage } from '@/pages/programmes/SchedulePage';
import { SessionDetailPage } from '@/pages/programmes/SessionDetailPage';

// Attendance (Group G)
import { AttendanceSessionListPage } from '@/pages/attendance/AttendanceSessionListPage';
import { AttendanceSessionRosterPage } from '@/pages/attendance/AttendanceSessionRosterPage';
import { AttendanceCorrectionsPage } from '@/pages/attendance/AttendanceCorrectionsPage';
import { AttendanceHistoryPage } from '@/pages/attendance/AttendanceHistoryPage';

// Communication (Group H)
import { CommunicationOverviewPage } from '@/pages/communication/CommunicationOverviewPage';
import { TemplateListPage } from '@/pages/communication/TemplateListPage';
import { TemplateEditorPage } from '@/pages/communication/TemplateEditorPage';
import { AnnouncementListPage } from '@/pages/communication/AnnouncementListPage';
import { AnnouncementNewPage } from '@/pages/communication/AnnouncementNewPage';
import { DeliveryLedgerPage } from '@/pages/communication/DeliveryLedgerPage';
import { ConsentRegistryPage } from '@/pages/communication/ConsentRegistryPage';
import { WhatsAppSimulatorPage } from '@/pages/communication/WhatsAppSimulatorPage';

// Services & Referrals (Group I)
import { ServiceCataloguePage } from '@/pages/services/ServiceCataloguePage';
import { ServiceEditorPage } from '@/pages/services/ServiceEditorPage';
import { ServiceRequestsPage } from '@/pages/services/ServiceRequestsPage';
import { ReferralListPage } from '@/pages/services/ReferralListPage';
import { ReferralNewPage } from '@/pages/services/ReferralNewPage';
import { ReferralDetailPage } from '@/pages/services/ReferralDetailPage';
import { PartnerListPage } from '@/pages/services/PartnerListPage';
import { PartnerDetailPage } from '@/pages/services/PartnerDetailPage';
import { PartnerHomePage } from '@/pages/services/partner/PartnerHomePage';
import { PartnerReferralsPage } from '@/pages/services/partner/PartnerReferralsPage';
import { PartnerProfilePage } from '@/pages/services/partner/PartnerProfilePage';
import { PartnerReportsPage } from '@/pages/services/partner/PartnerReportsPage';

// Feedback & Follow-up (Group J)
import { FeedbackListPage } from '@/pages/feedback/FeedbackListPage';
import { FeedbackFormBuilderPage } from '@/pages/feedback/FeedbackFormBuilderPage';
import { FeedbackNewPage } from '@/pages/feedback/FeedbackNewPage';
import { FollowUpsPage } from '@/pages/feedback/FollowUpsPage';
import { EngagementPage } from '@/pages/feedback/EngagementPage';

// Health & Assisted Support (Group K)
import { SupportRequestsPage } from '@/pages/support/SupportRequestsPage';
import { EscalationsQueuePage } from '@/pages/support/EscalationsQueuePage';
import { EscalationDetailPage } from '@/pages/support/EscalationDetailPage';
import { WarningRulesPage } from '@/pages/support/WarningRulesPage';
import { VoiceCheckinsPage } from '@/pages/support/VoiceCheckinsPage';

// Reports (Group L)
import { ReportDirectoryPage } from '@/pages/reports/ReportDirectoryPage';
import { OperationsReportPage } from '@/pages/reports/OperationsReportPage';
import { CentresProgrammesReportPage } from '@/pages/reports/CentresProgrammesReportPage';
import { MembersReportPage } from '@/pages/reports/MembersReportPage';
import { AttendanceReportPage } from '@/pages/reports/AttendanceReportPage';
import { OutcomesReportPage } from '@/pages/reports/OutcomesReportPage';
import { CsrReportBuilderPage } from '@/pages/reports/CsrReportBuilderPage';
import { CsrReportDetailPage } from '@/pages/reports/CsrReportDetailPage';
import { DataExportsPage } from '@/pages/reports/DataExportsPage';
import { DefinitionsPage } from '@/pages/reports/DefinitionsPage';

// Admin & Governance (Group M)
import { UserDirectoryPage } from '@/pages/admin/UserDirectoryPage';
import { UserDetailPage } from '@/pages/admin/UserDetailPage';
import { RolesMatrixPage } from '@/pages/admin/RolesMatrixPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { ApprovalsPage } from '@/pages/admin/ApprovalsPage';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';
import { ComplaintsPage } from '@/pages/admin/ComplaintsPage';
import { ComplaintNewPage } from '@/pages/admin/ComplaintNewPage';
import { IntegrationsPage } from '@/pages/admin/IntegrationsPage';
import { DataGovernancePage } from '@/pages/admin/DataGovernancePage';

// Senior Citizen Portal (Group N)
import { SeniorHomePage } from '@/pages/me/SeniorHomePage';
import { SeniorProgrammesPage } from '@/pages/me/SeniorProgrammesPage';
import { SeniorBookingsPage } from '@/pages/me/SeniorBookingsPage';
import { SeniorMessagesPage } from '@/pages/me/SeniorMessagesPage';
import { SeniorServicesPage } from '@/pages/me/SeniorServicesPage';
import { SeniorProfilePage } from '@/pages/me/SeniorProfilePage';
import { SeniorFeedbackPage } from '@/pages/me/SeniorFeedbackPage';
import { SeniorHelpPage } from '@/pages/me/SeniorHelpPage';

// Family Portal (Group O)
import { FamilyHomePage } from '@/pages/family/FamilyHomePage';
import { FamilySeniorProxyPage } from '@/pages/family/FamilySeniorProxyPage';
import { FamilyLinksPage } from '@/pages/family/FamilyLinksPage';

// Route Guard Component
interface GuardedRouteProps {
  children: React.ReactNode;
  capability?: CapabilityKey;
  action?: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({ children, capability, action = 'read' }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (capability && !hasPermission(user.role, capability, action)) {
    return (
      <Forbidden403
        missingPermission={`${capability}.${action}`}
        currentRole={user.role}
      />
    );
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  // Public & Authentication
  { path: '/login', element: <LoginPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  { path: '/mfa', element: <MfaPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
  { path: '/first-login', element: <FirstLoginPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/session-expired', element: <SessionExpiredPage /> },
  { path: '/403', element: <Forbidden403 /> },
  { path: '/offline', element: <OfflinePage /> },

  // Shell Layout
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardRouter /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'complaints/new', element: <ComplaintNewPage /> },

      // Members (Group D)
      {
        path: 'members',
        element: (
          <GuardedRoute capability="memberProfiles" action="read">
            <MemberListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'members/new',
        element: (
          <GuardedRoute capability="memberProfiles" action="create">
            <MemberNewPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'members/duplicates',
        element: (
          <GuardedRoute capability="memberProfiles" action="read">
            <MemberDuplicatesPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'members/:id',
        element: (
          <GuardedRoute capability="memberProfiles" action="read">
            <MemberDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'members/:id/edit',
        element: (
          <GuardedRoute capability="memberProfiles" action="update">
            <MemberEditPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'members/:id/card',
        element: <MemberCardPage />,
      },

      // Centres (Group E)
      {
        path: 'centres',
        element: (
          <GuardedRoute capability="centres" action="read">
            <CentreListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'centres/new',
        element: (
          <GuardedRoute capability="centres" action="create">
            <CentreNewEditPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'centres/:id',
        element: (
          <GuardedRoute capability="centres" action="read">
            <CentreDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'centres/:id/edit',
        element: (
          <GuardedRoute capability="centres" action="update">
            <CentreNewEditPage />
          </GuardedRoute>
        ),
      },

      // Programmes & Schedule (Group F)
      {
        path: 'programmes',
        element: (
          <GuardedRoute capability="programmesAndEvents" action="read">
            <ProgrammeListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'programmes/new',
        element: (
          <GuardedRoute capability="programmesAndEvents" action="create">
            <ProgrammeNewEditPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'programmes/:id',
        element: (
          <GuardedRoute capability="programmesAndEvents" action="read">
            <ProgrammeDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'programmes/:id/edit',
        element: (
          <GuardedRoute capability="programmesAndEvents" action="update">
            <ProgrammeNewEditPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'sessions/:id',
        element: <SessionDetailPage />,
      },

      // Attendance (Group G)
      {
        path: 'attendance',
        element: (
          <GuardedRoute capability="attendanceRecords" action="read">
            <AttendanceSessionListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'attendance/session/:id',
        element: (
          <GuardedRoute capability="attendanceRecords" action="create">
            <AttendanceSessionRosterPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'attendance/corrections',
        element: (
          <GuardedRoute capability="attendanceCorrections" action="read">
            <AttendanceCorrectionsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'attendance/history',
        element: (
          <GuardedRoute capability="attendanceRecords" action="read">
            <AttendanceHistoryPage />
          </GuardedRoute>
        ),
      },

      // Communication (Group H)
      {
        path: 'communication',
        element: <CommunicationOverviewPage />,
      },
      {
        path: 'communication/templates',
        element: (
          <GuardedRoute capability="messageTemplates" action="read">
            <TemplateListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/templates/new',
        element: (
          <GuardedRoute capability="messageTemplates" action="create">
            <TemplateEditorPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/templates/:id',
        element: (
          <GuardedRoute capability="messageTemplates" action="read">
            <TemplateEditorPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/announcements',
        element: (
          <GuardedRoute capability="announcements" action="read">
            <AnnouncementListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/announcements/new',
        element: (
          <GuardedRoute capability="announcements" action="create">
            <AnnouncementNewPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/delivery',
        element: (
          <GuardedRoute capability="deliveryStatus" action="read">
            <DeliveryLedgerPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/consents',
        element: (
          <GuardedRoute capability="optInOptOut" action="read">
            <ConsentRegistryPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'communication/simulator',
        element: <WhatsAppSimulatorPage />,
      },

      // Services & Referrals (Group I)
      {
        path: 'services',
        element: (
          <GuardedRoute capability="servicesCatalogue" action="read">
            <ServiceCataloguePage />
          </GuardedRoute>
        ),
      },
      {
        path: 'services/new',
        element: (
          <GuardedRoute capability="servicesCatalogue" action="create">
            <ServiceEditorPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'services/:id',
        element: (
          <GuardedRoute capability="servicesCatalogue" action="read">
            <ServiceEditorPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'service-requests',
        element: (
          <GuardedRoute capability="serviceBookings" action="read">
            <ServiceRequestsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'referrals',
        element: (
          <GuardedRoute capability="referrals" action="read">
            <ReferralListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'referrals/new',
        element: (
          <GuardedRoute capability="referrals" action="create">
            <ReferralNewPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'referrals/:id',
        element: (
          <GuardedRoute capability="referrals" action="read">
            <ReferralDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'partners',
        element: (
          <GuardedRoute capability="partners" action="read">
            <PartnerListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'partners/new',
        element: (
          <GuardedRoute capability="partners" action="create">
            <PartnerDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'partners/:id',
        element: (
          <GuardedRoute capability="partners" action="read">
            <PartnerDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'partner/home',
        element: <PartnerHomePage />,
      },
      {
        path: 'partner/referrals',
        element: <PartnerReferralsPage />,
      },
      {
        path: 'partner/profile',
        element: <PartnerProfilePage />,
      },
      {
        path: 'partner/reports',
        element: <PartnerReportsPage />,
      },

      // Feedback & Follow-up (Group J)
      {
        path: 'feedback',
        element: (
          <GuardedRoute capability="feedback" action="read">
            <FeedbackListPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'feedback/forms',
        element: (
          <GuardedRoute capability="feedback" action="read">
            <FeedbackFormBuilderPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'feedback/new',
        element: (
          <GuardedRoute capability="feedback" action="create">
            <FeedbackNewPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'follow-ups',
        element: (
          <GuardedRoute capability="followUps" action="read">
            <FollowUpsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'engagement',
        element: (
          <GuardedRoute capability="followUps" action="read">
            <EngagementPage />
          </GuardedRoute>
        ),
      },

      // Health & Assisted Support (Group K)
      {
        path: 'support/requests',
        element: (
          <GuardedRoute capability="healthRequests" action="read">
            <SupportRequestsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'support/escalations',
        element: (
          <GuardedRoute capability="healthRequests" action="read">
            <EscalationsQueuePage />
          </GuardedRoute>
        ),
      },
      {
        path: 'support/escalations/:id',
        element: (
          <GuardedRoute capability="healthRequests" action="read">
            <EscalationDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'support/rules',
        element: (
          <GuardedRoute capability="escalationRules" action="read">
            <WarningRulesPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'support/voice-checkins',
        element: (
          <GuardedRoute capability="voiceCheckins" action="read">
            <VoiceCheckinsPage />
          </GuardedRoute>
        ),
      },

      // Reports (Group L)
      { path: 'reports', element: <ReportDirectoryPage /> },
      { path: 'reports/overview', element: <OperationsReportPage /> },
      { path: 'reports/centres', element: <CentresProgrammesReportPage /> },
      { path: 'reports/programmes', element: <CentresProgrammesReportPage /> },
      { path: 'reports/members', element: <MembersReportPage /> },
      { path: 'reports/attendance', element: <AttendanceReportPage /> },
      { path: 'reports/outcomes', element: <OutcomesReportPage /> },
      { path: 'reports/csr', element: <CsrReportBuilderPage /> },
      { path: 'reports/csr/:id', element: <CsrReportDetailPage /> },
      {
        path: 'reports/exports',
        element: (
          <GuardedRoute capability="dataExports" action="read">
            <DataExportsPage />
          </GuardedRoute>
        ),
      },
      { path: 'reports/definitions', element: <DefinitionsPage /> },

      // Administration & Governance (Group M)
      {
        path: 'admin/users',
        element: (
          <GuardedRoute capability="usersAndRoles" action="read">
            <UserDirectoryPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/users/new',
        element: (
          <GuardedRoute capability="usersAndRoles" action="create">
            <UserDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/users/:id',
        element: (
          <GuardedRoute capability="usersAndRoles" action="read">
            <UserDetailPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/roles',
        element: (
          <GuardedRoute capability="usersAndRoles" action="read">
            <RolesMatrixPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <GuardedRoute capability="usersAndRoles" action="read">
            <SettingsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/approvals',
        element: (
          <GuardedRoute capability="approvalsQueue" action="read">
            <ApprovalsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/audit-logs',
        element: (
          <GuardedRoute capability="auditLogs" action="read">
            <AuditLogsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/complaints',
        element: (
          <GuardedRoute capability="complaints" action="read">
            <ComplaintsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/integrations',
        element: (
          <GuardedRoute capability="integrationMonitor" action="read">
            <IntegrationsPage />
          </GuardedRoute>
        ),
      },
      {
        path: 'admin/data-governance',
        element: (
          <GuardedRoute capability="dataGovernance" action="read">
            <DataGovernancePage />
          </GuardedRoute>
        ),
      },

      // Senior Citizen Portal (Group N)
      { path: 'me', element: <SeniorHomePage /> },
      { path: 'me/programmes', element: <SeniorProgrammesPage /> },
      { path: 'me/bookings', element: <SeniorBookingsPage /> },
      { path: 'me/messages', element: <SeniorMessagesPage /> },
      { path: 'me/services', element: <SeniorServicesPage /> },
      { path: 'me/profile', element: <SeniorProfilePage /> },
      { path: 'me/feedback', element: <SeniorFeedbackPage /> },
      { path: 'me/help', element: <SeniorHelpPage /> },
      { path: 'me/simulator', element: <WhatsAppSimulatorPage /> },

      // Family Portal (Group O)
      { path: 'family', element: <FamilyHomePage /> },
      { path: 'family/:seniorId', element: <FamilySeniorProxyPage /> },
      { path: 'family/links', element: <FamilyLinksPage /> },
    ],
  },

  // 404 Fallback Catch-All
  { path: '*', element: <NotFoundPage /> },
]);
