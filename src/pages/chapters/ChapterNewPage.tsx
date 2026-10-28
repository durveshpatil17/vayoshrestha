import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chapter } from '@/api/contracts';

export const ChapterNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [regionId, setRegionId] = useState('REG-W');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('+91');
  const [languages, setLanguages] = useState('English, Marathi, Hindi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newChapter: Chapter = {
      id: `HUB-${code.trim().toUpperCase() || Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      regionId,
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      languagesServed: languages.split(',').map((l) => l.trim()).filter(Boolean),
      status: 'Active',
      onDutyRoster: [
        {
          userId: `u-cm-${Date.now()}`,
          userName: contactPerson.trim(),
          role: 'CM',
          shift: '09:00 - 18:00 IST',
          onCallPhone: contactPhone.trim(),
          isPrimaryResponder: true,
        },
      ],
    };

    mockStore.updateData((data) => {
      data.chapters.push(newChapter);
    });

    navigate(`/chapters/${newChapter.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/chapters" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Chapters
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">New chapter</span>
      </div>

      <PageHeader
        title="Create chapter (Ekta Hub)"
        subtitle="Establish a new community centre under Vayoh Vikas supervision"
      />

      <Card title="Chapter registration details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Chapter code</label>
              <input
                type="text"
                required
                placeholder="e.g. THN, GOA, KOL"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Region</label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="REG-W">West (REG-W)</option>
                <option value="REG-S">South (REG-S)</option>
                <option value="REG-N">North (REG-N)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Chapter / Hub name</label>
            <input
              type="text"
              required
              placeholder="e.g. Thane Ekta Hub (Naupada Centre)"
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
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Facility street address</label>
            <textarea
              required
              rows={2}
              placeholder="Full physical building and road address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Chapter coordinator name</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Emergency contact phone</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Languages served (comma-separated)</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/chapters">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save and activate chapter
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

