import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ExportDialog } from '@/components/data/ExportDialog';
import { maskPhoneNumber } from '@/domain/masking';
import { maskAbhaNumber } from '@/domain/abha';
import {
  Search,
  Download,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const SeniorListPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [search, setSearch] = useState('');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [abhaFilter, setAbhaFilter] = useState('all');
  const [consentFilter, setConsentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);
  const pageSize = 25;

  // Scope isolation:
  const allowedChapters = user?.role === 'RA'
    ? data.chapters.filter((c) => !user.assignedRegion || c.regionId === user.assignedRegion).map((c) => c.id)
    : user?.role === 'CM' || user?.role === 'VF'
    ? [user.assignedChapter || user.assignedCentres[0]]
    : data.chapters.map((c) => c.id);

  const filtered = data.seniorCitizens.filter((s) => {
    if (!allowedChapters.includes(s.chapterId)) return false;

    if (chapterFilter !== 'all' && s.chapterId !== chapterFilter) return false;
    if (languageFilter !== 'all' && s.primaryLanguage !== languageFilter) return false;
    const hasAbha = s.abha?.status === 'provided_unverified' || s.abha?.verificationStatus === 'ProvidedUnverified' || Boolean(s.abha?.number) || Boolean(s.abha?.abhaNumber);
    if (abhaFilter === 'provided' && !hasAbha) return false;
    if (abhaFilter === 'not_provided' && hasAbha) return false;
    const hasConsent = s.consentRecorded || Boolean(s.consent?.generalCommunications);
    if (consentFilter === 'opted_out' && hasConsent) return false;
    if (consentFilter === 'active' && !hasConsent) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = s.fullName.toLowerCase().includes(q);
      const matchId = (s.memberId || s.membershipId || '').toLowerCase().includes(q);
      const matchPhone = (s.phoneNumber || s.phone || '').includes(q);
      if (!matchName && !matchId && !matchPhone) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={`Registered senior citizens (${filtered.length.toLocaleString()})`}
        description="Comprehensive directory of senior citizens enrolled in Vayoshreshtha across assigned chapters."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Senior citizens' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4 stroke-[1.5]" />}
              onClick={() => setExportOpen(true)}
            >
              Export directory
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4 stroke-[1.5]" />}
              onClick={() => navigate('/onboarding/new')}
            >
              Assisted onboarding
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-1 min-w-64 max-w-md relative">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5 stroke-[1.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, ID (VV-PUN...), or phone..."
            className="w-full bg-surface-subtle border border-border rounded-control pl-9 pr-3 py-1.5 text-xs text-text focus:bg-surface focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center text-xs">
          {user?.role !== 'CM' && user?.role !== 'VF' && (
            <select
              value={chapterFilter}
              onChange={(e) => {
                setChapterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface border border-border rounded-control px-2.5 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All chapters</option>
              {data.chapters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-surface border border-border rounded-control px-2.5 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All languages</option>
            <option value="Marathi">Marathi</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Kannada">Kannada</option>
            <option value="Tamil">Tamil</option>
          </select>

          <select
            value={abhaFilter}
            onChange={(e) => {
              setAbhaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-surface border border-border rounded-control px-2.5 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All ABHA statuses</option>
            <option value="provided">ABHA provided</option>
            <option value="not_provided">Not provided</option>
          </select>

          <select
            value={consentFilter}
            onChange={(e) => {
              setConsentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-surface border border-border rounded-control px-2.5 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All consent statuses</option>
            <option value="active">Active consent</option>
            <option value="opted_out">Opted out</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-surface border border-border rounded-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-normal">
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Full legal name</th>
                <th className="px-4 py-3">Age band</th>
                <th className="px-4 py-3">Mobile (+91)</th>
                <th className="px-4 py-3">Chapter</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Primary emergency contact</th>
                <th className="px-4 py-3">ABHA number</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-secondary">
                    No senior citizens matched your search and filter criteria.
                  </td>
                </tr>
              ) : (
                pagedItems.map((senior) => {
                  const rawPhone = senior.phoneNumber || senior.phone || '';
                  const displayPhone =
                    user?.role === 'VF' ? maskPhoneNumber(rawPhone) : rawPhone;
                  const primaryNok = senior.emergencyContacts?.[0];

                  return (
                    <tr
                      key={senior.id}
                      onClick={() => navigate(`/seniors/${senior.id}`)}
                      className="hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 tabular-nums font-semibold text-accent">
                        {senior.memberId || senior.membershipId}
                      </td>
                      <td className="px-4 py-3 font-semibold text-text">
                        <div>{senior.fullName}</div>
                        {senior.isAssistedRegistration && (
                          <span className="text-xs text-text-secondary font-normal">Assisted by volunteer</span>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">
                        {senior.ageBand || (senior.age ? `${senior.age} yrs` : 'Senior')}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-text">
                        {displayPhone}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {senior.chapterId}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {senior.preferredLanguage || senior.primaryLanguage}
                      </td>
                      <td className="px-4 py-3">
                        {primaryNok ? (
                          <div>
                            <span className="text-text font-semibold">{primaryNok.name}</span>
                            <span className="text-xs text-text-secondary block">({primaryNok.relationship})</span>
                          </div>
                        ) : (
                          <span className="text-negative flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-3 h-3 stroke-[1.5]" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {senior.abha?.number || senior.abha?.abhaNumber ? (
                          <span className="text-xs text-accent font-semibold">
                            {maskAbhaNumber(senior.abha?.number || senior.abha?.abhaNumber || '')}
                          </span>
                        ) : (
                          <span className="text-text-disabled text-xs">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {senior.consentRecorded || senior.consent?.generalCommunications ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-xs font-semibold bg-positive-tint text-positive">
                            <CheckCircle2 className="w-3 h-3 stroke-[1.5]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-xs font-semibold bg-surface-subtle text-text-secondary border border-border">
                            <XCircle className="w-3 h-3 stroke-[1.5]" /> Opted out
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border-subtle bg-surface-subtle flex items-center justify-between text-xs text-text-secondary">
          <div>
            Showing <span className="tabular-nums font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="tabular-nums font-semibold">{Math.min(currentPage * pageSize, filtered.length)}</span> of{' '}
            <span className="tabular-nums font-semibold">{filtered.length.toLocaleString()}</span> seniors
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        datasetName="SENIOR"
        data={filtered}
      />
    </div>
  );
};
