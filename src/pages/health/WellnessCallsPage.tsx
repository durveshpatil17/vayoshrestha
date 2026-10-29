import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  PhoneCall,
  CheckCircle2,
  Search,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { WellnessCallTask } from '@/api/contracts';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const WellnessCallsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';

  if (isSA) {
    return (
      <Container className="max-w-md mx-auto my-12 text-center p-8">
        <ShieldAlert className="w-8 h-8 text-negative mx-auto mb-3" />
        <h3 className="font-semibold text-base text-text">
          Access Restricted: 403 Forbidden
        </h3>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          System Administrators cannot view senior wellness call lists per Vayoh Vikas data governance.
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </Container>
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
      {/* Prominent non-clinical notice banner */}
      <MessageStrip type="informative">
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Nav & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health')}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text">Wellness Check-In Tasks</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Operational telephone outreach queue for seniors with elevated readings or consecutive missed logs.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/flags')}
        >
          Anomaly Flags Queue
        </Button>
      </div>

      {feedback && (
        <MessageStrip type="positive" onClose={() => setFeedback(null)}>
          {feedback}
        </MessageStrip>
      )}

      {/* Filter and search bar */}
      <Container className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-64">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search senior or member ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 border border-border rounded-control text-xs bg-surface text-text focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
            >
              <option value="ALL">All Task Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <span className="text-text-secondary text-xs shrink-0 self-center">
            Showing <strong className="text-text tabular-nums">{filtered.length}</strong> check-in calls
          </span>
        </div>
      </Container>

      {/* Calls Table */}
      <Container>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-page text-text-secondary font-semibold">
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Trigger Reason</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Target</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((call) => {
                const senior = data.seniorCitizens.find((s) => s.id === call.seniorId);
                const isPending = call.status === 'PENDING' || call.status === 'IN_PROGRESS';

                return (
                  <tr key={call.id} className="hover:bg-page transition-colors">
                    <td className="py-3 px-4 tabular-nums text-text-secondary">
                      {new Date(call.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-text block">
                        {senior?.fullName || 'Senior'}
                      </span>
                      <span className="text-xs tabular-nums text-text-secondary">
                        {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text">{call.chapterId}</td>
                    <td className="py-3 px-4 font-semibold text-text">{call.reason}</td>
                    <td className="py-3 px-4 text-text-secondary">
                      {call.assignedVolunteerId || 'Chapter Staff'}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-accent font-semibold">
                      {new Date(call.dueDate || call.dueAt || Date.now()).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                      })}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleMarkDone(call)}
                          className="px-2.5 py-1 text-xs border border-accent/40 rounded-control font-semibold text-accent hover:bg-informative-tint inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                        </button>
                      ) : (
                        <span className="text-xs text-text-secondary">
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
      </Container>
    </div>
  );
};
