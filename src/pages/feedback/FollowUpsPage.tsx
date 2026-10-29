import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const FollowUpsPage: React.FC = () => {
  const data = mockStore.getData();
  const tasks = data.followUpTasks || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups & task queue"
        subtitle="Proactive elder outreach triggered by missed sessions, abnormal vitals, or partner referrals"
      />

      <Card title="Open outreach tasks">
        <div className="divide-y divide-[var(--border-subtle)]">
          {tasks.map((t) => (
            <div key={t.id} className="py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text font-sans">{t.seniorName}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle border border-border">
                    {t.reason.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Due: <span className="tabular-nums font-semibold">{t.dueDate}</span> • Priority: <strong>{t.priority}</strong>
                </div>
                {t.outcomeNotes && (
                  <p className="text-xs text-text-secondary mt-1">Note: {t.outcomeNotes}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={t.status}
                  status={t.status === 'Completed' ? 'active' : 'warning'}
                />
                <Button size="sm" variant="outline">
                  {t.status === 'Completed' ? 'View log' : 'Complete task'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

