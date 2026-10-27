import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, CheckCircle2, Star, UserCheck } from 'lucide-react';
import { FeedbackItem } from '@/api/contracts';

export const FeedbackNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [memberId, setMemberId] = useState('');
  const [programmeId, setProgrammeId] = useState(data.programmes[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [theme, setTheme] = useState<FeedbackItem['theme']>('Instructor');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = data.seniorCitizens.find((m) => m.id === memberId);
    const programme = data.programmes.find((p) => p.id === programmeId);
    if (!member || !programme) return;

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      programmeId: programme.id,
      programmeTitle: programme.title,
      sessionId: 'sess-recent',
      centreId: member.centreId,
      rating,
      theme,
      comment,
      isAssistedEntry: true,
      recordedBy: `${user?.fullName || 'Volunteer Staff'} (${user?.role || 'VF'})`,
      createdAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.feedback.unshift(newFeedback);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'VF',
      'CREATE',
      'FeedbackItem',
      newFeedback.id,
      `Assisted feedback entry recorded for ${member.fullName}`,
      null,
      newFeedback,
      member.centreId
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/feedback');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Assisted Senior Feedback Entry"
        description="Record verbal feedback spoken by senior citizens during or immediately after Ekta Hub sessions (FR-35)"
        breadcrumb={[
          { label: 'Feedback', href: '/feedback' },
          { label: 'Assisted Entry' },
        ]}
        actions={
          <Link to="/feedback">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Feedback
            </Button>
          </Link>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Feedback Successfully Logged!</h3>
          <p className="text-xs text-emerald-800">Redirecting to feedback directory...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Senior Citizen Participant</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="">-- Choose registered senior citizen --</option>
                {data.seniorCitizens.slice(0, 30).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.membershipId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Programme Attended</label>
              <select
                value={programmeId}
                onChange={(e) => setProgrammeId(e.target.value)}
                required
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                {data.programmes.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">Elder's Rating Score (1 to 5 Stars)</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-transform ${star <= rating ? 'text-amber-500 scale-110' : 'text-zinc-300'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-medium text-text-muted ml-2">{rating} out of 5 stars</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Primary Theme Mentioned</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="Instructor">Instructor Guidance & Patience</option>
                <option value="Venue">Venue, Seating & Accessibility</option>
                <option value="Content">Programme Content & Clarity</option>
                <option value="Assistance">Volunteer Physical Assistance</option>
                <option value="General">General Well-being Experience</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Elder's Spoken Comment / Volunteer Summary
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Verbatim or summarized remarks spoken by the senior citizen..."
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-hairline">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/feedback')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!memberId || !comment.trim()}>
              Save Assisted Feedback
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
