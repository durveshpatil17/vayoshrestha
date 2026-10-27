import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Building2, Plus, Search, MapPin, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ServicePartner } from '@/api/contracts';

export const PartnerListPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();
  const [partners, setPartners] = useState<ServicePartner[]>(data.servicePartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = partners.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Approved Community Partner Organizations"
        description="Directory of vetted health clinics, physiotherapy centers, eye care trusts, and legal aid societies (FR-34 & FR-51)"
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Partners' }]}
        actions={
          <Can capability="partners" action="create">
            <Link to="/partners/new">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Register New Partner
              </Button>
            </Link>
          </Can>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search partner name, city, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            <option value="Clinic">Geriatric Clinic</option>
            <option value="Physiotherapy">Physiotherapy</option>
            <option value="Eye Care">Eye Care Trust</option>
            <option value="Legal Aid">Legal Aid Society</option>
            <option value="Pension Helpdesk">Pension Helpdesk</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filtered.length}</strong> partner organization{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base font-semibold text-text-primary">{p.name}</h4>
                  <div className="text-xs font-medium text-accent mt-0.5">{p.category}</div>
                </div>
                <StatusChip
                  label={p.approvalStatus}
                  variant={p.approvalStatus === 'Approved' ? 'active' : p.approvalStatus === 'Pending' ? 'warning' : 'danger'}
                />
              </div>

              <div className="space-y-1.5 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{p.city}, {p.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{p.contactPerson} ({p.phone})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{p.email}</span>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed line-clamp-2 bg-bg-subtle p-2.5 rounded border border-border-hairline">
                {p.notes}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border-hairline flex items-center justify-between text-xs">
              <span className="text-text-muted">
                {p.approvedAt ? `Approved ${p.approvedAt.split('T')[0]}` : 'Pending NM Review'}
              </span>
              <Link to={`/partners/${p.id}`} className="text-accent font-semibold hover:underline">
                View Profile & Services →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
