import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Globe, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';

export const TemplatesListPage: React.FC = () => {
  const [category, setCategory] = useState('ALL');

  const templates = [
    {
      id: 'TPL-001',
      name: 'Session Reminder & Venue Notice',
      category: 'Session_Reminder',
      languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
      status: 'Approved',
      body: 'Namaste {{1}} Ji, reminder for your {{2}} session tomorrow at {{3}}, {{4}}.',
    },
    {
      id: 'TPL-002',
      name: 'Medication Adherence Prompt',
      category: 'Medication',
      languages: ['English', 'Hindi', 'Marathi'],
      status: 'Approved',
      body: 'Namaste {{1}} Ji, have you taken your afternoon medication ({{2}})? Please tap Yes or No.',
    },
    {
      id: 'TPL-003',
      name: 'Weather & Heatwave Caution Alert',
      category: 'Health_Alert',
      languages: ['English', 'Hindi', 'Marathi', 'Tamil'],
      status: 'Approved',
      body: 'Weather advisory for {{1}} chapter: High temperature expected today. Please stay hydrated and rest indoors.',
    },
    {
      id: 'TPL-004',
      name: 'Doctor Referral Follow-up',
      category: 'Referral',
      languages: ['English', 'Hindi', 'Marathi'],
      status: 'Approved',
      body: 'Namaste {{1}} Ji, has your consultation with {{2}} taken place? Please reply to let your coordinator know.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/communication" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Communication
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Templates</span>
      </div>

      <PageHeader
        title="Message templates"
        subtitle="Standardised WhatsApp Interactive templates reviewed and approved for senior accessibility"
        actions={
          <Link to="/communication/templates/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Create template
            </Button>
          </Link>
        }
      />

      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
        searchPlaceholder="Filter templates..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: category,
            onChange: setCategory,
            options: [
              { label: 'All categories', value: 'ALL' },
              { label: 'Session Reminders', value: 'Session_Reminder' },
              { label: 'Medication', value: 'Medication' },
              { label: 'Health Alerts', value: 'Health_Alert' },
            ],
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="hover:border-[var(--border-strong)] transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--surface-selected)] px-2 py-0.5 rounded">
                  {tpl.category.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-semibold text-[var(--text)] font-sans mt-1.5">{tpl.name}</h3>
              </div>
              <StatusChip label={tpl.status} status="active" />
            </div>

            <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text)] my-3 font-sans">
              "{tpl.body}"
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>{tpl.languages.length} language variants</span>
              <Link to={`/communication/templates/${tpl.id}`}>
                <Button size="sm" variant="outline">View variants</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
