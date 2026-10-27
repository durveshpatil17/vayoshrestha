import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RevealPhoneModal } from '@/components/ui/RevealPhoneModal';
import { Forbidden403 } from '@/components/feedback/Forbidden403';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { authorize } from '@/permissions/authorize';
import { maskPhoneNumber } from '@/domain/masking';
import {
  Printer,
  Edit,
  UserX,
  Eye,
  Shield,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  HeartHandshake,
  Users,
  Activity,
  FileText,
} from 'lucide-react';

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const member = data.seniorCitizens.find((m) => m.id === id);

  // Authorize Scope Check: CC & VF cannot access other centres
  const isAuthorized = authorize(user, 'MEMBER_PROFILES', 'read', {
    id: member?.id,
    centreId: member?.centreId,
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'consent' | 'attendance' | 'referrals' | 'feedback' | 'comms' | 'family' | 'audit'
  >('overview');

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  if (!member) {
    return (
      <div className="p-12 text-center text-xs text-text-muted">
        Senior Citizen record not found.
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <Forbidden403
        missingPermission="MEMBER_PROFILES (Assigned Centre Isolation)"
        requiredRole="Coordinator of Centre"
      />
    );
  }

  const memberAttendance = data.attendanceRecords.filter((a) => a.memberId === member.id);
  const memberReferrals = data.referrals.filter((r) => r.memberId === member.id);
  const memberMessages = data.outboundMessages.filter((m) => m.recipientMemberId === member.id);
  const memberFamily = data.familyLinks.filter((f) => f.seniorId === member.id);
  const memberAudits = data.auditEvents.filter((a) => a.entityId === member.id);

  const isPhoneMasked = user?.role === 'VF' && !revealedPhone;

  const handleDeactivate = () => {
    mockStore.updateData((draft) => {
      const target = draft.seniorCitizens.find((x) => x.id === member.id);
      if (target) {
        target.status = 'Suspended';
        target.isActive = false;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Coordinator',
      user?.role || 'CC',
      'DELETE',
      'SeniorCitizen',
      member.id,
      'Senior member deactivated per coordinator request',
      { status: member.status },
      { status: 'Suspended' },
      member.centreId
    );

    setDeactivateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={member.fullName}
        description={`Membership ID: ${member.membershipId} · Ekta Hub: ${member.centreId} · Registered: ${member.registeredAt}`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Senior Citizens', to: '/members' },
          { label: member.fullName },
        ]}
        statusBadge={
          <StatusChip
            label={member.status}
            variant={member.status === 'Active' ? 'active' : member.status === 'Registered' ? 'registered' : 'opted-out'}
          />
        }
        primaryAction={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => navigate(`/members/${member.id}/card`)}
            >
              Print Card
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/members/${member.id}/edit`)}
            >
              Edit Profile
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<UserX className="w-4 h-4" />}
              onClick={() => setDeactivateOpen(true)}
            >
              Deactivate
            </Button>
          </div>
        }
      />

      {/* Senior Header Snapshot Panel */}
      <div className="p-6 bg-bg-base border border-border-hairline rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center font-serif text-2xl font-bold">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-text-primary">{member.fullName}</h2>
              <span className="text-xs text-text-muted">
                Age {2026 - new Date(member.dateOfBirth).getFullYear()} ({member.gender})
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
              <span>Primary Language: <strong className="text-text-primary">{member.primaryLanguage}</strong></span>
              <span>Emergency: <strong className="text-text-primary">{member.emergencyContactName} ({member.emergencyContactPhone})</strong></span>
            </div>
          </div>
        </div>

        {/* Contact with Masking / Reveal */}
        <div className="text-right">
          <span className="text-[11px] text-text-muted block mb-0.5">Mobile Phone</span>
          <div className="flex items-center gap-2 justify-end">
            <span className="font-mono text-sm font-bold text-text-primary">
              {revealedPhone || (isPhoneMasked ? maskPhoneNumber(member.phone) : member.phone)}
            </span>
            {isPhoneMasked && (
              <Button
                variant="outline"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => setRevealOpen(true)}
              >
                Reveal
              </Button>
            )}
          </div>
          <span className="text-[10px] text-text-muted block mt-0.5">
            Consent: <strong className="text-success">{member.consentStatus}</strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-hairline gap-6 text-xs font-medium overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'consent', label: 'Consent & Preferences' },
          { key: 'attendance', label: `Attendance History (${memberAttendance.length})` },
          { key: 'referrals', label: `Referrals & Services (${memberReferrals.length})` },
          { key: 'feedback', label: 'Feedback & Follow-up' },
          { key: 'comms', label: `WhatsApp Logs (${memberMessages.length})` },
          { key: 'family', label: `Family Proxy (${memberFamily.length})` },
          { key: 'audit', label: `Audit Trail (${memberAudits.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2.5 border-b-2 -mb-[1px] whitespace-nowrap ${
              activeTab === t.key
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
            <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
              Demographic & Registration Facts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-text-muted block">Date of Birth</span>
                <span className="font-semibold text-text-primary">{member.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-text-muted block">Digital Confidence</span>
                <span className="font-semibold text-text-primary">{member.digitalConfidence}</span>
              </div>
              <div>
                <span className="text-text-muted block">Assisted Registration</span>
                <span className="font-semibold text-text-primary">
                  {member.isAssistedRegistration ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Registered Address</span>
                <span className="font-semibold text-text-primary">{member.address}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
            <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
              Participation & Engagement Score
            </h3>
            <p className="text-text-muted leading-relaxed">
              Active Member Definition: Attended at least 1 session in the last 30 days. Current Status:{' '}
              <strong className={member.isActive ? 'text-success' : 'text-text-muted'}>
                {member.isActive ? 'Active Elder' : 'Registered / Inactive'}
              </strong>
            </p>
            <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-[11px] space-y-1">
              <div>Total Sessions Attended: <strong className="font-mono">{memberAttendance.length}</strong></div>
              <div>Consecutive Missed Sessions: <strong className="font-mono">0</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consent & Preferences */}
      {activeTab === 'consent' && (
        <div className="max-w-xl p-5 bg-bg-base border border-border-hairline rounded space-y-4 text-xs">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            Recorded Consent & Communication Settings (FR-09, FR-29)
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-border-hairline">
              <span className="text-text-muted">Consent Status:</span>
              <StatusChip label={member.consentStatus} variant={member.consentStatus === 'OptedIn' ? 'active' : 'opted-out'} />
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-hairline">
              <span className="text-text-muted">Recorded Timestamp:</span>
              <span className="font-mono font-medium">{member.consentRecordedAt || 'Pending Physical Form'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-hairline">
              <span className="text-text-muted">Policy Version:</span>
              <span className="font-mono">v2.1 (October 2026)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-hairline">
              <span className="text-text-muted">WhatsApp Opt-Out Status:</span>
              <span>{member.optedOutChannels.includes('WhatsApp') ? 'Opted Out (No Messages)' : 'Opted In'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance History */}
      {activeTab === 'attendance' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            Session Attendance Ledger ({memberAttendance.length})
          </h3>
          {memberAttendance.length === 0 ? (
            <p className="text-xs text-text-muted py-6 text-center">No attendance recorded yet.</p>
          ) : (
            <div className="divide-y divide-border-hairline text-xs">
              {memberAttendance.map((a) => (
                <div key={a.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-text-primary">{a.sessionDate}</span>
                    <span className="text-text-muted ml-2">Session ID: {a.sessionId}</span>
                  </div>
                  <StatusChip label={a.status} variant={a.status === 'Present' ? 'active' : 'neutral'} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Referrals */}
      {activeTab === 'referrals' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <h3 className="font-serif text-sm font-semibold text-text-primary">
              Referrals & External Services ({memberReferrals.length})
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/referrals/new')}>
              Create New Referral
            </Button>
          </div>
          {memberReferrals.length === 0 ? (
            <p className="text-xs text-text-muted py-6 text-center">No service referrals on file.</p>
          ) : (
            <div className="divide-y divide-border-hairline text-xs">
              {memberReferrals.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text-primary">{r.serviceName} · {r.partnerName}</div>
                    <p className="text-text-muted text-[11px] mt-0.5">{r.nonClinicalReason}</p>
                  </div>
                  <StatusChip label={r.status} variant="in-progress" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Communication Log */}
      {activeTab === 'comms' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            WhatsApp Delivery History ({memberMessages.length})
          </h3>
          {memberMessages.length === 0 ? (
            <p className="text-xs text-text-muted py-6 text-center">No outbound messages sent to this member.</p>
          ) : (
            <div className="divide-y divide-border-hairline text-xs">
              {memberMessages.map((m) => (
                <div key={m.id} className="py-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary">{m.category}</span>
                      <StatusChip label={m.status} variant={m.status === 'Read' ? 'active' : m.status === 'Failed' ? 'danger' : 'neutral'} />
                    </div>
                    <p className="text-text-muted leading-relaxed max-w-lg">{m.content}</p>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0">{m.sentAt ? new Date(m.sentAt).toLocaleDateString() : 'Queued'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            Member Audit & Modification Log ({memberAudits.length})
          </h3>
          {memberAudits.length === 0 ? (
            <p className="text-xs text-text-muted py-6 text-center">No logged modifications for this member record.</p>
          ) : (
            <div className="divide-y divide-border-hairline text-xs">
              {memberAudits.map((a) => (
                <div key={a.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-text-primary">{a.action}</span>
                    <span className="text-text-muted ml-2">by {a.actorName} ({a.actorRole})</span>
                    <p className="text-[11px] text-text-muted mt-0.5">{a.reason || 'Operational transaction'}</p>
                  </div>
                  <span className="text-[11px] text-text-muted font-mono">{a.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Deactivation Modal */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Senior Citizen Membership"
        description={`Are you sure you want to suspend membership for ${member.fullName} (${member.membershipId})? This action is audited.`}
        confirmWord="DEACTIVATE"
        confirmButtonLabel="Confirm Deactivation"
      />

      {/* Reveal Phone Modal */}
      <RevealPhoneModal
        isOpen={revealOpen}
        onClose={() => setRevealOpen(false)}
        memberId={member.id}
        memberName={member.fullName}
        unmaskedPhone={member.phone}
        onRevealed={(p) => setRevealedPhone(p)}
      />
    </div>
  );
};
