import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Heart, ShieldAlert } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SupportEscalationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const escalation = data.escalations.find((e) => e.id === id) || data.escalations[0];

  const [notes, setNotes] = useState(escalation?.resolutionSummary || '');
  const [resolved, setResolved] = useState(escalation?.status === 'Resolved');

  if (!escalation) {
    return (
      <div className="p-8 text-center">
        <h2>Escalation not found</h2>
        <Link to="/support/escalations">Back</Link>
      </div>
    );
  }

  const handleResolve = () => {
    mockStore.updateData((d) => {
      const e = d.escalations.find((x) => x.id === escalation.id);
      if (e) {
        e.status = 'Resolved';
        e.resolutionSummary = notes;
        e.resolvedAt = new Date().toISOString();
      }
    });
    setResolved(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/support/escalations" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Escalations
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{escalation.id}</span>
      </div>

      <PageHeader
        title={`${escalation.seniorName} — Clinical escalation`}
        subtitle={`Severity: ${escalation.severity} • Assigned clinician: ${escalation.assignedDoctorOrStaff}`}
      />

      <Card title="Clinical trigger description">
        <div className="p-3.5 rounded bg-[var(--negative-tint)] border border-[var(--border)] text-sm text-[var(--negative)]">
          <strong>Observation:</strong> {escalation.triggeredBy}
        </div>
      </Card>

      <Card title="Clinical response & discharge plan">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Clinician consultation notes</label>
            <textarea
              rows={4}
              placeholder="Record diagnostic impression, updated medication dosage, and family advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[var(--text-secondary)]">
              Status: <strong>{resolved ? 'Resolved' : 'Active Escalation'}</strong>
            </span>
            <Button variant="primary" onClick={handleResolve} disabled={resolved}>
              {resolved ? 'Escalation resolved' : 'Resolve escalation'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
