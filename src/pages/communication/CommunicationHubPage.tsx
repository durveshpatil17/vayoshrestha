import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, CheckCheck, ShieldCheck, Clock, FileText, Bell, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const CommunicationHubPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication hub"
        subtitle="WhatsApp Interactive messages, daily volume controls, multi-language templates, and broadcast announcements"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/communication/announcements/new">
              <Button variant="primary" icon={<Send size={16} />}>
                New broadcast announcement
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Messages sent today</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">482</span>
          <span className="text-xs text-[var(--positive)] font-semibold block mt-1">Cap: 5 msgs/senior/day</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Delivery success rate</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">98.6%</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">WhatsApp Cloud API</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Active broadcast templates</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">16</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">5 languages approved</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Consent opt-in rate</span>
          <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">99.1%</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Digital DPDP-ready consent</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Communication channels and tools">
            <div className="divide-y divide-[var(--border-subtle)]">
              {[
                {
                  to: '/communication/templates',
                  icon: <FileText size={20} className="text-[var(--accent)]" />,
                  title: 'Template manager',
                  desc: 'Pre-approved WhatsApp Interactive message templates across Hindi, Marathi, Kannada, Tamil, and English.',
                },
                {
                  to: '/communication/announcements',
                  icon: <Bell size={20} className="text-[var(--accent)]" />,
                  title: 'Broadcast announcements',
                  desc: 'Targeted chapter bulletins for festival timings, weather alerts, and doctor visit schedules.',
                },
                {
                  to: '/communication/delivery',
                  icon: <CheckCheck size={20} className="text-[var(--accent)]" />,
                  title: 'Delivery monitor & queue log',
                  desc: 'Live message queue status, failed recipient retries, and SMS fallback audit.',
                },
                {
                  to: '/communication/consents',
                  icon: <ShieldCheck size={20} className="text-[var(--accent)]" />,
                  title: 'Consent & opt-out registry',
                  desc: 'Manage elder communication preferences, language choices, and quiet-hours adherence.',
                },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="py-4 flex items-center justify-between hover:bg-[var(--surface-hover)] px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded bg-[var(--surface-subtle)] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text)] font-sans">{item.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Open</Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Quiet hours policy">
            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              <p>
                <strong>Active Window:</strong> 07:00 AM – 09:00 PM IST
              </p>
              <p>
                Non-critical announcements and reminders are automatically queued outside this window to respect senior sleep routines.
              </p>
              <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text)]">
                <strong>Exception:</strong> Emergency SOS alerts bypass quiet hours automatically.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
