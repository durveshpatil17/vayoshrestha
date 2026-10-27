import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

export const MemberCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockStore.getData();
  const member = data.seniorCitizens.find((m) => m.id === id);

  if (!member) {
    return <div className="p-12 text-center text-xs text-text-muted">Member not found.</div>;
  }

  const centre = data.centres.find((c) => c.id === member.centreId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Printable Membership Card"
        description="Physical identification card for senior citizen entry and session verification."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Senior Citizens', to: '/members' },
          { label: member.fullName, to: `/members/${member.id}` },
          { label: 'Membership Card' },
        ]}
        primaryAction={
          <Button
            variant="primary"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print Card (CR80 Standard)
          </Button>
        }
      />

      {/* Physical Card Layout (85.6mm × 53.98mm) */}
      <div className="w-[400px] h-[240px] bg-bg-base border-2 border-text-primary rounded-lg p-5 mx-auto shadow-md flex flex-col justify-between print:m-0 print:shadow-none">
        {/* Card Header */}
        <div className="flex items-start justify-between pb-2 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
              Vayoh Vikas NGO
            </span>
            <span className="font-serif text-lg font-bold text-text-primary leading-tight">
              Vayoshreshtha Ekta Card
            </span>
          </div>
          <div className="w-9 h-9 rounded bg-accent text-white font-serif font-bold text-base flex items-center justify-center">
            V
          </div>
        </div>

        {/* Card Body */}
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-[9px] text-text-muted uppercase tracking-wider block">Member Full Name</span>
            <span className="text-sm font-bold text-text-primary">{member.fullName}</span>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <div>
              <span className="text-[9px] text-text-muted uppercase tracking-wider block">Membership ID</span>
              <span className="font-mono text-sm font-bold text-accent">{member.membershipId}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-text-muted uppercase tracking-wider block">Ekta Hub</span>
              <span className="font-semibold text-text-primary">{centre?.name || member.centreId}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-border-hairline flex justify-between items-end text-[10px] text-text-muted">
          <div>
            <span>Emergency: <strong className="font-mono text-text-primary">{member.emergencyContactPhone}</strong></span>
          </div>
          <div className="text-right">
            <span>Helpline: <strong className="font-mono text-accent">+91 98220 11999</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
