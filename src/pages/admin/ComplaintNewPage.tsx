import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ComplaintNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [category, setCategory] = useState<any>('Service_Quality');
  const [chapterId, setChapterId] = useState('HUB-PUN');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((data) => {
      data.complaints = data.complaints || [];
      data.complaints.push({
        id: `CMP-${Date.now().toString().slice(-4)}`,
        complainantName: name,
        complainantPhone: phone,
        chapterId,
        category,
        description,
        status: 'Open',
        submittedAt: new Date().toISOString(),
      });
    });
    navigate('/admin/complaints');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/admin/complaints" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Complaints
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Lodge grievance</span>
      </div>

      <PageHeader
        title="Lodge elder or caregiver grievance"
        subtitle="Confidential complaint intake managed under NGO Management oversight"
      />

      <Card title="Grievance details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Complainant name</label>
              <input
                type="text"
                required
                placeholder="Senior, family member, or neighbor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Contact phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Service_Quality">Service Quality</option>
                <option value="Staff_Behavior">Staff / Volunteer Behavior</option>
                <option value="Transport">Transportation & Mobility</option>
                <option value="Facilities">Hub Facilities & Cleanliness</option>
                <option value="Data_Privacy">Data Privacy & Consent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Ekta Hub chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="HUB-PUN">Pune Ekta Hub</option>
                <option value="HUB-NSK">Nashik Ekta Hub</option>
                <option value="HUB-BLR">Bengaluru Ekta Hub</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Grievance description</label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact event details, dates, and names of individuals involved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/admin/complaints">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Submit grievance ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
