import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { HeartHandshake, Calendar, Building2, Clock, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';

export const FamilySeniorProxyPage: React.FC = () => {
  const { seniorId } = useParams<{ seniorId: string }>();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const senior = data.seniorCitizens.find((s) => s.id === seniorId) || data.seniorCitizens[0];

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Available sessions to book on behalf
  const upcomingSessions = data.sessions.filter(
    (s) => s.centreId === senior.centreId && !s.attendanceRecorded
  ).slice(0, 3);

  const handleBookOnBehalf = (sessionTitle: string) => {
    mockStore.writeAudit(
      user?.id || 'fm-1',
      user?.fullName || 'Family Member',
      'FM',
      'CREATE',
      'SessionRegistration',
      senior.id,
      `Family proxy booked session "${sessionTitle}" on behalf of ${senior.fullName}`,
      null,
      { session: sessionTitle },
      senior.centreId
    );

    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Mandatory Proxy Banner */}
      <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded text-xs text-amber-950 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-amber-800" />
          <span>
            <strong>Viewing on Behalf of Senior Citizen:</strong> {senior.fullName} ({senior.membershipId}).
            All bookings and feedback will be attributed to your family proxy account.
          </span>
        </div>
        <Link to="/family">
          <Button variant="outline" size="sm" className="text-xs bg-white">
            Switch Elder
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`${senior.fullName}’s Care & Engagement`}
        description={`Ekta Hub: Ekta Hub Shivajinagar • Relationship: Son/Daughter`}
        breadcrumb={[
          { label: 'Family Portal', href: '/family' },
          { label: senior.fullName },
        ]}
      />

      {bookingSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Session seat reserved on behalf of {senior.fullName}! A reminder has been queued.</span>
        </div>
      )}

      {/* Upcoming Activities for Elder */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <h3 className="font-serif text-base font-semibold text-text-primary">
            Upcoming Available Sessions at {senior.fullName}’s Hub
          </h3>
          <span className="text-xs text-text-muted">Direct Proxy Booking</span>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 bg-bg-subtle rounded border border-border-hairline flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="font-semibold text-text-primary text-sm">{sess.programmeTitle}</div>
                <div className="text-text-muted flex items-center gap-3">
                  <span>Date: <strong>{sess.date}</strong></span>
                  <span>Time: <strong>{sess.startTime} – {sess.endTime}</strong></span>
                  <span>Venue: {sess.centreName}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBookOnBehalf(sess.programmeTitle)}
                className="text-xs"
              >
                Book on Behalf of Elder
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
