import { RoleCode } from '@/permissions/matrix';
import { mockStore } from '@/mock/store';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type EntityType = 'senior' | 'case' | 'referral' | 'voucher' | 'intake' | 'pack' | 'roster';

export interface TaskItem {
  id: string;
  processId: string;
  stepId: string;
  type: string; // e.g. 'DUPLICATE_REVIEW', 'EMERGENCY_TRIAGE', 'HEALTH_ANOMALY', etc.
  title: string;
  description: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  assignedRole: RoleCode;
  assignedChapter: string;
  priority: TaskPriority;
  slaDue: string; // ISO string
  createdAt: string;
  status: TaskStatus;
  claimedByUserId?: string;
  actionLabel?: string;
  actionEndpoint?: string;
}

const STORAGE_KEY = 'vayoshrestha_tasks_v4';
const taskChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('vayoshrestha_task_events')
  : null;

class TaskServiceClass {
  private tasks: TaskItem[] = [];
  private initialized = false;

  constructor() {
    this.init();
    if (taskChannel) {
      taskChannel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_TASKS') {
          this.loadFromStorage();
        }
      };
    }
  }

  public resetToSeed() {
    this.seedInitialTasks();
    this.saveToStorage();
  }

  private init() {
    if (this.initialized) return;
    this.loadFromStorage();
    if (this.tasks.length === 0 || !this.tasks.some((t) => t.type === 'SOS_ACKNOWLEDGE')) {
      this.seedInitialTasks();
      this.saveToStorage();
    }
    this.initialized = true;
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.tasks = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read tasks from localStorage', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
      if (taskChannel) {
        taskChannel.postMessage({ type: 'SYNC_TASKS' });
      }
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }

  public seedInitialTasks() {
    const now = Date.now();
    const hours = (h: number) => new Date(now + h * 3600000).toISOString();
    const ago = (h: number) => new Date(now - h * 3600000).toISOString();

    this.tasks = [
      // J-01 (P1): DUPLICATE_REVIEW for Programme Manager (PM)
      {
        id: 'TASK-P1-001',
        processId: 'P1',
        stepId: 'P1-S3',
        type: 'DUPLICATE_REVIEW',
        title: 'Review duplicate senior enrollment: Anasuya Bai',
        description: 'Assisted registration at Jayanagar matched existing member record with 94% phonetic similarity. Verify whether this is a duplicate or a distinct elder.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-001',
        entityName: 'Anasuya Bai',
        assignedRole: 'PM',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(2),
        createdAt: ago(0.5),
        status: 'open',
        actionLabel: 'Confirm unique person',
        actionEndpoint: '/seniors/duplicates',
      },

      // J-02 (P2): SOS_ACKNOWLEDGE for Care Triage (CT)
      {
        id: 'TASK-P2-001',
        processId: 'P2',
        stepId: 'P2-S1',
        type: 'SOS_ACKNOWLEDGE',
        title: 'Emergency SOS: Shantaram Deshpande (Fall Detection)',
        description: 'Urgent red alert triggered from pendant device. Primary caregiver not answering.',
        entityType: 'case',
        entityId: 'SOS-20261030-001',
        entityName: 'Shantaram Deshpande',
        assignedRole: 'CT',
        assignedChapter: 'HUB-BLR',
        priority: 'critical',
        slaDue: hours(0.1),
        createdAt: ago(0.1),
        status: 'open',
        actionLabel: 'Acknowledge emergency',
        actionEndpoint: '/sos',
      },

      // J-02 (P2): SOS_POST_REVIEW for Centre Manager (CM)
      {
        id: 'TASK-P2-002',
        processId: 'P2',
        stepId: 'P2-S5',
        type: 'SOS_POST_REVIEW',
        title: 'Post-incident review: SOS-20261030-001',
        description: 'Elder discharged safely from emergency triage. Complete 24h follow-up protocol and log outcome.',
        entityType: 'case',
        entityId: 'SOS-20261030-001',
        entityName: 'Shantaram Deshpande',
        assignedRole: 'CM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(20),
        createdAt: ago(1),
        status: 'open',
        actionLabel: 'Complete review',
        actionEndpoint: '/sos/cases?tab=all',
      },

      // J-03 (P3): WELLNESS_CALL for Care Triage (CT)
      {
        id: 'TASK-P3-001',
        processId: 'P3',
        stepId: 'P3-S3',
        type: 'WELLNESS_CALL',
        title: 'Consecutive systolic BP spike: Savitri Amma (168/98)',
        description: 'Three consecutive days of Stage 2 hypertensive readings. Protocol requires phone wellness call within 4 hours.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-004',
        entityName: 'Savitri Amma',
        assignedRole: 'CT',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(3),
        createdAt: ago(1),
        status: 'open',
        actionLabel: 'Initiate wellness call',
        actionEndpoint: '/health/queue?tab=calls',
      },

      // J-04 (P4): ATTENDANCE_CORRECTION_APPROVAL for Centre Manager (CM)
      {
        id: 'TASK-P4-001',
        processId: 'P4',
        stepId: 'P4-S4',
        type: 'ATTENDANCE_CORRECTION_APPROVAL',
        title: 'Correction request: Chair Yoga Circle roster',
        description: 'Volunteer facilitator submitted attendance adjustment for 2 walk-in elders.',
        entityType: 'roster',
        entityId: 'ROSTER-BLR-02',
        entityName: 'Chair Yoga Circle',
        assignedRole: 'CM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(6),
        createdAt: ago(2),
        status: 'open',
        actionLabel: 'Review correction',
        actionEndpoint: '/attendance?tab=corrections',
      },

      // P4-S5: DISENGAGEMENT_OUTREACH for Volunteer Facilitator (VF)
      {
        id: 'TASK-P4-002',
        processId: 'P4',
        stepId: 'P4-S5',
        type: 'DISENGAGEMENT_OUTREACH',
        title: '3-Session absence follow-up: Anand Rao',
        description: 'Elder missed 3 consecutive Chair Yoga sessions. Conduct welfare phone outreach and document support need.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-007',
        entityName: 'Anand Rao',
        assignedRole: 'VF',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(48),
        createdAt: ago(4),
        status: 'open',
        actionLabel: 'Complete outreach',
        actionEndpoint: '/feedback?tab=follow-ups',
      },

      // J-05 (P5): TEMPLATE_APPROVAL for National Manager (NM)
      {
        id: 'TASK-P5-001',
        processId: 'P5',
        stepId: 'P5-S2',
        type: 'TEMPLATE_APPROVAL',
        title: 'Statutory SMS template approval: Heatwave Health Advisory',
        description: 'Program team submitted bilingual broadcast template for summer health advisory.',
        entityType: 'intake',
        entityId: 'TMPL-2026-08',
        entityName: 'Summer Heatwave Advisory',
        assignedRole: 'NM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(12),
        createdAt: ago(3),
        status: 'open',
        actionLabel: 'Approve template',
        actionEndpoint: '/communication/templates',
      },

      // J-06 (P6): PARTNER_REFERRAL_ACTION for Service Partner (SP)
      {
        id: 'TASK-P6-001',
        processId: 'P6',
        stepId: 'P6-S3',
        type: 'PARTNER_REFERRAL_ACTION',
        title: 'Voucher redemption: Apollo Pharmacy Jayanagar',
        description: 'Subsidized prescription voucher awaiting partner redemption settlement.',
        entityType: 'voucher',
        entityId: 'VCH-KA-2026-0042',
        entityName: 'Apollo Pharmacy Jayanagar',
        assignedRole: 'SP',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(8),
        createdAt: ago(2),
        status: 'open',
        actionLabel: 'Redeem voucher',
        actionEndpoint: '/partner/vouchers/redeem',
      },

      // J-07 (P7): LEGAL_CONSULTATION for Service Partner (SP) / Pro-Bono Counsel
      {
        id: 'TASK-P7-001',
        processId: 'P7',
        stepId: 'P7-S2',
        type: 'LEGAL_CONSULTATION',
        title: 'Review property tenancy dispute: Narayan Rao (Encrypted Narrative)',
        description: 'Assisted legal aid submission recorded under client-advocate privilege. Eviction threat from landlord requiring legal advice.',
        entityType: 'intake',
        entityId: 'LEGAL-2026-019',
        entityName: 'Narayan Rao',
        assignedRole: 'SP',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(18),
        createdAt: ago(3),
        status: 'open',
        actionLabel: 'Decrypt & review narrative',
        actionEndpoint: '/legal-intake',
      },

      // J-08 (P8): CURRICULUM_APPROVAL for National Manager (NM)
      {
        id: 'TASK-P8-001',
        processId: 'P8',
        stepId: 'P8-S3',
        type: 'CURRICULUM_APPROVAL',
        title: 'Review Digital Literacy Module: UPI Scam Prevention',
        description: 'Interactive vernacular quiz curriculum submitted for chapter rollout.',
        entityType: 'intake',
        entityId: 'CURR-2026-04',
        entityName: 'UPI Scam Prevention Curriculum',
        assignedRole: 'NM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(24),
        createdAt: ago(4),
        status: 'open',
        actionLabel: 'Approve curriculum',
        actionEndpoint: '/programmes',
      },

      // J-09 (P9): SUPERVISOR_SYNC_CHECK for Centre Manager (CM)
      {
        id: 'TASK-P9-001',
        processId: 'P9',
        stepId: 'P9-S3',
        type: 'SUPERVISOR_SYNC_CHECK',
        title: 'Offline terminal sync delay: Field Device TAB-08',
        description: 'Field device has not synced local double-consent logs for 18 hours. Verify device connectivity.',
        entityType: 'intake',
        entityId: 'DEV-SYNC-08',
        entityName: 'TAB-08 Jayanagar Cluster',
        assignedRole: 'CM',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(4),
        createdAt: ago(1.5),
        status: 'open',
        actionLabel: 'Inspect sync state',
        actionEndpoint: '/field-network/sync',
      },

      // J-10 (P10): GOVERNANCE_APPROVAL for National Manager (NM)
      {
        id: 'TASK-P10-001',
        processId: 'P10',
        stepId: 'P10-S2',
        type: 'GOVERNANCE_APPROVAL',
        title: 'Maker-checker policy update: Subsidized meal grant ceiling',
        description: 'Proposed amendment to emergency nutrition voucher ceiling from ₹250 to ₹350 per senior.',
        entityType: 'intake',
        entityId: 'GOV-POL-2026-02',
        entityName: 'Nutrition Voucher Amendment',
        assignedRole: 'NM',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(10),
        createdAt: ago(2),
        status: 'open',
        actionLabel: 'Review policy',
        actionEndpoint: '/admin/approvals',
      },

      // J-11 (P11): DPDP_REQUEST_ACTION for Super Admin (SA)
      {
        id: 'TASK-P11-001',
        processId: 'P11',
        stepId: 'P11-S2',
        type: 'DPDP_REQUEST_ACTION',
        title: 'DPDP-aligned data deletion request: Member SC-KA-BLR-019',
        description: 'Senior citizen invoked right to erasure. Verify identity and execute cryptographic purge of PII.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-019',
        entityName: 'Rameshwar Kulkarni',
        assignedRole: 'SA',
        assignedChapter: 'HUB-BLR',
        priority: 'critical',
        slaDue: hours(48),
        createdAt: ago(6),
        status: 'open',
        actionLabel: 'Execute erasure',
        actionEndpoint: '/admin/data-governance',
      },

      // J-12 (P12): COMPLAINT_INVESTIGATION for Centre Manager (CM)
      {
        id: 'TASK-P12-001',
        processId: 'P12',
        stepId: 'P12-S2',
        type: 'COMPLAINT_INVESTIGATION',
        title: 'Citizen grievance: Late companion volunteer arrival',
        description: 'Escorted hospital transport volunteer delayed by 45 minutes on Oct 28. Review and document resolution.',
        entityType: 'case',
        entityId: 'GRV-2026-031',
        entityName: 'Hospital Escort Grievance',
        assignedRole: 'CM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(16),
        createdAt: ago(5),
        status: 'open',
        actionLabel: 'Investigate grievance',
        actionEndpoint: '/admin/complaints',
      },

      // J-13 (P13): IMPACT_PACK_RELEASE for National Manager (NM)
      {
        id: 'TASK-P13-001',
        processId: 'P13',
        stepId: 'P13-S3',
        type: 'IMPACT_PACK_RELEASE',
        title: 'Maker-checker sign-off: Q3 CSR Telemetry Dossier',
        description: 'Impact pack compiled with k-anonymity (k>=5). Authorize public cryptographic SHA-256 seal.',
        entityType: 'pack',
        entityId: 'PACK-2026-CSR-03',
        entityName: 'Infosys Foundation Q3 Dossier',
        assignedRole: 'NM',
        assignedChapter: 'HUB-BLR',
        priority: 'high',
        slaDue: hours(8),
        createdAt: ago(2),
        status: 'open',
        actionLabel: 'Release impact pack',
        actionEndpoint: '/telemetry/packs',
      },

      // J-14 (P14): PARTNER_ACCREDITATION for National Manager (NM)
      {
        id: 'TASK-P14-001',
        processId: 'P14',
        stepId: 'P14-S2',
        type: 'PARTNER_ACCREDITATION',
        title: 'Accreditation application: Manipal Diagnostic Care Network',
        description: 'Service partner submitted clinical credential verification and fee schedule discount agreement.',
        entityType: 'intake',
        entityId: 'PTNR-2026-09',
        entityName: 'Manipal Diagnostic Network',
        assignedRole: 'NM',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(72),
        createdAt: ago(12),
        status: 'open',
        actionLabel: 'Review accreditation',
        actionEndpoint: '/partners',
      },

      // J-15 (P15): GO_LIVE_AUTHORIZATION for National Manager (NM)
      {
        id: 'TASK-P15-001',
        processId: 'P15',
        stepId: 'P15-S4',
        type: 'GO_LIVE_AUTHORIZATION',
        title: 'Chapter Go-Live Readiness: Mysore Heritage Hub',
        description: 'All 24 checklist gates satisfied (volunteers trained, hardware checked, emergency routes tested). Authorize public launch.',
        entityType: 'intake',
        entityId: 'HUB-MYS-01',
        entityName: 'Mysore Heritage Hub',
        assignedRole: 'NM',
        assignedChapter: 'HUB-MYS',
        priority: 'high',
        slaDue: hours(24),
        createdAt: ago(8),
        status: 'open',
        actionLabel: 'Authorize go-live',
        actionEndpoint: '/admin/settings',
      },

      // VF Task 1
      {
        id: 'TASK-VF-001',
        processId: 'P1',
        stepId: 'P1-S1',
        type: 'FIELD_VISIT',
        title: 'Home wellness visit: Geetha Raman',
        description: 'Senior was unable to complete digital verification over phone. Schedule in-person double-consent verification.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-007',
        entityName: 'Geetha Raman',
        assignedRole: 'VF',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(12),
        createdAt: ago(1.5),
        status: 'open',
        actionLabel: 'Start assisted visit',
        actionEndpoint: '/onboarding',
      },

      // VF Task 2
      {
        id: 'TASK-VF-002',
        processId: 'P4',
        stepId: 'P4-S4',
        type: 'ATTENDANCE_RECORDING',
        title: 'Submit attendance roster: Chair Yoga Circle',
        description: 'Session completed today at Jayanagar Ekta Hub with 18 attendees. Verify walk-in elders and submit final roster.',
        entityType: 'roster',
        entityId: 'ROSTER-BLR-02',
        entityName: 'Chair Yoga Circle',
        assignedRole: 'VF',
        assignedChapter: 'HUB-BLR',
        priority: 'medium',
        slaDue: hours(4),
        createdAt: ago(1),
        status: 'open',
        actionLabel: 'Record roster',
        actionEndpoint: '/attendance',
      },

      // VF Task 3
      {
        id: 'TASK-VF-003',
        processId: 'P8',
        stepId: 'P8-S2',
        type: 'LESSON_COMPLETION',
        title: 'Deliver Digital Literacy Module: WhatsApp Voice Notes',
        description: 'Facilitate micro-lesson with small elder circle at Malleshwaram hub. Demo hands-free recording.',
        entityType: 'senior',
        entityId: 'SC-KA-BLR-009',
        entityName: 'Digital Circle Group B',
        assignedRole: 'VF',
        assignedChapter: 'HUB-BLR',
        priority: 'low',
        slaDue: hours(24),
        createdAt: ago(2),
        status: 'open',
        actionLabel: 'Open lesson guide',
        actionEndpoint: '/learning',
      },
    ];
  }

  public listTasks(filter?: {
    role?: RoleCode;
    chapter?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    processId?: string;
    type?: string;
  }): TaskItem[] {
    this.init();
    return this.tasks.filter((t) => {
      if (filter?.status && t.status !== filter.status) return false;
      if (filter?.role && t.assignedRole !== filter.role && filter.role !== 'SA') return false;
      if (filter?.chapter && t.assignedChapter !== filter.chapter && filter.chapter !== 'ALL') return false;
      if (filter?.priority && t.priority !== filter.priority) return false;
      if (filter?.processId && t.processId !== filter.processId) return false;
      if (filter?.type && t.type !== filter.type) return false;
      return true;
    });
  }

  public getTask(id: string): TaskItem | undefined {
    this.init();
    return this.tasks.find((t) => t.id === id);
  }

  public claimTask(id: string, userId: string): TaskItem | null {
    this.init();
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.status = 'in_progress';
    task.claimedByUserId = userId;
    this.saveToStorage();
    return task;
  }

  public completeTask(id: string, result?: any): TaskItem | null {
    this.init();
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.status = 'completed';
    this.saveToStorage();
    return task;
  }

  public reassignTask(id: string, newRole: RoleCode): TaskItem | null {
    this.init();
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.assignedRole = newRole;
    this.saveToStorage();
    return task;
  }

  public getTasksForRole(role: RoleCode): TaskItem[] {
    this.init();
    // Executive and Super Admin roles can see all open tasks
    if (role === 'SA' || role === 'NM') {
      return this.tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');
    }
    return this.tasks.filter(
      (t) => t.assignedRole === role && t.status !== 'completed' && t.status !== 'cancelled'
    );
  }

  public getTakeNextTask(role: RoleCode): TaskItem | null {
    const openTasks = this.getTasksForRole(role);
    if (openTasks.length === 0) return null;

    // Sort by priority (critical > high > medium > low), then earliest SLA
    const priorityWeight: Record<TaskPriority, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const sorted = [...openTasks].sort((a, b) => {
      const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(a.slaDue).getTime() - new Date(b.slaDue).getTime();
    });

    return sorted[0] || null;
  }
}

export const TaskService = new TaskServiceClass();
