import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Check, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { FilterBar } from '@/components/data/FilterBar';

export const ConsentsPage: React.FC = () => {
  const [consents, setConsents] = useState([
    {
      id: 'SEN-001',
      name: 'Kamala Devi',
      phone: '+91 98220 12345',
      whatsappConsent: true,
      familyShareConsent: true,
      language: 'Marathi',
      optedInAt: '12 Aug 2026',
    },
    {
      id: 'SEN-002',
      name: 'Ramesh Kulkarni',
      phone: '+91 98220 23456',
      whatsappConsent: true,
      familyShareConsent: false,
      language: 'Marathi',
      optedInAt: '15 Aug 2026',
    },
    {
      id: 'SEN-003',
      name: 'Shantaram Deshpande',
      phone: '+91 98220 34567',
      whatsappConsent: true,
      familyShareConsent: true,
      language: 'Hindi',
      optedInAt: '01 Sep 2026',
    },
    {
      id: 'SEN-004',
      name: 'Sulabha Joshi',
      phone: '+91 98220 45678',
      whatsappConsent: false,
      familyShareConsent: false,
      language: 'Marathi',
      optedInAt: 'SMS Only',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/communication" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Communication
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Consents</span>
      </div>

      <PageHeader
        title="Consent & opt-out registry"
        subtitle="DPDP Act compliant consent records for messaging, partner data-sharing, and family access"
      />

      <Card title="Member consent status">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)]">
                <th className="py-2.5 px-3 font-semibold">Member</th>
                <th className="py-2.5 px-2 font-semibold">WhatsApp Messages</th>
                <th className="py-2.5 px-2 font-semibold">Family Portal Access</th>
                <th className="py-2.5 px-2 font-semibold">Preferred Language</th>
                <th className="py-2.5 px-3 font-semibold">Date Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {consents.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--surface-hover)]">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[var(--text)]">{c.name}</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{c.id} • {c.phone}</div>
                  </td>
                  <td className="py-3 px-2">
                    {c.whatsappConsent ? (
                      <span className="inline-flex items-center gap-1 text-[var(--positive)] font-semibold">
                        <Check size={14} /> Consented
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                        <X size={14} /> Opted-out
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {c.familyShareConsent ? (
                      <span className="inline-flex items-center gap-1 text-[var(--positive)] font-semibold">
                        <Check size={14} /> Permitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[var(--text-tertiary)]">
                        <X size={14} /> Restricted
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 font-semibold text-[var(--text)]">{c.language}</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)] tabular-nums">{c.optedInAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
