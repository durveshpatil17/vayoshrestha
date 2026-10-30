import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { HealthFlagsPage } from './HealthFlagsPage';
import { WellnessCallsPage } from './WellnessCallsPage';
import { HealthLogsPage } from './HealthLogsPage';
import { SupportRequestsPage } from '@/pages/support/SupportRequestsPage';
import { AlertCircle, PhoneCall, FileText, HeartPulse } from 'lucide-react';

export const HealthQueueHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'requests';

  const tabs = [
    {
      key: 'requests',
      label: 'Care requests',
      icon: <HeartPulse className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'flags',
      label: 'Anomaly flags',
      icon: <AlertCircle className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'calls',
      label: 'Wellness calls',
      icon: <PhoneCall className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'logs',
      label: 'Vital logs',
      icon: <FileText className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Care Queue & Triage Hub"
        description="Health anomalies, wellness call dispatches, and vital reading logs"
      />

      <NavTabBar tabs={tabs} defaultTab="requests" />

      {currentTab === 'requests' && <SupportRequestsPage />}
      {currentTab === 'flags' && <HealthFlagsPage />}
      {currentTab === 'calls' && <WellnessCallsPage />}
      {currentTab === 'logs' && <HealthLogsPage />}
    </div>
  );
};

