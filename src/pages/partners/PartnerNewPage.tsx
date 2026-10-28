import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const PartnerNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState<any>('Clinical / Hospital');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((data) => {
      data.partners = data.partners || [];
      data.partners.push({
        id: `PART-${Date.now().toString().slice(-4)}`,
        name,
        type,
        contactPerson,
        email,
        phone,
        city,
        mouStatus: 'Active',
        activeReferralsCount: 0,
      });
    });
    navigate('/partners');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/partners" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Partners
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Register partner</span>
      </div>

      <PageHeader
        title="Register partner organisation"
        subtitle="Establish an MOU and enable external partner referral portal access"
      />

      <Card title="Partner profile">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Organisation name</label>
            <input
              type="text"
              required
              placeholder="e.g. HealthBridge Geriatric Clinic"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Domain category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Clinical / Hospital">Clinical / Hospital</option>
                <option value="Diagnostic Lab">Diagnostic Lab</option>
                <option value="Mobility Aids">Mobility Aids</option>
                <option value="Legal Aid">Legal Aid</option>
                <option value="Social Services">Social Services</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">City</label>
              <input
                type="text"
                required
                placeholder="e.g. Pune, Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Primary contact person</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajan Pillai"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Official email</label>
              <input
                type="email"
                required
                placeholder="partner@clinic.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Direct phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/partners">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save and issue partner credentials
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

