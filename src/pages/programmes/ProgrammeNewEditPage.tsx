import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';

export const ProgrammeNewEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const existing = id ? data.programmes.find((p) => p.id === id) : null;
  const centres = data.centres;

  const [title, setTitle] = useState(existing?.title || '');
  const [category, setCategory] = useState<any>(existing?.category || 'Yoga & Wellness');
  const [description, setDescription] = useState(existing?.description || '');
  const [eligibility, setEligibility] = useState(existing?.eligibility || 'Ages 60+, self-paced');
  const [capacity, setCapacity] = useState(existing?.capacityPerSession || 25);
  const [waitlistEnabled, setWaitlistEnabled] = useState(existing ? existing.waitlistEnabled : true);
  const [walkInsAllowed, setWalkInsAllowed] = useState(existing ? existing.walkInsAllowed : true);
  const [assignedCentres, setAssignedCentres] = useState<string[]>(existing?.assignedCentres || centres.map((c) => c.id));

  const toggleCentre = (centreId: string) => {
    if (assignedCentres.includes(centreId)) {
      setAssignedCentres(assignedCentres.filter((c) => c !== centreId));
    } else {
      setAssignedCentres([...assignedCentres, centreId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (existing) {
      mockStore.updateData((draft) => {
        const p = draft.programmes.find((x) => x.id === existing.id);
        if (p) {
          p.title = title;
          p.category = category;
          p.description = description;
          p.eligibility = eligibility;
          p.capacityPerSession = Number(capacity);
          p.waitlistEnabled = waitlistEnabled;
          p.walkInsAllowed = walkInsAllowed;
          p.assignedCentres = assignedCentres;
        }
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'Programme Manager',
        user?.role || 'PM',
        'UPDATE',
        'Programme',
        existing.id,
        'Updated programme curriculum and capacity rules'
      );
    } else {
      const newProg = {
        id: `prog-${Date.now()}`,
        title,
        category,
        description,
        eligibility,
        capacityPerSession: Number(capacity),
        waitlistEnabled,
        walkInsAllowed,
        assignedCentres,
        status: 'Ongoing' as const,
        createdAt: new Date().toISOString(),
      };

      mockStore.updateData((draft) => {
        draft.programmes.unshift(newProg);
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'Programme Manager',
        user?.role || 'PM',
        'CREATE',
        'Programme',
        newProg.id,
        `Created new structured programme ${newProg.title}`
      );
    }

    navigate('/programmes');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title={existing ? `Edit ${existing.title}` : 'Create Structured Programme'}
        description="Configure activity curriculum, eligibility criteria, waitlist thresholds, and hub assignments."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Programmes', to: '/programmes' },
          { label: existing ? existing.title : 'New Programme' },
        ]}
      />

      <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-4 text-xs">
        <Input
          label="Programme Title"
          placeholder="e.g. Gentle Morning Yoga & Joint Mobility"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'Yoga & Wellness', label: 'Yoga & Wellness' },
              { value: 'Digital Literacy', label: 'Digital Literacy' },
              { value: 'Health Camp', label: 'Health Camp' },
              { value: 'Legal Aid', label: 'Legal Aid' },
              { value: 'Social Meet', label: 'Social Meet' },
              { value: 'Nutrition', label: 'Nutrition' },
            ]}
          />
          <Input
            label="Capacity Limit per Session"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-primary block mb-1">
            Curriculum Description (Sanitized)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded bg-bg-base border border-border-strong text-text-primary text-xs p-3 focus:outline-none focus:border-accent"
            placeholder="Detailed description of activities and eldercare outcomes..."
            required
          />
        </div>

        <Input
          label="Eligibility Criteria"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          placeholder="e.g. Registered elders aged 60+, self-paced"
          required
        />

        {/* Policies: Waitlist & Walk-in */}
        <div className="p-4 bg-bg-subtle rounded border border-border-hairline space-y-3">
          <span className="font-semibold text-text-primary block">Registration Policies (FR-17, FR-18)</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={waitlistEnabled}
                onChange={(e) => setWaitlistEnabled(e.target.checked)}
                className="rounded border-border-strong text-accent focus:ring-accent"
              />
              <span>Enable Automatic Waitlist when Full</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={walkInsAllowed}
                onChange={(e) => setWalkInsAllowed(e.target.checked)}
                className="rounded border-border-strong text-accent focus:ring-accent"
              />
              <span>Allow On-the-Day Walk-In Attendees</span>
            </label>
          </div>
        </div>

        {/* Assigned Centres */}
        <div className="pt-2">
          <span className="font-semibold text-text-primary block mb-2">Assigned Ekta Hubs (FR-16)</span>
          <div className="grid grid-cols-2 gap-2">
            {centres.map((c) => (
              <label key={c.id} className="flex items-center gap-2 p-2 rounded border border-border-hairline cursor-pointer hover:bg-bg-subtle">
                <input
                  type="checkbox"
                  checked={assignedCentres.includes(c.id)}
                  onChange={() => toggleCentre(c.id)}
                  className="rounded border-border-strong text-accent focus:ring-accent"
                />
                <span className="text-text-primary">{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
          <Button variant="outline" size="md" onClick={() => navigate('/programmes')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {existing ? 'Save Programme' : 'Publish Programme'}
          </Button>
        </div>
      </form>
    </div>
  );
};
