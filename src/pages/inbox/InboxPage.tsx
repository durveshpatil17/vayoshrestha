import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import {
  Inbox,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const InboxPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial mock task items for R1 stub (to be fully powered by TaskService in R4)
  const initialTasks = [
    {
      id: 'TASK-001',
      title: 'Review duplicate senior enrollment: Anasuya Bai',
      type: 'DUPLICATE_REVIEW',
      workspace: 'Seniors',
      priority: 'high',
      slaDue: 'In 2 hours',
      createdAt: '10 mins ago',
      path: '/seniors/duplicates',
    },
    {
      id: 'TASK-002',
      title: 'Acknowledge pending wellness check escalation',
      type: 'HEALTH_ESCALATION',
      workspace: 'Care',
      priority: 'critical',
      slaDue: '35 mins left',
      createdAt: '15 mins ago',
      path: '/support/escalations',
    },
    {
      id: 'TASK-003',
      title: 'Verify voucher redemption from Apollo Pharmacy',
      type: 'VOUCHER_APPROVAL',
      workspace: 'Partners',
      priority: 'medium',
      slaDue: 'By 5:00 PM',
      createdAt: '1 hour ago',
      path: '/vouchers',
    },
    {
      id: 'TASK-004',
      title: 'Approve volunteer session roster: Jayanagar Chapter',
      type: 'ROSTER_APPROVAL',
      workspace: 'Community',
      priority: 'low',
      slaDue: 'Tomorrow',
      createdAt: '3 hours ago',
      path: '/programmes',
    },
  ];

  const filteredTasks = initialTasks.filter((t) => {
    if (filter === 'urgent' && t.priority !== 'critical' && t.priority !== 'high') return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-surface border border-border rounded-container p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-container bg-accent-tint text-accent border border-accent/20 flex items-center justify-center">
            <Inbox className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text">My Work (Task Inbox)</h1>
            <p className="text-xs text-text-secondary">
              Centralized operational queue across all workspaces and life-safety workflows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="md">
            Take next task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3 border border-border rounded-container">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-control bg-page border border-border text-xs text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex rounded-control border border-border bg-page p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-control font-semibold transition-colors ${
                filter === 'all' ? 'bg-surface text-text' : 'text-text-secondary'
              }`}
            >
              All ({initialTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('urgent')}
              className={`px-3 py-1 rounded-control font-semibold transition-colors ${
                filter === 'urgent' ? 'bg-surface text-text' : 'text-text-secondary'
              }`}
            >
              Urgent (2)
            </button>
          </div>
        </div>

        <div className="text-xs text-text-secondary tabular-nums">
          Showing {filteredTasks.length} assigned items
        </div>
      </div>

      {/* Split Panel Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-surface border border-border hover:border-accent rounded-container p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-control mt-0.5 border ${
                    task.priority === 'critical'
                      ? 'bg-negative-tint text-negative border-negative/30'
                      : task.priority === 'high'
                      ? 'bg-critical-tint text-critical border-critical/30'
                      : 'bg-surface-subtle text-text border-border'
                  }`}
                >
                  {task.priority === 'critical' || task.priority === 'high' ? (
                    <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                  ) : (
                    <Clock className="w-4 h-4 stroke-[1.5]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-accent">{task.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-text-secondary">
                      {task.workspace}
                    </span>
                    <span className="text-xs text-text-secondary tabular-nums">
                      {task.slaDue}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-text mt-1">{task.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = task.path)}
                  className="flex items-center gap-1.5"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Info Panel */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-container p-5">
            <h3 className="text-sm font-semibold text-text mb-2">Operational SLA Policy</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Assigned tasks follow institutional priority protocols. Red escalations require triage within 30 minutes. Non-emergency cases follow the 24-hour review SLA.
            </p>
            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-secondary">Assigned role:</span>
              <span className="font-semibold text-text">{user?.role}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Audit trail:</span>
              <span className="text-positive font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SHA-256 enabled</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
