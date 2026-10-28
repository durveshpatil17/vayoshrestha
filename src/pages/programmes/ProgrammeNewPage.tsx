import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Programme } from '@/api/contracts';

export const ProgrammeNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Programme['category']>('Health & Wellness');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [chapters, setChapters] = useState('HUB-PUN, HUB-BLR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProg: Programme = {
      id: `PROG-${Date.now().toString().slice(-4)}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      description: description.trim(),
      targetAudience: targetAudience.trim(),
      chapterIds: chapters.split(',').map((c) => c.trim()).filter(Boolean),
      status: 'Active',
      sessionsCount: 0,
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
    };

    mockStore.updateData((data) => {
      data.programmes = data.programmes || [];
      data.programmes.push(newProg);
    });

    navigate(`/programmes/${newProg.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/programmes" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Programmes
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">New programme</span>
      </div>

      <PageHeader
        title="Create new programme"
        subtitle="Establish an elder engagement or health track across chapters"
      />

      <Card title="Programme definition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Programme code</label>
              <input
                type="text"
                required
                placeholder="e.g. SWASTHYA-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Digital Empowerment">Digital Empowerment</option>
                <option value="Mental Health & Social">Mental Health & Social</option>
                <option value="Financial & Legal">Financial & Legal</option>
                <option value="Recreation & Arts">Recreation & Arts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Programme title</label>
            <input
              type="text"
              required
              placeholder="e.g. Memory & Cognitive Wellbeing Circle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Detailed description</label>
            <textarea
              required
              rows={3}
              placeholder="Objectives, weekly cadence, and expected participant outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Target elder demographic</label>
            <input
              type="text"
              required
              placeholder="e.g. Seniors 65+ experiencing early memory loss or loneliness"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Participating chapter IDs (comma-separated)</label>
            <input
              type="text"
              value={chapters}
              onChange={(e) => setChapters(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/programmes">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save and create programme
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

