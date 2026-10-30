import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { TaskService, TaskItem } from '@/services/tasks';
import { ProcessFlow, ProcessStep } from '@/components/workflow/ProcessFlow';
import { EntityHoverCard } from '@/components/ui/EntityHoverCard';
import { Button } from '@/components/ui/Button';
import {
  Inbox,
  Clock,
  AlertTriangle,
  Search,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Filter,
  Check,
  Zap,
  Building2,
  User,
  ShieldAlert,
} from 'lucide-react';

// Process step lookup dictionary for ProcessFlow visualization
const PROCESS_STEPS_MAP: Record<string, ProcessStep[]> = {
  P1: [
    { id: 'P1-S1', name: 'Intake Capture', role: 'VF', sla: '4h', status: 'Completed' },
    { id: 'P1-S2', name: 'Consent Verification', role: 'VF', sla: '1h', status: 'Completed' },
    { id: 'P1-S3', name: 'Duplicate Resolution', role: 'PM', sla: '24h', status: 'Current' },
    { id: 'P1-S4', name: 'Chapter Induction', role: 'CM', sla: '48h', status: 'Pending' },
  ],
  P2: [
    { id: 'P2-S1', name: 'SOS Trigger', role: 'SC', sla: 'Instant', status: 'Completed' },
    { id: 'P2-S2', name: 'Triage & Acknowledge', role: 'CT', sla: '2m', status: 'Current' },
    { id: 'P2-S3', name: 'Responder Dispatch', role: 'CT', sla: '5m', status: 'Pending' },
    { id: 'P2-S4', name: 'Case Resolution', role: 'CT', sla: '30m', status: 'Pending' },
    { id: 'P2-S5', name: 'Post-Case Review', role: 'CM', sla: '24h', status: 'Pending' },
  ],
  P3: [
    { id: 'P3-S1', name: 'Reading Capture', role: 'VF', sla: 'Daily', status: 'Completed' },
    { id: 'P3-S2', name: 'Anomaly Detection', role: 'System', sla: 'Auto', status: 'Completed' },
    { id: 'P3-S3', name: 'Wellness Outreach', role: 'CT', sla: '4h', status: 'Current' },
    { id: 'P3-S4', name: 'Clinical Follow-up', role: 'CM', sla: '24h', status: 'Pending' },
  ],
  P4: [
    { id: 'P4-S1', name: 'Session Schedule', role: 'PM', sla: '48h', status: 'Completed' },
    { id: 'P4-S2', name: 'Roster Submission', role: 'VF', sla: '24h', status: 'Completed' },
    { id: 'P4-S3', name: 'Attendance Correction', role: 'CM', sla: '6h', status: 'Current' },
    { id: 'P4-S4', name: 'Final Ledger Lock', role: 'VF', sla: '2h', status: 'Pending' },
  ],
  P5: [
    { id: 'P5-S1', name: 'Draft Template', role: 'PM', sla: '12h', status: 'Completed' },
    { id: 'P5-S2', name: 'Maker-Checker Approval', role: 'NM', sla: '12h', status: 'Current' },
    { id: 'P5-S3', name: 'Statutory Broadcast', role: 'PM', sla: '1h', status: 'Pending' },
  ],
  P6: [
    { id: 'P6-S1', name: 'Referral Request', role: 'CM', sla: '2h', status: 'Completed' },
    { id: 'P6-S2', name: 'Voucher Issuance', role: 'System', sla: 'Instant', status: 'Completed' },
    { id: 'P6-S3', name: 'Partner Redemption', role: 'SP', sla: '8h', status: 'Current' },
    { id: 'P6-S4', name: 'Financial Settlement', role: 'NM', sla: '48h', status: 'Pending' },
  ],
  P7: [
    { id: 'P7-S1', name: 'Encrypted Narrative', role: 'VF', sla: '2h', status: 'Completed' },
    { id: 'P7-S2', name: 'Legal Consultation', role: 'SP', sla: '18h', status: 'Current' },
    { id: 'P7-S3', name: 'Advocate Review', role: 'SP', sla: '24h', status: 'Pending' },
    { id: 'P7-S4', name: 'Case Disposition', role: 'SP', sla: '72h', status: 'Pending' },
  ],
  P8: [
    { id: 'P8-S1', name: 'Curriculum Draft', role: 'PM', sla: '24h', status: 'Completed' },
    { id: 'P8-S2', name: 'Curriculum Approval', role: 'NM', sla: '24h', status: 'Current' },
    { id: 'P8-S3', name: 'Module Delivery', role: 'VF', sla: '48h', status: 'Pending' },
    { id: 'P8-S4', name: 'Elder Quiz Completion', role: 'SC', sla: 'Self-paced', status: 'Pending' },
  ],
  P9: [
    { id: 'P9-S1', name: 'Field Data Capture', role: 'VF', sla: 'Offline', status: 'Completed' },
    { id: 'P9-S2', name: 'Double Consent Log', role: 'VF', sla: 'Stored', status: 'Completed' },
    { id: 'P9-S3', name: 'Supervisor Sync Check', role: 'CM', sla: '4h', status: 'Current' },
    { id: 'P9-S4', name: 'Ledger Reconciliation', role: 'SA', sla: '12h', status: 'Pending' },
  ],
  P10: [
    { id: 'P10-S1', name: 'Policy Proposal', role: 'PM', sla: '24h', status: 'Completed' },
    { id: 'P10-S2', name: 'Governance Approval', role: 'NM', sla: '10h', status: 'Current' },
    { id: 'P10-S3', name: 'Executive Seal', role: 'SA', sla: '24h', status: 'Pending' },
  ],
  P11: [
    { id: 'P11-S1', name: 'Erasure Request', role: 'SC', sla: 'Instant', status: 'Completed' },
    { id: 'P11-S2', name: 'DPDP Action Verification', role: 'SA', sla: '48h', status: 'Current' },
    { id: 'P11-S3', name: 'Cryptographic Purge', role: 'SA', sla: '1h', status: 'Pending' },
  ],
  P12: [
    { id: 'P12-S1', name: 'Grievance Intake', role: 'VF', sla: '2h', status: 'Completed' },
    { id: 'P12-S2', name: 'Complaint Investigation', role: 'CM', sla: '16h', status: 'Current' },
    { id: 'P12-S3', name: 'Resolution Sign-off', role: 'NM', sla: '24h', status: 'Pending' },
  ],
  P13: [
    { id: 'P13-S1', name: 'Data Aggregation', role: 'System', sla: 'Auto', status: 'Completed' },
    { id: 'P13-S2', name: 'K-Anonymity Verification', role: 'PM', sla: '4h', status: 'Completed' },
    { id: 'P13-S3', name: 'Impact Pack Release', role: 'NM', sla: '8h', status: 'Current' },
    { id: 'P13-S4', name: 'Public SHA-256 Verification', role: 'Public', sla: 'Open', status: 'Pending' },
  ],
  P14: [
    { id: 'P14-S1', name: 'Partner Application', role: 'SP', sla: '24h', status: 'Completed' },
    { id: 'P14-S2', name: 'Partner Accreditation', role: 'NM', sla: '72h', status: 'Current' },
    { id: 'P14-S3', name: 'Directory Activation', role: 'SA', sla: '24h', status: 'Pending' },
  ],
  P15: [
    { id: 'P15-S1', name: 'Readiness Checklist', role: 'CM', sla: '48h', status: 'Completed' },
    { id: 'P15-S2', name: 'Hardware & Safety Audit', role: 'RA', sla: '24h', status: 'Completed' },
    { id: 'P15-S3', name: 'Staff Sign-off', role: 'PM', sla: '12h', status: 'Completed' },
    { id: 'P15-S4', name: 'Go-Live Authorization', role: 'NM', sla: '24h', status: 'Current' },
  ],
};

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const currentRole = user?.role || 'PM';

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'due_soon' | 'by_process'>('all');
  const [selectedProcess, setSelectedProcess] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const reloadTasks = () => {
    const list = TaskService.getTasksForRole(currentRole);
    setTasks(list);
    if (!selectedTaskId || !list.some((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(list[0]?.id || null);
    }
  };

  useEffect(() => {
    reloadTasks();
  }, [currentRole]);

  // Filter tasks based on pills & search
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'critical' && t.priority !== 'critical') return false;
      if (filter === 'due_soon') {
        const dueHours = (new Date(t.slaDue).getTime() - Date.now()) / 3600000;
        if (dueHours > 4 || dueHours < 0) return false;
      }
      if (filter === 'by_process' && selectedProcess !== 'all' && t.processId !== selectedProcess) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchType = t.type.toLowerCase().includes(q);
        const matchEntity = t.entityName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchType && !matchEntity) return false;
      }
      return true;
    });
  }, [tasks, filter, selectedProcess, searchQuery]);

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId) || filteredTasks[0] || null;
  }, [tasks, selectedTaskId, filteredTasks]);

  const handleTakeNext = () => {
    const next = TaskService.getTakeNextTask(currentRole);
    if (next) {
      setSelectedTaskId(next.id);
    }
  };

  const handleExecuteAction = (task: TaskItem) => {
    TaskService.completeTask(task.id);

    if (task.type === 'DUPLICATE_REVIEW') {
      mockStore.updateData((data) => {
        data.outboundMessages.push({
          id: `msg-${Date.now()}`,
          channel: 'WhatsApp',
          recipientPhone: '+919845012345',
          recipientName: task.entityName,
          content: `Namaskara ${task.entityName}, your membership is confirmed! Welcome to Vayoshrestha.`,
          status: 'Sent',
          sentAt: new Date().toISOString(),
          retryCount: 0,
        });
      });
      mockStore.writeAudit(
        user?.id || 'u-pm-1',
        user?.fullName || 'Priya Menon',
        user?.role || 'PM',
        'APPROVE',
        'SENIOR',
        task.entityId,
        `Duplicate confirmed unique: ${task.entityName}. Welcome message dispatched.`,
        'PM inbox confirmation'
      );
    } else if (task.type === 'SUPERVISOR_SYNC_CHECK') {
      mockStore.writeAudit(
        user?.id || 'u-cm-1',
        user?.fullName || 'Sunita Patil',
        user?.role || 'CM',
        'UPDATE',
        'SETTINGS',
        task.entityId,
        `Supervisor completed sync state inspection for field terminal ${task.entityId}. Connectivity restored.`,
        'Field supervisor check'
      );
    } else if (task.type === 'ATTENDANCE_CORRECTION_APPROVAL') {
      mockStore.writeAudit(
        user?.id || 'u-cm-1',
        user?.fullName || 'Sunita Patil',
        user?.role || 'CM',
        'APPROVE',
        'ROSTER',
        task.entityId,
        `Attendance correction approved for roster ${task.entityId} (${task.entityName}).`,
        'CM inbox verification'
      );
    } else if (task.type === 'DISENGAGEMENT_OUTREACH') {
      mockStore.writeAudit(
        user?.id || 'u-vf-1',
        user?.fullName || 'Pooja Shinde',
        user?.role || 'VF',
        'UPDATE',
        'SENIOR',
        task.entityId,
        `Completed 3-session absence drop-off outreach for senior ${task.entityName}.`,
        'VF welfare follow-up'
      );
    } else if (task.type === 'TEMPLATE_APPROVAL') {
      mockStore.writeAudit(
        user?.id || 'u-nm-1',
        user?.fullName || 'Nandita Rao',
        user?.role || 'NM',
        'APPROVE',
        'INTAKE',
        task.entityId,
        `Communication template ${task.entityId} (${task.entityName}) approved for statutory broadcast.`,
        'NM maker-checker signoff'
      );
    } else if (task.type === 'PARTNER_REFERRAL_ACTION') {
      mockStore.writeAudit(
        user?.id || 'u-sp-1',
        user?.fullName || 'Apollo Pharmacy',
        user?.role || 'SP',
        'UPDATE',
        'VOUCHER',
        task.entityId,
        `Partner acknowledged referral and initiated settlement for ${task.entityName}.`,
        'Partner portal fulfillment'
      );
    } else if (task.type === 'LEGAL_CONSULTATION') {
      mockStore.writeAudit(
        user?.id || 'u-sp-legal-1',
        user?.fullName || 'Adv. Kulkarni',
        user?.role || 'SP',
        'UPDATE',
        'INTAKE',
        task.entityId,
        `Pro-bono counsel completed preliminary legal consultation for senior ${task.entityName}. Advice documented under privilege.`,
        'Confidential pro-bono consultation'
      );
    } else if (task.type === 'PARTNER_ACCREDITATION') {
      mockStore.writeAudit(
        user?.id || 'u-nm-1',
        user?.fullName || 'Nandita Rao',
        user?.role || 'NM',
        'APPROVE',
        'PARTNER',
        task.entityId,
        `Service partner ${task.entityName} accredited and activated in deterministic capacity pool.`,
        'NM accreditation governance signoff'
      );
    }

    setActionNotice(`Successfully completed: ${task.title}`);
    setTimeout(() => setActionNotice(null), 4000);
    reloadTasks();
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-negative-tint text-negative border-negative/30';
      case 'high':
        return 'bg-critical-tint text-critical border-critical/30';
      case 'medium':
        return 'bg-accent-tint text-accent border-accent/30';
      default:
        return 'bg-surface-subtle text-text-secondary border-border';
    }
  };

  const formatSlaCountdown = (slaDue: string) => {
    const diffMs = new Date(slaDue).getTime() - Date.now();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    if (diffMs <= 0) return 'SLA overdue';
    if (diffHours === 0) return `${diffMins}m remaining`;
    return `${diffHours}h ${diffMins}m remaining`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header Bar */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
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
          <Button variant="primary" size="md" onClick={handleTakeNext}>
            Take next task
          </Button>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-positive-tint border border-positive/30 text-positive px-4 py-2.5 rounded-control text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 stroke-[2]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Split Panel Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left List Pane (384px fixed width on desktop) */}
        <div className="w-full lg:w-96 shrink-0 bg-surface border border-border rounded-container flex flex-col h-full overflow-hidden">
          {/* Filter Pills & Search */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5 stroke-[1.5]" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-9 pr-3 rounded-control bg-page border border-border text-xs text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-control font-semibold transition-colors shrink-0 ${
                  filter === 'all'
                    ? 'bg-accent text-surface'
                    : 'bg-surface-subtle border border-border text-text-secondary hover:text-text'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('critical')}
                className={`px-2.5 py-1 rounded-control font-semibold transition-colors shrink-0 ${
                  filter === 'critical'
                    ? 'bg-negative text-surface'
                    : 'bg-surface-subtle border border-border text-text-secondary hover:text-text'
                }`}
              >
                Critical ({tasks.filter((t) => t.priority === 'critical').length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('due_soon')}
                className={`px-2.5 py-1 rounded-control font-semibold transition-colors shrink-0 ${
                  filter === 'due_soon'
                    ? 'bg-accent text-surface'
                    : 'bg-surface-subtle border border-border text-text-secondary hover:text-text'
                }`}
              >
                Due soon
              </button>
              <button
                type="button"
                onClick={() => setFilter('by_process')}
                className={`px-2.5 py-1 rounded-control font-semibold transition-colors shrink-0 ${
                  filter === 'by_process'
                    ? 'bg-accent text-surface'
                    : 'bg-surface-subtle border border-border text-text-secondary hover:text-text'
                }`}
              >
                By process
              </button>
            </div>

            {filter === 'by_process' && (
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="w-full h-7 px-2 bg-page border border-border rounded-control text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="all">All processes (P1–P15)</option>
                {Array.from({ length: 15 }, (_, i) => `P${i + 1}`).map((p) => (
                  <option key={p} value={p}>
                    {p} Process Queue
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Task Scroll List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-text-secondary">
                No active tasks found matching criteria.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    data-task-item="true"
                    data-testid="task-item"
                    data-task-type={task.type}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-3 rounded-control border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-accent-tint/10 border-accent'
                        : 'bg-surface border-border hover:border-text-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-control bg-surface-subtle border border-border-subtle text-accent">
                        {task.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-control border font-semibold ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-text line-clamp-2 mb-1">
                      {task.title}
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-secondary mt-2">
                      <span className="truncate">{task.entityName}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-text tabular-nums shrink-0">
                        <Clock className="w-3 h-3 stroke-[1.5]" />
                        {formatSlaCountdown(task.slaDue)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="flex-1 min-w-0 bg-surface border border-border rounded-container flex flex-col h-full overflow-hidden">
          {selectedTask ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Task Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-control bg-accent-tint text-accent border border-accent/20">
                      {selectedTask.processId} • {selectedTask.type}
                    </span>
                    <span className="text-xs text-text-secondary tabular-nums">{selectedTask.id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-control border font-semibold ${getPriorityStyle(
                        selectedTask.priority
                      )}`}
                    >
                      {selectedTask.priority}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-text">{selectedTask.title}</h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleExecuteAction(selectedTask)}
                    className="h-9 px-4 rounded-control bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[2]" />
                    <span>{selectedTask.actionLabel || 'Confirm unique person'}</span>
                  </button>

                  {selectedTask.actionEndpoint && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(selectedTask.actionEndpoint!)}
                      className="flex items-center gap-1"
                    >
                      <span>Open view</span>
                      <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                    </Button>
                  )}
                </div>
              </div>

              {/* SLA & Context Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-subtle border border-border-subtle rounded-control text-xs">
                <div>
                  <span className="text-text-secondary block">Assigned Role</span>
                  <span className="font-semibold text-text flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 stroke-[1.5] text-accent" />
                    <span>{selectedTask.assignedRole}</span>
                  </span>
                </div>

                <div>
                  <span className="text-text-secondary block">Assigned Chapter</span>
                  <span className="font-semibold text-text flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 stroke-[1.5] text-accent" />
                    <span>{selectedTask.assignedChapter}</span>
                  </span>
                </div>

                <div>
                  <span className="text-text-secondary block">SLA Commitment</span>
                  <span className="font-semibold text-text flex items-center gap-1 mt-0.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5 stroke-[1.5] text-critical" />
                    <span>{formatSlaCountdown(selectedTask.slaDue)}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-secondary">Task Instructions</h3>
                <p className="text-xs text-text leading-relaxed bg-page p-3 border border-border rounded-control">
                  {selectedTask.description}
                </p>
              </div>

              {/* Entity Summary Card */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-secondary">Linked Entity Record</h3>
                <div className="p-3 bg-surface border border-border rounded-control flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-control bg-accent-tint text-accent border border-accent/20">
                      <User className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-text">{selectedTask.entityName}</div>
                      <div className="text-xs text-text-secondary tabular-nums">{selectedTask.entityId}</div>
                    </div>
                  </div>

                  {selectedTask.actionEndpoint && (
                    <EntityHoverCard
                      entityType={selectedTask.entityType}
                      entityId={selectedTask.entityId}
                      title={selectedTask.entityName}
                      subtitle={`Process: ${selectedTask.processId} • Role: ${selectedTask.assignedRole}`}
                      status={selectedTask.status}
                      detailUrl={selectedTask.actionEndpoint}
                    >
                      <span className="text-xs text-accent font-semibold hover:underline">
                        Hover for snapshot
                      </span>
                    </EntityHoverCard>
                  )}
                </div>
              </div>

              {/* Embedded Process Flow */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-secondary">Workflow Lifecycle</h3>
                <ProcessFlow
                  processId={selectedTask.processId}
                  processName={`Workflow ${selectedTask.processId}`}
                  steps={
                    PROCESS_STEPS_MAP[selectedTask.processId] || [
                      {
                        id: selectedTask.stepId,
                        name: selectedTask.title,
                        role: selectedTask.assignedRole,
                        sla: '24h',
                        status: 'Current',
                      },
                    ]
                  }
                  currentStepId={selectedTask.stepId}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-secondary">
              <Inbox className="w-12 h-12 stroke-[1] text-text-muted mb-3" />
              <h3 className="text-sm font-semibold text-text">No Task Selected</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                Select an assigned task from the left queue to view details, inspect entity context, and take action.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
