import React, { useState } from 'react';
import {
  Calendar,
  Video,
  Users,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_WEBINARS,
  CommunityWebinar,
} from '@/domain/learning/learningEngine';

export const WebinarsPage: React.FC = () => {
  const [webinars, setWebinars] = useState<CommunityWebinar[]>(() => [...SEED_WEBINARS]);
  const [activeTab, setActiveTab] = useState<'webinars' | 'channels'>('webinars');

  const handleToggleRsvp = (id: string) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextState = !w.isRegistered;
          return {
            ...w,
            isRegistered: nextState,
            rsvpCount: nextState ? w.rsvpCount + 1 : w.rsvpCount - 1,
          };
        }
        return w;
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Webinars & Broadcast Channels"
        subtitle="Regional elder knowledge circles, doctor Q&A sessions, and official announcement channels."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Webinars & Channels' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('webinars')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'webinars'
              ? 'border-brand-primary text-brand-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Upcoming Webinars & Workshops
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'channels'
              ? 'border-brand-primary text-brand-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          One-Way WhatsApp Broadcast Channels
        </button>
      </div>

      {activeTab === 'webinars' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webinars.map((web) => (
            <div
              key={web.id}
              className="p-5 bg-bg-surface border border-border rounded-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-brand-primary rounded font-semibold capitalize">
                    {web.category.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Users className="w-3.5 h-3.5" />
                    <span>{web.rsvpCount} Seniors Attending</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-serif font-semibold text-text-primary">
                    {web.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Featured Speaker: <strong className="text-text-primary">{web.speaker}</strong>
                  </p>
                </div>

                <div className="p-3 bg-bg-canvas border border-border rounded-lg space-y-1.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    <span className="font-semibold text-text-primary">
                      {new Date(web.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(web.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    <span>Duration: {web.durationMinutes} minutes with open Q&A</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleRsvp(web.id)}
                  className={`px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                    web.isRegistered
                      ? 'bg-emerald-50 text-brand-primary border border-brand-primary/30'
                      : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                  }`}
                >
                  {web.isRegistered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                  {web.isRegistered ? 'Seat Confirmed' : 'RSVP for Webinar'}
                </button>

                <a
                  href={web.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-secondary font-semibold hover:text-text-primary hover:underline flex items-center gap-1"
                >
                  <Video className="w-3.5 h-3.5 text-brand-primary" />
                  Meeting Link
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-brand-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-semibold text-text-primary">
                  Pune Ekta Elders Broadcast Circle
                </h3>
                <div className="text-xs text-text-secondary">Official Regional Channel · 1,420 Subscribers</div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              One-way verified WhatsApp broadcast channel distributing morning health tips, hub programme
              timings, and scam alerts. No spam, quiet hours strictly enforced.
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-brand-primary font-semibold">Active & Monitored</span>
              <span className="text-text-secondary">Broadcast ID: #CH-PUN-01</span>
            </div>
          </div>

          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-brand-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-semibold text-text-primary">
                  Mumbai Central Health & Vitals Circle
                </h3>
                <div className="text-xs text-text-secondary">Official Regional Channel · 980 Subscribers</div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Targeted updates on monsoon health precautions, diabetes management seminars, and diagnostic
              camp schedules in Dadar and Bandra Ekta Hubs.
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-brand-primary font-semibold">Active & Monitored</span>
              <span className="text-text-secondary">Broadcast ID: #CH-MUM-02</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
