import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  PhoneCall,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  User,
  ShieldAlert,
} from 'lucide-react';
import { WellnessCallTask } from '@/api/contracts';

export const WellnessCallsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';

  if (isSA) {
    return (
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <ShieldAlert className="w-8 h-8 text-danger mx-auto mb-3" />
        <h3 className="font-semibold text-base text-text-primary">
          Access Restricted: 403 Forbidden
        </h3>
        <p className="text-xs text-text-muted mt-1">
          System Administrators cannot view senior wellness call lists.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const calls = data.wellnessCallTasks.filter((c) => {
    if (user?.role === 'CM' && c.chapterId !== user.chapterId) return false;
    if (user?.role === 'VF' && c.assignedVolunteerId !== user.id) return false;
    return true;
  });

  const filtered = calls.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const senior = data.seniorCitizens.find((s) => s.id === c.seniorId);
      const q = search.toLowerCase();
      const matchName = senior?.fullName.toLowerCase().includes(q);
      const matchId = (senior?.memberId || senior?.membershipId || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const handleMarkDone = (task: WellnessCallTask) => {
    task.status = 'COMPLETED';
    task.outcome = 'REACHED_WELL';
    task.completedAt = new Date().toISOString();

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: task.chapterId,
      action: 'WELLNESS_CALL_COMPLETED',
      entityType: 'CALL',
      entityId: task.id,
      details: `Wellness check-in call task completed by ${user?.name || user?.role}.`,
    });

    mockStore.persist();
    setFeedback(`Wellness call ${task.id} marked as completed.`);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Health Overview
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Wellness Check-In Tasks"
          description="Operational telephone outreach queue for seniors with elevated readings or consecutive missed logs."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/flags')}
          className="text-xs"
        >
          Anomaly Flags Queue
        </Button>
      </div>

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-semibold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search senior or member ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-border-hairline rounded text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white text-xs"
          >
            <option value="ALL">All Task Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <span className="text-text-muted text-xs">
          Showing <strong>{filtered.length}</strong> check-in calls
        </span>
      </div>

      {/* Calls Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Created Date</th>
                <th className="py-2.5 px-4">Senior Citizen</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Trigger Reason</th>
                <th className="py-2.5 px-4">Assignee</th>
                <th className="py-2.5 px-4">Due Target</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filtered.map((call) => {
                const senior = data.seniorCitizens.find((s) => s.id === call.seniorId);
                const isPending = call.status === 'PENDING' || call.status === 'IN_PROGRESS';

                return (
                  <tr key={call.id} className="hover:bg-surface-subtle">
                    <td className="py-2.5 px-4 tabular-nums text-text-muted">
                      {new Date(call.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-text-primary block">
                        {senior?.fullName || 'Senior'}
                      </span>
                      <span className="text-[11px] tabular-nums text-text-muted">
                        {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-text-primary">{call.chapterId}</td>
                    <td className="py-2.5 px-4 font-medium text-text-primary">{call.reason}</td>
                    <td className="py-2.5 px-4 text-text-muted">
                      {call.assignedVolunteerId || 'Chapter Staff'}
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-accent">
                      {new Date(call.dueDate || call.dueAt || Date.now()).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusChip
                        status={
                          call.status === 'COMPLETED'
                            ? 'success'
                            : call.status === 'PENDING'
                            ? 'warning'
                            : 'neutral'
                        }
                        label={call.status || 'Pending'}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isPending ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkDone(call)}
                          className="text-xs px-2 py-0.5 h-6 gap-1 text-accent border-accent/30"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark Done
                        </Button>
                      ) : (
                        <span className="text-[11px] text-text-muted">
                          {call.outcome || 'Done'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
