import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Plus, CheckCircle2, Clock, Check } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { TaskService } from '@/services/tasks';
import { useAuthStore } from '@/store/authStore';

export const ComplaintsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const [complaints, setComplaints] = useState(data.complaints || []);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleResolve = (id: string, name: string) => {
    const updated = complaints.map((c) =>
      c.id === id
        ? {
            ...c,
            status: 'Resolved' as const,
            resolutionDetails: 'Investigated by CM. Volunteer reminded of punctuality protocol; senior contacted with apology and confirmed satisfaction.',
          }
        : c
    );
    setComplaints(updated);
    data.complaints = updated as any;

    TaskService.completeTask('TASK-P12-001');
    mockStore.writeAudit(
      user?.id || 'u-cm-1',
      (user as any)?.name || user?.fullName || 'Sunita Patil',
      user?.role || 'CM',
      'UPDATE',
      'CASE',
      id,
      `Citizen grievance ${id} (${name}) investigated and marked Resolved by CM.`,
      'Grievance redressal protocol'
    );
    mockStore.persist();

    setFeedback(`Grievance ${id} successfully resolved.`);
    setTimeout(() => setFeedback(null), 4000);
  };

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

      {feedback && (
        <div className="p-3 bg-positive-tint text-positive border border-positive/30 rounded text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[1.5]" />
          <span>{feedback}</span>
        </div>
      )}

      <Card title="Grievance records">
        <div className="divide-y divide-border-subtle text-xs">
          {complaints.map((c) => (
            <div key={c.id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-text">{c.complainantName}</span>
                  <span className="text-text-secondary ml-2">({c.category.replace('_', ' ')})</span>
                </div>
                <StatusChip
                  label={c.status}
                  status={c.status === 'Resolved' ? 'active' : 'warning'}
                />
              </div>
              <p className="text-text mt-0.5">"{c.description}"</p>
              {c.resolutionDetails && (
                <div className="p-2.5 rounded bg-positive-tint text-positive font-semibold mt-1">
                  Resolution: {c.resolutionDetails}
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <div className="text-text-secondary">
                  Chapter: {c.chapterId} • Contact: {c.complainantPhone} • Lodged: {new Date(c.submittedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
                {c.status !== 'Resolved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(c.id, c.complainantName)}
                  >
                    Resolve grievance
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

