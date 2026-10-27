import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { matchWarningSigns } from '@/domain/escalation';
import { ShieldAlert, Plus, CheckCircle2, AlertOctagon, Sparkles, TestTube } from 'lucide-react';

interface WarningRule {
  id: string;
  name: string;
  keywords: string[];
  severity: 'Immediate' | 'High' | 'Standard';
  slaHours: number;
  notifyRole: 'CT' | 'CC' | 'NM';
  status: 'Active' | 'Draft';
}

export const WarningRulesPage: React.FC = () => {
  const { user } = useAuthStore();

  const [rules, setRules] = useState<WarningRule[]>([
    {
      id: 'rule-1',
      name: 'Acute Cardiovascular & Respiratory Warning',
      keywords: ['chest pain', 'breathless', 'heart racing', 'dizzy collapsed'],
      severity: 'Immediate',
      slaHours: 2,
      notifyRole: 'CT',
      status: 'Active',
    },
    {
      id: 'rule-2',
      name: 'Physical Fall & Sudden Immobility Warning',
      keywords: ['fell down', 'cannot get up', 'fracture', 'hip pain', 'severe bleeding'],
      severity: 'High',
      slaHours: 6,
      notifyRole: 'CT',
      status: 'Active',
    },
    {
      id: 'rule-3',
      name: 'Social Isolation & Severe Distress Flag',
      keywords: ['no food', 'nobody visits', 'alone crying', 'helpless depressed'],
      severity: 'Standard',
      slaHours: 24,
      notifyRole: 'CC',
      status: 'Active',
    },
  ]);

  // Interactive Test-A-Message Tool
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const handleTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    const matched = matchWarningSigns(testMessage);
    setTestResult(matched);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Distress Warning-Sign Trigger Rules"
        description="Deterministic triage rules identifying acute physical symptoms or distress keywords in incoming messages (FR-40)"
        breadcrumb={[
          { label: 'Health Support', href: '/support/requests' },
          { label: 'Warning Rules' },
        ]}
      />

      {/* Mandatory Non-Clinical Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong>Deterministic Triage Architecture:</strong> Keyword matching algorithms run transparently without autonomous medical decision-making.
          When a distress keyword triggers, an urgent SLA timer is spawned for qualified human specialists to intervene.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rules Table Left Rail */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-base font-semibold text-text-primary">Configured Warning Rules</h3>
              <Can capability="escalationRules" action="create">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Rule
                </Button>
              </Can>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 bg-bg-subtle rounded border border-border-hairline space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-text-primary text-sm">{rule.name}</div>
                      <div className="text-text-muted mt-0.5">SLA Target: <strong>{rule.slaHours} Hours</strong> • Routes to: <strong>{rule.notifyRole}</strong></div>
                    </div>
                    <StatusChip label={rule.severity} variant={rule.severity === 'Immediate' ? 'danger' : 'warning'} />
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] text-text-muted block mb-1">Keywords Monitored:</span>
                    <div className="flex flex-wrap gap-1">
                      {rule.keywords.map((kw) => (
                        <span key={kw} className="font-mono text-[10px] px-2 py-0.5 bg-bg-base border border-border-hairline rounded text-text-primary">
                          "{kw}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive "Test a Message" Sandbox Right Rail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border-hairline pb-3">
              <TestTube className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-sm font-semibold text-text-primary">Test a Message Simulator (FR-40)</h4>
            </div>

            <p className="text-xs text-text-muted">
              Paste sample incoming Hindi, Marathi or English text from an elder to test keyword triage detection.
            </p>

            <form onSubmit={handleTestMessage} className="space-y-3">
              <textarea
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="e.g. 'I fell down near the bathroom and my hip has severe pain'..."
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />

              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" className="text-xs w-full">
                  Run Detection Check
                </Button>
              </div>
            </form>

            {testResult && (
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border-hairline pb-1.5">
                  <span className="font-semibold text-text-primary">Detection Outcome:</span>
                  <StatusChip
                    label={testResult.triggered ? `${testResult.severity} Triggered` : 'No Warning Signs'}
                    variant={testResult.triggered ? (testResult.severity === 'Immediate' ? 'danger' : 'warning') : 'active'}
                  />
                </div>

                {testResult.triggered ? (
                  <div className="space-y-1">
                    <div><strong>Matched Keywords:</strong> {testResult.matchedKeywords.join(', ')}</div>
                    <div><strong>Assigned SLA:</strong> {testResult.slaHours} Hours</div>
                    <div className="text-text-muted mt-1 text-[11px]">
                      A high-priority escalation ticket would automatically spawn for the Care Team.
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-800 text-[11px]">
                    Message contains no recognized distress triggers. Treated as routine community inquiry.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
