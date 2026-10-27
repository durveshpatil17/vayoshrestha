import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { ComplaintTicket } from '@/api/contracts';

export const ComplaintNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [category, setCategory] = useState<ComplaintTicket['category']>('Facility');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTicket: ComplaintTicket = {
      id: `comp-${Date.now()}`,
      category,
      complainantName: user?.fullName || 'Senior Citizen',
      complainantRole: user?.role || 'SC',
      complainantContact: user?.phone || user?.email || 'Registered Contact',
      centreId: user?.assignedCentres?.[0] || 'HUB-PUN',
      subject,
      description,
      urgency,
      status: 'New',
      createdAt: new Date().toISOString(),
      replies: [],
    };

    mockStore.updateData((draft) => {
      draft.complaints.unshift(newTicket);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Complainant',
      user?.role || 'SC',
      'CREATE',
      'ComplaintTicket',
      newTicket.id,
      `Lodge grievance: ${subject}`,
      null,
      newTicket,
      newTicket.centreId
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/help');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Lodge Grievance or Support Ticket"
        description="Submit concerns regarding hub facilities, staff conduct, scheduling, or communication (FR-53)"
        breadcrumb={[
          { label: 'Help', href: '/help' },
          { label: 'New Grievance' },
        ]}
        actions={
          <Link to="/help">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Help
            </Button>
          </Link>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Grievance Ticket Lodged!</h3>
          <p className="text-xs text-emerald-800">
            A coordinator will review your ticket and post a formal response. Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-text-primary block mb-1">Grievance Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            >
              <option value="Facility">Facility & Seating / Restroom</option>
              <option value="Staff Conduct">Volunteer or Staff Conduct</option>
              <option value="Scheduling">Programme Session Scheduling</option>
              <option value="Communication">WhatsApp Messages & Notifications</option>
              <option value="Other">Other Community Feedback</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-text-primary block mb-1">Subject Headline</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Ramp handrail loose at entrance"
              className="w-full p-2.5 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="font-semibold text-text-primary block mb-1">Detailed Description of Concern</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe what happened, the date/session, and how we can resolve it..."
              className="w-full p-2.5 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
            />
          </div>

          <div>
            <label className="font-semibold text-text-primary block mb-1">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full p-2.5 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            >
              <option value="Low">Low (General Feedback)</option>
              <option value="Medium">Medium (Attention within 48 Hours)</option>
              <option value="High">High (Immediate Safety Concern)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-hairline">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/help')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!subject || !description}>
              Submit Grievance
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
