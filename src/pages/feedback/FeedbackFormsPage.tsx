import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const FeedbackFormsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/feedback" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Feedback
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Survey forms</span>
      </div>

      <PageHeader
        title="Standardised survey forms"
        subtitle="3-question micro-surveys dispatched post-session via WhatsApp Interactive buttons"
      />

      <div className="space-y-4">
        {[
          {
            title: 'Post-Session Experience Micro-Survey',
            questions: [
              '1. How did you feel during today’s session? (1-5 Stars)',
              '2. Was the instructor’s pacing comfortable? (Yes / Too fast / Needs more time)',
              '3. Would you like to attend the next follow-up class? (Yes / Maybe / No)',
            ],
          },
          {
            title: 'Quarterly Wellbeing & Community Hub Assessment',
            questions: [
              '1. Overall satisfaction with Ekta Hub facilities & cleanliness (1-5 Stars)',
              '2. Do you feel more socially connected since joining? (Significantly / Somewhat / No change)',
              '3. What new activities would you like us to introduce?',
            ],
          },
        ].map((form, idx) => (
          <Card key={idx} title={form.title}>
            <div className="space-y-2 text-xs text-[var(--text)]">
              {form.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-2 rounded bg-[var(--surface-subtle)]">
                  {q}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

