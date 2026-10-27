import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { MessageSquare, Bell, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';

export const SeniorMessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>('inbox');
  const [preferredLang, setPreferredLang] = useState('Marathi');
  const [allowReminders, setAllowReminders] = useState(true);
  const [allowAnnouncements, setAllowAnnouncements] = useState(true);
  const [allowHealthAlerts, setAllowHealthAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  // Filter messages for senior
  const myAnnouncements = data.announcements.filter((a) => a.status === 'Approved' || a.status === 'Sent');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-base">
      <PageHeader
        title="Messages & Communication Preferences"
        description="Review community notices and manage your WhatsApp notification choices."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Messages' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border-hairline gap-6">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`pb-3 text-base font-medium border-b-2 transition-colors ${
            activeTab === 'inbox'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Message Inbox ({myAnnouncements.length})
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 text-base font-medium border-b-2 transition-colors ${
            activeTab === 'preferences'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          WhatsApp Communication Settings
        </button>
      </div>

      {activeTab === 'inbox' ? (
        <div className="space-y-4">
          {myAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-bg-base border-2 border-border-hairline rounded-lg p-5 space-y-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-lg font-bold text-text-primary">{ann.title}</h3>
                <span className="text-xs font-mono text-text-muted">{ann.scheduledFor.split('T')[0]}</span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed bg-bg-subtle p-3 rounded">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSavePreferences} className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-5 text-sm">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Communication preferences updated.</span>
            </div>
          )}

          <div>
            <label className="font-bold text-text-primary block mb-2">Preferred WhatsApp Language</label>
            <div className="flex gap-4">
              {['Marathi', 'Hindi', 'English'].map((lang) => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer text-base">
                  <input
                    type="radio"
                    name="lang"
                    checked={preferredLang === lang}
                    onChange={() => setPreferredLang(lang)}
                    className="text-accent focus:ring-accent"
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border-hairline space-y-3">
            <span className="font-bold text-text-primary block">Notification Categories</span>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowReminders}
                onChange={(e) => setAllowReminders(e.target.checked)}
                className="mt-1 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-medium text-text-primary">Session Reminders (24h before activity)</div>
                <div className="text-xs text-text-muted">Receive timing, room number, and facilitator details.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowAnnouncements}
                onChange={(e) => setAllowAnnouncements(e.target.checked)}
                className="mt-1 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-medium text-text-primary">Hub Festivals & Community Events</div>
                <div className="text-xs text-text-muted">Notices about celebrations, cultural meets, and holiday schedules.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowHealthAlerts}
                onChange={(e) => setAllowHealthAlerts(e.target.checked)}
                className="mt-1 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-medium text-text-primary">Health Awareness & Doctor Camps</div>
                <div className="text-xs text-text-muted">Information about free eye tests, dental checkups, and consultations.</div>
              </div>
            </label>
          </div>

          <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted">
            You can also opt out anytime by replying <strong>"STOP"</strong> directly to any message on WhatsApp.
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Preferences
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
