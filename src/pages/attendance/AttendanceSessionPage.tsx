import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, UserPlus, Save, ShieldAlert } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';

export const AttendanceSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const session = data.programmeSessions.find((s) => s.id === id) || data.programmeSessions[0];

  const [roster, setRoster] = useState([
    { id: 'SEN-001', name: 'Kamala Devi', phone: '+91 98220 12345', status: 'Present' as 'Present' | 'Absent' | 'Excused' | 'Walk_in' },
    { id: 'SEN-002', name: 'Ramesh Kulkarni', phone: '+91 98220 23456', status: 'Present' as 'Present' | 'Absent' | 'Excused' | 'Walk_in' },
    { id: 'SEN-003', name: 'Shantaram Deshpande', phone: '+91 98220 34567', status: 'Absent' as 'Present' | 'Absent' | 'Excused' | 'Walk_in' },
    { id: 'SEN-004', name: 'Sulabha Joshi', phone: '+91 98220 45678', status: 'Present' as 'Present' | 'Absent' | 'Excused' | 'Walk_in' },
    { id: 'SEN-005', name: 'Dattatray Pawar', phone: '+91 98220 56789', status: 'Absent' as 'Present' | 'Absent' | 'Excused' | 'Walk_in' },
  ]);

  const [walkInName, setWalkInName] = useState('');
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleStatus = (idx: number, newStatus: 'Present' | 'Absent' | 'Excused') => {
    const updated = [...roster];
    updated[idx].status = newStatus;
    setRoster(updated);
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;
    setRoster([
      ...roster,
      {
        id: `WALK-${Date.now().toString().slice(-4)}`,
        name: walkInName.trim(),
        phone: 'Walk-in elder',
        status: 'Walk_in',
      },
    ]);
    setWalkInName('');
    setShowWalkIn(false);
  };

  const handleSave = () => {
    mockStore.updateData((d) => {
      const sess = d.programmeSessions.find((s) => s.id === session.id);
      if (sess) {
        sess.attendanceStatus = 'Completed';
        sess.attendedCount = roster.filter((r) => r.status === 'Present' || r.status === 'Walk_in').length;
      }
    });
    setSubmitted(true);
    setTimeout(() => {
      navigate('/attendance');
    }, 1200);
  };

  const presentCount = roster.filter((r) => r.status === 'Present' || r.status === 'Walk_in').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/attendance" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Attendance
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{session.title}</span>
      </div>

      <PageHeader
        title={`Mark attendance: ${session.title}`}
        subtitle={`${session.chapterName} • ${roster.length} participants registered`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--critical-tint)] text-xs text-[var(--critical)] font-semibold border border-[var(--border)]">
              <Clock size={13} /> Auto-locks in 14h 15m
            </div>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<Save size={16} />}
              disabled={submitted}
            >
              {submitted ? 'Submitted!' : 'Submit & lock roster'}
            </Button>
          </div>
        }
      />

      {/* Summary KPI */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3.5 rounded-lg bg-surface border border-[var(--border)] text-center">
          <span className="text-xs text-[var(--text-secondary)] block">Present & Walk-ins</span>
          <span className="text-xl font-semibold text-[var(--positive)] tabular-nums">{presentCount}</span>
        </div>
        <div className="p-3.5 rounded-lg bg-surface border border-[var(--border)] text-center">
          <span className="text-xs text-[var(--text-secondary)] block">Absent</span>
          <span className="text-xl font-semibold text-[var(--negative)] tabular-nums">
            {roster.filter((r) => r.status === 'Absent').length}
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-surface border border-[var(--border)] text-center">
          <span className="text-xs text-[var(--text-secondary)] block">Attendance rate</span>
          <span className="text-xl font-semibold text-[var(--text)] tabular-nums">
            {Math.round((presentCount / roster.length) * 100)}%
          </span>
        </div>
      </div>

      <Card
        title="Participant roster"
        action={
          <Button
            size="sm"
            variant="outline"
            icon={<UserPlus size={14} />}
            onClick={() => setShowWalkIn(!showWalkIn)}
          >
            Add walk-in
          </Button>
        }
      >
        {showWalkIn && (
          <form onSubmit={handleAddWalkIn} className="p-3 mb-4 rounded bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center gap-3">
            <input
              type="text"
              required
              placeholder="Enter senior citizen full name..."
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded border border-[var(--border)] bg-surface focus:outline-none"
            />
            <Button size="sm" variant="primary" type="submit">Add to roster</Button>
            <Button size="sm" variant="outline" type="button" onClick={() => setShowWalkIn(false)}>Cancel</Button>
          </form>
        )}

        <div className="divide-y divide-[var(--border-subtle)]">
          {roster.map((person, idx) => (
            <div key={person.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">{person.name}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  ID: <span className="tabular-nums font-semibold">{person.id}</span> • {person.phone}
                </div>
              </div>

              {/* 48px+ touch targets */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(idx, 'Present')}
                  className={`min-h-[44px] min-w-[70px] px-3 py-2 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1 ${
                    person.status === 'Present' || person.status === 'Walk_in'
                      ? 'bg-[var(--positive)] text-white border-[var(--positive)]'
                      : 'bg-surface text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <Check size={14} /> Present
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus(idx, 'Absent')}
                  className={`min-h-[44px] min-w-[70px] px-3 py-2 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1 ${
                    person.status === 'Absent'
                      ? 'bg-[var(--negative)] text-white border-[var(--negative)]'
                      : 'bg-surface text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <X size={14} /> Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
