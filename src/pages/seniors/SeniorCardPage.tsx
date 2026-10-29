import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, User } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';

export const SeniorCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const senior = data.seniorCitizens.find((s) => s.id === id) || data.seniorCitizens[0];

  if (!senior) {
    return (
      <div className="p-8 text-center text-text-primary">
        <h2 className="text-xl font-semibold mb-2">Senior record not found</h2>
        <Link to="/seniors" className="text-accent hover:underline text-sm">Back to directory</Link>
      </div>
    );
  }

  const primaryContact = senior.emergencyContacts?.[0];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link to={`/seniors/${senior.id}`} className="hover:text-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> {senior.name}
        </Link>
        <span>/</span>
        <span className="text-text-primary font-semibold">Membership Card</span>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Printable membership card</h1>
          <p className="text-sm text-text-muted">Physical emergency elder ID card with QR access and next-of-kin contacts</p>
        </div>
        <Button variant="primary" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
          Print card
        </Button>
      </div>

      {/* Printable ID Card (Standard 85.6mm x 53.98mm credit card proportion) */}
      <div className="p-6 rounded-container bg-surface border-2 border-border space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-tint flex items-center justify-center text-accent font-semibold">
              व
            </div>
            <div>
              <span className="text-xs font-semibold text-accent block">Vayoshreshtha</span>
              <span className="text-xs text-text-muted">Digital Senior-Care Ecosystem</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-text-muted bg-bg-subtle px-2 py-0.5 rounded-control">
            Ekta member
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-20 h-24 rounded-control bg-bg-subtle border border-border flex flex-col items-center justify-center text-text-muted shrink-0">
            <User className="w-8 h-8" />
            <span className="text-xs mt-1">Photo</span>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="text-base font-semibold text-text-primary">{senior.name}</h3>
            <div className="text-text-muted">
              Age: <strong>{senior.age} yrs</strong> • Gender: <strong>{senior.gender}</strong>
            </div>
            <div className="text-text-muted">
              Blood Group: <strong className="text-critical">B +ve</strong>
            </div>
            <div className="text-text-muted">
              Hub: <strong>{senior.chapterId}</strong>
            </div>
            <div className="text-text-muted tabular-nums text-xs pt-1">
              ID: <strong>{senior.id}</strong>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-control bg-bg-subtle border border-border text-xs space-y-1">
          <div className="text-xs font-semibold text-text-muted">Emergency contact (Next-of-kin)</div>
          <div className="font-semibold text-text-primary flex items-center justify-between">
            <span>{primaryContact ? `${primaryContact.name} (${primaryContact.relationship})` : 'Son (Rajesh)'}</span>
            <span className="text-accent font-semibold">{primaryContact?.phone || '+91 98220 99887'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-text-muted">
          <span>In Emergency: Call 112 / Hub Helpline</span>
          <span className="tabular-nums">VALID 2026-2027</span>
        </div>
      </div>
    </div>
  );
};
