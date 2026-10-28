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
      title: 'Civic and onboarding',
      items: [
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
          label: 'Conversational script',
          to: '/onboarding/script',
          icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
          capability: 'ONBOARDING_SCRIPT',
        },
        {
          label: 'Senior directory',
          to: '/seniors',
          icon: <Users className="w-5 h-5 stroke-[1.5]" />,
          capability: 'SENIOR_PROFILES',
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
          label: 'Pilot outcome reports',
          to: '/reports/pilot',
          icon: <BarChart3 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'PILOT_REPORTS',
        },
        {
          label: 'Metric definitions',
          to: '/reports/definitions',
          icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
        },
      ],
    },
    {
      title: 'Administration',
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
          label: 'Ekta Hub chapters',
          to: '/admin/chapters',
          icon: <Building2 className="w-5 h-5 stroke-[1.5]" />,
          capability: 'CHAPTERS_ROSTERS',
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
          label: 'Integration monitor',
          to: '/admin/integrations',
          icon: <Radio className="w-5 h-5 stroke-[1.5]" />,
          capability: 'INTEGRATION_MONITOR',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 select-none overflow-y-auto">
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
