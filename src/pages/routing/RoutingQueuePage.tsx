import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitMerge,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Building2,
  HeartPulse,
  Scale,
  DollarSign,
  Truck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SERVICE_REQUESTS,
  PARTNER_REGISTRY,
  ServiceCategory,
  ServiceRoutingRequest,
} from '@/domain/routing/engine';

export const RoutingQueuePage: React.FC = () => {
  const [requests] = useState<ServiceRoutingRequest[]>(() => SERVICE_REQUESTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRequests = requests.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.seniorName.toLowerCase().includes(q) ||
        (r.assignedPartnerName && r.assignedPartnerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalAssigned = requests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length;
  const slaBreachedCount = requests.filter((r) => r.status === 'sla_breached').length;
  const autoRoutedPercent = '96.2%';

  const getCategoryIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case 'hospital':
        return <HeartPulse className="w-4 h-4 text-accent" />;
      case 'diagnostic_lab':
        return <Building2 className="w-4 h-4 text-accent" />;
      case 'legal':
        return <Scale className="w-4 h-4 text-accent" />;
      case 'financial':
        return <DollarSign className="w-4 h-4 text-accent" />;
      case 'transport':
        return <Truck className="w-4 h-4 text-accent" />;
      default:
        return <GitMerge className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Routing Fabric"
        subtitle="Deterministic capacity-aware intake routing, load balancing, and transparent decision records."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partners', href: '/partners' },
          { label: 'Routing Fabric' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/routing/rules"
              className="px-3 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-accent" />
              Routing Rules & Simulator
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Active Requests in Routing</div>
          <div className="text-2xl  font-semibold text-text">{requests.length}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <GitMerge className="w-3.5 h-3.5 text-accent" />
            Across 5 Service Domains
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Auto-Routed Deterministically</div>
          <div className="text-2xl  font-semibold text-accent">{autoRoutedPercent}</div>
          <div className="text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Decision records recorded
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Assigned & In Progress</div>
          <div className="text-2xl  font-semibold text-text">{totalAssigned}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent" />
            Within SLA window
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">SLA Attention Required</div>
          <div className={`text-2xl  font-semibold ${slaBreachedCount > 0 ? 'text-negative' : 'text-text'}`}>
            {slaBreachedCount}
          </div>
          <div className="text-xs text-negative flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Requires manual re-route
          </div>
        </div>
      </div>

      {/* Real-time Partner Capacity Strips */}
      <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent" />
            Partner Network Real-Time Capacity & Load
          </h3>
          <span className="text-xs text-text-secondary">Load-balancing active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PARTNER_REGISTRY.map((ptn) => {
            const usagePercent = Math.round((ptn.currentActiveAssigned / ptn.dailyMaxCapacity) * 100);
            const isFull = ptn.currentActiveAssigned >= ptn.dailyMaxCapacity;
            return (
              <div key={ptn.id} className="p-3 border border-border rounded-lg bg-page space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text truncate" title={ptn.name}>
                    {ptn.name}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${isFull ? 'bg-red-50 text-negative' : 'bg-emerald-50 text-accent'}`}>
                    {isFull ? 'Full' : `${usagePercent}%`}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Load: {ptn.currentActiveAssigned} / {ptn.dailyMaxCapacity}</span>
                    <span>SLA: {ptn.slaHours}h</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${isFull ? 'bg-negative' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search request ID, senior, partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-page border border-border rounded-lg px-2.5 py-1.5 text-text focus:outline-none"
          >
            <option value="all">All Domains</option>
            <option value="hospital">Hospital Care</option>
            <option value="diagnostic_lab">Diagnostic Lab</option>
            <option value="legal">Legal Aid</option>
            <option value="financial">Financial / Pension</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-page border border-border rounded-lg px-2.5 py-1.5 text-text focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="sla_breached">SLA Breached</option>
            <option value="reassigned">Reassigned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-page text-text-secondary border-b border-border">
              <tr>
                <th className="p-3.5 font-semibold">Request ID</th>
                <th className="p-3.5 font-semibold">Senior Citizen</th>
                <th className="p-3.5 font-semibold">Domain</th>
                <th className="p-3.5 font-semibold">Region / Language</th>
                <th className="p-3.5 font-semibold">Assigned Partner</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No routing requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-page/50 transition-colors">
                    <td className="p-3.5 font-semibold text-accent">
                      <Link to={`/routing/requests/${req.id}`} className="hover:underline">
                        {req.id}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-text">{req.seniorName}</div>
                      <div className="text-xs text-text-secondary">{req.seniorPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5  text-text">
                        {getCategoryIcon(req.category)}
                        <span>{req.category.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-text-secondary">
                      <span className="">{req.region}</span> · {req.language}
                    </td>
                    <td className="p-3.5 font-semibold text-text">
                      {req.assignedPartnerName || <span className="text-text-secondary italic">Unassigned</span>}
                    </td>
                    <td className="p-3.5">
                      {req.status === 'assigned' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-accent" />
                          Assigned
                        </span>
                      )}
                      {req.status === 'sla_breached' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-negative rounded font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          SLA Breached
                        </span>
                      )}
                      {req.status === 'reassigned' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-semibold">
                          <Clock className="w-3 h-3" />
                          Reassigned
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/routing/requests/${req.id}`}
                        className="text-accent hover:underline font-semibold inline-flex items-center justify-end gap-1 whitespace-nowrap"
                      >
                        Decision Record
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
