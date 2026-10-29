import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { HelpCircle, MessageSquarePlus, Phone, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  roles?: string[];
}

export const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'How does assisted registration work for senior citizens without smartphones?',
      a: 'Field Volunteers or Coordinators can use the Assisted Registration toggle in /members/new. You enter the elder details on their behalf, specify your relationship or staff code, and record their verbal/written consent.',
    },
    {
      q: 'Why are phone numbers masked with dots (••••••3421) for volunteers?',
      a: 'Per data minimisation rules under the DPDP Act and Vayoh Vikas safeguarding policies, senior citizen contact numbers are masked by default. Clicking "Reveal" opens a modal requiring a recorded operational justification.',
    },
    {
      q: 'What is the difference between "Registered", "Active", and "Participant"?',
      a: 'Registered means an elder has an active membership record. Active means they attended at least one session in the last 30 days. Participant means they attended a session in the specific reporting period.',
    },
    {
      q: 'Can a Centre Coordinator view or edit records from other Ekta Hubs?',
      a: 'No. Centre Coordinators and Volunteers are strictly restricted to their assigned centres. Attempts to view or swap IDs of unassigned centres will result in an explicit 403 Forbidden notice.',
    },
    {
      q: 'What should I do if a senior mentions acute illness or health distress?',
      a: 'Vayoshreshtha is not a clinical or medical platform. Always invoke the non-clinical routing flow in /support/requests or notify the designated care team specialist. For emergencies, contact the local medical helpline immediately.',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Help & Institutional Support"
        description="Operational guidance, role-specific FAQs, Ekta Hub coordinator directory, and grievance escalation."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Help' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            icon={<MessageSquarePlus className="w-4 h-4" />}
            onClick={() => navigate('/complaints/new')}
          >
            Lodge Formal Complaint
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: FAQs (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Frequently Answered Questions
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-border-hairline rounded bg-bg-base overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-text-primary hover:bg-bg-subtle transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-border-hairline bg-bg-subtle/30 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Support Channels & Emergency (1 col) */}
        <div className="space-y-4">
          <div className="p-5 bg-bg-subtle border border-border-hairline rounded space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              Central Operations Helpline
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              For field operational questions, technical assistance, or session scheduling guidance:
            </p>
            <div className="p-3 bg-bg-base rounded border border-border-hairline text-xs space-y-1">
              <div className="font-semibold text-text-primary">Vayoh Vikas Field Desk</div>
              <div className="text-accent tabular-nums font-semibold">+91 98220 11999</div>
              <div className="text-xs text-text-muted">Mon–Sat: 08:30 to 18:00 IST</div>
            </div>
          </div>

          <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Institutional Resources
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href="/privacy"
                className="block p-2 rounded hover:bg-bg-subtle text-accent font-semibold hover:underline"
              >
                Plain Language Privacy Charter
              </a>
              <button
                onClick={() => navigate('/reports/definitions')}
                className="w-full text-left p-2 rounded hover:bg-bg-subtle text-accent font-semibold hover:underline"
              >
                Measurement Metric Definitions
              </button>
              <button
                onClick={() => navigate('/complaints/new')}
                className="w-full text-left p-2 rounded hover:bg-bg-subtle text-accent font-semibold hover:underline"
              >
                Grievance & Redressal Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
