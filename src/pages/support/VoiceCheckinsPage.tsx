import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { PhoneCall, Play, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const VoiceCheckinsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [campaignRunning, setCampaignRunning] = useState(false);
  const [callLogs, setCallLogs] = useState([
    {
      id: 'vc-1',
      memberId: data.seniorCitizens[0]?.id || 'm-1',
      memberName: data.seniorCitizens[0]?.fullName || 'Kamala Deshpande',
      phone: '9822011223',
      callTime: '2026-10-27 09:30 AM',
      outcome: 'Completed',
      notes: 'Elder reported feeling well; confirmed attendance for Thursday Yoga.',
    },
    {
      id: 'vc-2',
      memberId: data.seniorCitizens[1]?.id || 'm-2',
      memberName: data.seniorCitizens[1]?.fullName || 'Narayan Patil',
      phone: '9822022334',
      callTime: '2026-10-27 09:32 AM',
      outcome: 'No answer',
      notes: 'No response after 4 rings. Retrying scheduled at 02:00 PM.',
    },
    {
      id: 'vc-3',
      memberId: data.seniorCitizens[2]?.id || 'm-3',
      memberName: data.seniorCitizens[2]?.fullName || 'Sitaram Joshi',
      phone: '9822033445',
      callTime: '2026-10-27 09:35 AM',
      outcome: 'Escalated',
      notes: 'Elder reported severe dizziness during IVR response. Handed over to Care Team.',
    },
  ]);

  const handleRunSimulation = () => {
    setCampaignRunning(true);
    setTimeout(() => {
      setCampaignRunning(false);
      alert('Simulated voice check-in batch completed (FR-41). All outcomes recorded in compliance log.');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          Optional / post-pilot feature
        </span>
      </div>

      <PageHeader
        title="Automated Voice Check-In Campaigns (Simulated)"
        description="Outbound conversational wellness check-ins for senior citizens with digital consent (FR-41 — UI simulation only)"
        breadcrumb={[
          { label: 'Health Support', href: '/support/requests' },
          { label: 'Voice Check-ins' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSimulation}
            disabled={campaignRunning}
          >
            <Play className={`w-4 h-4 mr-1.5 ${campaignRunning ? 'animate-pulse' : ''}`} />
            {campaignRunning ? 'Simulating Outbound Calls...' : 'Simulate Outbound Batch'}
          </Button>
        }
      />

      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Voice Check-in Compliance Architecture:</strong> In accordance with prompt constraint #5,
          this interface is a UI simulation. No live telephony or AI voice APIs are executed.
          In a production deployment, calls are placed strictly to seniors with explicit voice consent and are limited to conversational wellness check-ins.
        </div>
      </div>

      {/* Script Preview & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-bg-base border border-border-hairline rounded p-5 space-y-3 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">IVR Script Dialogue Preview</h4>
          <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-primary space-y-2 leading-relaxed">
            <div>
              <strong>Bot:</strong> "Namaste! This is a friendly call from Vayoh Vikas Ekta Hub. How are you feeling today? Press 1 for Feeling Good, or Press 2 if you are experiencing any pain or distress."
            </div>
            <div>
              <strong>Press 1:</strong> "Wonderful! We look forward to seeing you at your community yoga circle."
            </div>
            <div>
              <strong>Press 2:</strong> "We are immediately notifying your Centre Coordinator Meera ji to call you right away."
            </div>
          </div>
        </div>

        <div className="md:col-span-8 bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Recent Call Outcome Ledger</h4>

          <div className="divide-y divide-border-hairline text-xs">
            {callLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-medium text-text-primary">{log.memberName}</div>
                  <div className="text-text-muted">{log.phone} • {log.callTime}</div>
                  <div className="text-text-muted pt-1">{log.notes}</div>
                </div>

                <StatusChip
                  label={log.outcome}
                  variant={log.outcome === 'Completed' ? 'active' : log.outcome === 'Escalated' ? 'danger' : 'warning'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
