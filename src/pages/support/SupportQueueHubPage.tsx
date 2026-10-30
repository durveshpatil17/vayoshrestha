import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { SupportRequestsPage } from './SupportRequestsPage';
import { SupportEscalationsPage } from './SupportEscalationsPage';
import { SupportHandoverPage } from './SupportHandoverPage';
import { SupportVoiceCheckinsPage } from './SupportVoiceCheckinsPage';
import { HeartHandshake, AlertOctagon, Repeat, Mic } from 'lucide-react';

export const SupportQueueHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'requests';

  const tabs = [
    {
      key: 'requests',
      label: 'Support requests',
      icon: <HeartHandshake className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'escalations',
      label: 'Escalations',
      icon: <AlertOctagon className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'handover',
      label: 'Shift handover',
      icon: <Repeat className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'voice-checkins',
      label: 'Voice check-ins',
      icon: <Mic className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Assisted Care & Escalations Hub"
        description="Elder care inquiries, non-emergency triage, duty handovers, and voice check-in tracking"
      />

      <NavTabBar tabs={tabs} defaultTab="requests" />

      {currentTab === 'requests' && <SupportRequestsPage />}
      {currentTab === 'escalations' && <SupportEscalationsPage />}
      {currentTab === 'handover' && <SupportHandoverPage />}
      {currentTab === 'voice-checkins' && <SupportVoiceCheckinsPage />}
    </div>
  );
};
