import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Moon,
  Sun,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_DRIP_CAMPAIGNS,
  DripCampaign,
  isQuietHours,
} from '@/domain/learning/learningEngine';

export const DripCampaignsPage: React.FC = () => {
  const [campaigns] = useState<DripCampaign[]>(() => [...SEED_DRIP_CAMPAIGNS]);
  const currentHour = new Date().getHours();
  const inQuietHours = isQuietHours(currentHour);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Micro-Lesson Drip Campaigns"
        subtitle="Automated sequential daily lesson series delivered via WhatsApp broadcast channels."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Drip Campaigns' },
        ]}
      />

      {/* Quiet Hours Policy Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          inQuietHours
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-brand-primary/20 text-brand-primary'
        }`}
      >
        <div className="flex items-center gap-3">
          {inQuietHours ? <Moon className="w-5 h-5 text-amber-700" /> : <Sun className="w-5 h-5 text-brand-primary" />}
          <div>
            <div className="font-semibold">
              {inQuietHours
                ? 'Quiet Hours Active (21:00 to 08:00) — Automated Message Dispatch Blocked'
                : 'Daytime Broadcast Window Active (08:00 to 21:00)'}
            </div>
            <div className="text-text-secondary mt-0.5">
              Strict ethical policy: Messages to senior citizens are delayed until 08:00 to protect undisturbed rest.
            </div>
          </div>
        </div>

        <div className="font-semibold px-2.5 py-1 bg-bg-surface border border-border rounded text-text-primary">
          Current Hour: {currentHour}:00
        </div>
      </div>

      {/* Consent Gating Summary */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          <span>
            Consent Filtering: Only enrolled seniors with explicit opt-in (<code className="text-brand-primary">consent_digital_literacy: true</code>) receive broadcast lessons.
          </span>
        </div>
        <span className="font-semibold text-text-primary">1,005 Seniors Opted In</span>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 bg-bg-surface border border-border rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-brand-primary rounded font-semibold capitalize">
                {camp.frequency} series
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            </div>

            <div>
              <h3 className="text-base font-serif font-semibold text-text-primary">
                {camp.name}
              </h3>
              <div className="text-xs text-text-secondary mt-1">
                Target Chapter: <strong className="text-text-primary capitalize">{camp.targetChapter}</strong> · {camp.lessonIds.length} sequential lessons
              </div>
            </div>

            <div className="p-3 bg-bg-canvas border border-border rounded-lg grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-text-secondary">Enrolled Seniors:</div>
                <div className="font-semibold text-text-primary mt-0.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-primary" />
                  {camp.enrolledSeniorsCount} elders
                </div>
              </div>

              <div>
                <div className="text-text-secondary">Daily Dispatch Hour:</div>
                <div className="font-semibold text-text-primary mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  {camp.nextSendHour}:00 AM (Safe window)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
