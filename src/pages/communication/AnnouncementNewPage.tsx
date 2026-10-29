import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Users, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const AnnouncementNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('ALL');
  const [language, setLanguage] = useState('ALL');
  const [message, setMessage] = useState('');

  const estimatedRecipients = chapter === 'ALL' ? 420 : chapter === 'HUB-PUN' ? 142 : 98;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/communication/announcements');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/communication/announcements" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Announcements
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">New broadcast</span>
      </div>

      <PageHeader
        title="Broadcast builder"
        subtitle="Filter eligible recipients and send targeted bulletins within daily volume caps"
      />

      <Card title="1. Audience builder">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target chapter</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="ALL">All Chapters (Organisation-wide)</option>
              <option value="HUB-PUN">Pune Ekta Hub</option>
              <option value="HUB-NSK">Nashik Ekta Hub</option>
              <option value="HUB-BLR">Bengaluru Ekta Hub</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Language preference</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="ALL">All registered languages</option>
              <option value="Marathi">Marathi only</option>
              <option value="Hindi">Hindi only</option>
              <option value="Kannada">Kannada only</option>
              <option value="English">English only</option>
            </select>
          </div>
        </div>

        <div className="mt-3 p-3 rounded bg-surface-subtle text-xs text-text-secondary flex items-center justify-between">
          <span>Estimated active opted-in recipients:</span>
          <span className="text-sm font-semibold text-text tabular-nums">{estimatedRecipients} elders</span>
        </div>
      </Card>

      <Card title="2. Bulletin content">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Announcement headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Free Senior Eye Camp Scheduled This Friday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Message copy</label>
            <textarea
              required
              rows={4}
              placeholder="Enter announcement text to be broadcasted to elders..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-text-secondary">
              Scheduled messages adhere to 07:00 – 21:00 IST quiet hours.
            </span>
            <Button variant="primary" type="submit" icon={<Send size={16} />}>
              Queue broadcast ({estimatedRecipients} elders)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

