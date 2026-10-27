import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { UserCheck, Phone, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorName?: string;
  seniorId?: string;
  centreId?: string;
  initialReason?: string;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  isOpen,
  onClose,
  seniorName = 'Senior Citizen',
  seniorId = 'm-1',
  centreId = 'HUB-PUN',
  initialReason = 'Senior requested immediate phone conversation with human coordinator.',
}) => {
  const { user } = useAuthStore();
  const [assignedRole, setAssignedRole] = useState<'CC' | 'CT'>('CC');
  const [urgency, setUrgency] = useState<'Immediate' | 'Standard'>('Immediate');
  const [notes, setNotes] = useState(initialReason);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleHandover = (e: React.FormEvent) => {
    e.preventDefault();

    mockStore.updateData((draft) => {
      draft.escalations.unshift({
        id: `esc-handover-${Date.now()}`,
        memberId: seniorId,
        memberName: seniorName,
        centreId,
        severity: urgency,
        source: 'WhatsApp',
        triggerKeywords: ['handover request'],
        summary: notes,
        slaHours: urgency === 'Immediate' ? 2 : 24,
        assignedExpertName: assignedRole === 'CC' ? 'Centre Coordinator (Meera Joshi)' : 'Care Team Specialist',
        status: 'Open',
        createdAt: new Date().toISOString(),
      });
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'System',
      'SC',
      'CREATE',
      'HealthEscalation',
      seniorId,
      `Human handover initiated for ${seniorName} to ${assignedRole}`,
      null,
      { notes, urgency },
      centreId
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-lg font-semibold text-text-primary">Human Care Handover (FR-42)</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">✕</button>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Handover dispatched! Dedicated coordinator alerted on mobile.</span>
          </div>
        ) : (
          <form onSubmit={handleHandover} className="space-y-4 text-xs">
            <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
              <div><strong>Senior Citizen:</strong> {seniorName}</div>
              <div><strong>Routing Destination:</strong> Local Ekta Hub Field Coordinator</div>
            </div>

            <div>
              <label className="font-medium text-text-primary block mb-1">Handover Destination Role</label>
              <select
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value as any)}
                className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="CC">Centre Coordinator (Field Visit / Phone Call)</option>
                <option value="CT">Licensed Care Team Specialist (Geriatric Triage)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-text-primary block mb-1">Response Urgency Target</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="Immediate">Immediate (Within 2 Hours SLA)</option>
                <option value="Standard">Standard Routine (Within 24 Hours SLA)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-text-primary block mb-1">Handover Context & Notes</label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Human Handover
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
