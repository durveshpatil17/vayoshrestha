import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Lock,
  Building2,
  FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  LEGAL_INTAKE_REGISTRY,
  LEGAL_DISCLAIMER_NOTICE,
  CLOSURE_CODE_LABELS,
  LegalIntakeRecord,
} from '@/domain/legal/legalIntake';

export const LegalIntakeQueuePage: React.FC = () => {
  const [cases] = useState<LegalIntakeRecord[]>(() => [...LEGAL_INTAKE_REGISTRY]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = cases.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.seniorName.toLowerCase().includes(q) ||
        c.partnerFirm.toLowerCase().includes(q) ||
        c.assignedAdvocateName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = cases.filter((c) => c.status !== 'closed').length;
  const closedCount = cases.filter((c) => c.status === 'closed').length;
  const ageBarExclusions = cases.filter((c) => c.closureCode === 'declined_age_bar').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pro-Bono Legal Intake & Elder Rights"
        subtitle="Confidential legal aid queue mediated by verified advocates under the Senior Citizens Act 2007."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Legal Intake' },
        ]}
      />

      {/* Mandatory Statutory Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Statutory Disclaimer & Scope:</span>
          {LEGAL_DISCLAIMER_NOTICE}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Total Legal Inquiries</div>
          <div className="text-2xl font-serif font-semibold text-text-primary">{cases.length}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-brand-primary" />
            2 Verified Legal Aid Partners
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Active In Mediation</div>
          <div className="text-2xl font-serif font-semibold text-brand-primary">{activeCount}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Advocate Assisted
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Resolved & Mediated</div>
          <div className="text-2xl font-serif font-semibold text-emerald-700">{closedCount}</div>
          <div className="text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Maintenance Act & Community
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Policy Evidence (Age-Bar)</div>
          <div className="text-2xl font-serif font-semibold text-text-primary">{ageBarExclusions}</div>
          <div className="text-xs text-text-secondary">Exported to Insurance Dossier</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search case ID, senior, advocate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-bg-canvas border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none"
          >
            <option value="all">All Legal Categories</option>
            <option value="property_inheritance">Property & Eviction</option>
            <option value="maintenance_act">Maintenance Act 2007</option>
            <option value="insurance_exclusion">Insurance Exclusion</option>
            <option value="pension_epfo">Pension & EPFO</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-bg-canvas border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="mediation_active">Mediation Active</option>
            <option value="advocate_review">Advocate Review</option>
            <option value="closed">Closed / Evidence Logged</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-canvas text-text-secondary border-b border-border">
              <tr>
                <th className="p-3.5 font-semibold">Case ID</th>
                <th className="p-3.5 font-semibold">Senior Beneficiary</th>
                <th className="p-3.5 font-semibold">Legal Category</th>
                <th className="p-3.5 font-semibold">Assigned Advocate & Firm</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Policy Evidence Outcome</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-bg-canvas/50 transition-colors">
                  <td className="p-3.5 font-semibold text-brand-primary">
                    <Link to={`/legal-intake/${c.id}`} className="hover:underline">
                      {c.id}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold text-text-primary">
                    {c.seniorName}
                  </td>
                  <td className="p-3.5 capitalize text-text-primary">
                    {c.category.replace('_', ' ')}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-text-primary">{c.assignedAdvocateName}</div>
                    <div className="text-[11px] text-text-secondary">{c.partnerFirm}</div>
                  </td>
                  <td className="p-3.5">
                    {c.status === 'mediation_active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-brand-primary rounded font-medium">
                        <Clock className="w-3 h-3" />
                        Mediation Active
                      </span>
                    )}
                    {c.status === 'closed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-text-secondary max-w-xs truncate">
                    {c.closureCode ? (
                      <span className="font-medium text-text-primary" title={CLOSURE_CODE_LABELS[c.closureCode]}>
                        {CLOSURE_CODE_LABELS[c.closureCode]}
                      </span>
                    ) : (
                      <span className="italic">Case in progress</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/legal-intake/${c.id}`}
                      className="text-brand-primary hover:underline font-semibold flex items-center justify-end gap-1"
                    >
                      View Case
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
