import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { WORKSPACES, WorkspaceId } from '@/navigation/workspaces';
import {
  Clock,
  AlertTriangle,
  Star,
  History,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
  Inbox,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const LaunchpadMyWork: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Top 5 open tasks for active role with SLA countdown
  const tasks = [
    {
      id: 'TASK-001',
      title: 'Review duplicate senior enrollment: Anasuya Bai',
      workspace: 'Seniors',
      priority: 'high',
      slaCountdown: '1h 45m left',
      path: '/seniors/duplicates',
    },
    {
      id: 'TASK-002',
      title: 'Acknowledge pending wellness check escalation: Malleshwaram',
      workspace: 'Care',
      priority: 'critical',
      slaCountdown: '25m left',
      path: '/support/escalations',
    },
    {
      id: 'TASK-003',
      title: 'Verify partner voucher redemption from Apollo Pharmacy',
      workspace: 'Partners',
      priority: 'medium',
      slaCountdown: '3h 10m left',
      path: '/vouchers',
    },
    {
      id: 'TASK-004',
      title: 'Review and approve volunteer session roster: Jayanagar',
      workspace: 'Community',
      priority: 'low',
      slaCountdown: '6h 00m left',
      path: '/programmes',
    },
    {
      id: 'TASK-005',
      title: 'Triage pending data governance notice request',
      workspace: 'Governance',
      priority: 'medium',
      slaCountdown: '12h left',
      path: '/admin/data-governance',
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-container p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-control bg-accent-tint text-accent border border-accent/20">
            <Inbox className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">My Work</h2>
            <p className="text-xs text-text-secondary">
              Top 5 priority operational tasks assigned to your role ({user?.role})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(tasks[0].path)}
            className="flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Take next task</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />
          </Button>
          <Link
            to="/inbox"
            className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap shrink-0"
          >
            <span>Full inbox</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-border-subtle">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="py-2.5 flex items-center justify-between gap-3 hover:bg-surface-hover rounded-control px-2 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-control shrink-0 border ${
                  task.priority === 'critical'
                    ? 'bg-negative-tint text-negative border-negative/30'
                    : task.priority === 'high'
                    ? 'bg-critical-tint text-critical border-critical/30'
                    : 'bg-surface-subtle text-text-secondary border-border'
                }`}
              >
                {task.priority === 'critical' || task.priority === 'high' ? (
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />
                ) : (
                  <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text truncate">
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border text-xs">
                    {task.workspace}
                  </span>
                  <span className="tabular-nums text-text-secondary">{task.slaCountdown}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(task.path)}
              className="shrink-0 text-xs h-7 px-2.5"
            >
              Open
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LaunchpadFavourites: React.FC = () => {
  const navigate = useNavigate();
  const { favourites, toggleFavourite, user } = useAuthStore();

  // Find app definition for each favourite
  const allWorkspaces = Object.values(WORKSPACES);
  const allApps = allWorkspaces.flatMap((w) => w.apps);

  const favouriteApps = favourites
    .map((path) => allApps.find((a) => a.path === path))
    .filter(Boolean);

  return (
    <div className="bg-surface border border-border rounded-container p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-control bg-accent-tint text-accent border border-accent/20">
            <Star className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">Favourites</h2>
            <p className="text-xs text-text-secondary">
              Personalized quick launch apps (customize in App Finder)
            </p>
          </div>
        </div>
        <Link
          to="/apps"
          className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
        >
          <span>Manage in App Finder</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {favouriteApps.map((app) => {
          if (!app) return null;
          const AppIcon = app.icon;
          return (
            <div
              key={app.id}
              onClick={() => navigate(app.path)}
              className="p-3 bg-surface-subtle hover:bg-surface border border-border hover:border-accent rounded-control cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-control bg-surface text-accent border border-border group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                  <AppIcon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(app.path);
                  }}
                  className="text-accent hover:opacity-75 transition-opacity"
                  title="Remove from favourites"
                >
                  <Star className="w-3.5 h-3.5 fill-accent" />
                </button>
              </div>
              <div className="mt-3">
                <div className="text-xs font-semibold text-text group-hover:text-accent transition-colors truncate">
                  {app.name}
                </div>
                <div className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                  {app.description}
                </div>
              </div>
            </div>
          );
        })}

        {favouriteApps.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-text-secondary">
            No favourite apps saved yet. Click the star icon on any app in App Finder.
          </div>
        )}
      </div>
    </div>
  );
};

export const LaunchpadRecents: React.FC = () => {
  const navigate = useNavigate();
  const recentVisits = useAuthStore((s) => s.recentVisits);

  const formatRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-surface border border-border rounded-container p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-control bg-surface-subtle text-text-secondary border border-border">
            <History className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">Recently Visited</h2>
            <p className="text-xs text-text-secondary">
              Last {recentVisits.length} apps and workspace destinations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recentVisits.map((visit, idx) => (
          <div
            key={idx}
            onClick={() => navigate(visit.path)}
            className="p-3 bg-surface hover:bg-surface-hover border border-border hover:border-accent rounded-control cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-text group-hover:text-accent transition-colors truncate">
                {visit.title}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {visit.category || 'General'}
              </div>
            </div>
            <div className="text-xs text-text-secondary tabular-nums mt-3 pt-2 border-t border-border-subtle flex items-center justify-between">
              <span>{formatRelativeTime(visit.timestamp)}</span>
              <ChevronRight className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
