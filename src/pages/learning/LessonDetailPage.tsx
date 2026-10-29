import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Send,
  CheckCircle2,
  ExternalLink,
  Volume2,
  ShieldCheck,
  Check,
  CheckCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_LESSONS,
  MicroLesson,
  isAllowlistedLink,
} from '@/domain/learning/learningEngine';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson] = useState<MicroLesson | undefined>(() =>
    SEED_LESSONS.find((l) => l.id === id)
  );

  const [testSent, setTestSent] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!lesson) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl  font-semibold text-text">Lesson Not Found</h2>
        <p className="text-sm text-text-secondary">The requested micro-lesson does not exist.</p>
        <Link
          to="/learning/library"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const isLinkSafe = lesson.externalLink ? isAllowlistedLink(lesson.externalLink) : true;

  return (
    <div className="space-y-6">
      <PageHeader
        title={lesson.title}
        subtitle={`${lesson.category.replace(/_/g, ' ')} · ${lesson.language} · ${lesson.estimatedMinutes} min read`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Library', href: '/learning/library' },
          { label: lesson.title },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendTest}
              className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
            >
              {testSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {testSent ? 'Sent to Simulator' : 'Test Dispatch (WhatsApp)'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lesson Detail & Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
            <div>
              <span className="text-xs font-semibold text-accent ">
                {lesson.category.replace(/_/g, ' ')}
              </span>
              <h3 className="text-xl  font-semibold text-text mt-1">
                {lesson.title}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Executive summary: {lesson.summary}
              </p>
            </div>

            {/* Simulated Voice Note Bar */}
            <div className="p-4 bg-page border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-xs font-semibold text-text">
                    {isPlayingAudio ? 'Playing Marathi Audio Narration...' : 'Audio Narration (For Non-Reading Elders)'}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Voice Note length: 1 min 45 sec · Recorded by Ekta Hub Lead
                  </div>
                </div>
              </div>
              <span className="text-xs text-accent font-semibold">Voice Enabled</span>
            </div>

            {/* WhatsApp Chat Speech Bubble */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-text-secondary">
                Rendered WhatsApp Speech Bubble Preview
              </h4>
              <div className="p-5 bg-page rounded-container border border-border space-y-2">
                <div className="bg-surface p-4 rounded-container border border-border text-xs text-text whitespace-pre-wrap leading-relaxed max-w-lg">
                  {lesson.whatsappBubbleText}
                  <div className="text-xs text-text-secondary text-right mt-2 flex items-center justify-end gap-1 tabular-nums">
                    <span>10:30 AM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-accent stroke-[1.5]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Link Safety & Governance */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              URL Safety Verification
            </h3>

            {lesson.externalLink ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-accent/20 rounded-lg space-y-1">
                  <div className="font-semibold text-accent flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Allowlisted Safe Domain</span>
                  </div>
                  <div className="text-text break-all">{lesson.externalLink}</div>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  All external hyperlinks sent to elders are strictly checked against government and verified NGO
                  domains to prevent phishing or fraudulent redirects.
                </p>
              </div>
            ) : (
              <div className="text-xs text-text-secondary">
                No external hyperlinks included in this micro-lesson. 100% self-contained.
              </div>
            )}
          </div>

          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-3 text-xs">
            <div className="font-semibold text-text">Author & Maker-Checker</div>
            <div className="text-text-secondary">Author: {lesson.author}</div>
            <div className="text-text-secondary">Approved By: {lesson.approvedBy || 'Pending sign-off'}</div>
            <div className="text-text-secondary">Created: {new Date(lesson.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
