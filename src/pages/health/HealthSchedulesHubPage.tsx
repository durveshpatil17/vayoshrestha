import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { HealthSchedulesPage } from './HealthSchedulesPage';
import { ReminderTemplatesPage } from './ReminderTemplatesPage';
import { Calendar, MessageSquare } from 'lucide-react';

export const HealthSchedulesHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'schedules';

  const tabs = [
    {
      key: 'schedules',
      label: 'Medication schedules',
      icon: <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'templates',
      label: 'Reminder templates',
      icon: <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Schedules & Reminders Hub"
        description="Medication dosage timing, routine tracking, and automated notification templates"
      />

      <NavTabBar tabs={tabs} defaultTab="schedules" />

      {currentTab === 'schedules' && <HealthSchedulesPage />}
      {currentTab === 'templates' && <ReminderTemplatesPage />}
    </div>
  );
};
