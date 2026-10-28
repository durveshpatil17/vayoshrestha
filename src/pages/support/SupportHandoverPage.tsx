import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Save, UserCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SupportHandoverPage: React.FC = () => {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/support/requests" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Health support
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Shift handover</span>
      </div>

      <PageHeader
        title="Shift handover & clinical continuity log"
        subtitle="End-of-shift transfer notes between Field Volunteers, Chapter Managers, and on-duty Responders"
      />

      <Card title="Current shift handover briefing (Pune Hub)">
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
            <div className="font-semibold text-sm text-[var(--text)]">Morning shift summary (Pooja Shinde, VF)</div>
            <p className="text-[var(--text)] leading-relaxed">
              • Conducted BP screening for 32 elders in Swasthya Seva session.<br />
              • Kamala Devi reported slight dizziness; Systolic reading was 158 mmHg, Dr. Sunita notified.<br />
              • Ramesh Kulkarni received new four-pod cane from Sanjeevani mobility; instructed on usage.<br />
              • Evening responder to follow up with Shantaram Deshpande (unanswered morning check-in).
            </p>
            <div className="text-[var(--text-secondary)] pt-1 text-[11px]">Logged: 28 Oct 2026, 01:30 PM IST</div>
          </div>
        </div>
      </Card>

      <Card title="Record evening shift note">
        <div className="space-y-3">
          <textarea
            rows={4}
            placeholder="Type notes for tomorrow morning's coordinator and volunteer team..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex items-center justify-between pt-1">
            {saved && <span className="text-xs text-[var(--positive)] font-semibold">Shift note saved!</span>}
            <Button
              variant="primary"
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              icon={<Save size={16} />}
            >
              Save handover note
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

