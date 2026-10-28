import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, AlertTriangle, Check, Merge } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SeniorDuplicatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 'DUP-001',
      score: '96% Match (Phone + Name)',
      primary: { id: 'SEN-002', name: 'Ramesh Kulkarni', phone: '+91 98220 23456', chapter: 'Pune Hub', registered: '15 Aug 2026' },
      duplicate: { id: 'SEN-089', name: 'Ramesh B. Kulkarni', phone: '+91 98220 23456', chapter: 'Pune Hub', registered: '22 Oct 2026' },
      status: 'Pending',
    },
    {
      id: 'DUP-002',
      score: '88% Match (Aadhaar Hash Match)',
      primary: { id: 'SEN-004', name: 'Sulabha Joshi', phone: '+91 98220 45678', chapter: 'Pune Hub', registered: '10 Sep 2026' },
      duplicate: { id: 'SEN-094', name: 'Sulabha V. Joshi', phone: '+91 98220 99887', chapter: 'Nashik Hub', registered: '24 Oct 2026' },
      status: 'Pending',
    },
  ]);

  const handleMerge = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/seniors" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Seniors
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Duplicates</span>
      </div>

      <PageHeader
        title="Duplicate elder profile detection"
        subtitle="Phonetic name matching (Double Metaphone) and phone number collision resolution"
      />

      <Card title="Potential duplicate records">
        <div className="space-y-4">
          {candidates.length > 0 ? (
            candidates.map((c) => (
              <div key={c.id} className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--critical)] bg-[var(--critical-tint)] px-2 py-0.5 rounded">
                    {c.score}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleMerge(c.id)}>Dismiss match</Button>
                    <Button size="sm" variant="primary" icon={<Merge size={14} />} onClick={() => handleMerge(c.id)}>
                      Merge into primary profile
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 rounded bg-surface border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--accent)] font-semibold block">Primary record</span>
                    <strong className="text-sm text-[var(--text)] block mt-0.5">{c.primary.name}</strong>
                    <div className="text-[var(--text-secondary)] mt-1">{c.primary.id} • {c.primary.phone}</div>
                    <div className="text-[var(--text-tertiary)]">{c.primary.chapter} • Registered: {c.primary.registered}</div>
                  </div>

                  <div className="p-3 rounded bg-surface border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--critical)] font-semibold block">Flagged duplicate</span>
                    <strong className="text-sm text-[var(--text)] block mt-0.5">{c.duplicate.name}</strong>
                    <div className="text-[var(--text-secondary)] mt-1">{c.duplicate.id} • {c.duplicate.phone}</div>
                    <div className="text-[var(--text-tertiary)]">{c.duplicate.chapter} • Registered: {c.duplicate.registered}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-[var(--text-secondary)]">
              No duplicate records detected. All elder profiles are unique.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
