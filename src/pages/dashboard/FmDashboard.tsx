import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckSquare,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const FmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const linkedSenior = data.seniorCitizens.find((s) => s.id === 'm-1') || data.seniorCitizens[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Family Care Portal · ${user?.fullName || 'Family Caregiver'}`}
        description="Support your registered elderly relatives, manage their session bookings, and coordinate care assistance."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Family Portal' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/family/links')}
          >
            Manage Authorizations
          </Button>
        }
      />

      {/* Linked Senior Active Context Card */}
      <div className="p-6 bg-bg-base border border-border-strong rounded shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center font-serif text-lg font-bold">
              {linkedSenior.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold text-text-primary">
                  {linkedSenior.fullName}
                </h2>
                <StatusChip label="Proxy Consent Recorded" variant="active" />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Membership ID: <span className="font-mono">{linkedSenior.membershipId}</span> · Centre: Ekta Hub Shivajinagar
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/family/${linkedSenior.id}`)}
            >
              View Senior Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/me/programmes')}
            >
              Book on Behalf
            </Button>
          </div>
        </div>

        {/* Quick Summary of Upcoming Bookings for Elder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 bg-bg-subtle rounded border border-border-hairline">
            <span className="text-text-muted block mb-1">Upcoming Activity</span>
            <div className="font-semibold text-text-primary">Gentle Morning Yoga</div>
            <span className="text-[11px] text-accent">Tomorrow, 10:00 AM IST</span>
          </div>

          <div className="p-3 bg-bg-subtle rounded border border-border-hairline">
            <span className="text-text-muted block mb-1">Attendance Record</span>
            <div className="font-semibold text-text-primary">8 Sessions Attended</div>
            <span className="text-[11px] text-success">Regular participant (Active)</span>
          </div>

          <div className="p-3 bg-bg-subtle rounded border border-border-hairline">
            <span className="text-text-muted block mb-1">Care & Welfare Status</span>
            <div className="font-semibold text-text-primary">All Well · No Open Issues</div>
            <span className="text-[11px] text-text-muted">Last verified on 25 Oct</span>
          </div>
        </div>
      </div>
    </div>
  );
};
