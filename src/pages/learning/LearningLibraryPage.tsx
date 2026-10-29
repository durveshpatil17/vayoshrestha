import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  ShieldCheck,
  Smartphone,
  HeartPulse,
  Scale,
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_LESSONS,
  MicroLesson,
  LessonCategory,
} from '@/domain/learning/learningEngine';

export const LearningLibraryPage: React.FC = () => {
  const [lessons] = useState<MicroLesson[]>(() => [...SEED_LESSONS]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreview, setSelectedPreview] = useState<MicroLesson | null>(null);

  const filtered = lessons.filter((les) => {
    if (categoryFilter !== 'all' && les.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        les.title.toLowerCase().includes(q) ||
        les.summary.toLowerCase().includes(q) ||
        les.language.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (cat: LessonCategory) => {
    switch (cat) {
      case 'digital_safety_fraud':
        return <ShieldCheck className="w-4 h-4 text-brand-primary" />;
      case 'health_literacy':
        return <HeartPulse className="w-4 h-4 text-brand-primary" />;
      case 'rights_schemes':
        return <Scale className="w-4 h-4 text-brand-primary" />;
      case 'smartphone_mastery':
        return <Smartphone className="w-4 h-4 text-brand-primary" />;
      default:
        return <BookOpen className="w-4 h-4 text-brand-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Virtual Literacy & Micro-Lesson Library"
        subtitle="Bite-sized senior education modules optimized for WhatsApp broadcast, audio notes, and workshops."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Micro-Lessons' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/learning/series"
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-bg-canvas flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-brand-primary" />
              Drip Campaigns
            </Link>
            <Link
              to="/learning/quizzes"
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-bg-canvas flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-brand-primary" />
              Mastermind Quizzes
            </Link>
            <Link
              to="/learning/library/new"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Lesson
            </Link>
          </div>
        }
      />

      {/* 4 Category Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCategoryFilter(categoryFilter === 'digital_safety_fraud' ? 'all' : 'digital_safety_fraud')}
          className={`p-4 border rounded-xl text-left transition-colors ${
            categoryFilter === 'digital_safety_fraud' ? 'bg-emerald-50/50 border-brand-primary' : 'bg-bg-surface border-border hover:border-brand-primary/40'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-brand-primary mb-2" />
          <div className="text-xs font-semibold text-text-primary">Digital Safety & Anti-Fraud</div>
          <div className="text-[11px] text-text-secondary mt-1">UPI scams, OTP alerts, fake bills</div>
        </button>

        <button
          onClick={() => setCategoryFilter(categoryFilter === 'health_literacy' ? 'all' : 'health_literacy')}
          className={`p-4 border rounded-xl text-left transition-colors ${
            categoryFilter === 'health_literacy' ? 'bg-emerald-50/50 border-brand-primary' : 'bg-bg-surface border-border hover:border-brand-primary/40'
          }`}
        >
          <HeartPulse className="w-5 h-5 text-brand-primary mb-2" />
          <div className="text-xs font-semibold text-text-primary">Health Literacy & Self-Care</div>
          <div className="text-[11px] text-text-secondary mt-1">BP checks, hydration, medicines</div>
        </button>

        <button
          onClick={() => setCategoryFilter(categoryFilter === 'rights_schemes' ? 'all' : 'rights_schemes')}
          className={`p-4 border rounded-xl text-left transition-colors ${
            categoryFilter === 'rights_schemes' ? 'bg-emerald-50/50 border-brand-primary' : 'bg-bg-surface border-border hover:border-brand-primary/40'
          }`}
        >
          <Scale className="w-5 h-5 text-brand-primary mb-2" />
          <div className="text-xs font-semibold text-text-primary">Rights & Legal Schemes</div>
          <div className="text-[11px] text-text-secondary mt-1">Senior Citizens Act 2007, pensions</div>
        </button>

        <button
          onClick={() => setCategoryFilter(categoryFilter === 'smartphone_mastery' ? 'all' : 'smartphone_mastery')}
          className={`p-4 border rounded-xl text-left transition-colors ${
            categoryFilter === 'smartphone_mastery' ? 'bg-emerald-50/50 border-brand-primary' : 'bg-bg-surface border-border hover:border-brand-primary/40'
          }`}
        >
          <Smartphone className="w-5 h-5 text-brand-primary mb-2" />
          <div className="text-xs font-semibold text-text-primary">Smartphone Mastery</div>
          <div className="text-[11px] text-text-secondary mt-1">Voice notes, location sharing</div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search micro-lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-bg-canvas border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none"
          >
            <option value="all">All 4 Domains</option>
            <option value="digital_safety_fraud">Digital Safety & Fraud</option>
            <option value="health_literacy">Health Literacy</option>
            <option value="rights_schemes">Rights & Schemes</option>
            <option value="smartphone_mastery">Smartphone Mastery</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((les) => (
          <div
            key={les.id}
            className="p-5 bg-bg-surface border border-border rounded-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary capitalize">
                  {getCategoryIcon(les.category)}
                  <span>{les.category.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <span>{les.language}</span>
                  <span>·</span>
                  <span>{les.estimatedMinutes} min read</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-serif font-semibold text-text-primary">
                  {les.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {les.summary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setSelectedPreview(les)}
                className="text-brand-primary font-semibold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Bubble Preview
              </button>

              <Link
                to={`/learning/library/${les.id}`}
                className="text-text-secondary font-semibold hover:text-text-primary hover:underline flex items-center gap-1"
              >
                Full Lesson
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Chat Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-surface border border-border rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                  V
                </div>
                <div>
                  <div className="font-semibold text-xs text-text-primary">Vayoshrestha Ekta Broadcast</div>
                  <div className="text-[10px] text-text-secondary">Official WhatsApp Verified Channel</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-text-secondary hover:text-text-primary text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Realistic WhatsApp Chat Bubble */}
            <div className="p-4 bg-[#EFEAE2] rounded-lg space-y-2">
              <div className="bg-[#E7FFDB] p-3.5 rounded-lg border border-emerald-200 text-xs text-[#111B21] whitespace-pre-wrap leading-relaxed">
                {selectedPreview.whatsappBubbleText}
                <div className="text-[10px] text-text-secondary text-right mt-1">
                  10:15 AM · ✓✓
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
