import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Phone, HelpCircle, ShieldAlert, CheckCircle2, MessageSquarePlus } from 'lucide-react';

export const SeniorHelpPage: React.FC = () => {
  const { user } = useAuthStore();
  const [callRequested, setCallRequested] = useState(false);

  const handleRequestCallback = () => {
    mockStore.writeAudit(
      user?.id || 'm-1',
      user?.fullName || 'Senior Member',
      'SC',
      'CREATE',
      'HealthEscalation',
      user?.id || 'm-1',
      'Senior citizen tapped "Request Call from Coordinator" in portal',
      null,
      null,
      'HUB-PUN'
    );

    setCallRequested(true);
    setTimeout(() => setCallRequested(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-base">
      <PageHeader
        title="Help & Assisted Support"
        description="We are here to support you. Connect directly with your centre coordinator or lodge a concern."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Help' },
        ]}
      />

      {/* Mandatory Non-Clinical Notice */}
      <div className="p-4 bg-bg-subtle border-2 border-border-hairline rounded-lg text-sm text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Non-Clinical Support Notice:</strong> Vayoshrestha does not give emergency medical diagnosis.
          In a severe medical emergency, please dial 108 or have family accompany you to the nearest hospital casualty.
        </div>
      </div>

      {callRequested && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-900 rounded-lg text-sm flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            <strong>Request Received!</strong> Your Centre Coordinator (Meera Joshi) has been alerted and will call your phone number within 2 hours.
          </span>
        </div>
      )}

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-text-primary">Speak with Coordinator</h3>
              <div className="text-xs text-text-muted">Meera Joshi • Ekta Hub Shivajinagar</div>
            </div>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            Need help with booking, travel to the centre, or want someone to talk to? Tap below to request an immediate call back.
          </p>

          <Button
            variant="primary"
            size="md"
            onClick={handleRequestCallback}
            disabled={callRequested}
            className="w-full text-base h-11"
          >
            Request Call from Coordinator
          </Button>
        </div>

        <div className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-text-primary">Lodge a Concern or Grievance</h3>
              <div className="text-xs text-text-muted">Confidential Redressal</div>
            </div>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            Have a concern about facility cleanliness, seating, or staff conduct? Submit a formal ticket for management review.
          </p>

          <Link to="/complaints/new">
            <Button variant="outline" size="md" className="w-full text-base h-11">
              Submit Concern Form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
