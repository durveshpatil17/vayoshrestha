import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, Star, Plus, ThumbsUp, Filter, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NavTabBar } from '@/ui/NavTabBar';
import { FeedbackFormsPage } from './FeedbackFormsPage';
import { FollowUpsPage } from './FollowUpsPage';
import { EngagementIndexPage } from './EngagementIndexPage';

export const FeedbackHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'hub';
  const data = mockStore.getData();
  const feedbackList = data.feedbackRecords || [];

  const tabs = [
    {
      key: 'hub',
      label: 'Feedback responses',
      icon: <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'forms',
      label: 'Survey forms',
      icon: <FileText className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'follow-ups',
      label: 'Follow-ups queue',
      icon: <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'engagement',
      label: 'Engagement index',
      icon: <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Elder Feedback & Engagement Hub"
        description="Participant survey responses collected across WhatsApp prompts, in-person circles, and IVR calls"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/feedback/new">
              <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Record feedback</span>
              </Button>
            </Link>
          </div>
        }
      />

      <NavTabBar tabs={tabs} defaultTab="hub" />

      {currentTab === 'hub' && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Average satisfaction score</span>
              <span className="text-2xl font-semibold text-positive tabular-nums flex items-center justify-center gap-1 mt-1">
                <Star className="w-5 h-5 fill-current" /> 4.8 / 5.0
              </span>
              <span className="text-xs text-text-secondary block mt-1">Based on 182 verified surveys</span>
            </div>
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Net promoter score (NPS)</span>
              <span className="text-2xl font-semibold text-positive tabular-nums mt-1 block">+74</span>
              <span className="text-xs text-text-secondary block mt-1">Exceptional elder recommendation</span>
            </div>
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Actionable follow-ups created</span>
              <span className="text-2xl font-semibold text-accent tabular-nums mt-1 block">6</span>
              <span className="text-xs text-text-secondary block mt-1">Converted to coordinator tasks</span>
            </div>
          </div>

          <Card title="Recent feedback submissions">
            <div className="divide-y divide-border-subtle">
              {feedbackList.length > 0 ? (
                feedbackList.map((fb) => (
                  <div key={fb.id} className="py-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text">{fb.seniorName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-text-secondary">
                          {fb.channel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-accent">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{fb.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{fb.feedbackText}</p>
                    <div className="text-xs text-text-secondary pt-1">
                      Programme: {fb.programmeName || fb.programmeId || 'General'} · Chapter: {fb.chapterId} · {fb.submittedAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-text-secondary">
                  No feedback records recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {currentTab === 'forms' && <FeedbackFormsPage />}
      {currentTab === 'follow-ups' && <FollowUpsPage />}
      {currentTab === 'engagement' && <EngagementIndexPage />}
    </div>
  );
};
