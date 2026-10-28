import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { MessageStrip } from '@/components/ui/MessageStrip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  UserPlus,
  PhoneCall,
  Users,
  Shield,
  ChevronRight,
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
      {/* 1. Governance Message Strip */}
      <MessageStrip
        type="informative"
        message="Volunteer privacy mode active: Senior phone numbers and ABHA details are masked. Revealing unmasked contact numbers requires a mandatory justification logged to the institutional audit trail."
      />

      {/* 2. Page Header */}
      <PageHeader
        title="Field Volunteer Workdesk"
        description="Assisted senior onboarding, masked community check-in calls, and daily wellness support."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/onboarding/new')}
              className="gap-1.5"
            >
              <UserPlus className="w-4 h-4" strokeWidth={1.5} />
              Start Assisted Onboarding
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/health/calls')}
            >
              Work Calls ({assignedCalls.length})
            </Button>
          </div>
        }
      />

      {/* 3. 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Assigned outreach calls"
          value={assignedCalls.length}
          statusLine={assignedCalls.length === 0 ? 'All calls completed' : 'Pending wellness check-in'}
          status={assignedCalls.length === 0 ? 'positive' : 'critical'}
        />
        <KpiTile
          title="Assisted enrollments"
          value="14"
          statusLine="Completed this month"
          status="positive"
        />
        <KpiTile
          title="Chapter seniors"
          value={assignedSeniors.length}
          statusLine={`Assigned in ${chapterId}`}
          status="positive"
        />
        <KpiTile
          title="Medication adherence"
          value="86.2%"
          statusLine="Target > 75.0% met"
          status="positive"
        />
      </div>

      {/* 4. Needs Attention Row List */}
      <Card
        title="Needs attention"
        subtitle="Priority tasks assigned to your volunteer desk"
        padding="none"
      >
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={assignedCalls.length > 0 ? 'critical' : 'positive'}
                label={assignedCalls.length > 0 ? 'Pending' : 'Completed'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {assignedCalls.length > 0
                    ? `${assignedCalls.length} wellness outreach call(s) pending follow-up`
                    : 'All assigned wellness check-in calls completed'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Follow-up on vital logs and daily reminder check-ins
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Today</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/calls')}
              >
                Start Calls
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 5. Assigned Seniors Table */}
      <Card padding="none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Assigned community seniors
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Active seniors registered in your chapter hub with masked contact cards
            </p>
          </div>
          <span className="text-xs text-text-secondary tabular-nums">
            {assignedSeniors.length} seniors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold h-10">
                <th className="py-2 px-4">Senior name</th>
                <th className="py-2 px-4">Member ID</th>
                <th className="py-2 px-4">Phone (masked)</th>
                <th className="py-2 px-4">Language</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignedSeniors.map((s) => (
                <tr
                  key={s.id}
                  className="h-12 hover:bg-surface-hover transition-colors"
                >
                  <td className="py-2 px-4 font-semibold text-text">{s.fullName}</td>
                  <td className="py-2 px-4 tabular-nums text-text-secondary">{s.memberId}</td>
                  <td className="py-2 px-4 tabular-nums text-text-secondary">
                    {maskPhoneNumber(s.phoneNumber)}
                  </td>
                  <td className="py-2 px-4 text-text-secondary">{s.preferredLanguage}</td>
                  <td className="py-2 px-4">
                    <StatusIndicator
                      status={s.status === 'ACTIVE' ? 'positive' : 'neutral'}
                      label={s.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="py-2 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/seniors/${s.id}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
