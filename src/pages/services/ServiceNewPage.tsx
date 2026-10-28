import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ServiceNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Clinical Care');
  const [description, setDescription] = useState('');
  const [partnerName, setPartnerName] = useState('HealthBridge Geriatric Care');
  const [costType, setCostType] = useState<'Free' | 'Subsidised' | 'Fee_for_service'>('Subsidised');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('+91');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((data) => {
      data.services = data.services || [];
      data.services.push({
        id: `SRV-${Date.now().toString().slice(-4)}`,
        name,
        category,
        description,
        partnerId: 'PART-001',
        partnerName,
        costType,
        contactPerson,
        contactPhone,
        activeStatus: 'Active',
      });
    });
    navigate('/services');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/services" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Services
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">New service</span>
      </div>

      <PageHeader
        title="Add service to catalogue"
        subtitle="Catalog partner services available for senior referral and support"
      />

      <Card title="Service details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Service name</label>
            <input
              type="text"
              required
              placeholder="e.g. Geriatric Home Physiotherapy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Clinical Care">Clinical Care</option>
                <option value="Assistive Devices">Assistive Devices</option>
                <option value="Vision Care">Vision Care</option>
                <option value="Legal & Financial">Legal & Financial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Cost to senior</label>
              <select
                value={costType}
                onChange={(e) => setCostType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Free">Free / Fully funded</option>
                <option value="Subsidised">Subsidised by NGO</option>
                <option value="Fee_for_service">Fee for service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Scope of service, eligibility, and booking instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Partner contact person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Partner contact phone</label>
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
            <Link to="/services">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Save service
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

