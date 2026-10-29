import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  HeartPulse,
  Search,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const HealthLogsPage: React.FC = () => {
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
          System Administrators (SA) do not possess clinical or health-log access permissions.
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
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [flagFilter, setFlagFilter] = useState<'ALL' | 'FLAGGED_ONLY'>('ALL');

  const logs = data.vitalLogs.filter((l) => {
    if (user?.role === 'CM' && l.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === l.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

  const filtered = logs.filter((l) => {
    if (selectedChapter !== 'ALL' && l.chapterId !== selectedChapter) return false;
    if (typeFilter !== 'ALL' && l.readingType !== typeFilter) return false;
    if (flagFilter === 'FLAGGED_ONLY' && !l.isFlagged) return false;

    if (search.trim()) {
      const senior = data.seniorCitizens.find((sc) => sc.id === l.seniorId);
      const q = search.toLowerCase();
      const matchName = senior?.fullName.toLowerCase().includes(q);
      const matchId = (senior?.memberId || senior?.membershipId || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

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
            <h1 className="text-2xl font-semibold text-text">Senior Vital Logs & Adherence Records</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Registry of blood pressure, blood glucose, and daily medication confirmations logged by seniors via WhatsApp.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/flags')}
          className="gap-1.5 text-negative border-negative/30 hover:bg-negative-tint"
        >
          <AlertCircle className="w-4 h-4" />
          View Anomaly Flags
        </Button>
      </div>

      {/* Filter and search bar */}
      <Container className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-64">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search senior name or member ID..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
            >
              <option value="ALL">All Reading Types</option>
              <option value="BLOOD_PRESSURE">Blood Pressure (BP)</option>
              <option value="BLOOD_GLUCOSE">Blood Glucose</option>
              <option value="MEDICATION_CONFIRMATION">Medication Confirmation</option>
            </select>

            <div className="flex border border-border rounded-control overflow-hidden h-10">
              <button
                type="button"
                onClick={() => setFlagFilter('ALL')}
                className={`px-3 text-xs font-semibold ${
                  flagFilter === 'ALL'
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text hover:bg-page'
                }`}
              >
                All Records
              </button>
              <button
                type="button"
                onClick={() => setFlagFilter('FLAGGED_ONLY')}
                className={`px-3 text-xs font-semibold border-l border-border ${
                  flagFilter === 'FLAGGED_ONLY'
                    ? 'bg-negative text-white'
                    : 'bg-surface text-text hover:bg-page'
                }`}
              >
                Anomalies Only
              </button>
            </div>
          </div>

          <span className="text-text-secondary text-xs shrink-0 self-center">
            Showing <strong className="text-text tabular-nums">{filtered.length}</strong> logged entries
          </span>
        </div>
      </Container>

      {/* Table */}
      <Container>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-page text-text-secondary font-semibold">
                <th className="py-3 px-4">Logged At (IST)</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reading Value</th>
                <th className="py-3 px-4">Evaluated Band</th>
                <th className="py-3 px-4">Raw Text Input</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-secondary">
                    No vital logs match current filters.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 100).map((log) => {
                  const senior = data.seniorCitizens.find((s) => s.id === log.seniorId);

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-page transition-colors ${
                        log.isFlagged ? 'bg-critical-tint/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 tabular-nums text-text-secondary">
                        {new Date(log.recordedAt || log.loggedAt || Date.now()).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-text block">
                          {senior?.fullName || 'Senior'}
                        </span>
                        <span className="text-xs tabular-nums text-text-secondary">
                          {senior?.memberId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text">{log.chapterId}</td>
                      <td className="py-3 px-4 font-semibold text-text">
                        {log.readingType === 'BLOOD_PRESSURE'
                          ? 'Blood Pressure'
                          : log.readingType === 'BLOOD_GLUCOSE'
                          ? 'Blood Glucose'
                          : 'Medication'}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-text">
                        {log.systolic
                          ? `${log.systolic}/${log.diastolic} mmHg`
                          : log.glucoseValue
                          ? `${log.glucoseValue} mg/dL`
                          : log.medicationStatus || 'Confirmed'}
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip
                          status={
                            log.riskBand === 'CRITICAL'
                              ? 'danger'
                              : log.riskBand === 'HIGH_RISK'
                              ? 'warning'
                              : 'success'
                          }
                          label={log.riskBand || 'NORMAL'}
                        />
                      </td>
                      <td className="py-3 px-4 tabular-nums text-xs text-text-secondary">
                        "{log.rawText}"
                      </td>
                      <td className="py-3 px-4 text-right">
                        {log.isFlagged ? (
                          <span className="inline-flex items-center gap-1 text-xs text-negative font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> Flagged
                          </span>
                        ) : (
                          <span className="text-xs text-positive font-semibold">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};
