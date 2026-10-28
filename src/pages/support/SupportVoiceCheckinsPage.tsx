import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, Mic, Clock, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SupportVoiceCheckinsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/support/requests" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Health support
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Voice check-ins</span>
      </div>

      <PageHeader
        title="Automated voice check-ins (IVR Pilot)"
        subtitle="Feature-flagged voice recognition flow for illiterate or non-smartphone elders"
      />

      <div className="p-4 rounded-lg bg-[var(--surface-selected)] border border-[var(--border)] text-sm text-[var(--text)]">
        <strong>Feature Flag:</strong> `FEATURE_VOICE_CHECKINS` enabled. Interactive Voice Response (IVR) places scheduled 45-second morning calls in local dialect asking elders to press 1 for "I am well" or press 2 for "Please call me".
      </div>

      <Card title="Today's automated voice check-in queue">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {[
            { name: 'Kamala Devi', time: '08:30 AM', status: 'Completed (Pressed 1 — Well)', duration: '38s' },
            { name: 'Ramesh Kulkarni', time: '08:45 AM', status: 'Completed (Pressed 1 — Well)', duration: '42s' },
            { name: 'Shantaram Deshpande', time: '09:00 AM', status: 'Unanswered (Queued for volunteer call)', duration: '—' },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-[var(--text)]">{item.name}</span>
                <div className="text-[var(--text-secondary)] mt-0.5">{item.time} • Call duration: {item.duration}</div>
              </div>
              <span className="font-semibold text-[var(--text)]">{item.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
