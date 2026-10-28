import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Plus, CheckCircle2, Clock } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';

export const ComplaintsPage: React.FC = () => {
  const data = mockStore.getData();
  const complaints = data.complaints || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grievance & complaints redressal"
        subtitle="Whistleblower and participant grievance tracking with resolution accountability"
        actions={
          <Link to="/complaints/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Lodge grievance
            </Button>
          </Link>
        }
      />

      <Card title="Grievance records">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {complaints.map((c) => (
            <div key={c.id} className="py-4 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[var(--text)]">{c.complainantName}</span>
                  <span className="text-[var(--text-secondary)] ml-2">({c.category.replace('_', ' ')})</span>
                </div>
                <StatusChip
                  label={c.status}
                  status={c.status === 'Resolved' ? 'active' : 'warning'}
                />
              </div>
              <p className="text-[var(--text)] mt-0.5">"{c.description}"</p>
              {c.resolutionDetails && (
                <div className="p-2.5 rounded bg-[var(--positive-tint)] text-[var(--positive)] font-semibold mt-1">
                  Resolution: {c.resolutionDetails}
                </div>
              )}
              <div className="text-[var(--text-tertiary)] pt-1">
                Chapter: {c.chapterId} • Contact: {c.complainantPhone} • Lodged: {new Date(c.submittedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

