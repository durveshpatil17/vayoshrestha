import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Mail, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const PartnerProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/partner/home" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Partner portal
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Profile</span>
      </div>

      <PageHeader
        title="Partner organisation profile"
        subtitle="Manage credentials, clinical licenses, and lead coordinator details"
      />

      <Card title="HealthBridge Geriatric Care">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-secondary block">Clinical lead</span>
              <span className="text-sm font-semibold text-text">Dr. Rajan Pillai (MD, Geriatrics)</span>
            </div>
            <div>
              <span className="text-text-secondary block">Medical council registration</span>
              <span className="text-sm font-semibold text-text tabular-nums">MCI-2004-9842</span>
            </div>
            <div>
              <span className="text-text-secondary block">MOU standing with Vayoh Vikas</span>
              <span className="text-sm font-semibold text-positive">Active (Valid through Dec 2027)</span>
            </div>
            <div>
              <span className="text-text-secondary block">Official clinic contact</span>
              <span className="text-sm font-semibold text-text">+91 98450 23456</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
