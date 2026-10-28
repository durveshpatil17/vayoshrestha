import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  HeartPulse,
  Filter,
  Search,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const HealthLogsPage: React.FC = () => {
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
          System Administrators (SA) do not possess clinical or health-log access permissions.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
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
          title="Senior Vital Logs & Adherence Records"
          description="Registry of blood pressure, blood glucose, and daily medication confirmations logged by seniors via WhatsApp."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/flags')}
          className="text-xs gap-1.5 text-danger border-danger/30 hover:bg-danger-surface"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          View Anomaly Flags
        </Button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search senior name or ID..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white text-xs"
          >
            <option value="ALL">All Reading Types</option>
            <option value="BLOOD_PRESSURE">Blood Pressure (BP)</option>
            <option value="BLOOD_GLUCOSE">Blood Glucose</option>
            <option value="MEDICATION_CONFIRMATION">Medication Confirmation</option>
          </select>

          <div className="flex border border-border-hairline rounded overflow-hidden">
            <button
              onClick={() => setFlagFilter('ALL')}
              className={`px-3 py-1.5 ${
                flagFilter === 'ALL' ? 'bg-accent text-white font-medium' : 'bg-white text-text-primary'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFlagFilter('FLAGGED_ONLY')}
              className={`px-3 py-1.5 border-l border-border-hairline ${
                flagFilter === 'FLAGGED_ONLY'
                  ? 'bg-danger text-white font-medium'
                  : 'bg-white text-text-primary'
              }`}
            >
              Anomalies Only
            </button>
          </div>
        </div>

        <span className="text-text-muted text-xs">
          Showing <strong>{filtered.length}</strong> logged entries
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Logged At (IST)</th>
                <th className="py-2.5 px-4">Senior Citizen</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Reading Value</th>
                <th className="py-2.5 px-4">Evaluated Band</th>
                <th className="py-2.5 px-4">Raw Text Input</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filtered.slice(0, 100).map((log) => {
                const senior = data.seniorCitizens.find((s) => s.id === log.seniorId);

                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-surface-subtle ${
                      log.isFlagged ? 'bg-danger-surface/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-text-muted">
                      {new Date(log.recordedAt || log.loggedAt || Date.now()).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-text-primary block">
                        {senior?.fullName || 'Senior'}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        {senior?.memberId}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-text-primary">{log.chapterId}</td>
                    <td className="py-2.5 px-4 font-medium text-text-primary">
                      {log.readingType === 'BLOOD_PRESSURE'
                        ? 'Blood Pressure'
                        : log.readingType === 'BLOOD_GLUCOSE'
                        ? 'Blood Glucose'
                        : 'Medication'}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-text-primary">
                      {log.systolic
                        ? `${log.systolic}/${log.diastolic} mmHg`
                        : log.glucoseValue
                        ? `${log.glucoseValue} mg/dL`
                        : log.medicationStatus || 'Confirmed'}
                    </td>
                    <td className="py-2.5 px-4">
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
                    <td className="py-2.5 px-4 font-mono text-[11px] text-text-muted">
                      "{log.rawText}"
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {log.isFlagged ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-danger font-bold">
                          <AlertCircle className="w-3 h-3" /> Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] text-success">Normal</span>
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
