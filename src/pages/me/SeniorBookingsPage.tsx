import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Building2, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const SeniorBookingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [bookings, setBookings] = useState([
    {
      id: 'b-1',
      title: 'Gentle Yoga & Breathing Circle',
      centre: 'Ekta Hub Shivajinagar',
      date: '2026-10-28',
      time: '09:00 AM – 10:30 AM',
      status: 'Confirmed',
    },
    {
      id: 'b-2',
      title: 'Digital Smartphone Banking & Cyber Safety',
      centre: 'Ekta Hub Shivajinagar',
      date: '2026-10-31',
      time: '10:30 AM – 12:00 PM',
      status: 'Confirmed',
    },
    {
      id: 'b-3',
      title: 'Senior Vision & Cataract Screening',
      centre: 'Ekta Hub Shivajinagar',
      date: '2026-10-15',
      time: '09:30 AM – 12:30 PM',
      status: 'Attended',
    },
  ]);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you wish to cancel your booking? Your seat will be offered to the waitlist.')) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );

      mockStore.writeAudit(
        user?.id || 'm-1',
        user?.fullName || 'Senior Member',
        'SC',
        'UPDATE',
        'SessionRegistration',
        bookingId,
        'Senior citizen cancelled session booking',
        null,
        { status: 'Cancelled' },
        undefined
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-base">
      <PageHeader
        title="My Activity Bookings"
        description="View your reserved community sessions and manage your calendar."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'My Bookings' },
        ]}
      />

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-bg-base border-2 border-border-hairline rounded-lg p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-bold text-text-primary">{b.title}</h3>
              <StatusChip
                label={b.status}
                variant={b.status === 'Confirmed' ? 'active' : b.status === 'Attended' ? 'neutral' : 'danger'}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-text-muted bg-bg-subtle p-3 rounded">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{b.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>{b.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                <span>{b.centre}</span>
              </div>
            </div>

            {b.status === 'Confirmed' && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelBooking(b.id)}
                  className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
