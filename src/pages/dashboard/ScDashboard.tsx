import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  HelpCircle,
  MessageSquare,
  HeartHandshake,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

export const ScDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const nextSession = data.sessions.find((s) => s.centreId === 'HUB-PUN' && !s.attendanceRecorded) || data.sessions[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Namaste, ${user?.fullName || 'Senior Member'}`}
        description="Welcome to your Ekta Hub community space. View your upcoming activities, messages, and request assistance."
        primaryAction={
          <Button
            variant="danger"
            size="lg"
            icon={<HelpCircle className="w-5 h-5" />}
            onClick={() => navigate('/me/help')}
            className="text-base px-6 h-12"
          >
            Ask for Assistance
          </Button>
        }
      />

      {/* Prominent Next Activity Banner */}
      {nextSession && (
        <div className="p-6 bg-accent-tint/40 border border-accent/30 rounded shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Your Next Ekta Hub Activity
            </span>
            <StatusChip label="Seat Confirmed" variant="active" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
            {nextSession.programmeTitle}
          </h2>

          <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{nextSession.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              <span>{nextSession.startTime} to {nextSession.endTime} IST</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{nextSession.centreName}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/me/bookings')}
            >
              View Booking Details
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/me/programmes')}
            >
              Browse More Programmes
            </Button>
          </div>
        </div>
      )}

      {/* 3 Large Touch Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/me/programmes')}
          className="p-6 bg-bg-base border border-border-hairline rounded hover:border-accent hover:bg-bg-subtle cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded bg-accent-tint text-accent flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
            Community Programmes
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Browse yoga, smartphone literacy, health camps, and music circles at your Ekta Hub.
          </p>
          <span className="text-sm font-semibold text-accent inline-flex items-center gap-1">
            Browse & Book <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div
          onClick={() => navigate('/me/messages')}
          className="p-6 bg-bg-base border border-border-hairline rounded hover:border-accent hover:bg-bg-subtle cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded bg-accent-tint text-accent flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
            Messages & Reminders
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Read announcements, session reminders, and manage your WhatsApp message settings.
          </p>
          <span className="text-sm font-semibold text-accent inline-flex items-center gap-1">
            Open Inbox <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div
          onClick={() => navigate('/me/services')}
          className="p-6 bg-bg-base border border-border-hairline rounded hover:border-accent hover:bg-bg-subtle cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded bg-accent-tint text-accent flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
            Support & Referrals
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Connect with free eye clinics, physiotherapists, and legal pension assistance.
          </p>
          <span className="text-sm font-semibold text-accent inline-flex items-center gap-1">
            Browse Services <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
