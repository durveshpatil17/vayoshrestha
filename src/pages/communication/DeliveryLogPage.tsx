import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DeliveryLogPage: React.FC = () => {
  const messages = [
    {
      id: 'MSG-001',
      recipient: 'Kamala Devi (+91 98220 12345)',
      chapter: 'Pune Hub',
      template: 'Swasthya Seva Session Reminder',
      channel: 'WhatsApp',
      timeline: 'Queued (10:00:01) → Sent (10:00:03) → Delivered (10:00:05) → Read (10:02:14)',
      status: 'Read',
    },
    {
      id: 'MSG-002',
      recipient: 'Ramesh Kulkarni (+91 98220 23456)',
      chapter: 'Pune Hub',
      template: 'Morning Medication Confirmation',
      channel: 'WhatsApp',
      timeline: 'Queued (08:30:00) → Sent (08:30:02) → Delivered (08:30:04)',
      status: 'Delivered',
    },
    {
      id: 'MSG-003',
      recipient: 'Shantaram Deshpande (+91 98220 34567)',
      chapter: 'Nashik Hub',
      template: 'Session Absence Followup',
      channel: 'SMS (Fallback)',
      timeline: 'WhatsApp Failed (Undelivered) → SMS Fallback Dispatched (09:15:30) → Delivered',
      status: 'Delivered_SMS',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/communication" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Communication
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Delivery monitor</span>
      </div>

      <PageHeader
        title="Delivery monitor & message lifecycle"
        subtitle="End-to-end status tracking from outbound queue to read receipt with automatic SMS fallback"
      />

      <Card title="Live delivery feed">
        <div className="divide-y divide-[var(--border-subtle)]">
          {messages.map((m) => (
            <div key={m.id} className="py-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[var(--text)]">{m.recipient}</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-2">({m.chapter})</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    m.status === 'Read'
                      ? 'bg-[var(--positive-tint)] text-[var(--positive)]'
                      : m.status === 'Delivered_SMS'
                      ? 'bg-[var(--surface-selected)] text-[var(--accent)]'
                      : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Template: <strong>{m.template}</strong></div>
              <div className="text-xs tabular-nums text-[var(--text-tertiary)] bg-[var(--surface-subtle)] p-2 rounded mt-1">
                {m.timeline}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
