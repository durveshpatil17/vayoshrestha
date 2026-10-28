import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ChapterEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = mockStore.getData();
  const chapter = data.chapters.find((c) => c.id === id) || data.chapters[0];

  const [name, setName] = useState(chapter?.name || '');
  const [city, setCity] = useState(chapter?.city || '');
  const [state, setState] = useState(chapter?.state || '');
  const [address, setAddress] = useState(chapter?.address || '');
  const [contactPerson, setContactPerson] = useState(chapter?.contactPerson || '');
  const [contactPhone, setContactPhone] = useState(chapter?.contactPhone || '');
  const [status, setStatus] = useState(chapter?.status || 'Active');

  if (!chapter) {
    return (
      <div className="p-8 text-center">
        <h2>Chapter not found</h2>
        <Link to="/chapters">Back</Link>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((d) => {
      const c = d.chapters.find((x) => x.id === chapter.id);
      if (c) {
        c.name = name;
        c.city = city;
        c.state = state;
        c.address = address;
        c.contactPerson = contactPerson;
        c.contactPhone = contactPhone;
        c.status = status;
      }
    });
    navigate(`/chapters/${chapter.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to={`/chapters/${chapter.id}`} className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> {chapter.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Edit</span>
      </div>

      <PageHeader
        title={`Edit ${chapter.name}`}
        subtitle="Update chapter facility information and operational details"
      />

      <Card title="Chapter configuration">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Chapter name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Street address</label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Coordinator name</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Phone</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to={`/chapters/${chapter.id}`}>
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
