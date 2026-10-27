import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Send, ArrowLeft, Users, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Announcement } from '@/api/contracts';

export const AnnouncementNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Event');
  const [targetCentre, setTargetCentre] = useState<string>('ALL');
  const [targetLanguage, setTargetLanguage] = useState<string>('All');
  const [targetAgeBand, setTargetAgeBand] = useState<string>('All');
  const [scheduledDate, setScheduledDate] = useState('2026-10-31');
  const [submitted, setSubmitted] = useState(false);

  // Audience calculation with consent filtering (FR-27 & FR-29)
  const audienceMetrics = useMemo(() => {
    let eligible = 0;
    let noConsent = 0;
    let optedOut = 0;

    data.seniorCitizens.forEach((s) => {
      // Centre filter
      if (targetCentre !== 'ALL' && s.centreId !== targetCentre) return;
      // Language filter
      if (targetLanguage !== 'All' && s.preferredLanguage !== targetLanguage) return;

      // Consent check
      if (s.optedOutChannels && s.optedOutChannels.includes('WhatsApp')) {
        optedOut++;
      } else if (s.consentStatus !== 'OptedIn') {
        noConsent++;
      } else {
        eligible++;
      }
    });

    return { eligible, noConsent, optedOut, totalMatching: eligible + noConsent + optedOut };
  }, [data.seniorCitizens, targetCentre, targetLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      category,
      targetCentres: targetCentre === 'ALL' ? ['ALL'] : [targetCentre],
      targetLanguages: targetLanguage === 'All' ? ['English', 'Hindi', 'Marathi'] : [targetLanguage],
      audienceSize: audienceMetrics.eligible,
      excludedNoConsent: audienceMetrics.noConsent,
      excludedOptedOut: audienceMetrics.optedOut,
      scheduledFor: `${scheduledDate}T10:00:00Z`,
      status: 'Submitted',
      submittedBy: user?.fullName || 'Programme Team',
      submittedAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.announcements.unshift(newAnnouncement);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'PM',
      'CREATE',
      'Announcement',
      newAnnouncement.id,
      `Submitted announcement for review: ${title} (${audienceMetrics.eligible} target recipients)`,
      null,
      newAnnouncement,
      undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/communication/announcements');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Compose Broadcast Announcement"
        description="Craft an accessible WhatsApp broadcast message with automated consent and opt-out filtering (FR-27)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Announcements', href: '/communication/announcements' },
          { label: 'Compose' },
        ]}
        actions={
          <Link to="/communication/announcements">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Announcements
            </Button>
          </Link>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Broadcast Announcement Submitted!</h3>
          <p className="text-xs text-emerald-800">
            Forwarded to NGO Management (NM) for maker-checker approval. Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Content Form */}
          <div className="md:col-span-7 bg-bg-base border border-border-hairline rounded p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Campaign Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Health & Eye Checkup Camp This Sunday"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Event">Community Event</option>
                  <option value="HealthAlert">Health Awareness Alert</option>
                  <option value="Closure">Centre Holiday / Closure</option>
                  <option value="General">General Welfare Notice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Scheduled Transmission Date</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-primary">Announcement Message Body</label>
                <span className="text-[11px] text-text-muted">{content.length} / 1000 chars</span>
              </div>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Namaste elders, this Sunday Ekta Hub is organizing... Reply STOP to opt out."
                className="w-full text-xs border border-border-hairline rounded p-3 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            {/* Audience Builder Filters */}
            <div className="pt-2 border-t border-border-hairline space-y-3">
              <h4 className="font-serif text-sm font-semibold text-text-primary">Audience Targeting Filters</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Target Ekta Hub</label>
                  <select
                    value={targetCentre}
                    onChange={(e) => setTargetCentre(e.target.value)}
                    className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                  >
                    <option value="ALL">All 6 Ekta Hubs</option>
                    {data.centres.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Language Preference</label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                  >
                    <option value="All">All Languages</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate('/communication/announcements')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!title || !content || audienceMetrics.eligible === 0}>
                <Send className="w-4 h-4 mr-1.5" />
                Submit for NM Approval ({audienceMetrics.eligible} Recipients)
              </Button>
            </div>
          </div>

          {/* Audience Breakdown & Consent Summary Side Rail */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border-hairline pb-3">
                <Users className="w-4 h-4 text-accent" />
                <h4 className="font-serif text-sm font-semibold text-text-primary">Audience & Consent Breakdown</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="font-medium">Eligible with Valid Consent:</span>
                  <span className="font-bold text-sm">{audienceMetrics.eligible} Elders</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  <span>Excluded (No Consent on Record):</span>
                  <span className="font-semibold">{audienceMetrics.noConsent} Elders</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-rose-50 text-rose-900 border border-rose-200">
                  <span>Excluded (Explicit Opt-out STOP):</span>
                  <span className="font-semibold">{audienceMetrics.optedOut} Elders</span>
                </div>

                <div className="pt-2 border-t border-border-hairline flex items-center justify-between text-text-muted">
                  <span>Total Matching Filter Pool:</span>
                  <span className="font-mono">{audienceMetrics.totalMatching} Elders</span>
                </div>
              </div>

              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Consent Enforcement (FR-27 & FR-29):</strong> The system guarantees that messages are never
                  dispatched to senior citizens who have not granted digital consent or who have opted out.
                </span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
