import React, { useState } from 'react';
import { Calendar, MessageSquare, Heart, User, HelpCircle, PhoneCall, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const ScPortal: React.FC = () => {
  const [largeText, setLargeText] = useState(false);

  return (
    <div className={`max-w-3xl mx-auto space-y-6 py-6 px-4 ${largeText ? 'text-lg' : 'text-base'}`}>
      <div className="bg-surface rounded-xl border border-[var(--border)] p-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-[var(--text)]">
            Namaste, Kamala Ji 🙏
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Ekta Hub: <strong>Pune Centre</strong> • Member ID: <span className="tabular-nums">VV-PUN-0012</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLargeText(!largeText)}
          icon={<Type size={16} />}
        >
          {largeText ? 'Normal text' : 'Larger text'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            to: '/me/programmes',
            icon: <Calendar size={28} className="text-[var(--accent)]" />,
            title: 'My programmes & sessions',
            desc: 'View your upcoming community activities and register for new sessions.',
          },
          {
            to: '/me/messages',
            icon: <MessageSquare size={28} className="text-[var(--accent)]" />,
            title: 'Messages & announcements',
            desc: 'Updates from your Ekta Hub coordinator and wellness reminders.',
          },
          {
            to: '/me/health',
            icon: <Heart size={28} className="text-[var(--accent)]" />,
            title: 'Health & vitals records',
            desc: 'Your blood pressure, glucose readings, and medication schedule.',
          },
          {
            to: '/me/profile',
            icon: <User size={28} className="text-[var(--accent)]" />,
            title: 'My profile & emergency contacts',
            desc: 'Your emergency contacts, address, and language preferences.',
          },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="block bg-surface p-5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors min-h-[120px]"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-[var(--surface-subtle)] shrink-0">
                {card.icon}
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text)] font-sans">{card.title}</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-serif font-semibold text-[var(--text)] mb-3">Need assistance?</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Your Ekta Hub coordinator is here to support you at any time.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="tel:+919820011223">
            <Button variant="primary" icon={<PhoneCall size={18} />}>
              Call Pune Hub Coordinator
            </Button>
          </a>
          <Link to="/me/help">
            <Button variant="outline" icon={<HelpCircle size={18} />}>
              Help & FAQ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
