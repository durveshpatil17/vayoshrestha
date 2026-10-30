import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, UserCheck, Check } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { TaskService } from '@/services/tasks';
import { useAuthStore } from '@/store/authStore';

export const FollowUpsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const [tasks, setTasks] = useState(data.followUpTasks || []);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleComplete = (taskId: string, seniorName: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: 'Completed' as const, outcomeNotes: 'Welfare check call completed. Senior confirmed attendance for next session.' }
        : t
    );
    setTasks(updated);
    data.followUpTasks = updated as any;

    TaskService.completeTask('TASK-P4-002');
    mockStore.writeAudit(
      user?.id || 'u-vf-1',
      (user as any)?.name || user?.fullName || 'Pooja Shinde',
      user?.role || 'VF',
      'UPDATE',
      'SENIOR',
      taskId,
      `Completed 3-session absence drop-off outreach for senior ${seniorName}. Well-being confirmed.`,
      'Outreach protocol'
    );
    mockStore.persist();

    setFeedback(`Outreach task completed for ${seniorName}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups & task queue"
        subtitle="Proactive elder outreach triggered by missed sessions, abnormal vitals, or partner referrals"
      />

      {feedback && (
        <div className="p-3 bg-positive-tint text-positive border border-positive/30 rounded text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[1.5]" />
          <span>{feedback}</span>
        </div>
      )}

      <Card title="Open outreach tasks">
        <div className="divide-y divide-border-subtle">
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
                {t.status === 'Completed' ? (
                  <Button size="sm" variant="outline" disabled>
                    Completed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleComplete(t.id, t.seniorName)}
                  >
                    Complete task
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

