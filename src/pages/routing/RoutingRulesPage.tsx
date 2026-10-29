import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Plus,
  GitMerge,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  ROUTING_RULES,
  routeRequest,
  ServiceCategory,
  RoutingDecisionRecord,
  RoutingRule,
} from '@/domain/routing/engine';
import { useAuthStore } from '@/store/authStore';

export const RoutingRulesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [rules, setRules] = useState<RoutingRule[]>(() => ROUTING_RULES);

  // Simulator State
  const [testCategory, setTestCategory] = useState<ServiceCategory>('hospital');
  const [testRegion, setTestRegion] = useState<string>('pune');
  const [testLanguage, setTestLanguage] = useState<string>('Marathi');
  const [simulationResult, setSimulationResult] = useState<RoutingDecisionRecord | null>(null);

  const handleRunSimulation = () => {
    const result = routeRequest({
      seniorId: 'SIM-SC-001',
      seniorName: 'Simulated Senior Citizen',
      seniorPhone: '+91 98000 00000',
      category: testCategory,
      region: testRegion,
      language: testLanguage,
    });
    setSimulationResult(result.decisionRecord);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Routing Rules & Simulation Harness"
        subtitle="Manage deterministic partner assignment policies, capacity limits, and test routing outcomes."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partners', href: '/partners' },
          { label: 'Routing Fabric', href: '/routing' },
          { label: 'Rules & Simulator' },
        ]}
      />

      {/* Maker-Checker Governance Notice */}
      <div className="p-4 bg-emerald-50 border border-brand-primary/20 rounded-xl flex items-center justify-between text-xs text-brand-primary">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            Maker-Checker Governance: Programme Managers draft routing rules; National Managers activate them.
          </span>
        </div>
        <span className="font-semibold">Zero Unverified Partners</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-primary" />
                  Active Routing Policies
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Automated routing logic evaluated during every senior referral.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-bg-canvas text-text-secondary border-b border-border">
                  <tr>
                    <th className="p-3 font-semibold">Service Domain</th>
                    <th className="p-3 font-semibold">Routing Strategy</th>
                    <th className="p-3 font-semibold">SLA Target</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Sign-off Chain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-bg-canvas/50 transition-colors">
                      <td className="p-3 font-semibold text-text-primary capitalize">
                        {rule.category.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-brand-primary font-medium capitalize">
                        {rule.strategy.replace('-', ' ')}
                      </td>
                      <td className="p-3 text-text-secondary">{rule.escalationSlaHours} hours</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-brand-primary rounded font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                      <td className="p-3 text-text-secondary">
                        <div>{rule.updatedBy}</div>
                        {rule.approvedBy && (
                          <div className="text-[10px] text-brand-primary">Approved: {rule.approvedBy}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive "Test a Request" Harness */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Play className="w-4 h-4 text-brand-primary" />
              Test a Request (Simulator)
            </h3>
            <p className="text-xs text-text-secondary">
              Simulate how the routing engine assigns a hypothetical intake request in real time.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text-secondary">Service Domain:</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value as ServiceCategory)}
                  className="w-full p-2 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
                >
                  <option value="hospital">Hospital Care</option>
                  <option value="diagnostic_lab">Diagnostic Lab</option>
                  <option value="legal">Pro-Bono Legal Aid</option>
                  <option value="financial">Financial / Pension</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary">Senior Citizen Region:</label>
                <select
                  value={testRegion}
                  onChange={(e) => setTestRegion(e.target.value)}
                  className="w-full p-2 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
                >
                  <option value="pune">Pune Chapters</option>
                  <option value="mumbai">Mumbai Chapters</option>
                  <option value="nagpur">Nagpur Chapters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary">Spoken Language:</label>
                <select
                  value={testLanguage}
                  onChange={(e) => setTestLanguage(e.target.value)}
                  className="w-full p-2 bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none"
                >
                  <option value="Marathi">Marathi</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRunSimulation}
                className="w-full py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-semibold flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Run Routing Simulation
              </button>
            </div>

            {/* Simulation Output */}
            {simulationResult && (
              <div className="p-4 bg-bg-canvas border border-brand-primary/30 rounded-lg space-y-3 pt-3">
                <div className="text-[11px] font-semibold text-brand-primary flex items-center justify-between">
                  <span>Engine Output</span>
                  <span>Strategy: {simulationResult.strategyUsed}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-text-secondary">Selected Partner:</div>
                  <div className="text-sm font-semibold text-text-primary">
                    {simulationResult.selectedPartnerName || 'No eligible partner available'}
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-1.5 text-xs">
                  <div className="font-semibold text-text-secondary">Evaluated Candidates:</div>
                  {simulationResult.candidatesEvaluated.map((c) => (
                    <div key={c.partnerId} className="flex justify-between items-center text-[11px]">
                      <span className="text-text-primary truncate max-w-[140px]">{c.partnerName}</span>
                      {c.eligible ? (
                        <span className="text-brand-primary font-medium">Eligible ({c.activeLoad}/{c.maxCapacity})</span>
                      ) : (
                        <span className="text-negative font-medium truncate max-w-[120px]" title={c.rejectionReason}>
                          {c.rejectionReason}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
