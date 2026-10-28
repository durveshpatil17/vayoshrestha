import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  UserPlus,
  PhoneCall,
  HeartPulse,
  Users,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const VfDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const chapterId = user?.chapterId || user?.assignedCentres?.[0] || 'HUB-BLR';

  // Volunteer assigned tasks
  const assignedCalls = data.wellnessCallTasks.filter(
    (c) => c.assignedVolunteerId === user?.id || (c.chapterId === chapterId && c.status === 'PENDING')
  );

  const assignedSeniors = data.seniorCitizens.filter((s) => s.chapterId === chapterId).slice(0, 10);

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      <PageHeader
        title="Field Volunteer Workdesk"
        description="Assisted senior onboarding, masked community check-in calls, and daily wellness support."
      />

      {/* Masked Data Governance Banner */}
      <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs text-text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            <strong>Volunteer Privacy Mode:</strong> Senior phone numbers and ABHA details are masked
            (••••••3421). Revealing contact numbers requires a mandatory justification logged to the
            audit trail.
          </span>
        </div>
        <StatusChip status="neutral" label="Masked Access" />
      </div>

      {/* Action Shortcut Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-border-hairline rounded space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Assisted Onboarding</span>
              <UserPlus className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-text-muted">
              Enroll seniors who cannot self-onboard on WhatsApp using the 7-step guided wizard.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/onboarding/new')}
            className="text-xs gap-1.5 bg-accent w-full"
          >
            Start Assisted Onboarding
          </Button>
        </div>

        <div className="p-5 bg-white border border-border-hairline rounded space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Welfare Outreach Calls</span>
              <PhoneCall className="w-4 h-4 text-warning" />
            </div>
            <p className="text-xs text-text-muted">
              {assignedCalls.length} calls assigned for welfare checks on high readings or missed logs.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/calls')}
            className="text-xs w-full"
          >
            Work Outreach Calls ({assignedCalls.length})
          </Button>
        </div>

        <div className="p-5 bg-white border border-border-hairline rounded space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Chapter Seniors</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-text-muted">
              View registered seniors in your chapter hub with masked contact cards.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/seniors')}
            className="text-xs w-full"
          >
            View Senior Directory
          </Button>
        </div>
      </div>

      {/* Assigned Seniors List */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary">
            Assigned Community Seniors (My Chapter)
          </h3>
          <span className="text-xs text-text-muted">{assignedSeniors.length} seniors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Senior Name</th>
                <th className="py-2.5 px-4">Member ID</th>
                <th className="py-2.5 px-4">Phone (Masked)</th>
                <th className="py-2.5 px-4">Language</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {assignedSeniors.map((s) => (
                <tr key={s.id} className="hover:bg-surface-subtle">
                  <td className="py-2.5 px-4 font-bold text-text-primary">{s.fullName}</td>
                  <td className="py-2.5 px-4 font-mono text-text-muted">{s.memberId}</td>
                  <td className="py-2.5 px-4 font-mono text-text-muted">
                    {maskPhoneNumber(s.phoneNumber)}
                  </td>
                  <td className="py-2.5 px-4 text-text-muted">{s.preferredLanguage}</td>
                  <td className="py-2.5 px-4">
                    <StatusChip
                      status={s.status === 'ACTIVE' ? 'success' : 'neutral'}
                      label={s.status}
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/seniors/${s.id}`)}
                      className="text-xs px-2 py-0.5 h-6"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
