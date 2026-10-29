import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const TemplateNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Session_Reminder');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/communication/templates');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/communication/templates" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Templates
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">New template</span>
      </div>

      <PageHeader
        title="Compose WhatsApp template"
        subtitle="Subject to NGO Management maker-checker approval before gateway submission"
      />

      <Card title="Template parameters">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Template identifier</label>
            <input
              type="text"
              required
              placeholder="e.g. Health camp reminder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="Session_Reminder">Session Reminder</option>
              <option value="Medication">Medication Adherence</option>
              <option value="Health_Alert">Health & Weather Alert</option>
              <option value="Referral">Partner Referral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Message content (use {'{{1}}'}, {'{{2}}'} for variables)</label>
            <textarea
              required
              rows={4}
              placeholder="Namaste {{1}} Ji, your {{2}} session is scheduled for {{3}}..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link to="/communication/templates">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Submit for NM approval
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

