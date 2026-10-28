import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Calendar,
  Clock,
  Pill,
  Search,
  Filter,
  PauseCircle,
  PlayCircle,
  Plus,
  AlertTriangle,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { MedicationSchedule } from '@/api/contracts';

export const HealthSchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [search, setSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'MISSED'>('ACTIVE');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New schedule modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [seniorId, setSeniorId] = useState(data.seniorCitizens[0]?.id || '');
  const [reminderLabel, setReminderLabel] = useState('Morning wellness prescription');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [recurrence, setRecurrence] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  const schedules = data.medicationSchedules.filter((s) => {
    if (user?.role === 'CM' && s.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === s.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

  const filtered = schedules.filter((s) => {
    if (selectedChapter !== 'ALL' && s.chapterId !== selectedChapter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const senior = data.seniorCitizens.find((sc) => sc.id === s.seniorId);
      const q = search.toLowerCase();
      const matchName = senior?.fullName.toLowerCase().includes(q);
      const matchId = (senior?.memberId || senior?.membershipId || '').toLowerCase().includes(q);
      const matchLabel = (s.medicationLabel || s.label || '').toLowerCase().includes(q);
      if (!matchName && !matchId && !matchLabel) return false;
    }
    return true;
  });

  const handleToggleStatus = (schedule: MedicationSchedule) => {
    const nextStatus = schedule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    schedule.status = nextStatus;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: schedule.chapterId,
      action: 'MEDICATION_SCHEDULE_UPDATE',
      entityType: 'SCHEDULE',
      entityId: schedule.id,
      details: `Medication schedule ${schedule.id} toggled to ${nextStatus} by ${
        user?.name || user?.role
      }.`,
    });

    mockStore.persist();
    setFeedback(`Schedule for senior toggled to ${nextStatus}.`);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const senior = data.seniorCitizens.find((sc) => sc.id === seniorId);
    if (!senior) return;

    const newSched: MedicationSchedule = {
      id: `SCHED-${Date.now()}`,
      seniorId: senior.id,
      chapterId: senior.chapterId,
      medicationLabel: reminderLabel.trim(),
      scheduledTime,
      recurrence,
      status: 'ACTIVE',
      language: senior.preferredLanguage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.medicationSchedules.unshift(newSched);
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: senior.chapterId,
      action: 'MEDICATION_SCHEDULE_CREATE',
      entityType: 'SCHEDULE',
      entityId: newSched.id,
      details: `Created reminder schedule for ${senior.fullName} at ${scheduledTime} (${recurrence}).`,
    });

    mockStore.persist();
    setAddModalOpen(false);
    setFeedback(`Reminder schedule created for ${senior.fullName}.`);
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
          title="Medication Reminder Schedules"
          description="Configure daily utility reminder schedules, quiet hours compliance, and automated prompt timings."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/reminders')}
            className="text-xs"
          >
            Reminder Templates
          </Button>
          {(user?.role === 'CM' || user?.role === 'VF') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="text-xs gap-1.5 bg-accent"
            >
              <Plus className="w-3.5 h-3.5" />
              New Schedule
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-semibold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Data Minimisation Reminder Banner */}
      <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs text-text-muted flex items-center gap-2">
        <Info className="w-4 h-4 text-accent flex-shrink-0" />
        <span>
          <strong>Data Minimisation Mandate:</strong> Only reminder labels (e.g. "Morning wellness
          prescription") and target times are stored. No clinical dosage guidance or pharmacological
          advice is collected or sent.
        </span>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search senior or label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-border-hairline rounded text-xs"
            />
          </div>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white text-xs"
          >
            <option value="ALL">All Chapters</option>
            {data.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="PAUSED">Paused Only</option>
          </select>
        </div>

        <span className="text-text-muted text-xs">
          Showing <strong>{filtered.length}</strong> schedules
        </span>
      </div>

      {/* Schedules Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Senior Citizen</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Reminder Label</th>
                <th className="py-2.5 px-4">Scheduled Time (IST)</th>
                <th className="py-2.5 px-4">Recurrence</th>
                <th className="py-2.5 px-4">Language</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filtered.slice(0, 50).map((sched) => {
                const senior = data.seniorCitizens.find((s) => s.id === sched.seniorId);

                return (
                  <tr key={sched.id} className="hover:bg-surface-subtle">
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-text-primary block">
                        {senior?.fullName || 'Senior'}
                      </span>
                      <span className="text-[11px] tabular-nums text-text-muted">
                        {senior?.memberId}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-text-primary">{sched.chapterId}</td>
                    <td className="py-2.5 px-4 font-medium text-text-primary">
                      {sched.medicationLabel}
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-accent font-semibold">
                      {sched.scheduledTime} IST
                    </td>
                    <td className="py-2.5 px-4 text-text-muted capitalize">
                      {(sched.recurrence || 'Daily').toLowerCase()}
                    </td>
                    <td className="py-2.5 px-4 text-text-muted">{sched.language}</td>
                    <td className="py-2.5 px-4">
                      <StatusChip
                        status={sched.status === 'ACTIVE' ? 'success' : 'neutral'}
                        label={sched.status}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {(user?.role === 'CM' || user?.role === 'VF') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(sched)}
                          className="text-xs px-2 py-0.5 h-6 gap-1"
                        >
                          {sched.status === 'ACTIVE' ? (
                            <>
                              <PauseCircle className="w-3 h-3 text-warning" /> Pause
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3 h-3 text-success" /> Resume
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-base text-text-primary flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              Add Medication Reminder Schedule
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-text-muted mb-1">Select Senior Citizen:</label>
                <select
                  value={seniorId}
                  onChange={(e) => setSeniorId(e.target.value)}
                  className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
                  required
                >
                  {data.seniorCitizens.slice(0, 30).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.memberId} - {s.chapterId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text-muted mb-1">
                  Reminder Label (Non-Clinical):
                </label>
                <input
                  type="text"
                  value={reminderLabel}
                  onChange={(e) => setReminderLabel(e.target.value)}
                  placeholder="e.g. Morning wellness prescription"
                  className="w-full px-3 py-2 border border-border-hairline rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-text-muted mb-1">
                    Scheduled Time (24h IST):
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-border-hairline rounded tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-muted mb-1">Recurrence:</label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-accent">
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
