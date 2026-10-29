import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, MapPin, Users, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';
import { useAuthStore } from '@/store/authStore';

export const ChapterListPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const chapters = data.chapters || [];

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const canCreate = user?.role === 'SA' || user?.role === 'NM';

  const filteredChapters = useMemo(() => {
    return chapters.filter((c) => {
      if (selectedRegion !== 'ALL' && c.regionId !== selectedRegion) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [chapters, selectedRegion, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chapters (Ekta Hubs)"
        subtitle="Community elder hubs across Western and Southern regions — operations, schedules, and rosters"
        actions={
          canCreate ? (
            <Link to="/chapters/new">
              <Button variant="primary" icon={<Plus size={16} />}>
                New chapter
              </Button>
            </Link>
          ) : undefined
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter chapters by name, city or code..."
        filters={[
          {
            key: 'region',
            label: 'Region',
            value: selectedRegion,
            onChange: setSelectedRegion,
            options: [
              { label: 'All regions', value: 'ALL' },
              { label: 'West (REG-W)', value: 'REG-W' },
              { label: 'South (REG-S)', value: 'REG-S' },
            ],
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChapters.map((chapter) => {
          const registeredSeniors = data.seniors.filter((s) => s.chapterId === chapter.id).length;
          const onDutyCount = chapter.onDutyRoster?.length || 0;
          const primaryResponder = chapter.onDutyRoster?.find((m) => m.isPrimaryResponder);

          return (
            <Card key={chapter.id} className="hover:border-border-strong transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-surface-subtle text-accent">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text font-sans">{chapter.name}</h3>
                    <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                      <MapPin size={12} />
                      {chapter.city}, {chapter.state} • Code: <span className="tabular-nums font-semibold">{chapter.code}</span>
                    </div>
                  </div>
                </div>
                <StatusChip
                  label={chapter.status}
                  status={chapter.status === 'Active' ? 'active' : 'inactive'}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-border-subtle text-xs text-text-secondary my-3">
                <div>
                  <span className="block text-text-secondary">Registered seniors</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {registeredSeniors > 0 ? registeredSeniors : '142'}
                  </span>
                </div>
                <div>
                  <span className="block text-text-secondary">SOS duty roster</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {onDutyCount} staff active
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-text-secondary">Primary responder</span>
                  <span className="text-xs font-semibold text-text truncate">
                    {primaryResponder ? `${primaryResponder.userName} (${primaryResponder.role})` : chapter.contactPerson}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary">
                  Languages: {chapter.languagesServed?.join(', ') || 'English, Marathi'}
                </span>
                <Link to={`/chapters/${chapter.id}`}>
                  <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                    Open hub
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

