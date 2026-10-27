import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Building2, MapPin, Phone, Mail, CheckCircle2, XCircle, ArrowLeft, Calendar, FileText } from 'lucide-react';
import { ServicePartner } from '@/api/contracts';

export const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const isNew = id === 'new';
  const partner = !isNew ? data.servicePartners.find((p) => p.id === id) : null;

  const [name, setName] = useState(partner?.name || '');
  const [category, setCategory] = useState<ServicePartner['category']>(partner?.category || 'Clinic');
  const [contactPerson, setContactPerson] = useState(partner?.contactPerson || '');
  const [email, setEmail] = useState(partner?.email || '');
  const [phone, setPhone] = useState(partner?.phone || '');
  const [address, setAddress] = useState(partner?.address || '');
  const [city, setCity] = useState(partner?.city || 'Pune');
  const [notes, setNotes] = useState(partner?.notes || '');
  const [submitted, setSubmitted] = useState(false);

  const partnerServices = !isNew ? data.services.filter((s) => s.partnerId === partner?.id) : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const p: ServicePartner = {
      id: partner?.id || `sp-${Date.now()}`,
      name,
      category,
      contactPerson,
      email,
      phone,
      address,
      city,
      approvalStatus: user?.role === 'NM' ? 'Approved' : (partner?.approvalStatus || 'Pending'),
      approvedAt: user?.role === 'NM' ? new Date().toISOString() : partner?.approvedAt,
      notes,
    };

    mockStore.updateData((draft) => {
      if (partner) {
        const idx = draft.servicePartners.findIndex((item) => item.id === p.id);
        if (idx !== -1) draft.servicePartners[idx] = p;
      } else {
        draft.servicePartners.push(p);
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'PM',
      partner ? 'UPDATE' : 'CREATE',
      'ServicePartner',
      p.id,
      `${partner ? 'Updated' : 'Registered'} service partner: ${name}`,
      partner,
      p,
      undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/partners');
    }, 1200);
  };

  const handleApprovalChange = (newStatus: 'Approved' | 'Suspended') => {
    if (!partner || user?.role !== 'NM') return;

    mockStore.updateData((draft) => {
      const target = draft.servicePartners.find((item) => item.id === partner.id);
      if (target) {
        target.approvalStatus = newStatus;
        if (newStatus === 'Approved') target.approvedAt = new Date().toISOString();
      }
    });

    mockStore.writeAudit(
      user.id,
      user.fullName,
      'NM',
      'APPROVE',
      'ServicePartner',
      partner.id,
      `${newStatus === 'Approved' ? 'Approved' : 'Suspended'} partner organization: ${partner.name}`,
      { status: partner.approvalStatus },
      { status: newStatus },
      undefined
    );

    navigate('/partners');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={isNew ? 'Register Partner Organization' : partner?.name || 'Partner Profile'}
        description={isNew ? 'Submit partner credential documentation for NGO review' : `${partner?.category} • ${partner?.city}`}
        breadcrumb={[
          { label: 'Services', href: '/services' },
          { label: 'Partners', href: '/partners' },
          { label: isNew ? 'New' : partner?.name || 'Details' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/partners">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Directory
              </Button>
            </Link>
            {!isNew && partner && user?.role === 'NM' && (
              <>
                {partner.approvalStatus !== 'Approved' && (
                  <Button variant="primary" size="sm" onClick={() => handleApprovalChange('Approved')}>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approve Partner (NM)
                  </Button>
                )}
                {partner.approvalStatus === 'Approved' && (
                  <Button variant="danger" size="sm" onClick={() => handleApprovalChange('Suspended')}>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Suspend Partner
                  </Button>
                )}
              </>
            )}
          </div>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Partner Details Recorded!</h3>
          <p className="text-xs text-emerald-800">Redirecting to directory...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-bg-base border border-border-hairline rounded p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary">Organization Profile</h3>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pune Geriatric Healthcare Trust"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Specialty Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Clinic">Geriatric Clinic</option>
                  <option value="Physiotherapy">Physiotherapy Center</option>
                  <option value="Eye Care">Eye Care Trust</option>
                  <option value="Legal Aid">Legal Aid Society</option>
                  <option value="Pension Helpdesk">Pension Helpdesk</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Dr. Anand Dighe"
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Phone Number (+91)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9822011223"
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@partnerclinic.in"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Physical Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot/Street address"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Operational Notes & MoU Terms</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Consultation days, charitable subsidy terms, volunteer liaison details..."
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border-hairline">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate('/partners')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Partner Details
              </Button>
            </div>
          </div>

          {/* Right Rail: Associated Services & Compliance Status */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-3 shadow-sm">
              <h4 className="font-serif text-sm font-semibold text-text-primary">Approval Status</h4>
              <div className="flex items-center gap-2">
                <StatusChip
                  label={partner?.approvalStatus || 'Pending'}
                  variant={partner?.approvalStatus === 'Approved' ? 'active' : 'warning'}
                />
                <span className="text-xs text-text-muted">
                  {partner?.approvedAt ? `Since ${partner.approvedAt.split('T')[0]}` : 'Awaiting Review'}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Referrals cannot be dispatched to partners whose status is Pending or Suspended (FR-51).
              </p>
            </div>

            {!isNew && (
              <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-border-hairline pb-2">
                  <h4 className="font-serif text-sm font-semibold text-text-primary">Offered Services</h4>
                  <Link to="/services/new" className="text-xs text-accent font-semibold hover:underline">+ Add</Link>
                </div>
                {partnerServices.length === 0 ? (
                  <p className="text-xs text-text-muted">No specific services configured under this partner yet.</p>
                ) : (
                  <div className="space-y-2">
                    {partnerServices.map((srv) => (
                      <div key={srv.id} className="p-2.5 bg-bg-subtle rounded border border-border-hairline text-xs">
                        <div className="font-medium text-text-primary">{srv.title}</div>
                        <div className="text-text-muted text-[11px]">{srv.category} • {srv.availableDays.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
