import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Users, Calendar, Table, LayoutGrid, ArrowRight, MapPin } from 'lucide-react';

export const CentreListPage: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();
  const centres = data.centres;

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ekta Hub Community Centres (${centres.length})`}
        description="Physical community centres anchoring eldercare activities, structured programmes, and field delivery."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Centres' }]}
        primaryAction={
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className="px-2.5 py-1.5 text-xs border border-border-hairline rounded bg-bg-subtle hover:bg-bg-active text-text-primary flex items-center gap-1.5"
            >
              {viewMode === 'card' ? <Table className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
              <span>{viewMode === 'card' ? 'Table View' : 'Card Grid'}</span>
            </button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/centres/new')}
            >
              Add Ekta Hub
            </Button>
          </div>
        }
      />

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centres.map((c) => {
            const hubMembers = data.seniorCitizens.filter((s) => s.centreId === c.id);
            const activeCount = hubMembers.filter((s) => s.isActive).length;
            const activePct = hubMembers.length > 0 ? Math.round((activeCount / hubMembers.length) * 100) : 0;
            const hubSessions = data.sessions.filter((s) => s.centreId === c.id);

            return (
              <div
                key={c.id}
                className="bg-bg-base border border-border-hairline rounded p-5 hover:border-accent transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-accent bg-accent-tint px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <StatusChip label={c.status} variant="active" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-text-primary mb-1">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                    <span>{c.city}, {c.state}</span>
                  </div>

                  {/* Participation Snapshot Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-bg-subtle rounded border border-border-hairline text-center text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-text-muted block">Registered</span>
                      <span className="font-bold font-serif text-sm text-text-primary tabular-nums">
                        {hubMembers.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Active %</span>
                      <span className="font-bold font-serif text-sm text-success tabular-nums">
                        {activePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Sessions</span>
                      <span className="font-bold font-serif text-sm text-text-primary tabular-nums">
                        {hubSessions.length}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-text-muted space-y-1">
                    <div>Coordinator: <strong className="text-text-primary">{c.contactPerson}</strong></div>
                    <div>Hours: {c.operatingSchedule}</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border-hairline">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/centres/${c.id}`)}
                  >
                    View Centre Operations
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-subtle text-text-primary border-b border-border-hairline">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Centre Name</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-right">Registered Elders</th>
                <th className="p-3 text-right">Active (30d)</th>
                <th className="p-3">Coordinator</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {centres.map((c) => {
                const hubMembers = data.seniorCitizens.filter((s) => s.centreId === c.id);
                const activeCount = hubMembers.filter((s) => s.isActive).length;
                return (
                  <tr key={c.id} className="hover:bg-bg-subtle/50">
                    <td className="p-3 font-mono font-bold text-accent">{c.code}</td>
                    <td className="p-3 font-semibold text-text-primary">{c.name}</td>
                    <td className="p-3 text-text-muted">{c.city}, {c.state}</td>
                    <td className="p-3 text-right tabular-nums">{hubMembers.length}</td>
                    <td className="p-3 text-right tabular-nums text-success font-semibold">{activeCount}</td>
                    <td className="p-3 text-text-muted">{c.contactPerson}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/centres/${c.id}`)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
