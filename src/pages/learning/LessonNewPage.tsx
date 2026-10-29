import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  HeartPulse,
  Scale,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_LESSONS,
  MicroLesson,
  LessonCategory,
  isAllowlistedLink,
} from '@/domain/learning/learningEngine';
import { useAuthStore } from '@/store/authStore';

export const LessonNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [title, setTitle] = useState<string>('Preventing Lottery & Prize Call Scams');
  const [category, setCategory] = useState<LessonCategory>('digital_safety_fraud');
  const [language, setLanguage] = useState<'Marathi' | 'Hindi' | 'English' | 'Kannada' | 'Tamil'>('Marathi');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(2);
  const [summary, setSummary] = useState<string>(
    'How to handle telephone calls claiming you won a lucky draw or gold coin in a shopping contest.'
  );
  const [externalLink, setExternalLink] = useState<string>('https://cybercrime.gov.in');
  const [whatsappBubbleText, setWhatsappBubbleText] = useState<string>(
    `🎁 *सावध: बक्षीस आणि लॉटरी कॉल फसवणूक!*

प्रिय ज्येष्ठ नागरिक मित्र,
जर फोनवर कोणी सांगितले: _"तुम्ही २५ लाखांची लॉटरी जिंकली आहे, बक्षीस मिळवण्यासाठी प्रोसेसिंग फी भरा"_, तर:
1️⃣ फोन त्वरित कट करा!
2️⃣ तुम्ही ज्या स्पर्धेत भाग घेतला नाही, त्याचे बक्षीस कधीही मिळत नाही.
3️⃣ आपले बँक तपशील किंवा OTP कधीही सांगू नका.

तक्रारीसाठी संपर्क: https://cybercrime.gov.in
- वयोश्रेष्ठ डिजिटल सुरक्षा मंच`
  );

  const isLinkSafe = externalLink ? isAllowlistedLink(externalLink) : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson: MicroLesson = {
      id: `les-${Date.now()}`,
      title,
      category,
      language,
      estimatedMinutes,
      summary,
      whatsappBubbleText,
      externalLink: externalLink || undefined,
      status: 'approved',
      author: user?.name || 'Pooja Verma (PM)',
      approvedBy: 'Dr. Anita Joshi (NM)',
      createdAt: new Date().toISOString(),
    };

    SEED_LESSONS.unshift(newLesson);
    navigate('/learning/library');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Author New Micro-Lesson"
        subtitle="Compose a bite-sized educational lesson with instant WhatsApp speech bubble simulation."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Library', href: '/learning/library' },
          { label: 'New Lesson' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="p-6 bg-bg-surface border border-border rounded-xl space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text-secondary">Lesson Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LessonCategory)}
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
              >
                <option value="digital_safety_fraud">Digital Safety & Fraud</option>
                <option value="health_literacy">Health Literacy</option>
                <option value="rights_schemes">Rights & Schemes</option>
                <option value="smartphone_mastery">Smartphone Mastery</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
              >
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Kannada">Kannada</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Reading Time (Minutes):</label>
              <input
                type="number"
                min={1}
                max={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
                required
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">External Reference Link:</label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://cybercrime.gov.in"
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
              />
            </div>
          </div>

          {externalLink && (
            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${isLinkSafe ? 'bg-emerald-50 border-brand-primary/20 text-brand-primary' : 'bg-red-50 border-negative/30 text-negative'}`}>
              {isLinkSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{isLinkSafe ? 'Link domain is allowlisted safe.' : 'Warning: Domain not in government/NGO allowlist.'}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-text-secondary">Summary (Staff Overview):</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-secondary">WhatsApp Speech Bubble Content (Markdown formatted):</label>
            <textarea
              rows={6}
              value={whatsappBubbleText}
              onChange={(e) => setWhatsappBubbleText(e.target.value)}
              required
              className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/learning/library')}
              className="px-4 py-2 border border-border rounded-lg font-semibold text-text-secondary hover:bg-bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 flex items-center gap-1.5"
            >
              Save Micro-Lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Live WhatsApp Broadcast Simulation
          </h3>
          <p className="text-xs text-text-secondary">
            Simulates the exact rendering and line breaks seen on senior smartphones.
          </p>

          <div className="p-5 bg-[#EFEAE2] rounded-xl space-y-2">
            <div className="bg-[#E7FFDB] p-4 rounded-xl border border-emerald-200 text-xs text-[#111B21] whitespace-pre-wrap leading-relaxed">
              {whatsappBubbleText}
              <div className="text-[10px] text-text-secondary text-right mt-2 flex items-center justify-end gap-1">
                <span>11:00 AM</span>
                <span className="text-emerald-700 font-semibold">✓✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
