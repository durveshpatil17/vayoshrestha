import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Calendar, Users, Building2, ArrowUpRight, ListFilter } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';
import { useAuthStore } from '@/store/authStore';

export const ProgrammeListPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const programmes = data.programmes || [];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const canCreate = user?.role === 'SA' || user?.role === 'NM' || user?.role === 'PM' || user?.role === 'RA';

  const filteredProgrammes = useMemo(() => {
    return programmes.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [programmes, selectedCategory, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programmes catalogue"
        subtitle="Holistic elder engagement initiatives across preventive health, digital skills, and recreation"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/schedule">
              <Button variant="outline" icon={<Calendar size={16} />}>
                Master schedule
              </Button>
            </Link>
            {canCreate && (
              <Link to="/programmes/new">
                <Button variant="primary" icon={<Plus size={16} />}>
                  New programme
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter programmes by title, code or theme..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: selectedCategory,
            onChange: setSelectedCategory,
            options: [
              { label: 'All categories', value: 'ALL' },
              { label: 'Health & Wellness', value: 'Health & Wellness' },
              { label: 'Digital Empowerment', value: 'Digital Empowerment' },
              { label: 'Mental Health & Social', value: 'Mental Health & Social' },
              { label: 'Financial & Legal', value: 'Financial & Legal' },
              { label: 'Recreation & Arts', value: 'Recreation & Arts' },
            ],
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProgrammes.map((prog) => {
          return (
            <Card key={prog.id} className="hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--surface-selected)] px-2 py-0.5 rounded">
                    {prog.category}
                  </span>
                  <StatusChip
                    label={prog.status}
                    status={prog.status === 'Active' ? 'active' : 'info'}
                  />
                </div>

                <h3 className="text-base font-semibold text-[var(--text)] font-sans mb-1.5">{prog.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                  {prog.description}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] mb-3">
                  <div>
                    <span className="block text-[var(--text-tertiary)]">Enrolled elders</span>
                    <span className="text-sm font-semibold text-[var(--text)] tabular-nums">{prog.enrolledCount}</span>
                  </div>
                  <div>
                    <span className="block text-[var(--text-tertiary)]">Delivered sessions</span>
                    <span className="text-sm font-semibold text-[var(--text)] tabular-nums">{prog.sessionsCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] truncate">
                    Chapters: {prog.chapterIds?.length || 1} Hubs
                  </span>
                  <Link to={`/programmes/${prog.id}`}>
                    <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

