import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, CheckCircle2, Languages } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lang, setLang] = useState<'en' | 'hi' | 'mr' | 'kn' | 'ta'>('en');

  const variants = {
    en: 'Namaste {{1}} Ji, reminder for your {{2}} session tomorrow at {{3}}, {{4}}. Please tap Confirmed if attending.',
    hi: 'नमस्ते {{1}} जी, कल {{3}} बजे {{4}} में होने वाले आपके {{2}} सत्र का अनुस्मारक। यदि आप आ रहे हैं तो कृपया पुष्टि करें।',
    mr: 'नमस्ते {{1}} जी, उद्या {{3}} वाजता {{4}} येथे होणाऱ्या आपल्या {{2}} सत्राची आठवण। उपस्थित असल्यास कृपया निश्चित करा।',
    kn: 'ನಮಸ್ಕಾರ {{1}} ಜಿ, ನಾಳೆ {{3}} ಗಂಟೆಗೆ {{4}} ನಲ್ಲಿ ನಡೆಯುವ ನಿಮ್ಮ {{2}} ಅಧಿವೇಶನದ ಜ್ಞಾಪನೆ.',
    ta: 'வணக்கம் {{1}} ஜி, நாளை {{3}} மணிக்கு {{4}} நடக்கும் உங்கள் {{2}} அமர்வு பற்றிய நினைவூட்டல்.',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/communication/templates" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Templates
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{id || 'TPL-001'}</span>
      </div>

      <PageHeader
        title="Session Reminder & Venue Notice"
        subtitle="Meta WhatsApp Business API verified template"
      />

      <Card title="Multi-language translations">
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-[var(--border)] pb-2">
            {[
              { key: 'en', label: 'English' },
              { key: 'hi', label: 'हिंदी (Hindi)' },
              { key: 'mr', label: 'मराठी (Marathi)' },
              { key: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
              { key: 'ta', label: 'தமிழ் (Tamil)' },
            ].map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  lang === l.key
                    ? 'bg-[var(--surface-selected)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-sm leading-relaxed font-sans">
            {variants[lang]}
          </div>

          <div className="p-3 rounded bg-[var(--surface-selected)] border border-[var(--border)] text-xs text-[var(--accent)] flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Interactive quick-reply buttons configured: <strong>[ Yes, Attending ]</strong>, <strong>[ Need Transport ]</strong>, <strong>[ Cannot Attend ]</strong></span>
          </div>
        </div>
      </Card>
    </div>
  );
};
