import React from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const EngagementIndexPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Elder engagement index & retention"
        subtitle="Predictive dropout risk scoring based on longitudinal attendance and check-in responsiveness"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">High engagement cohort</span>
          <span className="text-2xl font-semibold text-positive tabular-nums">78%</span>
          <span className="text-xs text-text-secondary block mt-1">Attending &gt;2 sessions/week</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Moderate engagement</span>
          <span className="text-2xl font-semibold text-text tabular-nums">16%</span>
          <span className="text-xs text-text-secondary block mt-1">Attending 1 session/fortnight</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">At-risk of dropout</span>
          <span className="text-2xl font-semibold text-negative tabular-nums">6% (24 elders)</span>
          <span className="text-xs text-text-secondary block mt-1">Inactive for &gt;14 days</span>
        </div>
      </div>

      <Card title="Elders requiring proactive wellness outreach (At-risk)">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {[
            { id: 'SEN-003', name: 'Shantaram Deshpande (81y)', chapter: 'Nashik Hub', daysInactive: 18, reason: 'Missed 3 consecutive Swasthya Seva classes' },
            { id: 'SEN-009', name: 'Govind Rao (76y)', chapter: 'Pune Hub', daysInactive: 21, reason: 'No response to WhatsApp reminders or voice calls' },
            { id: 'SEN-014', name: 'Meenakshi Sundaram (74y)', chapter: 'Bengaluru Hub', daysInactive: 15, reason: 'Reported mild fever on 12 Oct, no follow-up since' },
          ].map((elder) => (
            <div key={elder.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-text">{elder.name}</span>
                <div className="text-text-secondary mt-0.5">
                  {elder.chapter} • Inactive for <strong className="text-negative">{elder.daysInactive} days</strong>
                </div>
                <p className="text-text-secondary mt-1">Risk trigger: {elder.reason}</p>
              </div>
              <Link to="/follow-ups">
                <Button size="sm" variant="outline">Assign volunteer</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

