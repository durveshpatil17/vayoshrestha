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
      <div className="p-4 bg-emerald-50 border border-accent/20 rounded-xl flex items-center justify-between text-xs text-accent">
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
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent" />
                  Active Routing Policies
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Automated routing logic evaluated during every senior referral.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-page text-text-secondary border-b border-border">
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
                    <tr key={rule.id} className="hover:bg-page/50 transition-colors">
                      <td className="p-3 font-semibold text-text ">
                        {rule.category.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-accent font-semibold ">
                        {rule.strategy.replace('-', ' ')}
                      </td>
                      <td className="p-3 text-text-secondary">{rule.escalationSlaHours} hours</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-accent rounded font-semibold text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                      <td className="p-3 text-text-secondary">
                        <div>{rule.updatedBy}</div>
                        {rule.approvedBy && (
                          <div className="text-xs text-accent">Approved: {rule.approvedBy}</div>
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
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Play className="w-4 h-4 text-accent" />
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
                  className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none"
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
                  className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none"
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
                  className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none"
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
                className="w-full py-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Run Routing Simulation
              </button>
            </div>

            {/* Simulation Output */}
            {simulationResult && (
              <div className="p-4 bg-page border border-accent/30 rounded-lg space-y-3 pt-3">
                <div className="text-xs font-semibold text-accent flex items-center justify-between">
                  <span>Engine Output</span>
                  <span>Strategy: {simulationResult.strategyUsed}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-text-secondary">Selected Partner:</div>
                  <div className="text-sm font-semibold text-text">
                    {simulationResult.selectedPartnerName || 'No eligible partner available'}
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-1.5 text-xs">
                  <div className="font-semibold text-text-secondary">Evaluated Candidates:</div>
                  {simulationResult.candidatesEvaluated.map((c) => (
                    <div key={c.partnerId} className="flex justify-between items-center text-xs">
                      <span className="text-text truncate max-w-36">{c.partnerName}</span>
                      {c.eligible ? (
                        <span className="text-accent font-semibold">Eligible ({c.activeLoad}/{c.maxCapacity})</span>
                      ) : (
                        <span className="text-negative font-semibold truncate max-w-32" title={c.rejectionReason}>
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
