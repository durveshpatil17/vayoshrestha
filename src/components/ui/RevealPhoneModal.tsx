import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Shield, Eye, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';

export interface RevealPhoneModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  memberId: string;
  memberName: string;
  unmaskedPhone: string;
  onRevealed: (phone: string) => void;
}

export const RevealPhoneModal: React.FC<RevealPhoneModalProps> = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  memberId,
  memberName,
  unmaskedPhone,
  onRevealed,
}) => {
  const isModalVisible = open !== undefined ? open : (isOpen ?? false);
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };
  const user = useAuthStore((s) => s.user);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isModalVisible) return null;

  const handleReveal = () => {
    if (!reason.trim()) {
      setError('A specific reason is mandatory to access unmasked senior contact details.');
      return;
    }

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Volunteer Staff',
      user?.role || 'VF',
      'PII_REVEAL',
      'SENIOR',
      memberId,
      `Unmasked phone number for reason: ${reason}`,
      reason,
      undefined,
      user?.assignedChapter || user?.assignedCentres[0]
    );

    onRevealed(unmaskedPhone);
    setReason('');
    setError('');
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-base border border-border-strong rounded shadow-xl max-w-md w-full p-6 text-left">
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent-tint text-accent flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-text-primary">
                Unmask Senior Phone Number
              </h3>
              <p className="text-xs text-text-muted">{memberName} ({memberId})</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-text-muted mb-4 leading-relaxed">
          Under the Vayoh Vikas Data Protection Policy and DPDP guidelines, revealing senior citizen contact information requires an explicit, audited operational justification.
        </p>

        <Input
          label="Operational Justification Reason"
          placeholder="e.g. Arranging morning auto transport; urgent welfare check"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          error={error}
          required
          autoFocus
        />

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border-hairline">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={handleReveal}
          >
            Confirm & Reveal
          </Button>
        </div>
      </div>
    </div>
  );
};
