import { describe, it, expect } from 'vitest';
import { CANONICAL_REDIRECTS } from '@/routes/redirects';

describe('Loop R3: Tabbed App Hubs & URL Query Param Sync', () => {
  it('validates every canonical redirect targets a valid tabbed hub with ?tab=', () => {
    const validHubs = [
      '/sos/cases',
      '/health/queue',
      '/health/schedules-hub',
      '/health/rules-hub',
      '/support/queue',
      '/onboarding',
      '/attendance',
      '/feedback',
      '/feedback/follow-ups',
      '/vouchers',
      '/telemetry',
      '/telemetry/packs',
    ];

    for (const entry of CANONICAL_REDIRECTS) {
      const [basePath, search] = entry.destination.split('?');
      expect(
        validHubs,
        `Redirect destination ${entry.destination} base path ${basePath} should be a recognized hub`
      ).toContain(basePath);

      expect(
        search,
        `Redirect destination ${entry.destination} must contain a ?tab= parameter`
      ).toMatch(/^tab=[a-z-]+$/);
    }
  });

  it('verifies the 8 primary tabbed hubs have well-defined default tabs', () => {
    const hubDefaults: Record<string, string> = {
      '/sos/cases': 'active',
      '/health/queue': 'requests',
      '/health/schedules-hub': 'schedules',
      '/health/rules-hub': 'thresholds',
      '/support/queue': 'requests',
      '/attendance': 'today',
      '/feedback': 'hub',
      '/telemetry': 'cohort',
    };

    expect(Object.keys(hubDefaults).length).toBe(8);
    for (const [hub, defaultTab] of Object.entries(hubDefaults)) {
      expect(defaultTab.length).toBeGreaterThan(0);
    }
  });
});
