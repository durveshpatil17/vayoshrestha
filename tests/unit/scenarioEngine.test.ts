import { describe, it, expect, beforeEach } from 'vitest';
import { scenarioEngine, DEMO_SCENARIOS } from '@/demo/scenarioEngine';
import { ambientSimulator } from '@/demo/ambientSimulator';
import { mockStore } from '@/mock/store';

describe('Scenario Engine & Ambient Operations Simulator (S1 through S6)', () => {
  beforeEach(() => {
    mockStore.resetToDefault();
  });

  it('provides all 6 canonical demo scenarios S1 through S6 with complete metadata', () => {
    const scenarios = scenarioEngine.getScenarios();
    expect(scenarios).toHaveLength(6);

    const ids = scenarios.map((s) => s.id);
    expect(ids).toEqual(['S1', 'S2', 'S3', 'S4', 'S5', 'S6']);

    scenarios.forEach((s) => {
      expect(s.name).toBeTruthy();
      expect(s.tagline).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.recommendedRole).toBeTruthy();
      expect(s.startingRoute.startsWith('/')).toBe(true);
      expect(s.talkingPoints.length).toBeGreaterThanOrEqual(3);
      expect(s.steps.length).toBeGreaterThanOrEqual(3);

      s.steps.forEach((step) => {
        expect(step.title).toBeTruthy();
        expect(step.targetRole).toBeTruthy();
        expect(step.targetRoute.startsWith('/')).toBe(true);
      });
    });
  });

  it('allows simulation speed adjustments between paused, 1x, 5x, and realtime', () => {
    expect(scenarioEngine.getSpeed()).toBe('1x');

    scenarioEngine.setSpeed('5x');
    expect(scenarioEngine.getSpeed()).toBe('5x');

    scenarioEngine.setSpeed('paused');
    expect(scenarioEngine.getSpeed()).toBe('paused');

    scenarioEngine.setSpeed('realtime');
    expect(scenarioEngine.getSpeed()).toBe('realtime');

    scenarioEngine.setSpeed('1x');
    expect(scenarioEngine.getSpeed()).toBe('1x');
  });

  it('applies scenario, resets base state, and records audit block', () => {
    scenarioEngine.applyScenario('S3');
    const active = scenarioEngine.getActiveScenario();
    expect(active.id).toBe('S3');
    expect(active.name).toContain('Emergency Escalation');

    const auditEvents = mockStore.getData().auditEvents;
    const scenarioLog = auditEvents.find((l) => l.entityId === 'SCENARIO-S3');
    expect(scenarioLog).toBeDefined();
    expect(scenarioLog?.action).toBe('UPDATE');
    expect(scenarioLog?.entityType).toBe('SETTINGS');
    expect(scenarioLog?.actorRole).toBe('SA');
    expect(scenarioLog?.details).toContain('Emergency Escalation Cascade');
  });

  it('supports ambient operations simulator subscription and status queries', () => {
    let receivedCount = 0;
    const unsub = ambientSimulator.subscribe((pulse) => {
      receivedCount++;
      expect(pulse.id).toBeTruthy();
      expect(pulse.chapter).toBeTruthy();
      expect(pulse.details).toBeTruthy();
    });

    expect(typeof unsub).toBe('function');
    unsub();
  });
});
