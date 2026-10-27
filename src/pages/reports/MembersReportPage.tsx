import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockStore } from '@/mock/store';
import { Users, UserCheck, ShieldCheck, PieChart } from 'lucide-react';

export const MembersReportPage: React.FC = () => {
  const data = mockStore.getData();
  const members = data.seniorCitizens;

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.isActive).length;
  const femaleCount = members.filter((m) => m.gender === 'Female').length;
  const maleCount = members.filter((m) => m.gender === 'Male').length;

  // Language breakdown
  const marathiCount = members.filter((m) => m.preferredLanguage === 'Marathi').length;
  const hindiCount = members.filter((m) => m.preferredLanguage === 'Hindi').length;
  const englishCount = members.filter((m) => m.preferredLanguage === 'English').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Senior Citizen Cohorts & Demographics"
        description="Participation fidelity, age-band distribution, gender representation, and language diversity (FR-45)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Members' },
        ]}
      />

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Registered Senior Citizens</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{totalMembers}</div>
          <div className="text-xs text-text-muted mt-0.5">Pilot Cohort Target: 1,000</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Active Participants (30 Days)</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">{activeMembers}</div>
          <div className="text-xs text-text-muted mt-0.5">{Math.round((activeMembers / totalMembers) * 100)}% of total cohort</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Female Senior Representation</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">
            {Math.round((femaleCount / totalMembers) * 100)}% ({femaleCount})
          </div>
          <div className="text-xs text-text-muted mt-0.5">Focus on vulnerable elder women</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Assisted Registrations</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">
            {members.filter((m) => m.isAssisted).length}
          </div>
          <div className="text-xs text-text-muted mt-0.5">Registered via field volunteers</div>
        </div>
      </div>

      {/* Demographic Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferred Language Mix */}
        <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Communication Language Diversity</h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Marathi (Local Regional)</span>
                <span>{marathiCount} ({Math.round((marathiCount / totalMembers) * 100)}%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${(marathiCount / totalMembers) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Hindi (National)</span>
                <span>{hindiCount} ({Math.round((hindiCount / totalMembers) * 100)}%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-[#B7791F] h-full" style={{ width: `${(hindiCount / totalMembers) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>English</span>
                <span>{englishCount} ({Math.round((englishCount / totalMembers) * 100)}%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-[#5F6B73] h-full" style={{ width: `${(englishCount / totalMembers) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Gender & Age Band Mix */}
        <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Age Band Distribution</h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Age 60–69 (Young-Old)</span>
                <span>460 Elders (46%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: '46%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Age 70–79 (Middle-Old)</span>
                <span>380 Elders (38%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-[#B7791F] h-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Age 80+ (Oldest-Old)</span>
                <span>160 Elders (16%)</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-[#B4533A] h-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
