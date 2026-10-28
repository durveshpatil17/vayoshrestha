import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  MessageSquare,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
} from 'lucide-react';

export const ReminderTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isNM = user?.role === 'NM';
  const isRA = user?.role === 'RA';

  // Sample templates or data from store
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Health Overview
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="WhatsApp Reminder Templates"
          description="Business-initiated utility templates, quick-reply buttons, and multi-language variants."
        />
        {isRA && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/health/reminders/new')}
            className="text-xs gap-1.5 bg-accent"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Template Draft
          </Button>
        )}
      </div>

      {/* Maker-Checker Policy Banner */}
      <div className="p-4 bg-white border border-border-hairline rounded flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div>
            <span className="font-bold text-xs text-text-primary block">
              Maker-Checker Operational Governance
            </span>
            <span className="text-xs text-text-muted">
              Templates drafted by Regional Admins require explicit approval by NGO Management before
              automated delivery to seniors.
            </span>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white border border-border-hairline rounded p-5 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-text-muted">{tpl.id}</span>
                <StatusChip
                  status={tpl.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
                  label={tpl.approvalStatus}
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-text-primary">{tpl.title}</h3>
                <p className="text-[11px] text-text-muted mt-1">
                  Category: <strong>{tpl.category}</strong>
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-text-muted">Quick Reply Actions:</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.buttons.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 bg-surface-subtle border border-border-hairline rounded text-[11px] text-text-primary font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <div className="text-[11px] font-semibold text-text-muted">Languages:</div>
                <p className="text-xs text-text-primary mt-0.5">{tpl.languages.join(' · ')}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-mono">
                {tpl.approvedBy ? `Approved by ${tpl.approvedBy}` : 'Awaiting NM Review'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/health/reminders/${tpl.id}`)}
                className="text-xs gap-1"
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
