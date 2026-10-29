import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldAlert,
  ArrowRight,
  Eye,
  CheckCircle2,
  Building,
  HeartPulse,
  Scale,
  Award,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  createImpactPack,
  TEMPLATE_CONFIGS,
  PackTemplateId,
  PackAudience,
  WATERMARK_TEXT,
} from '@/domain/telemetry/packBuilder';
import { useAuthStore } from '@/store/authStore';

export const ImpactPackNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedTemplate, setSelectedTemplate] = useState<PackTemplateId>('csr_impact_brief');
  const [title, setTitle] = useState<string>('Q4 2026 Maharashtra CSR Impact & Outreach Dossier');
  const [audience, setAudience] = useState<PackAudience>('CSR');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [summary, setSummary] = useState<string>(
    'Comprehensive aggregated telemetry certifying senior citizen reach, hub engagement, and volunteer hours across all operating chapters.'
  );
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleTemplateSelect = (templateId: PackTemplateId) => {
    setSelectedTemplate(templateId);
    const config = TEMPLATE_CONFIGS[templateId];
    setAudience(config.defaultAudience);
    if (templateId === 'csr_impact_brief') {
      setTitle('Q4 2026 Maharashtra CSR Impact & Outreach Dossier');
      setSummary('Comprehensive aggregated telemetry certifying senior citizen reach, hub engagement, and volunteer hours.');
    } else if (templateId === 'govt_health_brief') {
      setTitle('Senior Cohort Vaccination & Vital Control Brief (Maharashtra)');
      setSummary('Empirical 90-day vital stability and vaccination coverage indicators stripped of clinical identifiers.');
    } else if (templateId === 'insurance_age_bar_evidence') {
      setTitle('Insurance Age-Bar Exclusion Evidence Study (Ages 65-85)');
      setSummary('Aggregated analysis of 400+ excluded applicants demonstrating high medication adherence and vital stability.');
    } else if (templateId === 'elder_protection_evidence') {
      setTitle('Elder Protection & Pro-Bono Legal Rights Annual Dossier');
      setSummary('Turnaround and resolution metrics for civil disputes, property mediation, and maintenance petitions.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const pack = await createImpactPack({
        title,
        templateId: selectedTemplate,
        audience,
        chapterFilter,
        summary,
        dateRange: { start: startDate, end: endDate },
        creator: {
          id: user?.id || 'usr-pm-1',
          name: user?.name || 'Pooja Verma',
          role: user?.role || 'PM',
        },
      });
      navigate(`/telemetry/packs/${pack.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTemplate = TEMPLATE_CONFIGS[selectedTemplate];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Impact Pack"
        subtitle="Select a policy template, configure audience scoping, and generate a draft for review."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Telemetry', href: '/telemetry' },
          { label: 'Impact Packs', href: '/telemetry/packs' },
          { label: 'New Pack' },
        ]}
      />

      {/* Mandatory Notice */}
      <div className="p-4 bg-emerald-50 border border-accent/20 rounded-xl flex items-center justify-between text-xs text-accent">
        <span className="font-semibold">
          Maker-Checker Protocol: Newly created packs remain in Draft status until approved and cryptographically sealed by a National Manager.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text">
              1. Select Impact Pack Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTemplateSelect('csr_impact_brief')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedTemplate === 'csr_impact_brief'
                    ? 'border-accent bg-emerald-50/30'
                    : 'border-border hover:border-text-secondary/40'
                }`}
              >
                <Building className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs font-semibold text-text">CSR Impact Brief</div>
                <div className="text-xs text-text-secondary mt-1">
                  Hub reach, volunteer hours, welfare aid, voucher redemptions.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateSelect('govt_health_brief')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedTemplate === 'govt_health_brief'
                    ? 'border-accent bg-emerald-50/30'
                    : 'border-border hover:border-text-secondary/40'
                }`}
              >
                <HeartPulse className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs font-semibold text-text">Government Health Brief</div>
                <div className="text-xs text-text-secondary mt-1">
                  Vaccination status, 90-day BP control, non-clinical aggregates.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateSelect('insurance_age_bar_evidence')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedTemplate === 'insurance_age_bar_evidence'
                    ? 'border-accent bg-emerald-50/30'
                    : 'border-border hover:border-text-secondary/40'
                }`}
              >
                <Award className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs font-semibold text-text">Insurance Age-Bar Dossier</div>
                <div className="text-xs text-text-secondary mt-1">
                  Empirical vital stability and adherence in age 65–85 excluded seniors.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateSelect('elder_protection_evidence')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedTemplate === 'elder_protection_evidence'
                    ? 'border-accent bg-emerald-50/30'
                    : 'border-border hover:border-text-secondary/40'
                }`}
              >
                <Scale className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs font-semibold text-text">Elder Protection Dossier</div>
                <div className="text-xs text-text-secondary mt-1">
                  Pro-bono legal inquiries, property disputes, turnaround times.
                </div>
              </button>
            </div>
          </div>

          {/* Metadata Configuration */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text">
              2. Dossier Details & Scoping
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Pack Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as PackAudience)}
                  className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none"
                >
                  <option value="CSR">CSR Donors & Foundations</option>
                  <option value="Government">Government & ABDM Officials</option>
                  <option value="Insurance">Insurance Underwriters & Actuaries</option>
                  <option value="Legal">Legal Aid Networks & Regulators</option>
                  <option value="Public">Public Transparency Report</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Chapter Scope</label>
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none"
                >
                  <option value="all">All Chapters (9 Ekta Hubs)</option>
                  <option value="pune">Pune Chapters Only</option>
                  <option value="mumbai">Mumbai Chapters Only</option>
                  <option value="nagpur">Nagpur Chapters Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Reporting Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Reporting End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Executive Summary</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/telemetry/packs')}
                className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Creating...' : 'Create Draft Pack'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-accent text-xs font-semibold">
              <Eye className="w-4 h-4" />
              <span>Dossier Live Preview</span>
            </div>

            <div className="p-4 bg-page border border-border rounded-lg space-y-3 relative overflow-hidden">
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded font-semibold text-center">
                {WATERMARK_TEXT}
              </div>

              <div>
                <div className="text-xs text-accent font-semibold">{audience} Evidence Pack</div>
                <h4 className="text-sm  font-semibold text-text mt-0.5">{title}</h4>
                <p className="text-xs text-text-secondary mt-1">{summary}</p>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-xs font-semibold text-text-secondary">Included Metrics:</div>
                <div className="space-y-1.5">
                  {Object.entries(currentTemplate.standardMetrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-text-secondary ">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold text-text">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                <span>Privacy: k ≥ 5 Applied</span>
                <span className="font-semibold text-accent">Draft (Unsealed)</span>
              </div>
            </div>

            <div className="text-xs text-text-secondary flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                Once submitted for review, the pack is locked against edits and reviewed by the National Manager.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
