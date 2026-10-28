import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Star } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const FeedbackNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [seniorName, setSeniorName] = useState('Kamala Devi (SEN-001)');
  const [programmeName, setProgrammeName] = useState('Swasthya Seva — Geriatric Preventive Health');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [channel, setChannel] = useState<'In_Person' | 'WhatsApp' | 'IVR'>('In_Person');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((data) => {
      data.feedbackRecords = data.feedbackRecords || [];
      data.feedbackRecords.push({
        id: `FB-${Date.now().toString().slice(-4)}`,
        seniorId: 'SEN-001',
        seniorName: seniorName.split('(')[0].trim(),
        chapterId: 'HUB-PUN',
        programmeName,
        rating,
        satisfactionCategory: rating >= 4 ? 'Excellent' : rating === 3 ? 'Average' : 'Needs_Improvement',
        feedbackText,
        submittedAt: new Date().toISOString(),
        channel,
      });
    });
    navigate('/feedback');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/feedback" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Feedback
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Record response</span>
      </div>

      <PageHeader
        title="Record elder feedback"
        subtitle="Log verbal feedback or survey cards submitted at Ekta Hub sessions"
      />

      <Card title="Survey response entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Senior member</label>
            <input
              type="text"
              required
              value={seniorName}
              onChange={(e) => setSeniorName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Programme attended</label>
              <select
                value={programmeName}
                onChange={(e) => setProgrammeName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Swasthya Seva — Geriatric Preventive Health">Swasthya Seva</option>
                <option value="Digital Sahayata — Smartphone Independence">Digital Sahayata</option>
                <option value="Ananda Sangam — Social Circle">Ananda Sangam</option>
                <option value="General Facility Feedback">General Facility Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="In_Person">In-person session interview</option>
                <option value="WhatsApp">WhatsApp micro-survey reply</option>
                <option value="IVR">Voice IVR check-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Overall rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded border transition-colors ${
                    rating >= star
                      ? 'bg-[var(--surface-selected)] text-[var(--positive)] border-[var(--positive)]'
                      : 'bg-surface text-[var(--text-disabled)] border-[var(--border)]'
                  }`}
                >
                  <Star size={18} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Elder comments & suggestions</label>
            <textarea
              required
              rows={3}
              placeholder="Verbatim comments, praises, or concerns..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/feedback">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save feedback
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
