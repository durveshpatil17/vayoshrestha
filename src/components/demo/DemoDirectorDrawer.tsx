import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Radio,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { scenarioEngine, DEMO_SCENARIOS, DemoScenario } from '@/demo/scenarioEngine';
import { ambientSimulator, AmbientTelemetryPulse } from '@/demo/ambientSimulator';
import { useAuthStore } from '@/store/authStore';
import { RoleCode } from '@/permissions/matrix';

interface DemoDirectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoDirectorDrawer: React.FC<DemoDirectorDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const switchPersona = useAuthStore((s) => s.switchPersona);

  const [activeScenario, setActiveScenario] = useState<DemoScenario>(scenarioEngine.getActiveScenario());
  const [speed, setSpeed] = useState(scenarioEngine.getSpeed());
  const [lastPulse, setLastPulse] = useState<AmbientTelemetryPulse | null>(null);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    ambientSimulator.start();
    const unsub = ambientSimulator.subscribe((pulse) => {
      setLastPulse(pulse);
      setPulseCount(ambientSimulator.getPulseCount());
    });
    return () => {
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectScenario = (scId: DemoScenario['id']) => {
    scenarioEngine.applyScenario(scId);
    const updated = scenarioEngine.getActiveScenario();
    setActiveScenario(updated);
    switchPersona(updated.recommendedRole as RoleCode);
    navigate(updated.startingRoute);

    setToastMessage(`Loaded scenario ${scId}: ${updated.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSpeedChange = (newSpeed: 'paused' | '1x' | '5x' | 'realtime') => {
    scenarioEngine.setSpeed(newSpeed);
    setSpeed(newSpeed);
  };

  const handleStepAction = (step: DemoScenario['steps'][0]) => {
    switchPersona(step.targetRole as RoleCode);
    navigate(step.targetRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-text/40">
      <div className="w-96 max-w-full h-full bg-surface border-l border-border flex flex-col shadow-drawer">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-accent-tint text-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">Demo Director</h2>
              <span className="text-xs text-text-secondary">CSR Funder Showcase Controller</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-subtle text-text-secondary hover:text-text"
            aria-label="Close demo director"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {toastMessage && (
          <div className="px-4 py-2 bg-positive-tint text-positive border-b border-positive/30 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Ambient Simulator Speed Controls */}
          <div className="p-3 bg-surface-subtle rounded-container border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${speed === 'paused' ? 'text-text-secondary' : 'text-positive'}`} />
                Ambient Simulator Ticker
              </span>
              <span className="text-text-secondary tabular-nums">Pulse #{pulseCount}</span>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleSpeedChange('paused')}
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  speed === 'paused'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle'
                }`}
              >
                Pause
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('1x')}
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  speed === '1x'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle'
                }`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('5x')}
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  speed === '5x'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle'
                }`}
              >
                5x Fast
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('realtime')}
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  speed === 'realtime'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle'
                }`}
              >
                Realtime
              </button>
            </div>

            {lastPulse && (
              <div className="p-2 rounded bg-surface border border-border-subtle text-xs space-y-0.5">
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="font-semibold text-text">{lastPulse.title}</span>
                  <span className="tabular-nums">{lastPulse.chapter}</span>
                </div>
                <p className="text-text-secondary text-xs">{lastPulse.details}</p>
              </div>
            )}
          </div>

          {/* Scenario Selector Pills */}
          <div className="space-y-2">
            <span className="font-semibold text-text block">Select Demonstration Scenario (S1–S6)</span>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_SCENARIOS.map((sc) => {
                const isCurrent = activeScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`p-2 rounded text-left border transition-colors ${
                      isCurrent
                        ? 'bg-accent-tint border-accent text-accent font-semibold'
                        : 'bg-surface border-border text-text hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="tabular-nums font-semibold">{sc.id}</span>
                      {isCurrent && <CheckCircle2 className="w-3 h-3 stroke-[2]" />}
                    </div>
                    <div className="text-xs text-text truncate mt-0.5">{sc.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Scenario Narrative */}
          <div className="p-3 bg-surface border border-border rounded-container space-y-3">
            <div>
              <span className="text-xs text-accent font-semibold block">{activeScenario.id}: {activeScenario.name}</span>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{activeScenario.tagline}</p>
            </div>

            {/* Funder Talking Points */}
            <div className="space-y-1.5 pt-1">
              <span className="font-semibold text-text block">CSR Funder Value Proposition</span>
              <ul className="space-y-1 text-text-secondary list-disc pl-4">
                {activeScenario.talkingPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Guided Script Steps */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <span className="font-semibold text-text block">Recommended Walkthrough Steps</span>
              <div className="space-y-2">
                {activeScenario.steps.map((st, i) => (
                  <div key={i} className="p-2.5 rounded bg-surface-subtle border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text">
                        {i + 1}. {st.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs text-text-secondary font-semibold">
                        Role: {st.targetRole}
                      </span>
                    </div>
                    <p className="text-text-secondary">{st.description}</p>
                    <div className="pt-1 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStepAction(st)}
                        icon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        {st.actionLabel || 'Go to step'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between bg-surface-subtle">
          <span className="text-xs text-text-secondary">Shortcut: <strong>Ctrl+Shift+D</strong></span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSelectScenario(activeScenario.id)}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset scenario
          </Button>
        </div>
      </div>
    </div>
  );
};
