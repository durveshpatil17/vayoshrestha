import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Building2 } from 'lucide-react';

export const CentreNewEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const existing = id ? data.centres.find((c) => c.id === id) : null;

  const [name, setName] = useState(existing?.name || '');
  const [code, setCode] = useState(existing?.code || '');
  const [city, setCity] = useState(existing?.city || 'Pune');
  const [state, setState] = useState(existing?.state || 'Maharashtra');
  const [address, setAddress] = useState(existing?.address || '');
  const [contactPerson, setContactPerson] = useState(existing?.contactPerson || '');
  const [contactPhone, setContactPhone] = useState(existing?.contactPhone || '');
  const [seatingCapacity, setSeatingCapacity] = useState(existing?.seatingCapacity || 40);
  const [operatingSchedule, setOperatingSchedule] = useState(existing?.operatingSchedule || 'Mon-Sat 08:30 - 18:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (existing) {
      mockStore.updateData((draft) => {
        const c = draft.centres.find((x) => x.id === existing.id);
        if (c) {
          c.name = name;
          c.code = code.toUpperCase();
          c.city = city;
          c.state = state;
          c.address = address;
          c.contactPerson = contactPerson;
          c.contactPhone = contactPhone;
          c.seatingCapacity = Number(seatingCapacity);
          c.operatingSchedule = operatingSchedule;
        }
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'Administrator',
        user?.role || 'SA',
        'UPDATE',
        'EktaHub',
        existing.id,
        'Updated centre profile and capacity details'
      );
    } else {
      const newCentre = {
        id: `HUB-${code.toUpperCase()}`,
        code: code.toUpperCase(),
        name,
        city,
        state,
        address,
        contactPerson,
        contactPhone,
        seatingCapacity: Number(seatingCapacity),
        facilities: ['Wheelchair Ramp', 'Accessible Restroom', 'Medical Kit', 'Water Station'],
        operatingSchedule,
        status: 'Active' as const,
      };

      mockStore.updateData((draft) => {
        draft.centres.push(newCentre);
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'Administrator',
        user?.role || 'SA',
        'CREATE',
        'EktaHub',
        newCentre.id,
        `Established new Ekta Hub ${newCentre.name}`
      );
    }

    navigate('/centres');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title={existing ? `Edit ${existing.name}` : 'Establish New Ekta Hub'}
        description="Configure community centre operating parameters, capacity limits, and local coordinator assignment."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Centres', to: '/centres' },
          { label: existing ? existing.name : 'New Hub' },
        ]}
      />

      <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-4 text-xs">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Input
              label="Ekta Hub Name"
              placeholder="e.g. Ekta Hub Kothrud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="3-Letter Hub Code"
              placeholder="e.g. KOT"
              maxLength={3}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        <Input
          label="Physical Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Designated Coordinator"
            placeholder="Coordinator full name"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
          <Input
            label="Contact Helpline"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hall Seating Capacity"
            type="number"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(Number(e.target.value))}
            required
          />
          <Input
            label="Operating Schedule"
            value={operatingSchedule}
            onChange={(e) => setOperatingSchedule(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
          <Button variant="outline" size="md" onClick={() => navigate('/centres')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {existing ? 'Save Hub Details' : 'Create Ekta Hub'}
          </Button>
        </div>
      </form>
    </div>
  );
};
