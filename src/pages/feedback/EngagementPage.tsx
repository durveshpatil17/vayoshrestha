import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { TrendingUp, AlertTriangle, Sparkles, UserCheck, Calendar, ArrowRight } from 'lucide-react';

export const EngagementPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [activeTab, setActiveTab] = useState<'dropoffs' | 'recommendations'>('dropoffs');

  // Inactive / Drop-off seniors: registered but attended 0 sessions in last 30 days
  const dropOffSeniors = data.seniorCitizens.filter((s) => !s.isActive && s.status === 'Registered').slice(0, 30);

  // Deterministic rule-based recommendations (FR-38, strictly no AI claims)
  const recommendations = [
    {
      id: 'rec-1',
      memberId: data.seniorCitizens[0]?.id || 'm-1',
      memberName: data.seniorCitizens[0]?.fullName || 'Kamala Deshpande',
      ruleCode: 'RULE_YOGA_TO_MOBILITY',
      ruleExplanation: 'Rule: Member attended Yoga ≥ 4 times in last 30 days → Recommend Balance & Mobility Circle',
      recommendedProgramme: 'Balance & Fall Prevention Circle',
      confidence: 'Deterministic (Attendance Pattern Match)',
    },
    {
      id: 'rec-2',
      memberId: data.seniorCitizens[2]?.id || 'm-3',
      memberName: data.seniorCitizens[2]?.fullName || 'Sitaram Joshi',
      ruleCode: 'RULE_NEW_MEMBER_DIGITAL',
      ruleExplanation: 'Rule: New member registered in last 14 days with smartphone → Recommend Digital Banking Safety',
      recommendedProgramme: 'Digital Smartphone & Cyber Safety Workshop',
      confidence: 'Deterministic (Onboarding Pathway)',
    },
    {
      id: 'rec-3',
      memberId: data.seniorCitizens[4]?.id || 'm-5',
      memberName: data.seniorCitizens[4]?.fullName || 'Mohan Kulkarni',
      ruleCode: 'RULE_SOCIAL_ISOLATION_PREVENTION',
      ruleExplanation: 'Rule: Elder lives alone (family proxy outside city) → Recommend Weekly Bhajan & Social Meet',
      recommendedProgramme: 'Devotional Music & Social Circle',
      confidence: 'Deterministic (Living Arrangement Factor)',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Engagement History & Drop-off Management"
        description="Rule-based participation pathways, drop-off mitigation, and deterministic recommendations (FR-38)"
        breadcrumb={[{ label: 'Feedback', href: '/feedback' }, { label: 'Engagement' }]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border-hairline gap-6">
        <button
          onClick={() => setActiveTab('dropoffs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'dropoffs'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Drop-Off Mitigation List ({dropOffSeniors.length})
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'recommendations'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Rule-Based Recommendations ({recommendations.length})
        </button>
      </div>

      {activeTab === 'dropoffs' ? (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Drop-Off Definition (FR-38):</strong> Senior citizens who have been registered for at least 30 days
              but have zero session attendance marks in the last 30 calendar days. Outreach calls should be prioritized by coordinators.
            </div>
          </div>

          <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
                <tr>
                  <th className="py-3 px-4">Membership ID</th>
                  <th className="py-3 px-4">Senior Citizen</th>
                  <th className="py-3 px-4">Ekta Hub</th>
                  <th className="py-3 px-4">Days Inactive</th>
                  <th className="py-3 px-4">WhatsApp Consent</th>
                  <th className="py-3 px-4 text-right">Outreach Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
                {dropOffSeniors.map((s) => {
                  const centre = data.centres.find((c) => c.id === s.centreId);

                  return (
                    <tr key={s.id} className="hover:bg-bg-subtle/40">
                      <td className="py-3.5 px-4 font-mono text-text-muted">{s.membershipId}</td>
                      <td className="py-3.5 px-4 font-medium">
                        <Link to={`/members/${s.id}`} className="hover:text-accent underline decoration-dotted">
                          {s.fullName}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">{centre?.name || s.centreId}</td>
                      <td className="py-3.5 px-4 font-semibold text-rose-700">30+ Days</td>
                      <td className="py-3.5 px-4">
                        <StatusChip
                          label={s.consentStatus}
                          variant={s.consentStatus === 'OptedIn' ? 'active' : 'warning'}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/follow-ups`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Create Follow-Up
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted">
            <strong className="text-text-primary">Transparent Rule-Based Logic (FR-38):</strong> Vayoshreshtha deliberately does not use black-box AI
            recommendations. All suggestions are triggered by auditable, rule-based attendance criteria configured by programme directors.
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-bg-base border border-border-hairline rounded p-5 space-y-3 hover:border-border-strong transition-all shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-text-primary">{rec.memberName}</h4>
                    <div className="text-xs font-mono text-text-muted mt-0.5">{rec.ruleCode}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    Recommended: {rec.recommendedProgramme}
                  </span>
                </div>

                <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-primary">
                  {rec.ruleExplanation}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-text-muted font-mono text-[11px]">{rec.confidence}</span>
                  <Link to={`/members/${rec.memberId}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      View Member & Suggest Programme <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
