import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { AlertTriangle, GitMerge, Check, ArrowRight } from 'lucide-react';

interface DuplicatePair {
  id: string;
  confidence: 'High' | 'Medium';
  reason: string;
  primary: {
    id: string;
    membershipId: string;
    fullName: string;
    dateOfBirth: string;
    phone: string;
    registeredAt: string;
    centreId: string;
  };
  candidate: {
    id: string;
    membershipId: string;
    fullName: string;
    dateOfBirth: string;
    phone: string;
    registeredAt: string;
    centreId: string;
  };
}

export const MemberDuplicatesPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [pairs, setPairs] = useState<DuplicatePair[]>([
    {
      id: 'dup-1',
      confidence: 'High',
      reason: 'Exact match on Full Name, DOB, and Phone Number',
      primary: {
        id: 'm-1',
        membershipId: 'VV-PUN-26-00001',
        fullName: 'Bhagwandas Sharma',
        dateOfBirth: '1956-08-15',
        phone: '9822011223',
        registeredAt: '2026-08-01',
        centreId: 'HUB-PUN',
      },
      candidate: {
        id: 'm-102',
        membershipId: 'VV-PUN-26-00102',
        fullName: 'Bhagwandas Sharma',
        dateOfBirth: '1956-08-15',
        phone: '9822011223',
        registeredAt: '2026-09-14',
        centreId: 'HUB-PUN',
      },
    },
    {
      id: 'dup-2',
      confidence: 'Medium',
      reason: 'Normalized Name and identical Contact Phone',
      primary: {
        id: 'm-5',
        membershipId: 'VV-NSK-26-00005',
        fullName: 'Shanta Devi Patel',
        dateOfBirth: '1958-03-22',
        phone: '9822099887',
        registeredAt: '2026-08-05',
        centreId: 'HUB-NSK',
      },
      candidate: {
        id: 'm-155',
        membershipId: 'VV-NSK-26-00155',
        fullName: 'Shanta Patel',
        dateOfBirth: '1958-01-01',
        phone: '9822099887',
        registeredAt: '2026-10-02',
        centreId: 'HUB-NSK',
      },
    },
  ]);

  const [mergedPairId, setMergedPairId] = useState<string | null>(null);

  const handleMerge = (pairId: string) => {
    const pair = pairs.find((p) => p.id === pairId);
    if (!pair) return;

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Programme Manager',
      user?.role || 'PM',
      'UPDATE',
      'SeniorCitizen',
      pair.primary.id,
      `Merged duplicate record ${pair.candidate.membershipId} into primary ${pair.primary.membershipId}`
    );

    setPairs((prev) => prev.filter((p) => p.id !== pairId));
    setMergedPairId(pairId);
    setTimeout(() => setMergedPairId(null), 3000);
  };

  const handleDismiss = (pairId: string) => {
    setPairs((prev) => prev.filter((p) => p.id !== pairId));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duplicate Member Review Queue"
        description="Programme Manager queue for detecting, comparing, and resolving duplicate senior registrations."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Senior Citizens', to: '/members' },
          { label: 'Duplicate Review' },
        ]}
      />

      {mergedPairId && (
        <div className="p-3 bg-success-bg text-success text-xs rounded border border-success/30 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Duplicate record successfully merged and recorded in audit log.</span>
        </div>
      )}

      {pairs.length === 0 ? (
        <div className="p-12 text-center text-xs text-text-muted border border-dashed border-border-hairline rounded bg-bg-subtle">
          Zero pending duplicate warnings in queue.
        </div>
      ) : (
        <div className="space-y-6">
          {pairs.map((p) => (
            <div key={p.id} className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-semibold text-xs text-text-primary">
                    Flagged Conflict: {p.reason}
                  </span>
                </div>
                <StatusChip label={`${p.confidence} Confidence`} variant="pending" />
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Primary Record */}
                <div className="p-4 rounded border border-accent/30 bg-accent-tint/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-accent uppercase">Primary Record</span>
                    <span className="font-mono text-xs font-bold text-text-primary">{p.primary.membershipId}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>Name: <strong>{p.primary.fullName}</strong></div>
                    <div>DOB: {p.primary.dateOfBirth}</div>
                    <div>Phone: <span className="font-mono">{p.primary.phone}</span></div>
                    <div>Centre: {p.primary.centreId} · Registered: {p.primary.registeredAt}</div>
                  </div>
                </div>

                {/* Candidate Duplicate */}
                <div className="p-4 rounded border border-border-strong bg-bg-subtle">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Candidate Duplicate</span>
                    <span className="font-mono text-xs font-bold text-text-primary">{p.candidate.membershipId}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>Name: <strong>{p.candidate.fullName}</strong></div>
                    <div>DOB: {p.candidate.dateOfBirth}</div>
                    <div>Phone: <span className="font-mono">{p.candidate.phone}</span></div>
                    <div>Centre: {p.candidate.centreId} · Registered: {p.candidate.registeredAt}</div>
                  </div>
                </div>
              </div>

              {/* Resolution Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleDismiss(p.id)}>
                  Dismiss as Distinct Individuals
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<GitMerge className="w-4 h-4" />}
                  onClick={() => handleMerge(p.id)}
                >
                  Merge into Primary Record
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
