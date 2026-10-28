import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Shield, Phone, QrCode, User } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';

export const SeniorCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const senior = data.seniorCitizens.find((s) => s.id === id) || data.seniorCitizens[0];

  if (!senior) {
    return (
      <div className="p-8 text-center">
        <h2>Senior record not found</h2>
        <Link to="/seniors">Back to directory</Link>
      </div>
    );
  }

  const primaryContact = senior.emergencyContacts?.[0];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to={`/seniors/${senior.id}`} className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> {senior.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Membership Card</span>
      </div>

      <PageHeader
        title="Printable membership card"
        subtitle="Physical emergency elder ID card with QR access and next-of-kin contacts"
        actions={
          <Button variant="primary" icon={<Printer size={16} />} onClick={() => window.print()}>
            Print card
          </Button>
        }
      />

      {/* Printable ID Card (Standard 85.6mm x 53.98mm credit card proportion) */}
      <div className="p-6 rounded-2xl bg-surface border-2 border-[var(--border)] space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-selected)] flex items-center justify-center text-[var(--accent)] font-semibold">
              व
            </div>
            <div>
              <span className="text-xs font-semibold text-[var(--accent)] block">Vayoshreshtha</span>
              <span className="text-[10px] text-[var(--text-secondary)]">Digital Senior-Care Ecosystem</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded">
            Ekta member
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-20 h-24 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex flex-col items-center justify-center text-[var(--text-tertiary)] shrink-0">
            <User size={32} />
            <span className="text-[9px] mt-1">Photo</span>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="text-base font-semibold text-[var(--text)] font-sans">{senior.name}</h3>
            <div className="text-[var(--text-secondary)]">
              Age: <strong>{senior.age} yrs</strong> • Gender: <strong>{senior.gender}</strong>
            </div>
            <div className="text-[var(--text-secondary)]">
              Blood Group: <strong className="text-[var(--negative)]">B +ve</strong>
            </div>
            <div className="text-[var(--text-secondary)]">
              Hub: <strong>{senior.chapterId}</strong>
            </div>
            <div className="text-[var(--text-secondary)] tabular-nums text-[11px] pt-1">
              ID: <strong>{senior.id}</strong>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-1">
          <div className="text-[10px] font-semibold text-[var(--text-secondary)]">Emergency contact (Next-of-kin)</div>
          <div className="font-semibold text-[var(--text)] flex items-center justify-between">
            <span>{primaryContact ? `${primaryContact.name} (${primaryContact.relationship})` : 'Son (Rajesh)'}</span>
            <span className="text-[var(--accent)] font-semibold">{primaryContact?.phone || '+91 98220 99887'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-[var(--text-tertiary)]">
          <span>In Emergency: Call 112 / Hub Helpline</span>
          <span className="tabular-nums">VALID 2026-2027</span>
        </div>
      </div>
    </div>
  );
};
