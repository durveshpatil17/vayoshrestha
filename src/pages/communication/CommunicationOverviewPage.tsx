import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { MessageSquare, Send, CheckCircle2, AlertOctagon, Smartphone, Users, FileText, ArrowRight } from 'lucide-react';

export const CommunicationOverviewPage: React.FC = () => {
  const data = mockStore.getData();
  const messages = data.outboundMessages;

  const totalSent = messages.length;
  const deliveredCount = messages.filter((m) => m.status === 'Delivered' || m.status === 'Read').length;
  const failedCount = messages.filter((m) => m.status === 'Failed').length;
  const pendingCount = messages.filter((m) => m.status === 'Queued' || m.status === 'Sent').length;
  const deliveryRate = totalSent > 0 ? Math.round((deliveredCount / totalSent) * 100) : 0;

  // Monthly volume cap
  const volumeCap = 10000;
  const capPercentage = Math.round((totalSent / volumeCap) * 100);

  // Opt-out count
  const optedOutCount = data.seniorCitizens.filter((s) => s.optedOutChannels.includes('WhatsApp')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="WhatsApp Communication Hub"
        description="Governed WhatsApp notification channels, delivery tracking, and consent-gated messaging (FR-23 – FR-29)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Communication' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/communication/simulator">
              <Button variant="outline" size="sm">
                <Smartphone className="w-4 h-4 mr-1.5 text-accent" />
                Open WhatsApp Simulator
              </Button>
            </Link>
            <Link to="/communication/announcements/new">
              <Button variant="primary" size="sm">
                <Send className="w-4 h-4 mr-1.5" />
                Compose Announcement
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Monthly Message Cap</span>
            <span className="font-mono">{totalSent} / {volumeCap}</span>
          </div>
          <div className="text-xl font-serif font-bold text-text-primary mt-1">{capPercentage}% Utilized</div>
          <div className="w-full bg-bg-subtle h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${capPercentage > 85 ? 'bg-danger' : 'bg-accent'}`}
              style={{ width: `${Math.min(capPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Delivery Success Rate</div>
          <div className="text-xl font-serif font-bold text-emerald-700 mt-1">{deliveryRate}%</div>
          <div className="text-xs text-text-muted mt-1">{deliveredCount} delivered successfully</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Failed Delivery Alerts</div>
          <div className="text-xl font-serif font-bold text-rose-700 mt-1">{failedCount}</div>
          <div className="text-xs text-text-muted mt-1">Requires coordinator follow-up</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Active Opt-Outs (FR-29)</div>
          <div className="text-xl font-serif font-bold text-amber-700 mt-1">{optedOutCount}</div>
          <div className="text-xs text-text-muted mt-1">WhatsApp STOP recorded</div>
        </div>
      </div>

      {/* Quick Navigation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded bg-bg-subtle flex items-center justify-center text-accent">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-text-primary">Approved Message Templates</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Maintain multilingual pre-approved WhatsApp templates (Reminders, Bookings, Content) with strict variable safety.
            </p>
          </div>
          <Link to="/communication/templates" className="mt-4 inline-flex items-center text-xs font-semibold text-accent hover:underline">
            Manage Templates ({data.templates.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded bg-bg-subtle flex items-center justify-center text-accent">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-text-primary">Announcements & Broadcasts</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Governed audience targeting for centre activities and health awareness with consent filtering and NM approval.
            </p>
          </div>
          <Link to="/communication/announcements" className="mt-4 inline-flex items-center text-xs font-semibold text-accent hover:underline">
            View Announcements ({data.announcements.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded bg-bg-subtle flex items-center justify-center text-accent">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-text-primary">Consent & Opt-Out Registry</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Strict audit trail of senior citizen communication consent, opt-in statuses, and channel withdrawal history.
            </p>
          </div>
          <Link to="/communication/consents" className="mt-4 inline-flex items-center text-xs font-semibold text-accent hover:underline">
            Review Consents <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* Recent Dispatches & Delivery Health */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <h3 className="font-serif text-base font-semibold text-text-primary">Recent Outbound Dispatch Queue</h3>
          <Link to="/communication/delivery" className="text-xs font-medium text-accent hover:underline">
            View Complete Message Log ({messages.length}) →
          </Link>
        </div>

        <div className="divide-y divide-border-hairline">
          {messages.slice(0, 5).map((msg) => (
            <div key={msg.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-medium text-text-primary">{msg.recipientName}</div>
                <div className="text-text-muted font-mono">{msg.templateCode} • {msg.scheduledFor.split('T')[0]}</div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={msg.status}
                  variant={msg.status === 'Delivered' || msg.status === 'Read' ? 'active' : msg.status === 'Failed' ? 'danger' : 'warning'}
                />
                {msg.failureReason && (
                  <span className="text-xs text-rose-700 font-medium">({msg.failureReason})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
