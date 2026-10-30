import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WORKSPACES, WorkspaceId } from '@/navigation/workspaces';
import { useAuthStore } from '@/store/authStore';
import {
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const WorkspaceLandingPage: React.FC = () => {
  const { workspace: wsParam } = useParams<{ workspace: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const wsId = (wsParam || 'seniors') as WorkspaceId;
  const ws = WORKSPACES[wsId];

  if (!ws) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-text mb-2">Workspace not found</h2>
        <p className="text-sm text-text-secondary mb-4">
          The requested workspace does not exist or you do not have permission to view it.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home launchpad
        </Button>
      </div>
    );
  }

  const role = user?.role || 'RA';
  const permittedApps = ws.apps.filter(
    (app) => !app.requiredRoles || app.requiredRoles.includes(role)
  );

  const workApps = permittedApps.filter((a) => a.group === 'work');
  const monitorApps = permittedApps.filter((a) => a.group === 'monitor');
  const configureApps = permittedApps.filter((a) => a.group === 'configure');

  return (
    <div className="space-y-6">
      {/* Workspace Hero Header */}
      <div className="bg-surface border border-border rounded-container p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-container bg-accent-tint text-accent border border-accent/20 flex items-center justify-center shrink-0">
            <ws.icon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-text">{ws.name} Workspace</h1>
              <span className="px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-xs text-text-secondary">
                {permittedApps.length} applications
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              {ws.purpose}
            </p>
          </div>
        </div>

        {workApps.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(workApps[0].path)}
              className="flex items-center gap-2"
            >
              <span>Launch {workApps[0].name}</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Button>
          </div>
        )}
      </div>

      {/* <= 4 Key Operational Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-container p-4">
          <div className="text-xs text-text-secondary">Active Items</div>
          <div className="text-2xl font-semibold text-text mt-1 tabular-nums">24</div>
          <div className="text-xs text-positive font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Operational SLA normal</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-container p-4">
          <div className="text-xs text-text-secondary">Needs Attention</div>
          <div className="text-2xl font-semibold text-critical mt-1 tabular-nums">3</div>
          <div className="text-xs text-text-secondary mt-1">Pending verification</div>
        </div>
        <div className="bg-surface border border-border rounded-container p-4">
          <div className="text-xs text-text-secondary">Throughput (Today)</div>
          <div className="text-2xl font-semibold text-text mt-1 tabular-nums">48</div>
          <div className="text-xs text-text-secondary mt-1">Updates logged</div>
        </div>
        <div className="bg-surface border border-border rounded-container p-4">
          <div className="text-xs text-text-secondary">Compliance Rate</div>
          <div className="text-2xl font-semibold text-text mt-1 tabular-nums">99.4%</div>
          <div className="text-xs text-positive font-semibold mt-1">Audit verified</div>
        </div>
      </div>

      {/* Applications Directory by Group (Work, Monitor, Configure) */}
      <div className="space-y-6">
        {/* Work Apps */}
        {workApps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-text">
                Work Applications
              </h2>
              <span className="text-xs text-text-secondary">({workApps.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workApps.map((app) => (
                <Link
                  key={app.id}
                  to={app.path}
                  className="bg-surface border border-border hover:border-accent rounded-container p-4 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-control bg-surface-subtle text-text group-hover:text-accent group-hover:bg-accent-tint transition-colors border border-border">
                      <app.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Monitor Apps */}
        {monitorApps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-text">
                Monitor & Visibility
              </h2>
              <span className="text-xs text-text-secondary">({monitorApps.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monitorApps.map((app) => (
                <Link
                  key={app.id}
                  to={app.path}
                  className="bg-surface border border-border hover:border-accent rounded-container p-4 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-control bg-surface-subtle text-text group-hover:text-accent group-hover:bg-accent-tint transition-colors border border-border">
                      <app.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Configure Apps */}
        {configureApps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-text">
                Configuration & Governance
              </h2>
              <span className="text-xs text-text-secondary">({configureApps.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configureApps.map((app) => (
                <Link
                  key={app.id}
                  to={app.path}
                  className="bg-surface border border-border hover:border-accent rounded-container p-4 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-control bg-surface-subtle text-text group-hover:text-accent group-hover:bg-accent-tint transition-colors border border-border">
                      <app.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
