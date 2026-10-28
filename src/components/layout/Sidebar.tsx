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
      title: 'Safety & Core SOS',
      items: [
        {
          label: 'Dashboard',
          to: '/',
          icon: <LayoutDashboard className="w-4 h-4" />,
          capability: 'DASHBOARDS',
          action: 'read',
          exact: true,
        },
        {
          label: 'Live SOS Board',
          to: '/sos',
          icon: <AlertTriangle className="w-4 h-4 text-danger" />,
          capability: 'SOS_CASES',
          action: 'read',
          badge: openSosCount > 0 ? `${openSosCount}` : undefined,
          exact: true,
        },
        {
          label: 'SOS History',
          to: '/sos/history',
          icon: <History className="w-4 h-4" />,
          capability: 'SOS_CASES',
          action: 'read',
        },
        {
          label: 'SOS Settings & SLA',
          to: '/sos/settings',
          icon: <Settings className="w-4 h-4" />,
          capability: 'SOS_SETTINGS',
          action: 'read',
        },
        {
          label: 'Drill Mode Events',
          to: '/sos/drills',
          icon: <Radio className="w-4 h-4" />,
          capability: 'DRILL_MODE',
          action: 'read',
        },
        {
          label: 'SMS Fallback Outbox',
          to: '/sms-log',
          icon: <PhoneCall className="w-4 h-4" />,
          capability: 'SOS_FALLBACK_LOG',
          action: 'read',
        },
      ],
    },
    {
      title: 'Preventive Health (Module 2)',
      items: [
        {
          label: 'Health Overview',
          to: '/health',
          icon: <Activity className="w-4 h-4" />,
          capability: 'VITALS_LOG',
          action: 'read',
          exact: true,
        },
        {
          label: 'Medication Schedules',
          to: '/health/schedules',
          icon: <Calendar className="w-4 h-4" />,
          capability: 'MEDICATION_SCHEDULES',
          action: 'read',
        },
        {
          label: 'Reminder Templates',
          to: '/health/reminders',
          icon: <FileText className="w-4 h-4" />,
          capability: 'REMINDER_TEMPLATES',
          action: 'read',
        },
        {
          label: 'Vitals & Meds Logs',
          to: '/health/logs',
          icon: <ClipboardList className="w-4 h-4" />,
          capability: 'VITALS_LOG',
          action: 'read',
        },
        {
          label: 'Anomaly Flags Queue',
          to: '/health/flags',
          icon: <AlertTriangle className="w-4 h-4 text-warning" />,
          capability: 'HEALTH_FLAGS',
          action: 'read',
        },
        {
          label: 'Wellness Call Tasks',
          to: '/health/calls',
          icon: <PhoneCall className="w-4 h-4" />,
          capability: 'WELLNESS_CALLS',
          action: 'read',
        },
        {
          label: 'Clinician Thresholds',
          to: '/health/rules',
          icon: <Sliders className="w-4 h-4" />,
          capability: 'THRESHOLD_RULES',
          action: 'read',
        },
      ],
    },
    {
      title: 'Civic & Profiles (Module 3)',
      items: [
        {
          label: 'Onboarding Funnel',
          to: '/onboarding',
          icon: <BarChart3 className="w-4 h-4" />,
          capability: 'ONBOARDING',
          action: 'read',
          exact: true,
        },
        {
          label: 'Assisted Onboarding',
          to: '/onboarding/new',
          icon: <UserPlus className="w-4 h-4 text-accent" />,
          capability: 'ONBOARDING',
          action: 'create',
        },
        {
          label: 'Bot Script Editor',
          to: '/onboarding/script',
          icon: <FileCheck2 className="w-4 h-4" />,
          capability: 'ONBOARDING_SCRIPT',
          action: 'read',
        },
        {
          label: 'Senior Directory',
          to: '/seniors',
          icon: <Users className="w-4 h-4" />,
          capability: 'SENIOR_PROFILES',
          action: 'read',
        },
      ],
    },
    {
      title: 'WhatsApp Simulator',
      items: [
        {
          label: 'Interactive Simulator',
          to: '/simulator',
          icon: <Smartphone className="w-4 h-4 text-accent" />,
        },
      ],
    },
    {
      title: 'Reporting',
      items: [
        {
          label: 'Pilot Outcomes',
          to: '/reports/pilot',
          icon: <BarChart3 className="w-4 h-4" />,
          capability: 'PILOT_REPORTS',
          action: 'read',
        },
        {
          label: 'Metric Definitions',
          to: '/reports/definitions',
          icon: <BookOpen className="w-4 h-4" />,
          capability: 'PILOT_REPORTS',
          action: 'read',
        },
      ],
    },
    {
      title: 'Governance & Admin',
      items: [
        {
          label: 'User Directory',
          to: '/admin/users',
          icon: <Users className="w-4 h-4" />,
          capability: 'SYSTEM_SETTINGS',
          action: 'read',
        },
        {
          label: 'Roles & Matrix',
          to: '/admin/roles',
          icon: <Shield className="w-4 h-4" />,
          capability: 'SYSTEM_SETTINGS',
          action: 'read',
        },
        {
          label: 'Chapters & Rosters',
          to: '/admin/chapters',
          icon: <Building2 className="w-4 h-4" />,
          capability: 'CHAPTERS_ROSTERS',
          action: 'read',
        },
        {
          label: 'Approvals Queue',
          to: '/admin/approvals',
          icon: <FileCheck2 className="w-4 h-4" />,
          capability: 'APPROVALS_QUEUE',
          action: 'read',
        },
        {
          label: 'Audit Logs',
          to: '/admin/audit-logs',
          icon: <Layers className="w-4 h-4" />,
          capability: 'AUDIT_LOGS',
          action: 'read',
        },
        {
          label: 'Integrations & Queue',
          to: '/admin/integrations',
          icon: <Activity className="w-4 h-4" />,
          capability: 'INTEGRATION_MONITOR',
          action: 'read',
        },
        {
          label: 'System Settings',
          to: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
          capability: 'SYSTEM_SETTINGS',
          action: 'read',
        },
      ],
    },
  ];

  return (
    <aside className="w-[248px] bg-bg-base border-r border-border-hairline flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="py-3">
        {navGroups.map((group) => {
          // Filter items by permission
          const visibleItems = group.items.filter((item) => {
            if (!item.capability) return true;
            return hasPermission(user.role, item.capability, item.action || 'read');
          });

          if (visibleItems.length === 0) return null;

          const isCollapsed = collapsedGroups[group.title];

          return (
            <div key={group.title} className="mb-4">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full px-5 py-1 flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors"
              >
                <span>{group.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <nav className="mt-1 space-y-0.5 px-3">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? 'text-accent font-semibold bg-accent-tint/40 border-l-2 border-accent pl-2.5'
                            : 'text-text-primary hover:bg-bg-subtle'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-danger text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Branding Info */}
      <div className="p-4 border-t border-border-hairline bg-bg-subtle/50 text-[11px] text-text-muted">
        <div className="font-semibold text-text-primary">Ekta Hubs Pilot</div>
        <div>90-Day Controlled Pilot</div>
        <div className="mt-1 text-[10px] text-accent font-mono">1,000 Seniors Target</div>
      </div>
    </aside>
  );
};
