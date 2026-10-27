import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Building2, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ProgrammeSession } from '@/api/contracts';

export const SeniorProgrammesPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [selectedSession, setSelectedSession] = useState<ProgrammeSession | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Available sessions at senior's centre or accessible centres
  const upcomingSessions = data.sessions.filter(
    (s) => s.status === 'Scheduled' && !s.attendanceRecorded
  ).slice(0, 10);

  const handleConfirmBooking = () => {
    if (!selectedSession) return;

    mockStore.updateData((draft) => {
      draft.sessionRegistrations.push({
        id: `reg-senior-${Date.now()}`,
        sessionId: selectedSession.id,
        memberId: user?.id || 'm-1',
        memberName: user?.fullName || 'Senior Member',
        status: 'Confirmed',
        isWalkIn: false,
        registeredAt: new Date().toISOString(),
      });
      const target = draft.sessions.find((s) => s.id === selectedSession.id);
      if (target) {
        target.confirmedCount += 1;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Senior',
      'SC',
      'CREATE',
      'SessionRegistration',
      selectedSession.id,
      `Senior citizen self-booked session: ${selectedSession.programmeTitle}`,
      null,
      { session: selectedSession.programmeTitle },
      selectedSession.centreId
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSession(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-base">
      <PageHeader
        title="Community Activities & Programmes"
        description="Browse upcoming sessions, wellness circles, and health camps at your Ekta Hub."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Programmes' },
        ]}
      />

      <div className="space-y-4">
        {upcomingSessions.map((session) => {
          const isFull = session.confirmedCount >= session.capacity;

          return (
            <div
              key={session.id}
              className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-3 hover:border-accent transition-all shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-hairline pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    {session.programmeTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span>{session.centreName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isFull ? (
                    <StatusChip label="Waitlist Available" variant="warning" />
                  ) : (
                    <StatusChip label="Seats Open" variant="active" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-text-muted bg-bg-subtle p-3 rounded">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{session.startTime} – {session.endTime}</span>
                </div>
                <div>
                  Capacity: {session.confirmedCount} / {session.capacity} elders
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setSelectedSession(session)}
                  className="text-base px-6 h-11"
                >
                  Book Seat Now
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-lg border-2 border-border-hairline max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-text-primary">Confirm Activity Booking</h3>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>Your seat is reserved! A reminder will be sent to your WhatsApp.</span>
              </div>
            ) : (
              <>
                <div className="p-4 bg-bg-subtle rounded border border-border-hairline space-y-2 text-sm">
                  <div><strong>Activity:</strong> {selectedSession.programmeTitle}</div>
                  <div><strong>Date:</strong> {selectedSession.date} ({selectedSession.startTime} – {selectedSession.endTime})</div>
                  <div><strong>Venue:</strong> {selectedSession.centreName}</div>
                </div>

                <p className="text-xs text-text-muted">
                  Please carry your membership card. If you cannot attend, you can cancel anytime from "My Bookings".
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedSession(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleConfirmBooking}>
                    Confirm Reservation
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
