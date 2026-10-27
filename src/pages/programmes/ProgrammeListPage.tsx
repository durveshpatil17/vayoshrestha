import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Users, Clock, LayoutGrid, Table, ArrowRight } from 'lucide-react';

export const ProgrammeListPage: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();
  const programmes = data.programmes;
  const centres = data.centres;

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = programmes.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Programmes & Events (${filtered.length})`}
        description="Structured community activities: Yoga, Digital Literacy, Health Screenings, Legal Clinics, and Social Circles."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Programmes' }]}
        primaryAction={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => navigate('/schedule')}
            >
              Master Calendar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/programmes/new')}
            >
              Create Programme
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-bg-subtle border border-border-hairline rounded text-xs">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 px-2.5 rounded bg-bg-base border border-border-hairline text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="ALL">All Categories</option>
          <option value="Yoga & Wellness">Yoga & Wellness</option>
          <option value="Digital Literacy">Digital Literacy</option>
          <option value="Health Camp">Health Camp</option>
          <option value="Legal Aid">Legal Aid</option>
          <option value="Social Meet">Social Meet</option>
          <option value="Nutrition">Nutrition</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 px-2.5 rounded bg-bg-base border border-border-hairline text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="ALL">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Draft">Draft</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Programme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prog) => {
          const sessions = data.sessions.filter((s) => s.programmeId === prog.id);

          return (
            <div
              key={prog.id}
              className="bg-bg-base border border-border-hairline rounded p-5 hover:border-accent transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                    {prog.category}
                  </span>
                  <StatusChip
                    label={prog.status}
                    variant={prog.status === 'Ongoing' ? 'active' : 'neutral'}
                  />
                </div>

                <h3 className="font-serif text-lg font-bold text-text-primary mb-1">
                  {prog.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
                  {prog.description}
                </p>

                <div className="space-y-1.5 text-xs text-text-muted border-t border-border-hairline pt-3">
                  <div className="flex justify-between">
                    <span>Capacity / Session:</span>
                    <strong className="text-text-primary font-mono">{prog.capacityPerSession} seats</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Waitlist & Walk-ins:</span>
                    <span className="text-text-primary font-medium">
                      {prog.waitlistEnabled ? 'Waitlist Enabled' : 'No Waitlist'} · {prog.walkInsAllowed ? 'Walk-ins OK' : 'Pre-booking Only'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Scheduled Sessions:</span>
                    <span className="font-mono font-bold text-accent">{sessions.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border-hairline">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/programmes/${prog.id}`)}
                >
                  View Sessions & Roster
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
