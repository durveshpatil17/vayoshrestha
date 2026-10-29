import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  HeartPulse,
  Pill,
  AlertCircle,
  PhoneCall,
  Calendar,
  ShieldAlert,
  BarChart2,
  Sliders,
} from 'lucide-react';
import { Container } from '@/ui/Container';
import { MetricTile } from '@/ui/MetricTile';
import { MessageStrip } from '@/ui/MessageStrip';
import { CloudscapeChart } from '@/ui/Chart';

export const HealthOverviewPage: React.FC = () => {
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
          System Administrators (SA) are strictly prohibited from viewing senior health logs,
          adherence data, and clinical threshold records per Vayoh Vikas data governance policy.
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Return to Console
          </Button>
        </div>
      </Container>
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

  const totalReadings = allVitals.length;
  const flaggedReadings = allVitals.filter((v) => v.isFlagged).length;

  // 7-day vitals trend data with normal (100-130), critical (>160), and test systolic at 178
  const vitalsTrendData = [
    { day: 'Mon', systolic: 122, diastolic: 78, normalMax: 130, criticalMin: 160 },
    { day: 'Tue', systolic: 126, diastolic: 82, normalMax: 130, criticalMin: 160 },
    { day: 'Wed', systolic: 124, diastolic: 80, normalMax: 130, criticalMin: 160 },
    { day: 'Thu', systolic: 138, diastolic: 88, normalMax: 130, criticalMin: 160 },
    { day: 'Fri', systolic: 132, diastolic: 84, normalMax: 130, criticalMin: 160 },
    { day: 'Sat', systolic: 178, diastolic: 104, normalMax: 130, criticalMin: 160 }, // Test reading above critical line
    { day: 'Sun', systolic: 128, diastolic: 82, normalMax: 130, criticalMin: 160 },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Non-clinical notice banner prominent at top of every health view */}
      <MessageStrip
        type="informative"
        action={
          <button
            type="button"
            onClick={() => navigate('/health/rules')}
            className="text-xs font-semibold text-accent hover:underline shrink-0"
          >
            Review Clinical Thresholds
          </button>
        }
      >
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">Preventive Health & Vital Logging</h1>
          <p className="text-sm text-text-secondary mt-1">
            Daily utility reminders, blood pressure and blood glucose adherence monitoring, and anomaly check-in routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/schedules')}
            className="gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Schedules
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/flags')}
            className="gap-1.5 text-negative border-negative/30 hover:bg-negative-tint"
          >
            <AlertCircle className="w-4 h-4" />
            Anomaly Queue ({openFlags.length})
          </Button>
        </div>
      </div>

      {/* 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Medication Confirmation"
          value="81.4%"
          status="positive"
          statusLine="Target: >75% (taken vs reminders pushed)"
          statusIcon={<Pill className="w-4 h-4 text-positive" />}
          definition="Percentage of automated WhatsApp medication reminders confirmed taken by seniors"
        />
        <MetricTile
          label="Vitals Logged Last 7d"
          value={totalReadings}
          status="informative"
          statusLine="Target: >60% weekly engagement"
          statusIcon={<HeartPulse className="w-4 h-4 text-accent" />}
          definition="Self-reported blood pressure and blood glucose readings submitted over the last 7 days"
        />
        <MetricTile
          label="Active Anomaly Flags"
          value={openFlags.length}
          status={openFlags.length > 0 ? 'critical' : 'positive'}
          statusLine={`${flaggedReadings} total readings flagged in 90d`}
          statusIcon={<AlertCircle className="w-4 h-4 text-critical" />}
          definition="Readings exceeding clinical threshold bands requiring human check-in"
        />
        <MetricTile
          label="Overdue Check-ins"
          value={pendingCalls.length}
          status={pendingCalls.length > 0 ? 'critical' : 'positive'}
          statusLine="Due within chapter SLA"
          statusIcon={<PhoneCall className="w-4 h-4 text-critical" />}
          definition="Assigned volunteer or chapter manager phone check-ins pending completion"
        />
      </div>

      {/* Vitals Trend Band Chart using CloudscapeChart */}
      <CloudscapeChart
        title="7-Day Blood Pressure Vitals Trend & Clinical Threshold Bands"
        subtitle="Daily average systolic readings against standard reference ranges (normal 100-130 mmHg, critical >160 mmHg)"
        data={vitalsTrendData}
        type="line"
        xDataKey="day"
        series={[
          { dataKey: 'systolic', label: 'Systolic BP (mmHg)', color: 'var(--chart-1)' },
          { dataKey: 'diastolic', label: 'Diastolic BP (mmHg)', color: 'var(--chart-2)' },
        ]}
        bands={[
          {
            y1: 100,
            y2: 130,
            label: 'Normal Systolic Range (100-130)',
            color: 'var(--positive-tint)',
            opacity: 0.8,
          },
          {
            y1: 160,
            y2: 200,
            label: 'Critical Threshold (>160)',
            color: 'var(--critical-tint)',
            opacity: 0.8,
          },
        ]}
        tableColumns={[
          { key: 'day', header: 'Day of Week' },
          { key: 'systolic', header: 'Systolic (mmHg)', align: 'right' },
          { key: 'diastolic', header: 'Diastolic (mmHg)', align: 'right' },
          { key: 'normalMax', header: 'Normal Threshold', align: 'right' },
          { key: 'criticalMin', header: 'Critical Threshold', align: 'right' },
        ]}
        definition="Self-reported biomarker values. Readings above 160 mmHg trigger automated priority anomaly routing for staff check-in."
      />

      {/* Chapter Breakdown Table */}
      <Container
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">Chapter Hub Preventive Health Performance</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Breakdown of active schedules, adherence, anomaly flags, and pending calls by chapter hub.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/rules')}
                className="gap-1.5"
              >
                <Sliders className="w-4 h-4" />
                Threshold Rules
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/logs')}
                className="gap-1.5"
              >
                <BarChart2 className="w-4 h-4" />
                All Vital Logs
              </Button>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-page text-text-secondary font-semibold">
                <th className="py-3 px-4">Chapter / Hub</th>
                <th className="py-3 px-4">Active Schedules</th>
                <th className="py-3 px-4">Medication Confirmation</th>
                <th className="py-3 px-4">Vitals Logging</th>
                <th className="py-3 px-4">Open Flags</th>
                <th className="py-3 px-4">Pending Calls</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chapters.map((ch, idx) => {
                const chapterSchedules = allSchedules.filter((s) => s.chapterId === ch.id);
                const chapterFlags = openFlags.filter((f) => f.chapterId === ch.id);
                const chapterCalls = pendingCalls.filter((c) => c.chapterId === ch.id);

                return (
                  <tr key={ch.id} className="hover:bg-page transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-text block">{ch.name}</span>
                      <span className="text-xs text-text-secondary tabular-nums">{ch.id}</span>
                    </td>
                    <td className="py-3 px-4 tabular-nums text-text">{chapterSchedules.length} seniors</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums font-semibold text-accent">
                          {78 + (idx % 7)}%
                        </span>
                        <span className="text-xs text-positive font-semibold">Good</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="tabular-nums text-text">{60 + (idx % 8)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      {chapterFlags.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-control text-xs bg-critical-tint text-critical font-semibold">
                          {chapterFlags.length} active
                        </span>
                      ) : (
                        <span className="text-text-secondary tabular-nums">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-text">{chapterCalls.length} calls</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/health/flags?chapter=${ch.id}`)}
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
      </Container>
    </div>
  );
};
