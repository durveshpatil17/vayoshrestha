import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Video,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  HeartPulse,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_LESSONS,
  SEED_QUIZZES,
  SEED_WEBINARS,
} from '@/domain/learning/learningEngine';

export const SeniorLearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz' | 'events'>('lessons');

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning & Community Circles"
        subtitle="Practical smartphone tips, fraud prevention, health knowledge, and upcoming community workshops."
        breadcrumbs={[
          { label: 'My Dashboard', href: '/me' },
          { label: 'My Learning' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'lessons'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Daily Micro-Lessons (4)
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'quiz'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Mastermind Quiz Challenge
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'events'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Community Webinars (2)
        </button>
      </div>

      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_LESSONS.map((les) => (
            <div
              key={les.id}
              className="p-5 bg-bg-surface border border-border rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-accent ">
                    {les.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-text-secondary">{les.estimatedMinutes} min read</span>
                </div>
                <h3 className="text-base  font-semibold text-text">
                  {les.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {les.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-secondary">{les.language}</span>
                <Link
                  to={`/learning/library/${les.id}`}
                  className="text-accent font-semibold hover:underline flex items-center gap-1"
                >
                  Read Lesson
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-accent rounded font-semibold">
                Active Weekly Challenge
              </span>
              <h3 className="text-lg  font-semibold text-text mt-1">
                {SEED_QUIZZES[0].title}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Answer 3 quick questions on spotting SMS scams and resting before blood pressure checks.
              </p>
            </div>
            <Link
              to="/learning/quizzes"
              className="px-5 py-2.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              Play Quiz Challenge
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_WEBINARS.map((web) => (
            <div
              key={web.id}
              className="p-5 bg-bg-surface border border-border rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-accent ">
                  {web.category.replace(/_/g, ' ')}
                </span>
                <span className="text-text-secondary">{web.durationMinutes} min Q&A</span>
              </div>
              <h3 className="text-base  font-semibold text-text">
                {web.title}
              </h3>
              <div className="text-xs text-text-secondary">
                Speaker: <strong className="text-text">{web.speaker}</strong>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  {new Date(web.scheduledAt).toLocaleDateString()}
                </span>
                <Link
                  to="/learning/webinars"
                  className="text-accent font-semibold hover:underline"
                >
                  View Details & RSVP
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
