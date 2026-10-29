import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Heart,
  User,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  Plus,
} from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ScProgrammesPage: React.FC = () => {
  const data = mockStore.getData();
  const programmes = data.programmes || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">My Programmes</span>
      </div>

      <PageHeader
        title="Community programmes & activities"
        subtitle="Activities available at your Pune Ekta Hub"
      />

      <div className="space-y-4">
        {programmes.map((p) => (
          <Card key={p.id} title={p.name}>
            <p className="text-sm text-text-secondary mb-3">{p.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-accent">{p.category}</span>
              <Button size="sm" variant="primary">Book this session</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ScBookingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Bookings</span>
      </div>

      <PageHeader
        title="My booked sessions"
        subtitle="Upcoming sessions you are registered to attend"
      />

      <Card title="Upcoming attendance">
        <div className="divide-y divide-[var(--border-subtle)] text-sm">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-text">Gentle Yoga & Joint Mobility</div>
              <div className="text-xs text-text-secondary mt-0.5">Tomorrow, 10:00 AM • Main Hall</div>
            </div>
            <span className="text-xs font-semibold text-positive bg-positive-tint px-2 py-0.5 rounded">Confirmed</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ScMessagesPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Messages</span>
      </div>

      <PageHeader
        title="Messages from your Ekta Hub"
        subtitle="Announcements and health reminders sent to your WhatsApp"
      />

      <Card title="Recent notifications">
        <div className="space-y-3 text-sm">
          <div className="p-3.5 rounded bg-surface-subtle border border-border">
            <div className="font-semibold text-text">Session Reminder</div>
            <p className="text-xs text-text-secondary mt-1">
              Namaste Kamala Ji, reminder for your Gentle Yoga session tomorrow at 10:00 AM.
            </p>
            <span className="text-xs text-text-secondary block mt-2">Yesterday, 5:30 PM</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ScServicesPage: React.FC = () => {
  const data = mockStore.getData();
  const services = data.services || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Services</span>
      </div>

      <PageHeader
        title="Healthcare & support services"
        subtitle="Specialist health consultations available through vetted partners"
      />

      <div className="space-y-4">
        {services.map((s) => (
          <Card key={s.id} title={s.name}>
            <p className="text-sm text-text-secondary mb-3">{s.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Partner: <strong>{s.partnerName}</strong></span>
              <Button size="sm" variant="primary">Request consultation</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ScProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Profile</span>
      </div>

      <PageHeader
        title="My profile & contacts"
        subtitle="Your registered personal information and emergency next-of-kin contacts"
      />

      <Card title="Personal details">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-text-secondary block">Full Name</span>
            <span className="font-semibold text-text">Kamala Devi</span>
          </div>
          <div>
            <span className="text-xs text-text-secondary block">Age & Gender</span>
            <span className="font-semibold text-text">72 years, Female</span>
          </div>
          <div>
            <span className="text-xs text-text-secondary block">Registered Phone</span>
            <span className="font-semibold text-text">+91 98220 12345</span>
          </div>
          <div>
            <span className="text-xs text-text-secondary block">Assigned Chapter</span>
            <span className="font-semibold text-text">Pune Ekta Hub (HUB-PUN)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ScHealthPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Health</span>
      </div>

      <PageHeader
        title="My health records"
        subtitle="Recent vital readings and daily medication schedule"
      />

      <Card title="Latest blood pressure readings">
        <div className="space-y-2 text-sm">
          <div className="p-3 rounded bg-surface-subtle flex items-center justify-between">
            <span>27 Oct 2026, Morning</span>
            <strong className="text-positive">128 / 82 mmHg (Normal)</strong>
          </div>
          <div className="p-3 rounded bg-surface-subtle flex items-center justify-between">
            <span>20 Oct 2026, Morning</span>
            <strong className="text-text">134 / 86 mmHg (Normal)</strong>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ScFeedbackPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Feedback</span>
      </div>

      <PageHeader
        title="Share your feedback"
        subtitle="Help us improve your Ekta Hub experience"
      />

      <Card title="Submit feedback">
        <div className="space-y-4">
          <textarea
            rows={4}
            placeholder="Tell us what you liked or what we can improve..."
            className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none"
          />
          <Button variant="primary">Send to coordinator</Button>
        </div>
      </Card>
    </div>
  );
};

export const ScHelpPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Help</span>
      </div>

      <PageHeader
        title="Help & emergency contacts"
        subtitle="We are here to support you at any time"
      />

      <div className="space-y-4">
        <Card title="Emergency helplines">
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded bg-surface-subtle flex items-center justify-between">
              <div>
                <strong className="block text-text">National Emergency Ambulance</strong>
                <span className="text-xs text-text-secondary">24/7 Government Helpline</span>
              </div>
              <a href="tel:112">
                <Button size="sm" variant="destructive">Call 112</Button>
              </a>
            </div>
            <div className="p-3 rounded bg-surface-subtle flex items-center justify-between">
              <div>
                <strong className="block text-text">Elderline Senior Helpline</strong>
                <span className="text-xs text-text-secondary">Ministry of Social Justice</span>
              </div>
              <a href="tel:14567">
                <Button size="sm" variant="primary">Call 14567</Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const ScFamilyPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/me" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={16} /> My Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Family</span>
      </div>

      <PageHeader
        title="Family access & proxy sharing"
        subtitle="Manage which family members can view your wellbeing updates"
      />

      <Card title="Permitted family members">
        <div className="p-3.5 rounded bg-surface-subtle flex items-center justify-between text-sm">
          <div>
            <strong className="text-text">Sunita Desai (Daughter)</strong>
            <div className="text-xs text-text-secondary">+91 98450 11223 • Family portal access granted</div>
          </div>
          <span className="text-xs font-semibold text-positive">Active</span>
        </div>
      </Card>
    </div>
  );
};

