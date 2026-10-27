import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/permissions/authorize';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CheckSquare,
  MessageSquare,
  HeartHandshake,
  HeartPulse,
  BarChart3,
  Shield,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Smartphone,
  PhoneCall,
  UserCheck,
  Activity,
  Archive,
  AlertTriangle,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  capability?: any;
  action?: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
  badge?: string;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (!user) return null;

  // Senior Citizen Dedicated Sidebar
  if (user.role === 'SC') {
    return (
      <aside className="w-[248px] bg-bg-base border-r border-border-hairline flex flex-col justify-between shrink-0 select-none overflow-y-auto">
        <div className="py-4">
          <div className="px-5 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Senior Citizen Portal
          </div>
          <nav className="space-y-1 px-3">
            <NavLink
              to="/me"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 text-accent" />
              <span>My Home</span>
            </NavLink>
            <NavLink
              to="/me/programmes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <Calendar className="w-5 h-5 text-accent" />
              <span>Programmes & Activities</span>
            </NavLink>
            <NavLink
              to="/me/bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <CheckSquare className="w-5 h-5 text-accent" />
              <span>My Booked Sessions</span>
            </NavLink>
            <NavLink
              to="/me/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>Messages & Alerts</span>
            </NavLink>
            <NavLink
              to="/me/services"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <HeartHandshake className="w-5 h-5 text-accent" />
              <span>Community Services</span>
            </NavLink>
            <NavLink
              to="/me/simulator"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <Smartphone className="w-5 h-5 text-accent" />
              <span>WhatsApp Channel</span>
            </NavLink>
            <NavLink
              to="/me/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <UserCheck className="w-5 h-5 text-accent" />
              <span>My Card & Profile</span>
            </NavLink>
            <NavLink
              to="/me/help"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <HelpCircle className="w-5 h-5 text-accent" />
              <span>Ask for Help</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    );
  }

  // Family Member Dedicated Sidebar
  if (user.role === 'FM') {
    return (
      <aside className="w-[248px] bg-bg-base border-r border-border-hairline flex flex-col justify-between shrink-0 select-none overflow-y-auto">
        <div className="py-4">
          <div className="px-5 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Family Care Portal
          </div>
          <nav className="space-y-1 px-3">
            <NavLink
              to="/family"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <Users className="w-5 h-5 text-accent" />
              <span>Linked Seniors</span>
            </NavLink>
            <NavLink
              to="/family/links"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <Shield className="w-5 h-5 text-accent" />
              <span>Proxy Authorizations</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    );
  }

  // Service Partner Dedicated Sidebar
  if (user.role === 'SP') {
    return (
      <aside className="w-[248px] bg-bg-base border-r border-border-hairline flex flex-col justify-between shrink-0 select-none overflow-y-auto">
        <div className="py-4">
          <div className="px-5 mb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Partner Portal
          </div>
          <nav className="space-y-1 px-3">
            <NavLink
              to="/partner/home"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-accent" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/partner/referrals"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <HeartHandshake className="w-4 h-4 text-accent" />
              <span>Assigned Referrals</span>
            </NavLink>
            <NavLink
              to="/partner/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <Building2 className="w-4 h-4 text-accent" />
              <span>Organisation & Slots</span>
            </NavLink>
            <NavLink
              to="/partner/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                    : 'text-text-primary hover:bg-bg-subtle'
                }`
              }
            >
              <BarChart3 className="w-4 h-4 text-accent" />
              <span>Partner Performance</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    );
  }

  // Staff Standard Navigation Groups (Role Filtered)
  const navGroups: NavGroup[] = [
    {
      title: 'Operations',
      items: [
        { label: 'Overview Dashboard', to: '/', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
        { label: 'Notifications', to: '/notifications', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Senior Citizens',
      items: [
        { label: 'Member Directory', to: '/members', icon: <Users className="w-4 h-4" />, capability: 'MEMBER_PROFILES' },
        { label: 'New Registration', to: '/members/new', icon: <UserCheck className="w-4 h-4" />, capability: 'MEMBER_PROFILES', action: 'create' },
        { label: 'Duplicate Review', to: '/members/duplicates', icon: <AlertTriangle className="w-4 h-4" />, capability: 'MEMBER_PROFILES', action: 'update' },
      ],
    },
    {
      title: 'Centres & Programmes',
      items: [
        { label: 'Ekta Hubs', to: '/centres', icon: <Building2 className="w-4 h-4" />, capability: 'CENTRES' },
        { label: 'Programmes & Events', to: '/programmes', icon: <Calendar className="w-4 h-4" />, capability: 'PROGRAMMES' },
        { label: 'Master Schedule', to: '/schedule', icon: <Calendar className="w-4 h-4" />, capability: 'PROGRAMMES' },
        { label: 'Mark Attendance', to: '/attendance', icon: <CheckSquare className="w-4 h-4" />, capability: 'ATTENDANCE' },
        { label: 'Attendance History', to: '/attendance/history', icon: <Archive className="w-4 h-4" />, capability: 'ATTENDANCE' },
        { label: 'Correction Requests', to: '/attendance/corrections', icon: <FileCheck className="w-4 h-4" />, capability: 'ATTENDANCE_CORRECTIONS' },
      ],
    },
    {
      title: 'Communication & WhatsApp',
      items: [
        { label: 'WhatsApp Overview', to: '/communication', icon: <MessageSquare className="w-4 h-4" />, capability: 'ANNOUNCEMENTS' },
        { label: 'Message Templates', to: '/communication/templates', icon: <FileCheck className="w-4 h-4" />, capability: 'MESSAGE_TEMPLATES' },
        { label: 'Announcements', to: '/communication/announcements', icon: <MessageSquare className="w-4 h-4" />, capability: 'ANNOUNCEMENTS' },
        { label: 'Delivery Monitor', to: '/communication/delivery', icon: <Activity className="w-4 h-4" />, capability: 'MESSAGE_DELIVERY' },
        { label: 'Consent Registry', to: '/communication/consents', icon: <UserCheck className="w-4 h-4" />, capability: 'OPT_IN_OUT' },
        { label: 'WhatsApp Simulator', to: '/communication/simulator', icon: <Smartphone className="w-4 h-4" />, capability: 'ANNOUNCEMENTS' },
      ],
    },
    {
      title: 'Services & Referrals',
      items: [
        { label: 'Service Catalogue', to: '/services', icon: <HeartHandshake className="w-4 h-4" />, capability: 'SERVICES_CATALOGUE' },
        { label: 'Service Bookings', to: '/service-requests', icon: <CheckSquare className="w-4 h-4" />, capability: 'SERVICE_BOOKINGS' },
        { label: 'Eldercare Referrals', to: '/referrals', icon: <HeartHandshake className="w-4 h-4" />, capability: 'REFERRALS' },
        { label: 'Partner Directory', to: '/partners', icon: <Building2 className="w-4 h-4" />, capability: 'PARTNER_PROFILES' },
      ],
    },
    {
      title: 'Care & Welfare Support',
      items: [
        { label: 'Feedback Analytics', to: '/feedback', icon: <CheckSquare className="w-4 h-4" />, capability: 'FEEDBACK' },
        { label: 'Follow-up Tasks', to: '/follow-ups', icon: <UserCheck className="w-4 h-4" />, capability: 'FOLLOW_UPS' },
        { label: 'Engagement Drop-off', to: '/engagement', icon: <Activity className="w-4 h-4" />, capability: 'FOLLOW_UPS' },
        { label: 'Health Assistance', to: '/support/requests', icon: <HeartPulse className="w-4 h-4" />, capability: 'HEALTH_REQUESTS' },
        { label: 'Escalations SLA', to: '/support/escalations', icon: <AlertTriangle className="w-4 h-4" />, capability: 'HEALTH_REQUESTS' },
        { label: 'Warning Rules', to: '/support/rules', icon: <Shield className="w-4 h-4" />, capability: 'ESCALATION_RULES' },
        { label: 'Voice Check-ins (Post-pilot)', to: '/support/voice-checkins', icon: <PhoneCall className="w-4 h-4" />, capability: 'VOICE_CHECKINS' },
      ],
    },
    {
      title: 'Analytics & Governance',
      items: [
        { label: 'Operations Report', to: '/reports/overview', icon: <BarChart3 className="w-4 h-4" />, capability: 'OPERATIONAL_REPORTS' },
        { label: 'Hubs & Programmes', to: '/reports/centres', icon: <Building2 className="w-4 h-4" />, capability: 'OPERATIONAL_REPORTS' },
        { label: 'Member Cohorts', to: '/reports/members', icon: <Users className="w-4 h-4" />, capability: 'OPERATIONAL_REPORTS' },
        { label: 'Attendance Ledger', to: '/reports/attendance', icon: <CheckSquare className="w-4 h-4" />, capability: 'OPERATIONAL_REPORTS' },
        { label: 'Outcome Metrics', to: '/reports/outcomes', icon: <Activity className="w-4 h-4" />, capability: 'OPERATIONAL_REPORTS' },
        { label: 'CSR Grant Release', to: '/reports/csr', icon: <FileCheck className="w-4 h-4" />, capability: 'CSR_REPORTS' },
        { label: 'Data Exports', to: '/reports/exports', icon: <Archive className="w-4 h-4" />, capability: 'EXPORTS' },
        { label: 'Metric Definitions', to: '/reports/definitions', icon: <HelpCircle className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'User Accounts', to: '/admin/users', icon: <Users className="w-4 h-4" />, capability: 'SYSTEM_SETTINGS' },
        { label: 'Roles & Matrix', to: '/admin/roles', icon: <Shield className="w-4 h-4" />, capability: 'SYSTEM_SETTINGS' },
        { label: 'Approvals Queue', to: '/admin/approvals', icon: <FileCheck className="w-4 h-4" />, capability: 'APPROVAL_QUEUE' },
        { label: 'Audit Trail', to: '/admin/audit-logs', icon: <Shield className="w-4 h-4" />, capability: 'AUDIT_LOGS' },
        { label: 'Complaints', to: '/admin/complaints', icon: <AlertTriangle className="w-4 h-4" />, capability: 'COMPLAINTS' },
        { label: 'Integration Health', to: '/admin/integrations', icon: <Activity className="w-4 h-4" />, capability: 'INTEGRATION_MONITOR' },
        { label: 'DPDP Data Governance', to: '/admin/data-governance', icon: <Shield className="w-4 h-4" />, capability: 'DATA_GOVERNANCE' },
        { label: 'Pilot Settings', to: '/admin/settings', icon: <Shield className="w-4 h-4" />, capability: 'SYSTEM_SETTINGS' },
      ],
    },
  ];

  return (
    <aside className="w-[248px] bg-bg-base border-r border-border-hairline flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="py-4 space-y-4">
        {navGroups.map((group) => {
          // Filter items by role capability
          const visibleItems = group.items.filter((item) => {
            if (!item.capability) return true;
            return hasPermission(user.role, item.capability, item.action || 'read');
          });

          if (visibleItems.length === 0) return null;

          const isCollapsed = collapsedGroups[group.title];

          return (
            <div key={group.title} className="px-3">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider hover:text-text-primary"
              >
                <span>{group.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2'
                            : 'text-text-primary hover:bg-bg-subtle'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-text-muted">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-warning-bg text-warning">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
