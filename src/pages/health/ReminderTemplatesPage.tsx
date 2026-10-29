import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Plus,
  ShieldCheck,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const ReminderTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const isRA = user?.role === 'RA';

  const templates = [
    {
      id: 'TPL-MORNING-01',
      title: '08:00 Morning Wellness & Vitals Prompt',
      category: 'UTILITY',
      approvalStatus: 'APPROVED',
      approvedBy: 'NM-01',
      languages: ['English', 'Hindi', 'Kannada', 'Marathi', 'Tamil'],
      buttons: ['Taken', 'Not yet', 'Skip'],
      vitalsPrompt: 'Blood Pressure or Glucose reading',
      updatedAt: '2026-10-15T09:00:00Z',
    },
    {
      id: 'TPL-EVENING-02',
      title: 'Evening Vital Check-In (Optional)',
      category: 'UTILITY',
      approvalStatus: 'APPROVED',
      approvedBy: 'NM-01',
      languages: ['English', 'Hindi'],
      buttons: ['Logged', 'Skip'],
      vitalsPrompt: 'Evening BP prompt',
      updatedAt: '2026-10-18T14:30:00Z',
    },
    {
      id: 'TPL-WEEKLY-03',
      title: 'Weekly Sunday Wellness Check',
      category: 'UTILITY',
      approvalStatus: 'PENDING_APPROVAL',
      approvedBy: null,
      languages: ['English', 'Hindi', 'Kannada'],
      buttons: ['All Good', 'Request Check-In Call'],
      vitalsPrompt: 'Weekly general check',
      updatedAt: '2026-10-24T11:00:00Z',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Prominent non-clinical notice banner */}
      <MessageStrip type="informative">
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Nav & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health')}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text">WhatsApp Reminder Templates</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Business-initiated utility templates, quick-reply buttons, and multi-language variants.
            </p>
          </div>
        </div>
        {isRA && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/health/reminders/new')}
            className="gap-1.5 bg-accent"
          >
            <Plus className="w-4 h-4" />
            Create Template Draft
          </Button>
        )}
      </div>

      {/* Maker-Checker Policy Banner */}
      <div className="p-4 bg-surface border border-border rounded-container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
          <div>
            <span className="font-semibold text-xs text-text block">
              Maker-Checker Operational Governance
            </span>
            <span className="text-xs text-text-secondary">
              Templates drafted by Regional Admins require explicit approval by NGO Management before automated delivery to seniors.
            </span>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-surface border border-border rounded-container p-5 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs tabular-nums text-text-secondary">{tpl.id}</span>
                <StatusChip
                  status={tpl.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
                  label={tpl.approvalStatus}
                />
              </div>

              <div>
                <h3 className="font-semibold text-sm text-text">{tpl.title}</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Category: <strong className="text-text">{tpl.category}</strong>
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-xs font-semibold text-text-secondary">Quick Reply Actions:</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.buttons.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 bg-page border border-border rounded-control text-xs text-text font-normal"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <div className="text-xs font-semibold text-text-secondary">Languages:</div>
                <p className="text-xs text-text mt-0.5">{tpl.languages.join(' · ')}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-secondary tabular-nums">
                {tpl.approvedBy ? `Approved by ${tpl.approvedBy}` : 'Awaiting NM Review'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/health/reminders/${tpl.id}`)}
                className="gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect & Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
