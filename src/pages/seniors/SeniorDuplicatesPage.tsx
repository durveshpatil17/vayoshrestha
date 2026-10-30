import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Merge, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskService } from '@/services/tasks';
import { mockStore } from '@/mock/store';

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
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleConfirmUnique = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    TaskService.completeTask('TASK-P1-001');
    mockStore.updateData((data) => {
      data.outboundMessages.push({
        id: `msg-${Date.now()}`,
        channel: 'WhatsApp',
        recipientPhone: '+919845012345',
        recipientName: 'Anasuya Bai',
        content: 'Namaskara Anasuya Bai, your membership at Jayanagar Ekta Hub is confirmed! Welcome to Vayoshrestha.',
        status: 'Sent',
        sentAt: new Date().toISOString(),
        retryCount: 0,
      });
    });
    mockStore.writeAudit(
      'u-pm-1',
      'Priya Menon',
      'PM',
      'APPROVE',
      'SENIOR',
      'SC-KA-BLR-001',
      'Confirmed unique senior enrollment after duplicate review; welcome message dispatched.',
      'Manual field verification'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Link to="/seniors" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" /> Seniors
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Duplicates</span>
      </div>

      <PageHeader
        title="Duplicate elder profile detection"
        description="Phonetic name matching (Double Metaphone) and phone number collision resolution"
      />

      <Card title="Potential duplicate records">
        <div className="space-y-4">
          {candidates.length > 0 ? (
            candidates.map((c) => (
              <div key={c.id} className="p-4 rounded-container bg-surface-subtle border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-critical bg-critical-tint px-2 py-0.5 rounded-chip border border-critical/20">
                    {c.score}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" icon={<Check className="w-3.5 h-3.5 stroke-[1.5]" />} onClick={() => handleConfirmUnique(c.id)}>
                      Confirm unique person
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleMerge(c.id)}>Dismiss match</Button>
                    <Button size="sm" variant="primary" icon={<Merge className="w-3.5 h-3.5 stroke-[1.5]" />} onClick={() => handleMerge(c.id)}>
                      Merge into primary profile
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 rounded-control bg-surface border border-border space-y-1">
                    <span className="text-xs text-accent font-semibold block">Primary record</span>
                    <strong className="text-sm text-text block font-semibold">{c.primary.name}</strong>
                    <div className="text-text-secondary tabular-nums">{c.primary.id} • {c.primary.phone}</div>
                    <div className="text-text-secondary">{c.primary.chapter} • Registered: {c.primary.registered}</div>
                  </div>

                  <div className="p-3 rounded-control bg-surface border border-border space-y-1">
                    <span className="text-xs text-critical font-semibold block">Flagged duplicate</span>
                    <strong className="text-sm text-text block font-semibold">{c.duplicate.name}</strong>
                    <div className="text-text-secondary tabular-nums">{c.duplicate.id} • {c.duplicate.phone}</div>
                    <div className="text-text-secondary">{c.duplicate.chapter} • Registered: {c.duplicate.registered}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-text-secondary">
              No duplicate records detected. All elder profiles are unique.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
