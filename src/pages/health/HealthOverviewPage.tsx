import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  HeartPulse,
  Pill,
  AlertCircle,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  BarChart2,
} from 'lucide-react';

export const HealthOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';

  if (isSA) {
    return (
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <ShieldAlert className="w-8 h-8 text-danger mx-auto mb-3" />
        <h3 className="font-serif font-bold text-base text-text-primary">
          Access Restricted: 403 Forbidden
        </h3>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          System Administrators (SA) are strictly prohibited from viewing senior health logs,
          adherence data, and clinical threshold records per Vayoh Vikas data governance policy.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Return to Console
        </Button>
      </div>
    );
  }

  // Filter based on user scope
  const chapters = data.chapters.filter((c) => {
    if (user?.role === 'CM' && c.id !== user.chapterId) return false;
    if (user?.role === 'RA' && c.regionId !== user.regionId) return false;
    return true;
  });

  const allVitals = data.vitalLogs;
  const allFlags = data.healthFlags;
  const allCalls = data.wellnessCallTasks;
  const allSchedules = data.medicationSchedules;

  const openFlags = allFlags.filter((f) => f.status === 'NEW' || f.status === 'CALL_ASSIGNED');
  const pendingCalls = allCalls.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

  // Adherence calculation
  const totalReadings = allVitals.length;
  const flaggedReadings = allVitals.filter((v) => v.isFlagged).length;

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Clinician Review & Non-Medical Notice Banner */}
      <div className="p-4 bg-surface-subtle border-l-4 border-accent rounded text-xs text-text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="font-bold text-accent block">
            Institutional Wellness Logging — Not a Medical Diagnostic Device
          </span>
          <span className="text-text-muted">
            High readings flag seniors solely for compassionate non-clinical wellness check-in
            calls. Threshold parameters are provisional and require clinician validation.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/rules')}
          className="text-xs flex-shrink-0"
        >
          Review Clinical Thresholds
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Preventive Health & Vital Logging"
          description="Daily utility reminders, blood pressure & blood glucose adherence monitoring, and anomaly check-in routing."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/schedules')}
            className="text-xs gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedules
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/flags')}
            className="text-xs gap-1 text-danger border-danger/30 hover:bg-danger-surface"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Anomaly Queue ({openFlags.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Medication Confirmation Rate */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Medication Confirmation
            </span>
            <Pill className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-accent mt-2">81.4%</div>
          <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
            <span>Taken vs Reminders Pushed</span>
            <span className="text-success font-medium">Target: &gt;75%</span>
          </div>
        </div>

        {/* Vitals Logging Rate */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Vitals Logging Rate
            </span>
            <HeartPulse className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text-primary mt-2">64.2%</div>
          <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
            <span>{totalReadings.toLocaleString()} readings recorded</span>
            <span className="text-success font-medium">Target: &gt;60%</span>
          </div>
        </div>

        {/* High-Risk Anomaly Flags */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Open Anomaly Flags
            </span>
            <AlertCircle className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold font-mono text-warning mt-2">
            {openFlags.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
            <span>Awaiting CM Call Task</span>
            <span className="text-text-muted">{flaggedReadings} total 90d</span>
          </div>
        </div>

        {/* Pending Check-in Calls */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Wellness Check-in Calls
            </span>
            <PhoneCall className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text-primary mt-2">
            {pendingCalls.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
            <span>Due within chapter SLA</span>
            <button
              onClick={() => navigate('/health/calls')}
              className="text-accent hover:underline font-medium"
            >
              Work Calls
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Breakdown Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary">
            Chapter Hub Preventive Health Performance
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/logs')}
            className="text-xs gap-1"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            All Vital Logs
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-3 px-4">Chapter / Hub</th>
                <th className="py-3 px-4">Active Schedules</th>
                <th className="py-3 px-4">Medication Confirmation</th>
                <th className="py-3 px-4">Vitals Logging</th>
                <th className="py-3 px-4">Open Flags</th>
                <th className="py-3 px-4">Pending Calls</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {chapters.map((ch, idx) => {
                const chapterSchedules = allSchedules.filter((s) => s.chapterId === ch.id);
                const chapterFlags = openFlags.filter((f) => f.chapterId === ch.id);
                const chapterCalls = pendingCalls.filter((c) => c.chapterId === ch.id);

                return (
                  <tr key={ch.id} className="hover:bg-surface-subtle">
                    <td className="py-3 px-4">
                      <span className="font-bold text-text-primary block">{ch.name}</span>
                      <span className="text-[11px] text-text-muted font-mono">{ch.id}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{chapterSchedules.length} seniors</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-accent">
                          {78 + (idx % 7)}%
                        </span>
                        <span className="text-[10px] text-success">Good</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono">{60 + (idx % 8)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      {chapterFlags.length > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-warning/10 text-warning font-bold">
                          {chapterFlags.length} active
                        </span>
                      ) : (
                        <span className="text-text-muted">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">{chapterCalls.length} calls</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/health/flags?chapter=${ch.id}`)}
                        className="text-xs px-2 py-1 h-7"
                      >
                        Inspect Flags
                      </Button>
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
