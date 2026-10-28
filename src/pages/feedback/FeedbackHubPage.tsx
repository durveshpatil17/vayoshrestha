import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, Plus, ThumbsUp, Filter } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const FeedbackHubPage: React.FC = () => {
  const data = mockStore.getData();
  const feedbackList = data.feedbackRecords || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Elder feedback & satisfaction"
        subtitle="Participant survey responses collected across WhatsApp prompts, in-person circles, and IVR calls"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/feedback/forms">
              <Button variant="outline">Feedback forms</Button>
            </Link>
            <Link to="/feedback/new">
              <Button variant="primary" icon={<Plus size={16} />}>
                Record feedback
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Average satisfaction score</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums flex items-center justify-center gap-1">
            <Star size={20} fill="currentColor" /> 4.8 / 5.0
          </span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Based on 182 verified surveys</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Net promoter score (NPS)</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">+74</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Exceptional elder recommendation</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Actionable follow-ups created</span>
          <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">6</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Converted to coordinator tasks</span>
        </div>
      </div>

      <Card title="Recent feedback submissions">
        <div className="divide-y divide-[var(--border-subtle)]">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="py-4 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[var(--text)]">{fb.seniorName || 'Anonymous Member'}</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-2">({fb.channel})</span>
                </div>
                <span className="text-xs font-semibold text-[var(--positive)] flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {fb.rating} / 5
                </span>
              </div>
              {fb.programmeName && (
                <div className="text-xs text-[var(--text-secondary)]">Programme: <strong>{fb.programmeName}</strong></div>
              )}
              <p className="text-xs text-[var(--text)] pt-1 italic">"{fb.feedbackText}"</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

