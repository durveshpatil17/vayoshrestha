import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { parseVitalsInput } from '@/domain/vitalsParser';
import { evaluateVitalsReading } from '@/domain/thresholds';
import {
  ShieldCheck,
  HeartPulse,
  Activity,
  Play,
  ArrowLeft,
  AlertTriangle,
  Save,
  CheckCircle,
  PhoneCall,
} from 'lucide-react';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

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
      {/* Prominent non-clinical notice banner */}
      <MessageStrip type="informative">
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Nav & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health')}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text">Vital Anomaly Thresholds & Routing Rules</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure risk bands for Blood Pressure and Glucose. High-risk bands trigger welfare calls; critical bands trigger emergency SOS.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <MessageStrip type="positive" onClose={() => setFeedback(null)}>
          {feedback}
        </MessageStrip>
      )}

      {/* Mandatory Clinician Placeholder MessageStrip */}
      <MessageStrip
        type="critical"
        title="Provisional Operational Parameters — Clinician Validation Mandatory"
      >
        The values shown below are provisional operational defaults for software evaluation. Formal clinical sign-off from a certified physician and NGO Management approval is legally mandatory prior to deploying live senior notifications.
      </MessageStrip>

      {/* Approval Status Card */}
      <Container className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text">
                Rule Version: {currentConfig.version} · Governance:
              </span>
              <StatusChip
                status={currentConfig.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
                label={currentConfig.approvalStatus || 'APPROVED'}
              />
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Care Team (CT) proposes clinical thresholds; NGO Management (NM) approves. Maker cannot self-approve.
            </p>
          </div>
        </div>

        {isNM && currentConfig.approvalStatus === 'PENDING_APPROVAL' && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApprove}
            className="bg-positive hover:bg-positive/90 text-white"
          >
            Approve Threshold Version
          </Button>
        )}
      </Container>

      {/* Interactive 'Test a Reading' Tool */}
      <Container className="p-5 space-y-4">
        <h2 className="font-semibold text-sm text-text flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          Interactive Rule Test Scratchpad
        </h2>
        <p className="text-xs text-text-secondary">
          Type an arbitrary user input format (e.g. 140/90, 140 90, BP 150 over 95, 240 mg/dl) to verify parsing and band outcome.
        </p>

        <form onSubmit={handleRunTest} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="e.g. 145/95 or 240"
            className="flex-1 h-10 text-xs px-3 border border-border rounded-control bg-surface text-text focus:outline-none focus:border-accent tabular-nums"
            required
          />
          <Button type="submit" variant="primary" size="sm" className="gap-1.5 bg-accent">
            <Play className="w-3.5 h-3.5 fill-current" />
            Evaluate Reading
          </Button>
        </form>

        {testResult && (
          <div className="p-3 bg-page border border-border rounded-control text-xs space-y-1">
            {testResult.error ? (
              <span className="text-negative font-semibold">{testResult.error}</span>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Parsed Type:</span>
                  <span className="font-semibold text-text">
                    {testResult.parsed.readingType} (
                    {testResult.parsed.systolic
                      ? `${testResult.parsed.systolic}/${testResult.parsed.diastolic} mmHg`
                      : `${testResult.parsed.glucoseValue} mg/dL`}
                    )
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Evaluated Risk Band:</span>
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
                <div className="flex justify-between pt-1 border-t border-border">
                  <span className="text-text-secondary">Operational Action:</span>
                  <span className="font-semibold text-accent inline-flex items-center gap-1.5">
                    {testResult.evaluated.action === 'ESCALATE_TO_SOS' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-negative" /> Immediately Trigger Emergency SOS Alert
                      </>
                    ) : testResult.evaluated.action === 'FLAG_FOR_CALL' ? (
                      <>
                        <PhoneCall className="w-4 h-4 text-critical" /> Create Chapter Manager Wellness Call Task
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-positive" /> Log Reading Silently (Normal)
                      </>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </Container>

      {/* Threshold Rules Configuration Form */}
      <form onSubmit={handlePropose} className="space-y-6">
        {/* Blood Pressure Bands */}
        <Container className="p-5 space-y-4">
          <h2 className="font-semibold text-sm text-text flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-accent" />
            Blood Pressure (BP) Risk Bands (mmHg)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-page border border-border rounded-control space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-critical">High-Risk Band (Wellness Call)</span>
                <span className="text-xs bg-critical-tint text-critical px-2 py-0.5 rounded-control font-semibold">
                  FLAG FOR CALL
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Readings at or above these thresholds trigger an anomaly queue entry for human follow-up.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Systolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpHighRiskSystolic}
                    onChange={(e) => setBpHighRiskSystolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Diastolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpHighRiskDiastolic}
                    onChange={(e) => setBpHighRiskDiastolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-negative-tint border border-negative/30 rounded-control space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-negative">Critical Band (Treated as SOS)</span>
                <span className="text-xs bg-negative text-white px-2 py-0.5 rounded-control font-semibold">
                  EMERGENCY SOS
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Readings in this extreme range immediately trigger an Emergency SOS alert across the regional board.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Systolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpCriticalSystolic}
                    onChange={(e) => setBpCriticalSystolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">
                    Diastolic Min (mmHg):
                  </label>
                  <input
                    type="number"
                    value={bpCriticalDiastolic}
                    onChange={(e) => setBpCriticalDiastolic(Number(e.target.value))}
                    disabled={!canPropose}
                    className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Blood Glucose Bands */}
        <Container className="p-5 space-y-4">
          <h2 className="font-semibold text-sm text-text flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Blood Glucose Risk Bands (mg/dL)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-page border border-border rounded-control space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-critical">High-Risk Band (Wellness Call)</span>
                <span className="text-xs bg-critical-tint text-critical px-2 py-0.5 rounded-control font-semibold">
                  FLAG FOR CALL
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Glucose readings exceeding standard post-prandial ranges prompt chapter check-in.
              </p>
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Glucose Min (mg/dL):
                </label>
                <input
                  type="number"
                  value={glucoseHighRiskMin}
                  onChange={(e) => setGlucoseHighRiskMin(Number(e.target.value))}
                  disabled={!canPropose}
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                />
              </div>
            </div>

            <div className="p-4 bg-negative-tint border border-negative/30 rounded-control space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-negative">Critical Band (Treated as SOS)</span>
                <span className="text-xs bg-negative text-white px-2 py-0.5 rounded-control font-semibold">
                  EMERGENCY SOS
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Extreme hyper- or hypoglycemic values trigger an urgent incident alert.
              </p>
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Glucose Min (mg/dL):
                </label>
                <input
                  type="number"
                  value={glucoseCriticalMin}
                  onChange={(e) => setGlucoseCriticalMin(Number(e.target.value))}
                  disabled={!canPropose}
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text tabular-nums"
                />
              </div>
            </div>
          </div>
        </Container>

        {canPropose && (
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" className="gap-1.5 bg-accent">
              <Save className="w-4 h-4" />
              {isNM ? 'Save & Approve Thresholds' : 'Propose Changes to NM'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
