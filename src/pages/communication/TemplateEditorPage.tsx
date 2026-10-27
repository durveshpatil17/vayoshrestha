import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { MessageSquare, CheckCircle2, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';
import { MessageTemplate } from '@/api/contracts';

export const TemplateEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const isEditing = Boolean(id && id !== 'new');
  const existingTemplate = isEditing ? data.templates.find((t) => t.id === id) : null;

  const [title, setTitle] = useState(existingTemplate?.title || '');
  const [code, setCode] = useState(existingTemplate?.code || 'WS_TMPL_');
  const [category, setCategory] = useState<MessageTemplate['category']>(
    existingTemplate?.category || 'SessionReminder'
  );
  const [body, setBody] = useState(
    existingTemplate?.body ||
      'Namaste {name} ji, reminder from Vayoh Vikas: your {session} is tomorrow at {time} at Ekta Hub {centre}. Please carry your card. Reply STOP to opt out.'
  );
  const [languages, setLanguages] = useState<('English' | 'Hindi' | 'Marathi')[]>(
    existingTemplate?.languages || ['English', 'Hindi']
  );
  const [submitted, setSubmitted] = useState(false);

  const variables = ['name', 'session', 'time', 'centre', 'date', 'link'];

  const insertVariable = (v: string) => {
    setBody((prev) => `${prev} {${v}}`);
  };

  // Preview replacement with mock data
  const previewText = body
    .replace('{name}', 'Ramesh Sharma')
    .replace('{session}', 'Yoga & Pranayama')
    .replace('{time}', '09:00 AM')
    .replace('{centre}', 'Pune Model Colony')
    .replace('{date}', '28 Oct 2026')
    .replace('{link}', 'https://vayoh.org/m/123');

  const handleSubmit = (status: 'Draft' | 'Submitted') => {
    const tpl: MessageTemplate = {
      id: existingTemplate?.id || `tpl-${Date.now()}`,
      code: code.toUpperCase().trim(),
      title,
      category,
      body,
      variables: variables.filter((v) => body.includes(`{${v}}`)),
      languages,
      status,
      submittedBy: user?.fullName || 'Programme Manager',
      updatedAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      if (isEditing) {
        const idx = draft.templates.findIndex((t) => t.id === tpl.id);
        if (idx !== -1) draft.templates[idx] = tpl;
      } else {
        draft.templates.unshift(tpl);
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Programme Manager',
      user?.role || 'PM',
      isEditing ? 'UPDATE' : 'CREATE',
      'MessageTemplate',
      tpl.id,
      `${status === 'Submitted' ? 'Submitted template for NM approval' : 'Saved template draft'}: ${title}`,
      existingTemplate,
      tpl,
      undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/communication/templates');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={isEditing ? `Edit Template: ${existingTemplate?.title}` : 'Create WhatsApp Template'}
        description="Design and submit compliant notification templates with pre-approved variable slots (FR-25)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Templates', href: '/communication/templates' },
          { label: isEditing ? 'Edit' : 'New' },
        ]}
        actions={
          <Link to="/communication/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Templates
            </Button>
          </Link>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-6 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Template successfully recorded!</h3>
          <p className="text-xs text-emerald-800">
            Redirecting to template catalog...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Form Column */}
          <div className="lg:col-span-7 bg-bg-base border border-border-hairline rounded p-6 space-y-5">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Template Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session Reminder 24h Prior"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">HSM Template Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WS_SESSION_REMINDER_V1"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-xs font-mono uppercase border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                  >
                    <option value="SessionReminder">Session Reminder</option>
                    <option value="BookingConfirmation">Booking Confirmation</option>
                    <option value="Announcement">Announcement</option>
                    <option value="EducationalTip">Educational Tip</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-text-primary">Template Body</label>
                  <span className="text-[11px] text-text-muted">{body.length} / 1024 chars</span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-3 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
                />
              </div>

              {/* Variable Chips */}
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1.5">Insert Variable Chip:</label>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="text-xs px-2.5 py-1 bg-bg-subtle border border-border-hairline hover:border-accent hover:text-accent rounded transition-colors font-mono"
                    >
                      +{`{${v}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Supported Languages */}
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1.5">Language Translations Included</label>
                <div className="flex gap-4 text-xs">
                  {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
                    <label key={lang} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={languages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) setLanguages([...languages, lang]);
                          else setLanguages(languages.filter((l) => l !== lang));
                        }}
                        className="rounded text-accent focus:ring-accent"
                      />
                      <span>{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  All WhatsApp notifications must clearly specify opt-out keywords (e.g. "Reply STOP to opt out") in accordance with FR-29.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSubmit('Draft')}
                disabled={!title || !body}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit('Submitted')}
                disabled={!title || !body || languages.length === 0}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit for Approval (NM)
              </Button>
            </div>
          </div>

          {/* Live Mobile WhatsApp Preview Column */}
          <div className="lg:col-span-5 bg-bg-base border border-border-hairline rounded p-6 flex flex-col items-center">
            <h4 className="font-serif text-sm font-semibold text-text-primary mb-4">Live WhatsApp Preview</h4>

            <div className="w-72 bg-[#EFEAE2] border-4 border-zinc-700 rounded-3xl p-3 shadow-md">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white p-2.5 rounded-t-xl flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  VV
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">Vayoh Vikas Senior Care</div>
                  <div className="text-[10px] text-white/80">Official Verified Channel</div>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#DCF8C6] p-3 rounded-lg text-xs text-zinc-900 leading-relaxed shadow-sm relative mb-2">
                <div className="whitespace-pre-wrap">{previewText}</div>
                <div className="text-[10px] text-zinc-500 text-right mt-1 flex items-center justify-end gap-1">
                  <span>10:30 AM</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-zinc-500 mt-4">
                Simulated WhatsApp End-to-End Encrypted Bubble
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
