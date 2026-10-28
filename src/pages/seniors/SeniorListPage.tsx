import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { ExportDialog } from '@/components/data/ExportDialog';
import { maskPhoneNumber } from '@/domain/masking';
import { maskAbhaNumber } from '@/domain/abha';
import {
  Users,
  Search,
  Filter,
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
    // 1. Scope filter
    if (!allowedChapters.includes(s.chapterId)) return false;

    // 2. Dropdown filters
    if (chapterFilter !== 'all' && s.chapterId !== chapterFilter) return false;
    if (languageFilter !== 'all' && s.primaryLanguage !== languageFilter) return false;
    const hasAbha = s.abha?.status === 'provided_unverified' || s.abha?.verificationStatus === 'ProvidedUnverified' || !!s.abha?.number || !!s.abha?.abhaNumber;
    if (abhaFilter === 'provided' && !hasAbha) return false;
    if (abhaFilter === 'not_provided' && hasAbha) return false;
    const hasConsent = s.consentRecorded || !!s.consent?.generalCommunications;
    if (consentFilter === 'opted_out' && hasConsent) return false;
    if (consentFilter === 'active' && !hasConsent) return false;

    // 3. Search query
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
    <div className="space-y-6">
      <PageHeader
        title={`Registered Senior Citizens (${filtered.length.toLocaleString()})`}
        description="Comprehensive directory of senior citizens enrolled in Vayoshreshtha across assigned chapters."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Senior Citizens' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => setExportOpen(true)}
            >
              Export Directory
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/onboarding/new')}
            >
              Assisted Onboarding
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-1 min-w-[280px] max-w-md relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, ID (VV-PUN...), or phone..."
            className="w-full bg-bg-subtle border border-border-hairline rounded pl-9 pr-3 py-1.5 text-xs text-text-primary focus:bg-white focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center text-xs">
          {/* Chapter Filter */}
          {allowedChapters.length > 1 && (
            <select
              value={chapterFilter}
              onChange={(e) => {
                setChapterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-bg-subtle border border-border-hairline rounded px-2.5 py-1.5 text-text-primary"
            >
              <option value="all">All Chapters</option>
              {data.chapters
                .filter((c) => allowedChapters.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          )}

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-bg-subtle border border-border-hairline rounded px-2.5 py-1.5 text-text-primary"
          >
            <option value="all">All Languages</option>
            <option value="Marathi">Marathi</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Kannada">Kannada</option>
            <option value="Tamil">Tamil</option>
          </select>

          {/* ABHA Filter */}
          <select
            value={abhaFilter}
            onChange={(e) => {
              setAbhaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-bg-subtle border border-border-hairline rounded px-2.5 py-1.5 text-text-primary"
          >
            <option value="all">ABHA: All</option>
            <option value="provided">ABHA: Provided (Phase 2)</option>
            <option value="not_provided">ABHA: Not Provided</option>
          </select>

          {/* Consent Filter */}
          <select
            value={consentFilter}
            onChange={(e) => {
              setConsentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-bg-subtle border border-border-hairline rounded px-2.5 py-1.5 text-text-primary"
          >
            <option value="all">Consent: All</option>
            <option value="active">Consent: Active</option>
            <option value="opted_out">Consent: Opted Out</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-subtle text-text-muted font-semibold border-b border-border-hairline">
              <tr>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Senior Name</th>
                <th className="px-4 py-3">Age Band</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Chapter</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Emergency NOK</th>
                <th className="px-4 py-3">ABHA (Phase 2)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-muted">
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
                      className="hover:bg-bg-subtle/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-accent">
                        {senior.memberId || senior.membershipId}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-primary">
                        <div>{senior.fullName}</div>
                        {senior.isAssistedRegistration && (
                          <span className="text-[10px] text-text-muted font-normal">Assisted by volunteer</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-text-muted">
                        {senior.ageBand || (senior.age ? `${senior.age} yrs` : 'Senior')}
                      </td>
                      <td className="px-4 py-3 font-mono text-text-primary">
                        {displayPhone}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {senior.chapterId}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {senior.preferredLanguage || senior.primaryLanguage}
                      </td>
                      <td className="px-4 py-3">
                        {primaryNok ? (
                          <div>
                            <span className="text-text-primary font-medium">{primaryNok.name}</span>
                            <span className="text-[10px] text-text-muted block">({primaryNok.relationship})</span>
                          </div>
                        ) : (
                          <span className="text-danger flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {senior.abha?.number || senior.abha?.abhaNumber ? (
                          <span className="text-[11px] text-accent">
                            {maskAbhaNumber(senior.abha?.number || senior.abha?.abhaNumber || '')}
                          </span>
                        ) : (
                          <span className="text-text-disabled text-[11px]">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {senior.consentRecorded || senior.consent?.generalCommunications ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-bg-subtle text-text-muted border border-border-hairline">
                            <XCircle className="w-3 h-3" /> Opted Out
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
        <div className="p-3 border-t border-border-hairline bg-bg-subtle/50 flex items-center justify-between text-xs text-text-muted">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length.toLocaleString()} seniors
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
            <span className="font-mono">
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
