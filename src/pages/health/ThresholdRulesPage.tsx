import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { parseVitalsInput } from '@/domain/vitalsParser';
import { evaluateVitalsReading } from '@/domain/thresholds';
import {
  ShieldAlert,
  ShieldCheck,
  HeartPulse,
  Activity,
  Play,
  ArrowLeft,
  AlertTriangle,
  Save,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const ThresholdRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isNM = user?.role === 'NM';
  const isCT = user?.role === 'CT';
  const canPropose = isCT || isNM;

  const currentConfig = data.thresholdConfig;

  // Form states for BP
  const [bpHighRiskSystolic, setBpHighRiskSystolic] = useState(
    currentConfig.bloodPressure.highRisk.systolicMin
  );
  const [bpHighRiskDiastolic, setBpHighRiskDiastolic] = useState(
    currentConfig.bloodPressure.highRisk.diastolicMin
  );
  const [bpCriticalSystolic, setBpCriticalSystolic] = useState(
    currentConfig.bloodPressure.critical.systolicMin
  );
  const [bpCriticalDiastolic, setBpCriticalDiastolic] = useState(
    currentConfig.bloodPressure.critical.diastolicMin
  );

  // Form states for Glucose
  const [glucoseHighRiskMin, setGlucoseHighRiskMin] = useState(
    currentConfig.bloodGlucose.highRisk.glucoseMin
  );
  const [glucoseCriticalMin, setGlucoseCriticalMin] = useState(
    currentConfig.bloodGlucose.critical.glucoseMin
  );

  // Test tool state
  const [testInput, setTestInput] = useState('145/95');
  const [testResult, setTestResult] = useState<any>(null);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseVitalsInput(testInput);
    if (!parsed) {
      setTestResult({
        error:
          'Could not parse input. Please enter valid BP (e.g. 130/85) or Glucose (e.g. 112 mg/dl).',
      });
      return;
    }
    const evaluated = evaluateVitalsReading(parsed, currentConfig);
    setTestResult({ parsed, evaluated });
  };

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();

    currentConfig.bloodPressure.highRisk.systolicMin = bpHighRiskSystolic;
    currentConfig.bloodPressure.highRisk.diastolicMin = bpHighRiskDiastolic;
    currentConfig.bloodPressure.critical.systolicMin = bpCriticalSystolic;
    currentConfig.bloodPressure.critical.diastolicMin = bpCriticalDiastolic;

    currentConfig.bloodGlucose.highRisk.glucoseMin = glucoseHighRiskMin;
    currentConfig.bloodGlucose.critical.glucoseMin = glucoseCriticalMin;

    if (isNM) {
      currentConfig.approvalStatus = 'APPROVED';
      currentConfig.approvedBy = user?.id;
    } else {
      currentConfig.approvalStatus = 'PENDING_APPROVAL';
      currentConfig.proposedBy = user?.id;
    }

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CT',
      chapterId: 'ORGANISATION',
      action: 'THRESHOLD_RULES_UPDATE',
      entityType: 'SETTINGS',
      entityId: 'VITAL_THRESHOLDS',
      details: `Threshold rules updated (${currentConfig.approvalStatus}) by ${
        user?.name || user?.role
      }.`,
    });

    mockStore.persist();
    setFeedback(
      isNM
        ? 'Clinical thresholds saved and approved as NGO Management.'
        : 'Threshold proposals submitted to NGO Management for Maker-Checker sign-off.'
    );
  };

  const handleApprove = () => {
    currentConfig.approvalStatus = 'APPROVED';
    currentConfig.approvedBy = user?.id;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: 'NM',
      chapterId: 'ORGANISATION',
      action: 'THRESHOLD_RULES_APPROVE',
      entityType: 'SETTINGS',
      entityId: 'VITAL_THRESHOLDS',
      details: `Threshold rules version ${currentConfig.version} approved by NGO Management (${user?.name}).`,
    });

    mockStore.persist();
    setFeedback('Threshold rule configuration approved and active across pilot.');
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Health Overview
        </Button>
      </div>

      <PageHeader
        title="Vital Anomaly Thresholds & Routing Rules"
        description="Configure risk bands for Blood Pressure and Glucose. High-risk bands trigger welfare calls; critical bands trigger emergency SOS."
      />

      {feedback && (
        <div className="p-3 bg-success-surface border border-success/30 rounded text-xs text-success flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Mandatory Clinician Placeholder Banner */}
      <div className="p-4 bg-amber-50 border-l-4 border-warning rounded text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-warning" />
          PROVISIONAL PLACEHOLDER — TO BE SET BY A QUALIFIED CLINICIAN
        </div>
        <p className="leading-relaxed">
          The values shown below are placeholder operational defaults for engineering evaluation.
          Formal clinical sign-off from a certified physician and NGO Management approval is legally
          mandatory prior to deploying live senior notifications. Vayoshreshtha is strictly an
          operational outreach tool, not a medical diagnostic product.
        </p>
      </div>

      {/* Approval Status Card */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">
                Rule Version: {currentConfig.version} · Governance:
              </span>
              <StatusChip
                status={currentConfig.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
                label={currentConfig.approvalStatus || 'APPROVED'}
              />
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Care Team (CT) proposes clinical thresholds; NGO Management (NM) approves. Maker cannot
              self-approve.
            </p>
          </div>
        </div>

        {isNM && currentConfig.approvalStatus === 'PENDING_APPROVAL' && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApprove}
            className="text-xs bg-success hover:bg-success/90 text-white"
          >
            Approve Threshold Version
          </Button>
        )}
      </div>

      {/* Interactive 'Test a Reading' Tool */}
      <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
        <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          Interactive Rule Test Scratchpad
        </h3>
        <p className="text-xs text-text-muted">
          Type an arbitrary user input format (e.g. <code>140/90</code>, <code>140 90</code>,{' '}
          <code>BP 150 over 95</code>, <code>240 mg/dl</code>) to verify parsing and band outcome.
        </p>

        <form onSubmit={handleRunTest} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="e.g. 145/95 or 240"
            className="flex-1 text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent font-mono"
            required
          />
          <Button type="submit" variant="primary" size="sm" className="text-xs gap-1 bg-accent">
            <Play className="w-3.5 h-3.5 fill-current" />
            Evaluate Reading
          </Button>
        </form>

        {testResult && (
          <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs space-y-1">
            {testResult.error ? (
              <span className="text-danger font-medium">{testResult.error}</span>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-text-muted">Parsed Type:</span>
                  <span className="font-bold text-text-primary">
                    {testResult.parsed.readingType} (
                    {testResult.parsed.systolic
                      ? `${testResult.parsed.systolic}/${testResult.parsed.diastolic} mmHg`
                      : `${testResult.parsed.glucoseValue} mg/dL`}
                    )
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Evaluated Risk Band:</span>
                  <StatusChip
                    status={
                      testResult.evaluated.band === 'CRITICAL'
                        ? 'danger'
                        : testResult.evaluated.band === 'HIGH_RISK'
                        ? 'warning'
                        : 'success'
                    }
                    label={testResult.evaluated.band}
                  />
                </div>
                <div className="flex justify-between pt-1 border-t border-border-hairline">
                  <span className="text-text-muted">Operational Action:</span>
                  <span className="font-bold text-accent">
                    {testResult.evaluated.action === 'ESCALATE_TO_SOS'
                      ? '🚨 Immediately Trigger Emergency SOS Alert'
                      : testResult.evaluated.action === 'FLAG_FOR_CALL'
                      ? '📞 Create Chapter Manager Wellness Call Task'
                      : '✓ Log Reading Silently (Normal)'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Threshold Rules Configuration Form */}
      <form onSubmit={handlePropose} className="space-y-6">
        {/* Blood Pressure Bands */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-accent" />
            Blood Pressure (BP) Risk Bands (mmHg)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-surface-subtle border border-border-hairline rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-warning">High-Risk Band (Wellness Call)</span>
                <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded font-bold">
                  FLAG FOR CALL
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Readings at or above these thresholds trigger an anomaly queue entry for human
                follow-up.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-text-muted mb-0.5">
                    Systolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpHighRiskSystolic}
                    onChange={(e) => setBpHighRiskSystolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-0.5">
                    Diastolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpHighRiskDiastolic}
                    onChange={(e) => setBpHighRiskDiastolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-danger-surface border border-danger/30 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-danger">Critical Band (Treated as SOS)</span>
                <span className="text-[10px] bg-danger text-white px-1.5 py-0.5 rounded font-bold">
                  EMERGENCY SOS
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Readings in this extreme range immediately trigger an Emergency SOS alert across the
                regional board.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-text-muted mb-0.5">
                    Systolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpCriticalSystolic}
                    onChange={(e) => setBpCriticalSystolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-0.5">
                    Diastolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpCriticalDiastolic}
                    onChange={(e) => setBpCriticalDiastolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blood Glucose Bands */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Blood Glucose Risk Bands (mg/dL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-surface-subtle border border-border-hairline rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-warning">High-Risk Band (Wellness Call)</span>
                <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded font-bold">
                  FLAG FOR CALL
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Glucose readings exceeding standard post-prandial ranges prompt chapter check-in.
              </p>
              <div>
                <label className="block text-[11px] text-text-muted mb-0.5">
                  Glucose Min (mg/dL):
                </label>
                <input
                  type="number"
                  value={glucoseHighRiskMin}
                  onChange={(e) => setGlucoseHighRiskMin(Number(e.target.value))}
                  disabled={!canPropose}
                  className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-danger-surface border border-danger/30 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-danger">Critical Band (Treated as SOS)</span>
                <span className="text-[10px] bg-danger text-white px-1.5 py-0.5 rounded font-bold">
                  EMERGENCY SOS
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Extreme hyper- or hypoglycemic values trigger an urgent incident alert.
              </p>
              <div>
                <label className="block text-[11px] text-text-muted mb-0.5">
                  Glucose Min (mg/dL):
                </label>
                <input
                  type="number"
                  value={glucoseCriticalMin}
                  onChange={(e) => setGlucoseCriticalMin(Number(e.target.value))}
                  disabled={!canPropose}
                  className="w-full px-2 py-1.5 border border-border-hairline rounded font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {canPropose && (
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5 bg-accent">
              <Save className="w-3.5 h-3.5" />
              {isNM ? 'Save & Approve Thresholds' : 'Propose Changes to NM'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
