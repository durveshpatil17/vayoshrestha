import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Calendar,
  Clock,
  Pill,
  Search,
  PauseCircle,
  PlayCircle,
  Plus,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { MedicationSchedule } from '@/api/contracts';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const HealthSchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [search, setSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
            <h1 className="text-2xl font-semibold text-text">Medication Reminder Schedules</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure daily utility reminder schedules, quiet hours compliance, and automated prompt timings.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/reminders')}
          >
            Reminder Templates
          </Button>
          {(user?.role === 'CM' || user?.role === 'VF') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="gap-1.5 bg-accent"
            >
              <Plus className="w-4 h-4" />
              New Schedule
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <MessageStrip type="positive" onClose={() => setFeedback(null)}>
          {feedback}
        </MessageStrip>
      )}

      {/* Data Minimisation Mandate Strip */}
      <div className="p-3 bg-surface border border-border rounded-container text-xs text-text-secondary flex items-center gap-2">
        <Info className="w-4 h-4 text-accent shrink-0" />
        <span>
          <strong className="text-text">Data Minimisation Mandate:</strong> Only reminder labels (e.g. "Morning wellness prescription") and target times are stored. No clinical dosage guidance or pharmacological advice is collected or sent.
        </span>
      </div>

      {/* Filter and search bar */}
      <Container className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-64">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search senior or label..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 border border-border rounded-control text-xs bg-surface text-text focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
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
              className="h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="PAUSED">Paused Only</option>
            </select>
          </div>

          <span className="text-text-secondary text-xs shrink-0 self-center">
            Showing <strong className="text-text tabular-nums">{filtered.length}</strong> schedules
          </span>
        </div>
      </Container>

      {/* Schedules Table */}
      <Container>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-page text-text-secondary font-semibold">
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Reminder Label</th>
                <th className="py-3 px-4">Scheduled Time (IST)</th>
                <th className="py-3 px-4">Recurrence</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 50).map((sched) => {
                const senior = data.seniorCitizens.find((s) => s.id === sched.seniorId);

                return (
                  <tr key={sched.id} className="hover:bg-page transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-text block">
                        {senior?.fullName || 'Senior'}
                      </span>
                      <span className="text-xs tabular-nums text-text-secondary">
                        {senior?.memberId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text">{sched.chapterId}</td>
                    <td className="py-3 px-4 font-semibold text-text">
                      {sched.medicationLabel}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-accent font-semibold">
                      {sched.scheduledTime} IST
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {sched.recurrence === 'DAILY' ? 'Daily' : sched.recurrence === 'WEEKLY' ? 'Weekly' : sched.recurrence || 'Daily'}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{sched.language}</td>
                    <td className="py-3 px-4">
                      <StatusChip
                        status={sched.status === 'ACTIVE' ? 'success' : 'neutral'}
                        label={sched.status}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(user?.role === 'CM' || user?.role === 'VF') && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(sched)}
                          className="px-2.5 py-1 text-xs border border-border rounded-control font-semibold text-text hover:bg-page inline-flex items-center gap-1.5"
                        >
                          {sched.status === 'ACTIVE' ? (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 text-critical" /> Pause
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 text-positive" /> Resume
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Add Schedule Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-base text-text flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              Add Medication Reminder Schedule
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Select Senior Citizen:</label>
                <select
                  value={seniorId}
                  onChange={(e) => setSeniorId(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
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
                <label className="block font-semibold text-text mb-1">
                  Reminder Label (Non-Clinical):
                </label>
                <input
                  type="text"
                  value={reminderLabel}
                  onChange={(e) => setReminderLabel(e.target.value)}
                  placeholder="e.g. Morning wellness prescription"
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text mb-1">
                    Scheduled Time (24h IST):
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">Recurrence:</label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
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
