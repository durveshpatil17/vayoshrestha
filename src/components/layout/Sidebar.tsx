import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/permissions/authorize';
import { CapabilityKey } from '@/permissions/matrix';
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  Settings,
  PhoneCall,
  Activity,
  Calendar,
  Clock,
  FileText,
  Radio,
  FileCheck2,
  Users,
  UserPlus,
  Smartphone,
  BarChart3,
  BookOpen,
  Shield,
  Layers,
  Building2,
  Sliders,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CheckSquare,
  MessageSquare,
  Share2,
  HeartHandshake,
  HeartPulse,
  ThumbsUp,
  FileSpreadsheet,
  Send,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  capability?: CapabilityKey;
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
  const openSosCount = useAuthStore((s) => s.openSosCount);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (!user) return null;

  // Dedicated sidebar for Senior Citizen (SC)
  if (user.role === 'SC') {
    return (
      <aside className="w-[248px] bg-surface border-r border-border flex flex-col shrink-0 select-none overflow-y-auto">
        <div className="p-3 border-b border-border-subtle">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 stroke-[1.5]" />
            <span>My dashboard</span>
          </NavLink>
        </div>
        <div className="flex-1 p-3 space-y-1">
          <NavLink
            to="/me/programmes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Calendar className="w-5 h-5 stroke-[1.5]" />
            <span>Hub programmes</span>
          </NavLink>
          <NavLink
            to="/me/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <CheckSquare className="w-5 h-5 stroke-[1.5]" />
            <span>My bookings</span>
          </NavLink>
          <NavLink
            to="/me/messages"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <MessageSquare className="w-5 h-5 stroke-[1.5]" />
            <span>Messages & announcements</span>
          </NavLink>
          <NavLink
            to="/me/services"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <HeartHandshake className="w-5 h-5 stroke-[1.5]" />
            <span>Request support</span>
          </NavLink>
          <NavLink
            to="/me/health"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <HeartPulse className="w-5 h-5 stroke-[1.5]" />
            <span>Health & readings</span>
          </NavLink>
          <NavLink
            to="/me/family"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Users className="w-5 h-5 stroke-[1.5]" />
            <span>Family & emergency</span>
          </NavLink>
          <NavLink
            to="/me/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <ThumbsUp className="w-5 h-5 stroke-[1.5]" />
            <span>Share feedback</span>
          </NavLink>
          <NavLink
            to="/me/help"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <HelpCircle className="w-5 h-5 stroke-[1.5]" />
            <span>Help & emergency SOS</span>
          </NavLink>
          <NavLink
            to="/me/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Settings className="w-5 h-5 stroke-[1.5]" />
            <span>My profile & ABHA</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  // Dedicated sidebar for Family Member (FM)
  if (user.role === 'FM') {
    return (
      <aside className="w-[248px] bg-surface border-r border-border flex flex-col shrink-0 select-none overflow-y-auto">
        <div className="p-3 border-b border-border-subtle">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 stroke-[1.5]" />
            <span>Family overview</span>
          </NavLink>
        </div>
        <div className="flex-1 p-3 space-y-1">
          <NavLink
            to="/family/links"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Users className="w-5 h-5 stroke-[1.5]" />
            <span>Linked elders & proxy</span>
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <HelpCircle className="w-5 h-5 stroke-[1.5]" />
            <span>Help & safety hotline</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  // Dedicated sidebar for External Service Partner (SP)
  if (user.role === 'SP') {
    return (
      <aside className="w-[248px] bg-surface border-r border-border flex flex-col shrink-0 select-none overflow-y-auto">
        <div className="p-3 border-b border-border-subtle">
          <NavLink
            to="/partner/home"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 stroke-[1.5]" />
            <span>Partner home</span>
          </NavLink>
        </div>
        <div className="flex-1 p-3 space-y-1">
          <NavLink
            to="/partner/referrals"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Share2 className="w-5 h-5 stroke-[1.5]" />
            <span>Assigned referrals</span>
          </NavLink>
          <NavLink
            to="/partner/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <Building2 className="w-5 h-5 stroke-[1.5]" />
            <span>Partner organisation profile</span>
          </NavLink>
          <NavLink
            to="/partner/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text hover:bg-surface-hover'
              }`
            }
          >
            <BarChart3 className="w-5 h-5 stroke-[1.5]" />
            <span>Fulfilment metrics</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  // Full enterprise navigation for staff personas (SA, NM, RA, CM, VF, CT, CD, PM)
  const navGroups: NavGroup[] = [
    {
      title: 'Safety and emergency',
      items: [
        {
          label: 'SOS incident board',
          to: '/sos',
          icon: <AlertTriangle className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SOS_CASES',
          badge: openSosCount > 0 ? `${openSosCount}` : undefined,
        },
        {
          label: 'Emergency history',
          to: '/sos/history',
          icon: <History className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SOS_CASES',
        },
        {
          label: 'Escalation settings',
          to: '/sos/settings',
          icon: <Settings className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SOS_SETTINGS',
        },
        {
          label: 'Readiness drills',
          to: '/sos/drills',
          icon: <Radio className="w-5 h-5 stroke-[1.5]" />,
          capability: 'DRILL_MODE',
        },
        {
          label: 'SMS fallback log',
          to: '/sms-log',
          icon: <PhoneCall className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SOS_FALLBACK_LOG',
        },
      ],
    },
    {
      title: 'Hubs and programmes',
      items: [
        {
          label: 'Ekta Hub chapters',
          to: '/chapters',
          icon: <Building2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Programmes directory',
          to: '/programmes',
          icon: <Calendar className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Session schedule',
          to: '/schedule',
          icon: <Clock className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Attendance hub',
          to: '/attendance',
          icon: <CheckSquare className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ATTENDANCE',
        },
        {
          label: 'Attendance corrections',
          to: '/attendance/corrections',
          icon: <FileCheck2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ATTENDANCE',
        },
        {
          label: 'Attendance history heatmap',
          to: '/attendance/history',
          icon: <Activity className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ATTENDANCE',
        },
      ],
    },
    {
      title: 'Senior directory and onboarding',
      items: [
        {
          label: 'Senior directory',
          to: '/seniors',
          icon: <Users className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SENIOR_PROFILES',
        },
        {
          label: 'Onboarding funnel',
          to: '/onboarding',
          icon: <Layers className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ONBOARDING',
        },
        {
          label: 'Assisted registration',
          to: '/onboarding/new',
          icon: <UserPlus className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ONBOARDING',
          action: 'create',
        },
        {
          label: 'Duplicate records check',
          to: '/seniors/duplicates',
          icon: <AlertTriangle className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SENIOR_PROFILES',
        },
        {
          label: 'Conversational script',
          to: '/onboarding/script',
          icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ONBOARDING_SCRIPT',
        },
      ],
    },
    {
      title: 'Preventive health',
      items: [
        {
          label: 'Health command center',
          to: '/health',
          icon: <Activity className="w-5 h-5 stroke-[1.5]" />,
          capability: 'VITALS_LOG',
        },
        {
          label: 'Reminder schedules',
          to: '/health/schedules',
          icon: <Calendar className="w-5 h-5 stroke-[1.5]" />,
          capability: 'MEDICATION_SCHEDULES',
        },
        {
          label: 'Message templates',
          to: '/health/reminders',
          icon: <FileText className="w-5 h-5 stroke-[1.5]" />,
          capability: 'REMINDER_TEMPLATES',
        },
        {
          label: 'Biomarker logs',
          to: '/health/logs',
          icon: <ClipboardList className="w-5 h-5 stroke-[1.5]" />,
          capability: 'VITALS_LOG',
        },
        {
          label: 'Clinical anomaly flags',
          to: '/health/flags',
          icon: <AlertTriangle className="w-5 h-5 stroke-[1.5]" />,
          capability: 'HEALTH_FLAGS',
        },
        {
          label: 'Wellness call roster',
          to: '/health/calls',
          icon: <PhoneCall className="w-5 h-5 stroke-[1.5]" />,
          capability: 'WELLNESS_CALLS',
        },
        {
          label: 'Threshold rules',
          to: '/health/rules',
          icon: <Sliders className="w-5 h-5 stroke-[1.5]" />,
          capability: 'THRESHOLD_RULES',
        },
      ],
    },
    {
      title: 'Services and referrals',
      items: [
        {
          label: 'Service catalogue',
          to: '/services',
          icon: <HeartHandshake className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Service requests',
          to: '/service-requests',
          icon: <ClipboardList className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Referral tracking',
          to: '/referrals',
          icon: <Share2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Partner network',
          to: '/partners',
          icon: <Building2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
      ],
    },
    {
      title: 'Communication and broadcast',
      items: [
        {
          label: 'Communication hub',
          to: '/communication',
          icon: <MessageSquare className="w-5 h-5 stroke-[1.5]" />,
          capability: 'REMINDER_TEMPLATES',
        },
        {
          label: 'Broadcast templates',
          to: '/communication/templates',
          icon: <FileText className="w-5 h-5 stroke-[1.5]" />,
          capability: 'REMINDER_TEMPLATES',
        },
        {
          label: 'Audience announcements',
          to: '/communication/announcements',
          icon: <Send className="w-5 h-5 stroke-[1.5]" />,
          capability: 'REMINDER_TEMPLATES',
        },
        {
          label: 'Delivery logs',
          to: '/communication/delivery',
          icon: <PhoneCall className="w-5 h-5 stroke-[1.5]" />,
          capability: 'MESSAGE_DELIVERY_STATUS',
        },
        {
          label: 'Consent registry',
          to: '/communication/consents',
          icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CONSENT_LANGUAGE',
        },
      ],
    },
    {
      title: 'Feedback and assisted care',
      items: [
        {
          label: 'Feedback responses',
          to: '/feedback',
          icon: <ThumbsUp className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
        },
        {
          label: 'Follow-up tasks',
          to: '/follow-ups',
          icon: <CheckSquare className="w-5 h-5 stroke-[1.5]" />,
          capability: 'WELLNESS_CALLS',
        },
        {
          label: 'Engagement index',
          to: '/engagement',
          icon: <BarChart3 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
        {
          label: 'Assisted health requests',
          to: '/support/requests',
          icon: <HeartPulse className="w-5 h-5 stroke-[1.5]" />,
          capability: 'HEALTH_REQUESTS',
        },
        {
          label: 'Health escalations',
          to: '/support/escalations',
          icon: <AlertTriangle className="w-5 h-5 stroke-[1.5]" />,
          capability: 'HEALTH_REQUESTS',
        },
      ],
    },
    {
      title: 'Simulator and analytics',
      items: [
        {
          label: 'WhatsApp phone simulator',
          to: '/simulator',
          icon: <Smartphone className="w-5 h-5 stroke-[1.5]" />,
        },
        {
          label: 'Reports overview',
          to: '/reports',
          icon: <BarChart3 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
        {
          label: 'CSR report builder',
          to: '/reports/csr',
          icon: <FileSpreadsheet className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
        {
          label: 'Pilot outcome reports',
          to: '/reports/pilot',
          icon: <BarChart3 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
        {
          label: 'Data exports center',
          to: '/reports/exports',
          icon: <FileSpreadsheet className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
      ],
    },
    {
      title: 'Administration and governance',
      items: [
        {
          label: 'Staff directory',
          to: '/admin/users',
          icon: <Users className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SYSTEM_SETTINGS',
        },
        {
          label: 'Role permissions matrix',
          to: '/admin/roles',
          icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SYSTEM_SETTINGS',
        },
        {
          label: 'System configuration',
          to: '/admin/settings',
          icon: <Settings className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SYSTEM_SETTINGS',
        },
        {
          label: 'Maker-checker approvals',
          to: '/admin/approvals',
          icon: <FileCheck2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'APPROVALS_QUEUE',
        },
        {
          label: 'Immutable audit logs',
          to: '/admin/audit-logs',
          icon: <ClipboardList className="w-5 h-5 stroke-[1.5]" />,
          capability: 'AUDIT_LOGS',
        },
        {
          label: 'Grievances and complaints',
          to: '/admin/complaints',
          icon: <AlertTriangle className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SYSTEM_SETTINGS',
        },
        {
          label: 'Data governance registry',
          to: '/admin/data-governance',
          icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SYSTEM_SETTINGS',
        },
        {
          label: 'Integration monitor',
          to: '/admin/integrations',
          icon: <Radio className="w-5 h-5 stroke-[1.5]" />,
          capability: 'INTEGRATION_MONITOR',
        },
      ],
    },
  ];

  return (
    <aside className="w-[248px] bg-surface border-r border-border flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Home Link */}
      <div className="p-3 border-b border-border-subtle">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
              isActive
                ? 'bg-surface-selected text-accent font-semibold'
                : 'text-text-secondary hover:text-text hover:bg-surface-hover'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 stroke-[1.5]" />
          <span>Operational home</span>
        </NavLink>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 p-3 space-y-4">
        {navGroups.map((group) => {
          const permittedItems = group.items.filter((item) => {
            if (!item.capability) return true;
            return hasPermission(user.role, item.capability, item.action || 'read');
          });

          if (permittedItems.length === 0) return null;

          const isCollapsed = collapsedGroups[group.title];

          return (
            <div key={group.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-1 text-xs text-text-secondary font-normal hover:text-text"
              >
                <span>{group.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {permittedItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-control text-sm transition-colors ${
                          isActive
                            ? 'bg-surface-selected text-accent font-semibold'
                            : 'text-text hover:bg-surface-hover'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 truncate">
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-chip bg-negative text-text-on-accent tabular-nums">
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
