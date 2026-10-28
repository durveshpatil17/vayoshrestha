import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const FmSeniorOverviewPage: React.FC = () => {
  const { seniorId } = useParams<{ seniorId?: string }>();

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/family" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={16} /> Family portal
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Elder overview</span>
      </div>

      <PageHeader
        title="Kamala Devi — Wellbeing status"
        subtitle="Consent-gated health summary shared with family"
      />

      <Card title="Activity & check-in summary">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Recent attendance:</span>
            <span className="font-semibold text-[var(--text)]">Gentle Yoga (Attended yesterday)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Last blood pressure check:</span>
            <span className="font-semibold text-[var(--positive)]">128 / 82 mmHg (Normal)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Active SOS alerts:</span>
            <span className="font-semibold text-[var(--positive)]">None</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const FmLinksPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/family" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={16} /> Family portal
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Contacts</span>
      </div>

      <PageHeader
        title="Family emergency contacts"
        subtitle="Update next-of-kin contact information for emergency notification chains"
      />

      <Card title="Primary emergency contact">
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Contact Name</span>
            <strong className="text-[var(--text)]">Sunita Desai (Daughter)</strong>
          </div>
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Registered Phone</span>
            <strong className="text-[var(--accent)]">+91 98450 11223</strong>
          </div>
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Notification Mode</span>
            <span className="text-[var(--text)]">WhatsApp Interactive Prompt + Emergency SMS</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
