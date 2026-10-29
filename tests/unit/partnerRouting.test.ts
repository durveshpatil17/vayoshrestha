import { describe, it, expect } from 'vitest';
import {
  routeRequest,
  submitServiceRequest,
  reassignRequest,
  PARTNER_REGISTRY,
} from '@/domain/routing/engine';

describe('Layer 2 — Partner Routing Fabric Domain Engine', () => {
  it('deterministically selects least-loaded partner for hospital category', () => {
    const result = routeRequest({
      seniorId: 'SC-TEST-1',
      seniorName: 'Test Senior',
      seniorPhone: '+91 99999 11111',
      category: 'hospital',
      region: 'pune',
      language: 'Marathi',
    });

    expect(result.selectedPartner).toBeDefined();
    // Sahyadri (load 3) is less than Ruby Hall (load 4)
    expect(result.selectedPartner?.id).toBe('ptn-sahyadri');
    expect(result.decisionRecord.candidatesEvaluated.length).toBeGreaterThanOrEqual(2);
    expect(result.decisionRecord.strategyUsed).toBe('least-loaded');
  });

  it('rejects partner whose daily capacity is exhausted', () => {
    // ptn-nyaya-bandhu is at 4/4 capacity
    const result = routeRequest({
      seniorId: 'SC-TEST-2',
      seniorName: 'Test Legal Senior',
      seniorPhone: '+91 99999 22222',
      category: 'legal',
      region: 'nagpur',
      language: 'Marathi',
    });

    const rejectedCandidate = result.decisionRecord.candidatesEvaluated.find(
      (c) => c.partnerId === 'ptn-nyaya-bandhu'
    );
    expect(rejectedCandidate?.eligible).toBe(false);
    expect(rejectedCandidate?.rejectionReason).toContain('Daily capacity exhausted');
  });

  it('generates immutable decision record with candidates and rejection reasons', () => {
    const result = routeRequest({
      seniorId: 'SC-TEST-3',
      seniorName: 'Test Diagnostic',
      seniorPhone: '+91 99999 33333',
      category: 'diagnostic_lab',
      region: 'mumbai',
      language: 'Marathi',
    });

    expect(result.decisionRecord).toBeDefined();
    expect(result.decisionRecord.ruleIdMatched).toBe('rule-diag-round');
    expect(result.decisionRecord.slaDeadline).toBeDefined();
  });

  it('submits service request and increments partner active load', () => {
    const partner = PARTNER_REGISTRY.find((p) => p.id === 'ptn-sahyadri')!;
    const initialLoad = partner.currentActiveAssigned;

    const req = submitServiceRequest({
      seniorId: 'SC-TEST-4',
      seniorName: 'Submitted Senior',
      seniorPhone: '+91 99999 44444',
      category: 'hospital',
      region: 'pune',
      language: 'Marathi',
      notes: 'Post-discharge follow-up',
    });

    expect(req.id).toMatch(/^req-/);
    expect(req.assignedPartnerId).toBe('ptn-sahyadri');
    expect(partner.currentActiveAssigned).toBe(initialLoad + 1);
  });

  it('reassigns request and adjusts load balancing between partners', () => {
    const req = submitServiceRequest({
      seniorId: 'SC-TEST-5',
      seniorName: 'Reassignment Senior',
      seniorPhone: '+91 99999 55555',
      category: 'hospital',
      region: 'pune',
      language: 'Marathi',
    });

    const reassigned = reassignRequest(req.id, 'ptn-rubyhall', 'Specialist requested by family');
    expect(reassigned.status).toBe('reassigned');
    expect(reassigned.assignedPartnerId).toBe('ptn-rubyhall');
    expect(reassigned.notes).toContain('Specialist requested by family');
  });
});
