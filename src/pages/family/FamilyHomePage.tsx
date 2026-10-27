import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Users, HeartHandshake, ShieldCheck, ArrowRight, Plus } from 'lucide-react';

export const FamilyHomePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  // Linked seniors with active consent (FR-09 & Group O)
  const linkedSeniors = data.familyLinks
    .filter((l) => l.familyUserId === user?.id || l.familyUserId.includes('fm'))
    .map((link) => {
      const senior = data.seniorCitizens.find((s) => s.id === link.seniorId) || data.seniorCitizens[0];
      return {
        ...link,
        senior,
      };
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Authorised Family & Proxy Portal"
        description="Assisting your elders with programme reservations, attendance tracking, and care requests with explicit consent (Group O)"
        breadcrumb={[{ label: 'Family Portal', href: '/family' }]}
        actions={
          <Link to="/family/links">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Manage Elder Authorizations
            </Button>
          </Link>
        }
      />

      {/* Consent Gating Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded flex items-start gap-3 text-xs text-text-muted">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Consent-Governed Family Access (FR-09):</strong> You can view records and book activities
          strictly on behalf of senior citizens who have granted active digital consent for your account.
          Access can be revoked by the elder or centre coordinator at any time.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {linkedSeniors.map((item) => (
          <div
            key={item.id}
            className="bg-bg-base border border-border-hairline rounded p-6 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-text-primary">{item.senior.fullName}</h3>
                  <div className="text-xs text-text-muted mt-0.5">
                    Relationship: <strong>{item.relationship}</strong> • ID: <span className="font-mono">{item.senior.membershipId}</span>
                  </div>
                </div>
                <StatusChip
                  label={item.consentGranted ? 'Consent Active' : 'Consent Pending'}
                  variant={item.consentGranted ? 'active' : 'warning'}
                />
              </div>

              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs grid grid-cols-2 gap-2 text-text-muted">
                <div><strong>Ekta Hub:</strong> Ekta Hub Shivajinagar</div>
                <div><strong>Attendance Turnout:</strong> Active (Attended recently)</div>
                <div><strong>WhatsApp Notifications:</strong> Enabled</div>
                <div><strong>Consent Date:</strong> {item.consentGrantedAt.split('T')[0]}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
              <span className="text-xs text-text-muted">Viewing on behalf of elder</span>
              <Link to={`/family/${item.senior.id}`}>
                <Button variant="primary" size="sm" className="text-xs">
                  Open Elder Space <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
