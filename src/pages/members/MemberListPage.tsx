import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/data/DataTable';
import { FilterBar, FilterConfig } from '@/components/data/FilterBar';
import { ExportDialog } from '@/components/data/ExportDialog';
import { RevealPhoneModal } from '@/components/ui/RevealPhoneModal';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { SeniorCitizen } from '@/api/contracts';
import { useNavigate } from 'react-router-dom';
import { maskPhoneNumber, dobToAgeBand } from '@/domain/masking';
import { UserPlus, Download, Eye, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const MemberListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeCentreId } = useAuthStore();
  const rawMembers = mockStore.getData().seniorCitizens;
  const centres = mockStore.getData().centres;

  // Scope Filtering: CC & VF only see assigned centres
  const scopedMembers = useMemo(() => {
    if (user?.role === 'CC' || user?.role === 'VF') {
      const allowed = user.assignedCentres || [];
      return rawMembers.filter((m) => allowed.includes(m.centreId));
    }
    return rawMembers;
  }, [rawMembers, user]);

  // Filters State
  const [search, setSearch] = useState('');
  const [centreFilter, setCentreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [consentFilter, setConsentFilter] = useState('ALL');
  const [assistedFilter, setAssistedFilter] = useState('ALL');

  // Selected for Bulk Action
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  // Modals State
  const [exportOpen, setExportOpen] = useState(false);
  const [revealModal, setRevealModal] = useState<{
    open: boolean;
    memberId: string;
    memberName: string;
    phone: string;
  }>({ open: false, memberId: '', memberName: '', phone: '' });

  const [revealedPhones, setRevealedPhones] = useState<Record<string, string>>({});

  // Filter application
  const filteredMembers = useMemo(() => {
    return scopedMembers.filter((m) => {
      if (centreFilter !== 'ALL' && m.centreId !== centreFilter) return false;
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
      if (languageFilter !== 'ALL' && m.primaryLanguage !== languageFilter) return false;
      if (consentFilter !== 'ALL' && m.consentStatus !== consentFilter) return false;
      if (assistedFilter !== 'ALL') {
        const isAssisted = assistedFilter === 'YES';
        if (m.isAssistedRegistration !== isAssisted) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = m.fullName.toLowerCase().includes(q);
        const matchesId = m.membershipId.toLowerCase().includes(q);
        const matchesPhone = m.phone.includes(q);
        if (!matchesName && !matchesId && !matchesPhone) return false;
      }
      return true;
    });
  }, [scopedMembers, centreFilter, statusFilter, languageFilter, consentFilter, assistedFilter, search]);

  const handleRevealClick = (m: SeniorCitizen) => {
    setRevealModal({
      open: true,
      memberId: m.id,
      memberName: m.fullName,
      phone: m.phone,
    });
  };

  const handlePhoneRevealed = (phone: string) => {
    setRevealedPhones((prev) => ({ ...prev, [revealModal.memberId]: phone }));
  };

  // Bulk Actions
  const handleBulkReminder = () => {
    setBulkActionSuccess(`Consent reminders queued for ${selectedIds.length} selected members.`);
    setSelectedIds([]);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  // Table Columns
  const columns: Column<SeniorCitizen>[] = [
    {
      key: 'membershipId',
      header: 'Membership ID',
      sortable: true,
      render: (m) => (
        <span className="font-mono text-xs font-semibold text-text-primary">
          {m.membershipId}
        </span>
      ),
    },
    {
      key: 'fullName',
      header: 'Full Name',
      sortable: true,
      render: (m) => (
        <div>
          <button
            onClick={() => navigate(`/members/${m.id}`)}
            className="font-semibold text-text-primary hover:text-accent hover:underline text-left block"
          >
            {m.fullName}
          </button>
          <span className="text-[11px] text-text-muted">
            Age {2026 - new Date(m.dateOfBirth).getFullYear()} ({m.gender})
          </span>
        </div>
      ),
    },
    {
      key: 'centreId',
      header: 'Ekta Hub',
      sortable: true,
      render: (m) => (
        <span className="text-xs font-medium text-text-primary">
          {centres.find((c) => c.id === m.centreId)?.name.replace('Ekta Hub ', '') || m.centreId}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: (m) => {
        const isRevealed = revealedPhones[m.id];
        const isStaffMasked = user?.role === 'VF';

        if (isRevealed) {
          return <span className="font-mono text-xs text-text-primary font-bold">{isRevealed}</span>;
        }

        if (isStaffMasked) {
          return (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-text-muted">{maskPhoneNumber(m.phone)}</span>
              <button
                onClick={() => handleRevealClick(m)}
                className="p-1 hover:bg-bg-subtle text-accent rounded"
                title="Audit and reveal phone"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }

        return <span className="font-mono text-xs text-text-primary">{m.phone}</span>;
      },
    },
    {
      key: 'consentStatus',
      header: 'Consent',
      sortable: true,
      render: (m) => (
        <StatusChip
          label={m.consentStatus}
          variant={m.consentStatus === 'OptedIn' ? 'active' : m.consentStatus === 'Pending' ? 'pending' : 'opted-out'}
        />
      ),
    },
    {
      key: 'status',
      header: 'Activity Status',
      sortable: true,
      render: (m) => (
        <StatusChip
          label={m.status}
          variant={m.status === 'Active' ? 'active' : m.status === 'Registered' ? 'registered' : 'opted-out'}
        />
      ),
    },
    {
      key: 'isAssistedRegistration',
      header: 'Assisted',
      render: (m) => (
        <span className="text-[11px] text-text-muted">
          {m.isAssistedRegistration ? 'Yes (Volunteer)' : 'Self'}
        </span>
      ),
    },
  ];

  // Filters Configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: 'centre',
      label: 'Hubs',
      value: centreFilter,
      onChange: setCentreFilter,
      options: centres.map((c) => ({ value: c.id, label: c.name.replace('Ekta Hub ', '') })),
    },
    {
      id: 'status',
      label: 'Activity',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'Active', label: 'Active (30d)' },
        { value: 'Registered', label: 'Registered Only' },
        { value: 'OptedOut', label: 'Opted Out' },
      ],
    },
    {
      id: 'consent',
      label: 'Consent',
      value: consentFilter,
      onChange: setConsentFilter,
      options: [
        { value: 'OptedIn', label: 'Opted In' },
        { value: 'Pending', label: 'Pending Consent' },
        { value: 'OptedOut', label: 'Opted Out' },
      ],
    },
    {
      id: 'language',
      label: 'Language',
      value: languageFilter,
      onChange: setLanguageFilter,
      options: [
        { value: 'Marathi', label: 'Marathi' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'English', label: 'English' },
        { value: 'Gujarati', label: 'Gujarati' },
      ],
    },
  ];

  const hasActiveFilters =
    centreFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    languageFilter !== 'ALL' ||
    consentFilter !== 'ALL' ||
    assistedFilter !== 'ALL' ||
    search !== '';

  const handleResetFilters = () => {
    setCentreFilter('ALL');
    setStatusFilter('ALL');
    setLanguageFilter('ALL');
    setConsentFilter('ALL');
    setAssistedFilter('ALL');
    setSearch('');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Senior Citizen Directory (${filteredMembers.length})`}
        description="Comprehensive member registry across Ekta Hubs. Supports assisted intake, consent tracking, and phone unmasking."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Senior Citizens' }]}
        primaryAction={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => setExportOpen(true)}
            >
              Export Gated Dataset
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/members/new')}
            >
              Register Senior Citizen
            </Button>
          </div>
        }
      />

      {bulkActionSuccess && (
        <div className="p-3 bg-success-bg text-success text-xs rounded border border-success/30 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{bulkActionSuccess}</span>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-accent text-white rounded flex items-center justify-between text-xs shadow-md">
          <span className="font-medium">
            {selectedIds.length} senior citizens selected
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleBulkReminder}>
              Send Consent Reminder
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-white hover:bg-accent-hover">
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter by name, ID (e.g. VV-PUN-26-00001), or phone..."
        filters={filterConfigs}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Virtualized Data Table */}
      <DataTable
        columns={columns}
        data={filteredMembers}
        keyExtractor={(m) => m.id}
        selectable={true}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        initialPageSize={25}
        rowActions={(m) => (
          <Button
            variant="ghost"
            size="sm"
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/members/${m.id}`)}
          >
            View
          </Button>
        )}
      />

      {/* Audited Phone Reveal Modal */}
      <RevealPhoneModal
        isOpen={revealModal.open}
        onClose={() => setRevealModal({ ...revealModal, open: false })}
        memberId={revealModal.memberId}
        memberName={revealModal.memberName}
        unmaskedPhone={revealModal.phone}
        onRevealed={handlePhoneRevealed}
      />

      {/* Secure Audited Export Dialog */}
      <ExportDialog
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        datasetName="SeniorCitizens"
        fileNamePrefix="Vayoshreshtha_Members"
        data={filteredMembers.map((m) => ({
          MembershipID: m.membershipId,
          FullName: m.fullName,
          AgeBand: dobToAgeBand(m.dateOfBirth),
          Gender: m.gender,
          EktaHub: m.centreId,
          PrimaryLanguage: m.primaryLanguage,
          ConsentStatus: m.consentStatus,
          ActivityStatus: m.status,
          AssistedRegistration: m.isAssistedRegistration ? 'Yes' : 'No',
        }))}
      />
    </div>
  );
};
