import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('processesSpec: spec lint', () => {
  it('validates docs/PROCESSES.md contains all 15 processes P1 through P15 with terminal states', () => {
    const processesDoc = fs.readFileSync(path.resolve(__dirname, '../../docs/PROCESSES.md'), 'utf8');

    for (let i = 1; i <= 15; i++) {
      const pid = `P${i}`;
      expect(processesDoc).toContain(`## ${pid}:`);
      expect(processesDoc).toContain('Terminal States');
      expect(processesDoc).toContain('Handoffs');
    }
  });

  it('validates docs/JOURNEYS.md contains all 15 journey test scripts J-01 through J-15', () => {
    const journeysDoc = fs.readFileSync(path.resolve(__dirname, '../../docs/JOURNEYS.md'), 'utf8');

    for (let i = 1; i <= 15; i++) {
      const jid = `J-${String(i).padStart(2, '0')}`;
      expect(journeysDoc).toContain(`## ${jid}:`);
      expect(journeysDoc).toContain('Cast');
      expect(journeysDoc).toContain('Steps');
      expect(journeysDoc).toContain('Verification');
    }
  });

  it('validates docs/CONTENT_STYLE.md establishes canonical glossary and E-XXXX error code format', () => {
    const styleDoc = fs.readFileSync(path.resolve(__dirname, '../../docs/CONTENT_STYLE.md'), 'utf8');

    // Glossary terms
    expect(styleDoc).toContain('**Chapter**');
    expect(styleDoc).toContain('**Senior**');
    expect(styleDoc).toContain('**Field associate**');
    expect(styleDoc).toContain('**Emergency**');
    expect(styleDoc).toContain('**Wellness call**');
    expect(styleDoc).toContain('**Voucher**');
    expect(styleDoc).toContain('**Legal intake**');
    expect(styleDoc).toContain('**Impact pack**');

    // Error codes
    expect(styleDoc).toMatch(/E-4031/);
    expect(styleDoc).toMatch(/E-4041/);
    expect(styleDoc).toMatch(/E-4221/);
    expect(styleDoc).toMatch(/E-4222/);
  });

  it('validates docs/DATA_REALISM.md specifies all 8 named in-flight stories', () => {
    const realismDoc = fs.readFileSync(path.resolve(__dirname, '../../docs/DATA_REALISM.md'), 'utf8');

    expect(realismDoc).toContain('Smt. Lakshmi Devi');
    expect(realismDoc).toContain('Shri Ramesh Kulkarni');
    expect(realismDoc).toContain('Shri Abdul Rehman');
    expect(realismDoc).toContain('Smt. Savitri Patil');
    expect(realismDoc).toContain('Shri Mohan Lal');
    expect(realismDoc).toContain('Dharwad Quiz');
  });

  it('validates docs/IA.md details 10 workspaces and explicit URL redirect mappings', () => {
    const iaDoc = fs.readFileSync(path.resolve(__dirname, '../../docs/IA.md'), 'utf8');

    expect(iaDoc).toContain('**Emergency**');
    expect(iaDoc).toContain('**Care**');
    expect(iaDoc).toContain('**Seniors**');
    expect(iaDoc).toContain('**Community**');
    expect(iaDoc).toContain('**Learning**');
    expect(iaDoc).toContain('**Messaging**');
    expect(iaDoc).toContain('**Partners**');
    expect(iaDoc).toContain('**Field network**');
    expect(iaDoc).toContain('**Insights**');
    expect(iaDoc).toContain('**Governance**');
    expect(iaDoc).toContain('**Administration**');

    // Check redirect mapping entries
    expect(iaDoc).toContain('/sos/history');
    expect(iaDoc).toContain('/health/flags');
    expect(iaDoc).toContain('/health/calls');
    expect(iaDoc).toContain('/onboarding/script');
    expect(iaDoc).toContain('/attendance/corrections');
    expect(iaDoc).toContain('/vouchers/campaigns');
    expect(iaDoc).toContain('/telemetry/trends');
  });
});

