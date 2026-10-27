import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { HeartPulse, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ServiceItem } from '@/api/contracts';

export const ServiceEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const isEditing = Boolean(id && id !== 'new');
  const existingService = isEditing ? data.services.find((s) => s.id === id) : null;

  const [title, setTitle] = useState(existingService?.title || '');
  const [partnerId, setPartnerId] = useState(existingService?.partnerId || data.servicePartners[0]?.id || '');
  const [category, setCategory] = useState(existingService?.category || 'Clinical Assessment');
  const [description, setDescription] = useState(existingService?.description || '');
  const [eligibility, setEligibility] = useState(existingService?.eligibility || 'Senior citizens aged 60+');
  const [availableDays, setAvailableDays] = useState<string[]>(existingService?.availableDays || ['Monday', 'Wednesday']);
  const [centresServed, setCentresServed] = useState<string[]>(existingService?.centresServed || ['HUB-PUN']);
  const [submitted, setSubmitted] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = data.servicePartners.find((p) => p.id === partnerId);

    const srv: ServiceItem = {
      id: existingService?.id || `srv-${Date.now()}`,
      partnerId,
      partnerName: partner?.name || 'Partner Organization',
      title,
      category,
      description,
      eligibility,
      availableDays,
      centresServed,
      status: user?.role === 'NM' ? 'Approved' : 'Pending',
    };

    mockStore.updateData((draft) => {
      if (isEditing) {
        const idx = draft.services.findIndex((s) => s.id === srv.id);
        if (idx !== -1) draft.services[idx] = srv;
      } else {
        draft.services.push(srv);
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'PM',
      isEditing ? 'UPDATE' : 'CREATE',
      'ServiceItem',
      srv.id,
      `${isEditing ? 'Updated' : 'Created'} service item: ${title}`,
      existingService,
      srv,
      undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/services');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEditing ? `Edit Service: ${existingService?.title}` : 'Add Community Partner Service'}
        description="Configure structured consultation or assistance offering provided by approved partners (FR-30)"
        breadcrumb={[
          { label: 'Services', href: '/services' },
          { label: isEditing ? 'Edit' : 'New' },
        ]}
        actions={
          <Link to="/services">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Catalogue
            </Button>
          </Link>
        }
      />

      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong>Non-Clinical Governance Notice:</strong> All descriptions must use non-clinical, community-support language.
          Services are strictly delivered by independent approved professionals and not by Vayoh Vikas field volunteers.
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Service Record Saved!</h3>
          <p className="text-xs text-emerald-800">Redirecting to service catalogue...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Service Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Geriatric Mobility & Joint Health Consultation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Approved Partner Organization</label>
                <select
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  {data.servicePartners.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Specialty Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Clinical Assessment">Clinical Assessment</option>
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Legal Aid">Legal Aid</option>
                  <option value="Eye Care">Eye Care</option>
                  <option value="Pension Helpdesk">Pension Helpdesk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Service Scope & Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurs during the consultation and any required materials/records..."
                className="w-full text-xs border border-border-hairline rounded p-3 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Eligibility Criteria</label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Seniors 60+ experiencing mobility difficulty"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Available Days */}
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">Weekly Consultation Days</label>
              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={availableDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) setAvailableDays([...availableDays, day]);
                        else setAvailableDays(availableDays.filter((d) => d !== day));
                      }}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Centres Served */}
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">Ekta Hubs Served</label>
              <div className="flex flex-wrap gap-3">
                {data.centres.map((c) => (
                  <label key={c.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={centresServed.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) setCentresServed([...centresServed, c.id]);
                        else setCentresServed(centresServed.filter((id) => id !== c.id));
                      }}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/services')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Submit Service
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
