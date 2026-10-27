import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { Can } from '@/permissions/Can';
import { Plus, Search, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TemplateListPage: React.FC = () => {
  const data = mockStore.getData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const templates = data.templates.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="WhatsApp Message Templates"
        description="Pre-approved HSM templates with strict variable safety and multilingual translations (FR-25 – FR-27)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Templates' },
        ]}
        actions={
          <Can capability="messageTemplates" action="create">
            <Link to="/communication/templates/new">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Create New Template
              </Button>
            </Link>
          </Can>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search template title, code, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            <option value="BookingConfirmation">Booking Confirmation</option>
            <option value="SessionReminder">Session Reminder</option>
            <option value="Announcement">Announcement</option>
            <option value="EducationalTip">Educational Tip</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{templates.length}</strong> template{templates.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base font-semibold text-text-primary">{tpl.title}</h4>
                  <div className="font-mono text-xs text-text-muted mt-0.5">{tpl.code}</div>
                </div>
                <StatusChip
                  label={tpl.status}
                  variant={tpl.status === 'Approved' ? 'active' : tpl.status === 'Submitted' ? 'warning' : 'neutral'}
                />
              </div>

              {/* Mock WhatsApp Bubble */}
              <div className="bg-[#E7F3EE] p-3.5 rounded-lg border border-[#D0E5DC] text-xs text-text-primary font-sans leading-relaxed whitespace-pre-wrap">
                {tpl.body}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tpl.variables.map((v) => (
                  <span key={v} className="text-[11px] font-mono px-2 py-0.5 bg-bg-subtle text-text-muted border border-border-hairline rounded">
                    {`{${v}}`}
                  </span>
                ))}
                {tpl.languages.map((l) => (
                  <span key={l} className="text-[11px] px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded font-medium">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted">
              <span>Updated: {tpl.updatedAt.split('T')[0]}</span>
              <Link to={`/communication/templates/${tpl.id}`} className="text-accent font-semibold hover:underline inline-flex items-center">
                Edit & Preview <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
