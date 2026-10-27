import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Star, CheckCircle2 } from 'lucide-react';
import { FeedbackItem } from '@/api/contracts';

export const SeniorFeedbackPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFb: FeedbackItem = {
      id: `fb-self-${Date.now()}`,
      memberId: user?.id || 'm-1',
      memberName: user?.fullName || 'Senior Member',
      programmeId: data.programmes[0]?.id || 'p-1',
      programmeTitle: 'Gentle Yoga & Breathing Circle',
      sessionId: 'sess-recent',
      centreId: 'HUB-PUN',
      rating,
      theme: 'General',
      comment,
      isAssistedEntry: false,
      createdAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.feedback.unshift(newFb);
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-base">
      <PageHeader
        title="Share Your Session Feedback"
        description="Tell us about your experience at Ekta Hub so we can make our programmes more comfortable."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Give Feedback' },
        ]}
      />

      {submitted ? (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-8 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-emerald-900">Dhanyavaad! Thank you for your feedback.</h3>
          <p className="text-sm text-emerald-800">Your comments help us improve every session.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-5 text-sm">
          <div>
            <label className="font-serif text-lg font-bold text-text-primary block mb-2">
              How did you enjoy your recent session?
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform ${star <= rating ? 'text-amber-500 scale-110' : 'text-zinc-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm font-semibold text-text-muted ml-3">{rating} out of 5 stars</span>
            </div>
          </div>

          <div>
            <label className="font-serif text-base font-bold text-text-primary block mb-1">
              Any suggestions or difficulties you experienced?
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. The room was cool and comfortable, but please arrange an extra volunteer near the steps..."
              className="w-full p-3 border border-border-hairline rounded bg-bg-base text-text-primary text-sm focus:ring-1 focus:ring-accent leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" disabled={!comment.trim()}>
              Submit My Feedback
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
