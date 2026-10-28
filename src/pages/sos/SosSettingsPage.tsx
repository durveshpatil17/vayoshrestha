import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Settings,
  ShieldCheck,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
  Save,
  CheckCircle,
} from 'lucide-react';

export const SosSettingsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isNM = user?.role === 'NM';
  const isRA = user?.role === 'RA';
  const isSA = user?.role === 'SA';
  const canEdit = isNM || isRA;

  const currentSettings = data.sosSettings;

  // Form states
  const [slaMinutes, setSlaMinutes] = useState(currentSettings.acknowledgementSlaMinutes || 2);
  const [escalationStep1, setEscalationStep1] = useState(
    currentSettings.escalationChainMinutes?.[0] || 2
  );
  const [escalationStep2, setEscalationStep2] = useState(
    currentSettings.escalationChainMinutes?.[1] || 5
  );
  const [fallbackMode, setFallbackMode] = useState(currentSettings.cellularFallbackMode || 'STOP_AT_FIRST_DELIVERED');
  const [emergency112Text, setEmergency112Text] = useState(currentSettings.emergency112Notice || 'In an emergency call 112');
  const [selectedLang, setSelectedLang] = useState<string>('ENGLISH');
  const [smsTemplateText, setSmsTemplateText] = useState(
    currentSettings.smsWording?.[selectedLang] || 'Emergency alert for {senior_name}'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setSmsTemplateText(currentSettings.smsWording?.[lang] || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    currentSettings.acknowledgementSlaMinutes = slaMinutes;
    currentSettings.escalationChainMinutes = [escalationStep1, escalationStep2];
    currentSettings.cellularFallbackMode = fallbackMode;
    currentSettings.emergency112Notice = emergency112Text;
    if (!currentSettings.smsWording) currentSettings.smsWording = {};
    currentSettings.smsWording[selectedLang] = smsTemplateText;

    if (isNM) {
      currentSettings.approvalStatus = 'APPROVED';
      currentSettings.approvedBy = user?.id;
    } else {
      currentSettings.approvalStatus = 'PENDING_APPROVAL';
      currentSettings.updatedBy = user?.id;
    }

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: user?.chapterId || 'ORGANISATION',
      action: 'SOS_SETTINGS_UPDATE',
      entityType: 'SETTINGS',
      entityId: 'SOS_CONFIG',
      details: `SOS operational settings updated (${currentSettings.approvalStatus}) by ${
        user?.name || user?.role
      }.`,
    });

    mockStore.persist();
    setFeedback(
      isNM
        ? 'Settings updated and immediately approved as NGO Management.'
        : 'Settings submitted to NGO Management for Maker-Checker approval.'
    );
  };

  const handleApprove = () => {
    currentSettings.approvalStatus = 'APPROVED';
    currentSettings.approvedBy = user?.id;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: 'NM',
      chapterId: 'ORGANISATION',
      action: 'SOS_SETTINGS_APPROVE',
      entityType: 'SETTINGS',
      entityId: 'SOS_CONFIG',
      details: `SOS settings version approved by NGO Management (${user?.name}).`,
    });

    mockStore.persist();
    setFeedback('SOS configuration approved and active across all regional chapters.');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <PageHeader
        title="Emergency SOS & Cellular Fallback Configuration"
        description="Configure acknowledgement SLAs, auto-escalation timings, carrier SMS templates, and maker-checker approvals."
      />

      {feedback && (
        <div className="p-3 bg-success-surface border border-success/30 rounded text-xs text-success flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Approval Status Card */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">Maker-Checker Policy:</span>
              <StatusChip
                status={currentSettings.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
                label={currentSettings.approvalStatus || 'APPROVED'}
              />
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Changes submitted by Regional Admins require formal review and approval by NGO
              Management.
            </p>
          </div>
        </div>

        {isNM && currentSettings.approvalStatus === 'PENDING_APPROVAL' && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApprove}
            className="text-xs bg-success hover:bg-success/90 text-white"
          >
            Approve Configuration
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SLA and Timings */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Acknowledgement SLA & Auto-Escalation Ladder
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-text-muted mb-1">
                Acknowledgement SLA:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={slaMinutes}
                  onChange={(e) => setSlaMinutes(Number(e.target.value))}
                  disabled={!canEdit}
                  className="w-20 px-2.5 py-1.5 border border-border-hairline rounded font-mono"
                  required
                />
                <span className="text-text-muted">minutes</span>
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                Max duration before triggering SLA breach banner. Default: 2 min.
              </p>
            </div>

            <div>
              <label className="block font-medium text-text-muted mb-1">
                Escalation Step 1 (RA):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={escalationStep1}
                  onChange={(e) => setEscalationStep1(Number(e.target.value))}
                  disabled={!canEdit}
                  className="w-20 px-2.5 py-1.5 border border-border-hairline rounded font-mono"
                  required
                />
                <span className="text-text-muted">minutes</span>
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                Unacknowledged alert escalates to Regional Admin.
              </p>
            </div>

            <div>
              <label className="block font-medium text-text-muted mb-1">
                Escalation Step 2 (Care/NM):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={escalationStep2}
                  onChange={(e) => setEscalationStep2(Number(e.target.value))}
                  disabled={!canEdit}
                  className="w-20 px-2.5 py-1.5 border border-border-hairline rounded font-mono"
                  required
                />
                <span className="text-text-muted">minutes</span>
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                Escalates to Central Care Team and Management.
              </p>
            </div>
          </div>
        </div>

        {/* Cellular Fallback Strategy */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <Radio className="w-4 h-4 text-accent" />
            Cellular Fallback Routing Behavior
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 bg-surface-subtle border border-border-hairline rounded cursor-pointer">
              <input
                type="radio"
                name="fallbackMode"
                value="STOP_AT_FIRST_DELIVERED"
                checked={fallbackMode === 'STOP_AT_FIRST_DELIVERED'}
                onChange={() => setFallbackMode('STOP_AT_FIRST_DELIVERED')}
                disabled={!canEdit}
                className="mt-0.5 text-accent"
              />
              <div>
                <span className="font-bold text-text-primary block">
                  Priority Cascade (Stop at first delivered)
                </span>
                <span className="text-text-muted">
                  Dispatches transactional SMS to Priority 1 contact. Only cascades to Priority 2 if
                  carrier reports a delivery failure within 45 seconds.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-surface-subtle border border-border-hairline rounded cursor-pointer">
              <input
                type="radio"
                name="fallbackMode"
                value="BROADCAST_ALL"
                checked={fallbackMode === 'BROADCAST_ALL'}
                onChange={() => setFallbackMode('BROADCAST_ALL')}
                disabled={!canEdit}
                className="mt-0.5 text-accent"
              />
              <div>
                <span className="font-bold text-text-primary block">
                  Simultaneous Broadcast (All contacts)
                </span>
                <span className="text-text-muted">
                  Pushes emergency alert simultaneously to all registered Next-of-Kin contacts on
                  file.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SMS Fallback Wording & Emergency 112 Notice */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-hairline pb-3">
            <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Fallback SMS Copy & Emergency Notice
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Language:</span>
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="text-xs px-2 py-1 border border-border-hairline rounded bg-white"
              >
                <option value="ENGLISH">English</option>
                <option value="HINDI">Hindi (हिंदी)</option>
                <option value="KANNADA">Kannada (ಕನ್ನಡ)</option>
                <option value="MARATHI">Marathi (मराठी)</option>
                <option value="TAMIL">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-medium text-text-muted">
                  DLT-Registered Transactional SMS Body ({selectedLang}):
                </label>
                <span className="font-mono text-text-muted">
                  {smsTemplateText.length} characters (1 GSM credit)
                </span>
              </div>
              <textarea
                rows={3}
                value={smsTemplateText}
                onChange={(e) => setSmsTemplateText(e.target.value)}
                disabled={!canEdit}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded font-mono focus:outline-none focus:border-accent"
              />
              <p className="text-[10px] text-text-muted mt-1">
                Available variables: <code>{'{senior_name}'}</code>, <code>{'{chapter}'}</code>,{' '}
                <code>{'{timestamp}'}</code>
              </p>
            </div>

            <div>
              <label className="block font-medium text-text-muted mb-1">
                Permanent Emergency Notice Text (displayed on Simulator & Case File):
              </label>
              <input
                type="text"
                value={emergency112Text}
                onChange={(e) => setEmergency112Text(e.target.value)}
                disabled={!canEdit}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5">
              <Save className="w-3.5 h-3.5" />
              {isNM ? 'Save & Apply Settings' : 'Submit for NM Approval'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
