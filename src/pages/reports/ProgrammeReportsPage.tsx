import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ProgrammeReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/reports" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Programmes</span>
      </div>

      <PageHeader
        title="Programme efficacy & curriculum outcomes"
        subtitle="Participation consistency, cohort progression, and satisfaction ratings by track"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export analytics
          </Button>
        }
      />

      <Card title="Curriculum performance metrics">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {[
            { name: 'Swasthya Seva (Geriatric Preventive Health)', category: 'Health & Wellness', sessions: 36, elders: 248, retention: '94%', rating: '4.8 / 5' },
            { name: 'Digital Sahayata (Smartphone Independence)', category: 'Digital Empowerment', sessions: 24, elders: 185, retention: '88%', rating: '4.9 / 5' },
            { name: 'Ananda Sangam (Social Circle & Mental Health)', category: 'Mental Health & Social', sessions: 48, elders: 310, retention: '92%', rating: '4.7 / 5' },
            { name: 'Yoga Chikitsa (Chair & Gentle Asanas)', category: 'Health & Wellness', sessions: 52, elders: 195, retention: '96%', rating: '4.9 / 5' },
          ].map((p, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text font-sans">{p.name}</h3>
                <div className="text-text-secondary mt-0.5">
                  Category: {p.category} • Sessions: <span className="tabular-nums font-semibold">{p.sessions}</span> • Enrolled: <span className="tabular-nums font-semibold">{p.elders}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-positive font-semibold block">{p.retention} Retention</span>
                <span className="text-text-secondary block tabular-nums">{p.rating} Satisfaction</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

