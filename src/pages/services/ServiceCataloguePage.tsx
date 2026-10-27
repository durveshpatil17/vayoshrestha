import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { HeartPulse, Plus, Search, Building2, Calendar, ShieldAlert, ArrowRight } from 'lucide-react';

export const ServiceCataloguePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const services = data.services.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.partnerName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Senior Services & Consultations Catalogue"
        description="Vetted external community partner services, clinical assessments, physiotherapy, and legal aid (FR-30)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/referrals">
              <Button variant="outline" size="sm">
                Active Referrals
              </Button>
            </Link>
            <Can capability="servicesCatalogue" action="create">
              <Link to="/services/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add New Service
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      {/* Mandatory Non-Clinical Notice (Hard constraint) */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded flex items-start gap-3 text-xs text-text-muted">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Important Non-Clinical Notice:</strong> Vayoshreshtha does not diagnose or give clinical advice.
          Health-related requests and consultations are routed to qualified independent professionals and approved partner clinics.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search service title, partner, or specialty..."
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
            <option value="all">All Specialties</option>
            <option value="Clinical Assessment">Clinical Assessment</option>
            <option value="Physiotherapy">Physiotherapy</option>
            <option value="Legal Aid">Legal Aid</option>
            <option value="Eye Care">Eye Care</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{services.length}</strong> approved service{services.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base font-semibold text-text-primary">{srv.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-accent" />
                    <span>{srv.partnerName}</span>
                  </div>
                </div>
                <StatusChip label={srv.status} variant="active" />
              </div>

              <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                {srv.description}
              </p>

              <div className="space-y-1.5 text-xs text-text-muted bg-bg-subtle p-3 rounded border border-border-hairline">
                <div><strong>Eligibility:</strong> {srv.eligibility}</div>
                <div><strong>Available Days:</strong> {srv.availableDays.join(', ')}</div>
                <div>
                  <strong>Centres Served:</strong>{' '}
                  {srv.centresServed.map((cId) => data.centres.find((c) => c.id === cId)?.code || cId).join(', ')}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border-hairline flex items-center justify-between">
              <Link to={`/services/${srv.id}`} className="text-xs text-text-muted hover:text-text-primary">
                View Details
              </Link>
              <Link to={`/referrals/new?serviceId=${srv.id}`}>
                <Button variant="primary" size="sm" className="text-xs">
                  Create Referral Request <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
