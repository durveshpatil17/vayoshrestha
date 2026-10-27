import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle2, Clock, AlertTriangle, Plus, Search, UserCheck } from 'lucide-react';
import { FollowUpTask } from '@/api/contracts';

export const FollowUpsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [tasks, setTasks] = useState<FollowUpTask[]>(data.followUps);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-31');

  const todayStr = '2026-10-27';

  const filteredTasks = tasks.filter((t) => {
    // CC scope
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(t.centreId)) {
        return false;
      }
    }
    // VF scope: assigned tasks only
    if (user?.role === 'VF') {
      if (t.assigneeId !== user.id) return false;
    }

    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.memberName.toLowerCase().includes(q) || t.reason.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCompleteTask = () => {
    if (!selectedTask || !outcomeNotes) return;

    mockStore.updateData((draft) => {
      const target = draft.followUps.find((t) => t.id === selectedTask.id);
      if (target) {
        target.status = 'Closed';
        target.outcomeNotes = outcomeNotes;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'UPDATE',
      'FollowUpTask',
      selectedTask.id,
      `Completed follow-up for ${selectedTask.memberName}. Notes: ${outcomeNotes}`,
      { status: selectedTask.status },
      { status: 'Closed', outcomeNotes },
      selectedTask.centreId
    );

    setTasks([...mockStore.getData().followUps]);
    setSelectedTask(null);
    setOutcomeNotes('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const member = data.seniorCitizens.find((m) => m.id === newMemberId);
    if (!member) return;

    const newTask: FollowUpTask = {
      id: `fu-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      centreId: member.centreId,
      reason: newReason,
      assigneeId: user?.id || 'u-cc-pune',
      assigneeName: user?.fullName || 'Centre Coordinator',
      dueDate: newDueDate,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.followUps.unshift(newTask);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'CREATE',
      'FollowUpTask',
      newTask.id,
      `Created follow-up task for ${member.fullName}: ${newReason}`,
      null,
      newTask,
      member.centreId
    );

    setTasks([...mockStore.getData().followUps]);
    setShowNewModal(false);
    setNewMemberId('');
    setNewReason('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Field Follow-Up & Outreach Tasks"
        description="Assigned elder wellness check-ins, drop-off investigations, and post-referral calls (FR-36)"
        breadcrumb={[{ label: 'Feedback', href: '/feedback' }, { label: 'Follow-ups' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Follow-Up Task
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior or outreach reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Pending', 'Contacted', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {st === 'all' ? 'All Tasks' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filteredTasks.length}</strong> task{filteredTasks.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Reason & Outreach Trigger</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">
                  No outreach tasks found matching active filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = task.status !== 'Closed' && task.dueDate < todayStr;

                return (
                  <tr key={task.id} className="hover:bg-bg-subtle/40">
                    <td className="py-3.5 px-4 font-medium text-text-primary">
                      <Link to={`/members/${task.memberId}`} className="hover:text-accent underline decoration-dotted">
                        {task.memberName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm text-text-muted">
                      <div>{task.reason}</div>
                      {task.outcomeNotes && (
                        <div className="text-[11px] text-emerald-800 font-medium mt-1">
                          Outcome: {task.outcomeNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">{task.assigneeName}</td>
                    <td className="py-3.5 px-4">
                      <span className={isOverdue ? 'text-rose-700 font-bold flex items-center gap-1' : 'text-text-muted'}>
                        {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                        {task.dueDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip
                        label={task.status}
                        variant={task.status === 'Closed' ? 'neutral' : isOverdue ? 'danger' : 'warning'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {task.status !== 'Closed' ? (
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-xs text-accent font-semibold hover:underline"
                        >
                          Complete Task →
                        </button>
                      ) : (
                        <span className="text-text-muted">Resolved</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Complete Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Record Follow-Up Outcome</h3>
              <button onClick={() => setSelectedTask(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline">
                <div><strong>Senior:</strong> {selectedTask.memberName}</div>
                <div className="mt-1"><strong>Trigger:</strong> {selectedTask.reason}</div>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-text-primary">Call / Visit Outcome Notes</label>
                <textarea
                  rows={3}
                  required
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="e.g. Called elder; was recovering from mild fever. Confirmed will return to yoga next Tuesday."
                  className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedTask(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleCompleteTask} disabled={!outcomeNotes.trim()}>
                Mark Completed
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Task Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">New Outreach Task</h3>
              <button onClick={() => setShowNewModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-text-primary block mb-1">Select Senior Citizen</label>
                <select
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  required
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="">-- Choose member --</option>
                  {data.seniorCitizens.slice(0, 30).map((m) => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.membershipId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-text-primary block mb-1">Reason / Outreach Purpose</label>
                <textarea
                  rows={3}
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Check why member has not attended sessions in 3 weeks..."
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="font-medium text-text-primary block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" disabled={!newMemberId || !newReason.trim()}>
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
