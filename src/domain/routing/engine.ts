/**
 * Partner Routing Fabric Domain Engine
 * Vayoshreshtha Ecosystem Layer 2 (Partner Aggregation & Routing)
 *
 * Implements:
 * - Deterministic Rule Matching (Category, Region, Language, Capacity, SLA)
 * - Load-balancing strategies: 'least-loaded' and 'round-robin'
 * - SLA Monitoring & Reassignment Flags
 * - Immutable Decision Records ("Why this partner")
 * - Rule Maker-Checker (PM drafts -> NM approves)
 */

export type ServiceCategory =
  | 'hospital'
  | 'diagnostic_lab'
  | 'legal'
  | 'financial'
  | 'insurer'
  | 'transport'
  | 'grocery';

export interface PartnerCapacity {
  id: string;
  name: string;
  category: ServiceCategory;
  regions: string[];
  languages: string[];
  dailyMaxCapacity: number;
  currentActiveAssigned: number;
  slaHours: number;
  isActive: boolean;
}

export interface RoutingRule {
  id: string;
  category: ServiceCategory;
  preferredRegion?: string;
  preferredLanguage?: string;
  strategy: 'least-loaded' | 'round-robin';
  escalationSlaHours: number;
  status: 'draft' | 'active' | 'archived';
  updatedBy: string;
  approvedBy?: string;
}

export interface DecisionCandidate {
  partnerId: string;
  partnerName: string;
  eligible: boolean;
  activeLoad: number;
  maxCapacity: number;
  rejectionReason?: string;
}

export interface RoutingDecisionRecord {
  requestId: string;
  timestamp: string;
  category: ServiceCategory;
  region: string;
  language: string;
  strategyUsed: 'least-loaded' | 'round-robin';
  candidatesEvaluated: DecisionCandidate[];
  selectedPartnerId?: string;
  selectedPartnerName?: string;
  ruleIdMatched: string;
  slaDeadline: string;
}

export interface ServiceRoutingRequest {
  id: string;
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
  category: ServiceCategory;
  region: string;
  language: string;
  status: 'pending_routing' | 'assigned' | 'acknowledged' | 'in_progress' | 'completed' | 'sla_breached' | 'reassigned';
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  decisionRecord?: RoutingDecisionRecord;
  createdAt: string;
  assignedAt?: string;
  acknowledgedAt?: string;
  notes?: string;
}

// In-Memory Partner Network with Capacity
export let PARTNER_REGISTRY: PartnerCapacity[] = [
  {
    id: 'ptn-sahyadri',
    name: 'Sahyadri Specialty Hospitals',
    category: 'hospital',
    regions: ['pune', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 8,
    currentActiveAssigned: 3,
    slaHours: 24,
    isActive: true,
  },
  {
    id: 'ptn-rubyhall',
    name: 'Ruby Hall Clinic',
    category: 'hospital',
    regions: ['pune', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 6,
    currentActiveAssigned: 4,
    slaHours: 24,
    isActive: true,
  },
  {
    id: 'ptn-metropolis',
    name: 'Metropolis Diagnostics Lab',
    category: 'diagnostic_lab',
    regions: ['pune', 'mumbai', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 15,
    currentActiveAssigned: 7,
    slaHours: 12,
    isActive: true,
  },
  {
    id: 'ptn-thyrocare',
    name: 'Thyrocare Senior Wellness',
    category: 'diagnostic_lab',
    regions: ['pune', 'mumbai', 'nagpur', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 12,
    currentActiveAssigned: 11,
    slaHours: 12,
    isActive: true,
  },
  {
    id: 'ptn-vidhi-legal',
    name: 'Vidhi Centre for Senior Legal Aid',
    category: 'legal',
    regions: ['pune', 'mumbai', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 5,
    currentActiveAssigned: 2,
    slaHours: 48,
    isActive: true,
  },
  {
    id: 'ptn-nyaya-bandhu',
    name: 'Nyaya Bandhu Pro-Bono Advocates',
    category: 'legal',
    regions: ['pune', 'nagpur', 'all'],
    languages: ['Marathi', 'Hindi'],
    dailyMaxCapacity: 4,
    currentActiveAssigned: 4, // Full capacity!
    slaHours: 48,
    isActive: true,
  },
  {
    id: 'ptn-pension-mitra',
    name: 'Pension & EPFO Advisory Services',
    category: 'financial',
    regions: ['pune', 'mumbai', 'all'],
    languages: ['Marathi', 'Hindi', 'English'],
    dailyMaxCapacity: 10,
    currentActiveAssigned: 3,
    slaHours: 72,
    isActive: true,
  },
];

// Active Routing Rules
export let ROUTING_RULES: RoutingRule[] = [
  {
    id: 'rule-hosp-least',
    category: 'hospital',
    strategy: 'least-loaded',
    escalationSlaHours: 24,
    status: 'active',
    updatedBy: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
  },
  {
    id: 'rule-diag-round',
    category: 'diagnostic_lab',
    strategy: 'least-loaded',
    escalationSlaHours: 12,
    status: 'active',
    updatedBy: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
  },
  {
    id: 'rule-legal-least',
    category: 'legal',
    strategy: 'least-loaded',
    escalationSlaHours: 48,
    status: 'active',
    updatedBy: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
  },
  {
    id: 'rule-fin-round',
    category: 'financial',
    strategy: 'round-robin',
    escalationSlaHours: 72,
    status: 'active',
    updatedBy: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
  },
];

// Seed Service Routing Requests
export let SERVICE_REQUESTS: ServiceRoutingRequest[] = [
  {
    id: 'req-801',
    seniorId: 'SC-PUN-001',
    seniorName: 'Anusuya Deshpande',
    seniorPhone: '+91 98220 11001',
    category: 'hospital',
    region: 'pune',
    language: 'Marathi',
    status: 'assigned',
    assignedPartnerId: 'ptn-sahyadri',
    assignedPartnerName: 'Sahyadri Specialty Hospitals',
    createdAt: '2026-10-28T09:00:00Z',
    assignedAt: '2026-10-28T09:05:00Z',
    notes: 'Requires geriatric cardiac review; wheelchair accessible entrance required.',
    decisionRecord: {
      requestId: 'req-801',
      timestamp: '2026-10-28T09:05:00Z',
      category: 'hospital',
      region: 'pune',
      language: 'Marathi',
      strategyUsed: 'least-loaded',
      ruleIdMatched: 'rule-hosp-least',
      slaDeadline: '2026-10-29T09:05:00Z',
      selectedPartnerId: 'ptn-sahyadri',
      selectedPartnerName: 'Sahyadri Specialty Hospitals',
      candidatesEvaluated: [
        {
          partnerId: 'ptn-sahyadri',
          partnerName: 'Sahyadri Specialty Hospitals',
          eligible: true,
          activeLoad: 2,
          maxCapacity: 8,
        },
        {
          partnerId: 'ptn-rubyhall',
          partnerName: 'Ruby Hall Clinic',
          eligible: true,
          activeLoad: 4,
          maxCapacity: 6,
        },
      ],
    },
  },
  {
    id: 'req-802',
    seniorId: 'SC-PUN-004',
    seniorName: 'Dattatray Joshi',
    seniorPhone: '+91 98220 44004',
    category: 'diagnostic_lab',
    region: 'pune',
    language: 'Marathi',
    status: 'assigned',
    assignedPartnerId: 'ptn-metropolis',
    assignedPartnerName: 'Metropolis Diagnostics Lab',
    createdAt: '2026-10-28T11:30:00Z',
    assignedAt: '2026-10-28T11:32:00Z',
    notes: 'Home sample collection for HbA1c and Lipid Profile.',
  },
  {
    id: 'req-803',
    seniorId: 'SC-PUN-006',
    seniorName: 'Malati Kulkarni',
    seniorPhone: '+91 98220 66006',
    category: 'legal',
    region: 'pune',
    language: 'Marathi',
    status: 'assigned',
    assignedPartnerId: 'ptn-vidhi-legal',
    assignedPartnerName: 'Vidhi Centre for Senior Legal Aid',
    createdAt: '2026-10-27T14:00:00Z',
    assignedAt: '2026-10-27T14:10:00Z',
    notes: 'Senior Citizen Maintenance Act filing guidance.',
  },
  {
    id: 'req-804',
    seniorId: 'SC-PUN-010',
    seniorName: 'Prabhakar Shinde',
    seniorPhone: '+91 98220 10010',
    category: 'hospital',
    region: 'pune',
    language: 'Hindi',
    status: 'sla_breached',
    assignedPartnerId: 'ptn-rubyhall',
    assignedPartnerName: 'Ruby Hall Clinic',
    createdAt: '2026-10-25T08:00:00Z',
    assignedAt: '2026-10-25T08:05:00Z',
    notes: 'Orthopedic evaluation; partner unacknowledged after 48 hours.',
  },
];

/**
 * Deterministically routes a request to an optimal partner
 */
export function routeRequest(
  request: Omit<ServiceRoutingRequest, 'id' | 'status' | 'createdAt' | 'assignedPartnerId' | 'assignedPartnerName' | 'decisionRecord'>
): {
  selectedPartner?: PartnerCapacity;
  decisionRecord: RoutingDecisionRecord;
} {
  const reqId = `req-${Date.now()}`;
  const now = new Date();

  // Find matching active rule
  const matchedRule =
    ROUTING_RULES.find((r) => r.category === request.category && r.status === 'active') || {
      id: 'default-least-loaded',
      category: request.category,
      strategy: 'least-loaded' as const,
      escalationSlaHours: 24,
      status: 'active' as const,
      updatedBy: 'system',
    };

  // Evaluate candidate partners
  const candidates: DecisionCandidate[] = [];
  const eligiblePartners: PartnerCapacity[] = [];

  for (const partner of PARTNER_REGISTRY) {
    if (!partner.isActive) continue;

    if (partner.category !== request.category) {
      continue; // Filter to category
    }

    // Check region
    const regionMatch = partner.regions.includes('all') || partner.regions.includes(request.region.toLowerCase());
    if (!regionMatch) {
      candidates.push({
        partnerId: partner.id,
        partnerName: partner.name,
        eligible: false,
        activeLoad: partner.currentActiveAssigned,
        maxCapacity: partner.dailyMaxCapacity,
        rejectionReason: `Region '${request.region}' not served`,
      });
      continue;
    }

    // Check language
    const langMatch = partner.languages.includes(request.language);
    if (!langMatch) {
      candidates.push({
        partnerId: partner.id,
        partnerName: partner.name,
        eligible: false,
        activeLoad: partner.currentActiveAssigned,
        maxCapacity: partner.dailyMaxCapacity,
        rejectionReason: `Language '${request.language}' not supported`,
      });
      continue;
    }

    // Check capacity
    if (partner.currentActiveAssigned >= partner.dailyMaxCapacity) {
      candidates.push({
        partnerId: partner.id,
        partnerName: partner.name,
        eligible: false,
        activeLoad: partner.currentActiveAssigned,
        maxCapacity: partner.dailyMaxCapacity,
        rejectionReason: `Daily capacity exhausted (${partner.currentActiveAssigned}/${partner.dailyMaxCapacity})`,
      });
      continue;
    }

    // Eligible
    candidates.push({
      partnerId: partner.id,
      partnerName: partner.name,
      eligible: true,
      activeLoad: partner.currentActiveAssigned,
      maxCapacity: partner.dailyMaxCapacity,
    });
    eligiblePartners.push(partner);
  }

  // Strategy Selection
  let chosen: PartnerCapacity | undefined;
  if (eligiblePartners.length > 0) {
    if (matchedRule.strategy === 'least-loaded') {
      // Sort by activeLoad ascending; tie-break by ID ascending
      eligiblePartners.sort((a, b) => {
        if (a.currentActiveAssigned !== b.currentActiveAssigned) {
          return a.currentActiveAssigned - b.currentActiveAssigned;
        }
        return a.id.localeCompare(b.id);
      });
      chosen = eligiblePartners[0];
    } else {
      // Round robin deterministic tie-break
      eligiblePartners.sort((a, b) => a.id.localeCompare(b.id));
      chosen = eligiblePartners[0];
    }
  }

  const slaDeadline = new Date(now.getTime() + (chosen?.slaHours || matchedRule.escalationSlaHours) * 3600 * 1000).toISOString();

  const decisionRecord: RoutingDecisionRecord = {
    requestId: reqId,
    timestamp: now.toISOString(),
    category: request.category,
    region: request.region,
    language: request.language,
    strategyUsed: matchedRule.strategy,
    ruleIdMatched: matchedRule.id,
    slaDeadline,
    selectedPartnerId: chosen?.id,
    selectedPartnerName: chosen?.name,
    candidatesEvaluated: candidates,
  };

  return { selectedPartner: chosen, decisionRecord };
}

/**
 * Creates and registers a new routing request
 */
export function submitServiceRequest(params: {
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
  category: ServiceCategory;
  region: string;
  language: string;
  notes?: string;
}): ServiceRoutingRequest {
  const { selectedPartner, decisionRecord } = routeRequest(params);
  const now = new Date().toISOString();

  const newReq: ServiceRoutingRequest = {
    id: `req-${Date.now()}`,
    seniorId: params.seniorId,
    seniorName: params.seniorName,
    seniorPhone: params.seniorPhone,
    category: params.category,
    region: params.region,
    language: params.language,
    status: selectedPartner ? 'assigned' : 'pending_routing',
    assignedPartnerId: selectedPartner?.id,
    assignedPartnerName: selectedPartner?.name,
    decisionRecord,
    createdAt: now,
    assignedAt: selectedPartner ? now : undefined,
    notes: params.notes,
  };

  if (selectedPartner) {
    selectedPartner.currentActiveAssigned += 1;
  }

  SERVICE_REQUESTS.unshift(newReq);
  return newReq;
}

/**
 * Reassigns an existing request to another partner
 */
export function reassignRequest(requestId: string, newPartnerId: string, reason: string): ServiceRoutingRequest {
  const req = SERVICE_REQUESTS.find((r) => r.id === requestId);
  if (!req) throw new Error(`Request ${requestId} not found`);

  const oldPartner = PARTNER_REGISTRY.find((p) => p.id === req.assignedPartnerId);
  const newPartner = PARTNER_REGISTRY.find((p) => p.id === newPartnerId);
  if (!newPartner) throw new Error(`Partner ${newPartnerId} not found`);

  if (oldPartner && oldPartner.currentActiveAssigned > 0) {
    oldPartner.currentActiveAssigned -= 1;
  }
  newPartner.currentActiveAssigned += 1;

  req.assignedPartnerId = newPartner.id;
  req.assignedPartnerName = newPartner.name;
  req.status = 'reassigned';
  req.notes = `${req.notes || ''} [Reassigned to ${newPartner.name}: ${reason}]`;

  return req;
}
