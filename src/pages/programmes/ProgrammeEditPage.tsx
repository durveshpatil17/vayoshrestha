import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ProgrammeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockStore.getData();
  const programme = data.programmes.find((p) => p.id === id) || data.programmes[0];

  const [name, setName] = useState(programme?.name || '');
  const [description, setDescription] = useState(programme?.description || '');
  const [targetAudience, setTargetAudience] = useState(programme?.targetAudience || '');
  const [status, setStatus] = useState(programme?.status || 'Active');

  if (!programme) {
    return (
      <div className="p-8 text-center">
        <h2>Programme not found</h2>
        <Link to="/programmes">Back</Link>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((d) => {
      const p = d.programmes.find((x) => x.id === programme.id);
      if (p) {
        p.name = name;
        p.description = description;
        p.targetAudience = targetAudience;
        p.status = status as any;
      }
    });
    navigate(`/programmes/${programme.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to={`/programmes/${programme.id}`} className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> {programme.name}
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Edit</span>
      </div>

      <PageHeader
        title={`Edit ${programme.name}`}
        subtitle="Update programme curriculum and operational settings"
      />

      <Card title="Programme configuration">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Programme title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target demographic</label>
            <input
              type="text"
              required
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link to={`/programmes/${programme.id}`}>
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
