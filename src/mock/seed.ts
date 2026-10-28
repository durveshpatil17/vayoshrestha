import { faker } from '@faker-js/faker';
import {
  Region,
  Chapter,
  UserAccount,
  SeniorCitizen,
  EmergencyContact,
  SosEvent,
  SmsFallbackRecord,
  MedicationSchedule,
  MedicationConfirmation,
  VitalLog,
  HealthFlag,
  WellnessCallTask,
  ThresholdConfig,
  SosSettings,
  ReminderTemplate,
  OnboardingScript,
  OnboardingSession,
  SystemSettings,
  AuditEvent,
  OutboundMessage,
} from '@/api/contracts';
import { generateMembershipId } from '@/domain/idGenerator';
import { dobToAgeBand } from '@/domain/masking';
import { DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS } from '@/domain/thresholds';

export function createDeterministicSeed() {
  faker.seed(20261027);

  // 1. Regions (3 regions)
  const regions: Region[] = [
    { id: 'REG-W', code: 'WEST', name: 'West Region (Maharashtra & MP)' },
    { id: 'REG-S', code: 'SOUTH', name: 'South Region (Karnataka & TN)' },
    { id: 'REG-N', code: 'NORTH', name: 'North Region (Rajasthan & UP)' },
  ];

  // 2. Chapters (9 Ekta Hub chapters)
  const chapters: Chapter[] = [
    {
      id: 'HUB-PUN',
      code: 'PUN',
      name: 'Pune Ekta Hub (Shivajinagar)',
      regionId: 'REG-W',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Plot 42, Senapati Bapat Road, Shivajinagar, Pune 411016',
      contactPerson: 'Sunita Patil',
      contactPhone: '+91 98220 11223',
      languagesServed: ['Marathi', 'Hindi', 'English'],
      status: 'Active',
      onDutyRoster: [
        {
          userId: 'u-cm-pun',
          userName: 'Sunita Patil',
          role: 'CM',
          shift: '08:00 - 16:00 IST',
          onCallPhone: '+91 98220 11223',
          isPrimaryResponder: true,
        },
        {
          userId: 'u-vf-pun',
          userName: 'Pooja Shinde',
          role: 'VF',
          shift: '10:00 - 18:00 IST',
          onCallPhone: '+91 98220 44551',
          isPrimaryResponder: false,
        },
      ],
    },
    {
      id: 'HUB-NSK',
      code: 'NSK',
      name: 'Nashik Ekta Hub (Gangapur)',
      regionId: 'REG-W',
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Near Old Pandit Colony, Gangapur Road, Nashik 422005',
      contactPerson: 'Anand Deshmukh',
      contactPhone: '+91 98220 22334',
      languagesServed: ['Marathi', 'Hindi'],
      status: 'Active',
      onDutyRoster: [
        {
          userId: 'u-cm-nsk',
          userName: 'Anand Deshmukh',
          role: 'CM',
          shift: '08:00 - 16:00 IST',
          onCallPhone: '+91 98220 22334',
          isPrimaryResponder: true,
        },
      ],
    },
    {
      id: 'HUB-NAG',
      code: 'NAG',
      name: 'Nagpur Ekta Hub (Dharampeth)',
      regionId: 'REG-W',
      city: 'Nagpur',
      state: 'Maharashtra',
      address: 'West High Court Road, Dharampeth, Nagpur 440010',
      contactPerson: 'Vivek Joshi',
      contactPhone: '+91 98220 33445',
      languagesServed: ['Marathi', 'Hindi'],
      status: 'Active',
      onDutyRoster: [],
    },
    {
      id: 'HUB-IND',
      code: 'IND',
      name: 'Indore Ekta Hub (Vijay Nagar)',
      regionId: 'REG-W',
      city: 'Indore',
      state: 'Madhya Pradesh',
      address: 'Scheme 54, Vijay Nagar, Indore 452010',
      contactPerson: 'Ritu Agarwal',
      contactPhone: '+91 98220 44556',
      languagesServed: ['Hindi', 'English'],
      status: 'Active',
      onDutyRoster: [],
    },
    {
      id: 'HUB-BLR',
      code: 'BLR',
      name: 'Bengaluru Ekta Hub (Jayanagar)',
      regionId: 'REG-S',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '32nd Cross, 4th Block, Jayanagar, Bengaluru 560011',
      contactPerson: 'Karthik Swaminathan',
      contactPhone: '+91 98440 11223',
      languagesServed: ['Kannada', 'English', 'Tamil'],
      status: 'Active',
      onDutyRoster: [
        {
          userId: 'u-cm-blr',
          userName: 'Karthik Swaminathan',
          role: 'CM',
          shift: '08:00 - 16:00 IST',
          onCallPhone: '+91 98440 11223',
          isPrimaryResponder: true,
        },
      ],
    },
    {
      id: 'HUB-MYS',
      code: 'MYS',
      name: 'Mysuru Ekta Hub (Kuvempunagar)',
      regionId: 'REG-S',
      city: 'Mysuru',
      state: 'Karnataka',
      address: 'Anikethana Road, Kuvempunagar, Mysuru 570023',
      contactPerson: 'Suresh Rao',
      contactPhone: '+91 98440 22334',
      languagesServed: ['Kannada', 'English'],
      status: 'Active',
      onDutyRoster: [],
    },
    {
      id: 'HUB-CHE',
      code: 'CHE',
      name: 'Chennai Ekta Hub (Mylapore)',
      regionId: 'REG-S',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Luz Church Road, Mylapore, Chennai 600004',
      contactPerson: 'Lakshmi Narayanan',
      contactPhone: '+91 98440 33445',
      languagesServed: ['Tamil', 'English'],
      status: 'Active',
      onDutyRoster: [],
    },
    {
      id: 'HUB-JAI',
      code: 'JAI',
      name: 'Jaipur Ekta Hub (C-Scheme)',
      regionId: 'REG-N',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'Ashok Nagar, C-Scheme, Jaipur 302001',
      contactPerson: 'Mahesh Sharma',
      contactPhone: '+91 98110 11223',
      languagesServed: ['Hindi', 'English'],
      status: 'Active',
      onDutyRoster: [],
    },
    {
      id: 'HUB-LUK',
      code: 'LUK',
      name: 'Lucknow Ekta Hub (Gomti Nagar)',
      regionId: 'REG-N',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Vipin Khand, Gomti Nagar, Lucknow 226010',
      contactPerson: 'Alok Srivastava',
      contactPhone: '+91 98110 22334',
      languagesServed: ['Hindi', 'English'],
      status: 'Active',
      onDutyRoster: [],
    },
  ];

  // 3. User Accounts (Covers all 8 roles, with extras for isolation testing)
  const users: UserAccount[] = [
    {
      id: 'u-sa-1',
      email: 'rajesh.admin@vayohvikas.org',
      fullName: 'Rajesh Varma',
      role: 'SA',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: true,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-nm-1',
      email: 'vandana.sharma@vayohvikas.org',
      fullName: 'Vandana Sharma',
      role: 'NM',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: true,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-ra-west',
      email: 'arjun.ra.west@vayohvikas.org',
      fullName: 'Arjun Nambiar',
      role: 'RA',
      assignedRegion: 'REG-W',
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-NAG', 'HUB-IND'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-ra-south',
      email: 'priya.ra.south@vayohvikas.org',
      fullName: 'Priya Raman',
      role: 'RA',
      assignedRegion: 'REG-S',
      assignedCentres: ['HUB-BLR', 'HUB-MYS', 'HUB-CHE'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-cm-pun',
      email: 'sunita.cm.pune@vayohvikas.org',
      fullName: 'Sunita Patil',
      role: 'CM',
      assignedRegion: 'REG-W',
      assignedChapter: 'HUB-PUN',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-cm-nsk',
      email: 'anand.cm.nashik@vayohvikas.org',
      fullName: 'Anand Deshmukh',
      role: 'CM',
      assignedRegion: 'REG-W',
      assignedChapter: 'HUB-NSK',
      assignedCentres: ['HUB-NSK'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-cm-blr',
      email: 'karthik.cm.blr@vayohvikas.org',
      fullName: 'Karthik Swaminathan',
      role: 'CM',
      assignedRegion: 'REG-S',
      assignedChapter: 'HUB-BLR',
      assignedCentres: ['HUB-BLR'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-vf-pun',
      email: 'pooja.vf.pune@vayohvikas.org',
      fullName: 'Pooja Shinde',
      role: 'VF',
      assignedRegion: 'REG-W',
      assignedChapter: 'HUB-PUN',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-ct-1',
      email: 'meera.ct@vayohvikas.org',
      fullName: 'Meera Kulkarni',
      role: 'CT',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-cd-1',
      email: 'vikram.tata@tatatrusts.org',
      fullName: 'Vikram Tata',
      role: 'CD',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-sc-1',
      email: 'senior.ramesh@vayohvikas.org',
      phone: '9822012345',
      fullName: 'Ramesh Kulkarni',
      role: 'SC',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-pm-1',
      email: 'priya.menon@vayohvikas.org',
      fullName: 'Priya Menon',
      role: 'PM',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-sp-1',
      email: 'rajan.pillai@healthbridge.org',
      fullName: 'Dr. Rajan Pillai',
      role: 'SP',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
    {
      id: 'u-fm-1',
      email: 'sunita.desai@gmail.com',
      fullName: 'Sunita Desai',
      role: 'FM',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      mustChangePassword: false,
    },
  ];

  // 4. Generate 1,000 Registered Senior Citizens
  const seniorCitizens: SeniorCitizen[] = [];
  const emergencyContactsList: EmergencyContact[] = [];
  const firstNamesM = ['Ramesh', 'Suresh', 'Dattatray', 'Govind', 'Gopal', 'Anand', 'Prabhakar', 'Shantaram', 'Vasant', 'Madhav', 'Bhalchandra', 'Vijay', 'Krishnan', 'Narayanan', 'Ramachandran', 'Subramanian', 'Venkatesh'];
  const firstNamesF = ['Shakuntala', 'Sulabha', 'Kamal', 'Mandakini', 'Usha', 'Lalita', 'Nirmala', 'Saraswati', 'Anuradha', 'Savitri', 'Meenakshi', 'Padma', 'Kaveri', 'Rukmini', 'Janaki', 'Kalyani'];
  const lastNames = ['Kulkarni', 'Deshpande', 'Joshi', 'Patil', 'Pawar', 'Shinde', 'Gaikwad', 'Bhosale', 'Iyer', 'Iyengar', 'Nair', 'Menon', 'Sharma', 'Verma', 'Gupta', 'Singh', 'Deshmukh'];
  const relationships: ('Son' | 'Daughter' | 'Spouse' | 'Caregiver' | 'Neighbour')[] = ['Son', 'Daughter', 'Spouse', 'Caregiver', 'Neighbour'];

  for (let i = 1; i <= 1000; i++) {
    const isFemale = faker.datatype.boolean(0.58); // ~58% women
    const firstName = isFemale ? faker.helpers.arrayElement(firstNamesF) : faker.helpers.arrayElement(firstNamesM);
    const lastName = faker.helpers.arrayElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const birthYear = faker.number.int({ min: 1934, max: 1966 });
    const birthMonth = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
    const birthDay = String(faker.number.int({ min: 1, max: 28 })).padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;
    const chapter = chapters[(i - 1) % chapters.length];
    const membershipId = generateMembershipId(chapter.code, 26, i);

    // Distribution edge cases:
    const hasConsent = i > 50; // ~5% without consent
    const isOptedOut = i > 50 && i <= 110; // ~6% opted out
    const hasSingleContact = i > 950; // ~5% single contact only
    const missingNokPhone = i === 42 || i === 87 || i === 129; // ~3% missing valid NOK phone
    const hasAbha = i % 3 === 0; // ~35% ABHA provided

    const seniorId = `m-${i}`;
    const seniorPhone = `98${faker.string.numeric(8)}`;

    const contacts: EmergencyContact[] = [];
    const nok1: EmergencyContact = {
      id: `c-${i}-1`,
      name: `${faker.helpers.arrayElement(firstNamesM)} ${lastName}`,
      relationship: faker.helpers.arrayElement(relationships),
      phone: missingNokPhone ? '' : `98${faker.string.numeric(8)}`,
      isPrimary: true,
      safetySmsConsent: hasConsent,
      priorityOrder: 1,
    };
    contacts.push(nok1);
    emergencyContactsList.push(nok1);

    if (!hasSingleContact) {
      const nok2: EmergencyContact = {
        id: `c-${i}-2`,
        name: `${faker.helpers.arrayElement(firstNamesF)} ${lastName}`,
        relationship: 'Daughter',
        phone: `97${faker.string.numeric(8)}`,
        isPrimary: false,
        safetySmsConsent: hasConsent,
        priorityOrder: 2,
      };
      contacts.push(nok2);
      emergencyContactsList.push(nok2);
    }

    const senior: SeniorCitizen = {
      id: seniorId,
      membershipId,
      fullName,
      dateOfBirth: dob,
      ageBand: dobToAgeBand(dob),
      gender: isFemale ? 'Female' : 'Male',
      phone: seniorPhone,
      emergencyContacts: contacts,
      emergencyContactName: contacts[0]?.name,
      emergencyContactPhone: contacts[0]?.phone,
      chapterId: chapter.id,
      centreId: chapter.id,
      primaryLanguage: faker.helpers.arrayElement(chapter.languagesServed as ('English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil')[]),
      address: `${faker.number.int({ min: 1, max: 120 })}, ${chapter.city} Residential Colony, ${chapter.city}`,
      digitalConfidence: faker.helpers.arrayElement(['Basic', 'Assisted', 'Confident', 'None']),
      isAssistedRegistration: i <= 120, // ~12% assisted onboarding
      assistedBy: i <= 120 ? 'Pooja Shinde (Field Volunteer)' : undefined,
      consent: {
        generalCommunications: hasConsent && !isOptedOut,
        safetySmsFallback: hasConsent,
        abdmLinkage: hasAbha,
        recordedAt: '2026-08-01T09:00:00.000Z',
        version: 'v1.2-2026',
        withdrawnAt: isOptedOut ? '2026-09-15T11:00:00.000Z' : null,
      },
      abha: {
        number: hasAbha ? `${faker.string.numeric(2)}-${faker.string.numeric(4)}-${faker.string.numeric(4)}-${faker.string.numeric(4)}` : undefined,
        address: hasAbha ? `${firstName.toLowerCase()}${faker.string.numeric(3)}@abdm` : undefined,
        abdmConsent: hasAbha,
        status: hasAbha ? 'provided_unverified' : 'not_provided',
      },
      status: 'Registered',
      isActive: i % 4 !== 0, // ~75% active in last 14 days
      lastActivityAt: i % 4 !== 0 ? new Date(Date.now() - faker.number.int({ min: 1, max: 13 }) * 86400000).toISOString() : new Date(Date.now() - 25 * 86400000).toISOString(),
      registeredAt: new Date(Date.now() - faker.number.int({ min: 10, max: 80 }) * 86400000).toISOString(),
    };

    seniorCitizens.push(senior);
  }

  // 5. 200 Stalled Mid-Onboarding Sessions
  const stalledSessions: OnboardingSession[] = [];
  for (let s = 1; s <= 200; s++) {
    const step = faker.number.int({ min: 2, max: 6 });
    stalledSessions.push({
      id: `stall-${s}`,
      seniorPhone: `96${faker.string.numeric(8)}`,
      seniorName: `Stalled Elder #${s}`,
      chapterId: chapters[s % chapters.length].id,
      currentStep: step,
      stepName: ['Welcome', 'Full Name', 'Language Preference', 'Emergency Contact', 'ABHA (Phase 2)', 'Medication Schedule'][step - 1] || 'Details',
      startedAt: new Date(Date.now() - faker.number.int({ min: 2, max: 20 }) * 86400000).toISOString(),
      lastUpdatedAt: new Date(Date.now() - faker.number.int({ min: 1, max: 10 }) * 86400000).toISOString(),
      stalledDays: faker.number.int({ min: 2, max: 14 }),
      nudgeCount: faker.number.int({ min: 0, max: 3 }),
    });
  }

  // 6. Medication Schedules (~850 seniors)
  const medicationSchedules: MedicationSchedule[] = [];
  seniorCitizens.slice(0, 850).forEach((senior, idx) => {
    medicationSchedules.push({
      id: `sched-${idx + 1}`,
      seniorId: senior.id,
      seniorName: senior.fullName,
      label: idx % 3 === 0 ? 'Morning hypertension & wellness prescription' : idx % 3 === 1 ? 'Post-breakfast diabetic management' : 'Morning vitality prescription',
      time: '08:00',
      frequency: 'Daily',
      language: senior.primaryLanguage,
      status: 'Active',
    });
  });

  // 7. Vitals and Confirmations (~9,000 readings with ~3% anomalies)
  const vitalLogs: VitalLog[] = [];
  const healthFlags: HealthFlag[] = [];
  const wellnessCalls: WellnessCallTask[] = [];

  for (let r = 1; r <= 9000; r++) {
    const senior = seniorCitizens[r % 850];
    const isBp = r % 2 === 0;
    const isAnomaly = r % 33 === 0; // ~3% flagged

    if (isBp) {
      const systolic = isAnomaly ? faker.number.int({ min: 155, max: 195 }) : faker.number.int({ min: 110, max: 135 });
      const diastolic = isAnomaly ? faker.number.int({ min: 95, max: 115 }) : faker.number.int({ min: 70, max: 85 });
      const band = systolic >= 180 || diastolic >= 120 ? 'Critical' : systolic >= 140 || diastolic >= 90 ? 'HighRisk' : systolic >= 130 ? 'Watch' : 'Normal';

      const vitalLog: VitalLog = {
        id: `vital-${r}`,
        seniorId: senior.id,
        type: 'BloodPressure',
        systolic,
        diastolic,
        rawInput: `${systolic}/${diastolic}`,
        band,
        loggedAt: new Date(Date.now() - faker.number.int({ min: 1, max: 85 }) * 86400000).toISOString(),
        flagged: band === 'HighRisk' || band === 'Critical',
        ruleVersion: '1.0.0-placeholder',
        isAssisted: false,
      };
      vitalLogs.push(vitalLog);

      if (vitalLog.flagged && healthFlags.length < 270) {
        const flagId = `flag-${healthFlags.length + 1}`;
        const flag: HealthFlag = {
          id: flagId,
          seniorId: senior.id,
          seniorName: senior.fullName,
          chapterId: senior.chapterId,
          readingId: vitalLog.id,
          vitalType: 'BloodPressure',
          readingSummary: `${systolic}/${diastolic} mmHg (${band})`,
          bandCrossed: band === 'Critical' ? 'Critical' : 'HighRisk',
          status: healthFlags.length < 170 ? 'CallCompleted' : 'New',
          createdAt: vitalLog.loggedAt,
          slaDueAt: new Date(new Date(vitalLog.loggedAt || new Date().toISOString()).getTime() + 24 * 3600000).toISOString(),
        };
        healthFlags.push(flag);

        if (healthFlags.length <= 170) {
          wellnessCalls.push({
            id: `call-${wellnessCalls.length + 1}`,
            flagId,
            seniorId: senior.id,
            seniorName: senior.fullName,
            seniorPhone: senior.phone,
            chapterId: senior.chapterId,
            reason: `High Blood Pressure reading (${systolic}/${diastolic})`,
            dueAt: flag.slaDueAt,
            assignedToId: 'u-cm-pun',
            assignedToName: 'Sunita Patil',
            attempts: 1,
            outcome: 'ReachedWell',
            notes: 'Spoke with senior. Confirmed they took morning meds. Advised resting and scheduled clinic visit.',
            completedAt: new Date(new Date(vitalLog.loggedAt || new Date().toISOString()).getTime() + 3600000).toISOString(),
          });
        }
      }
    } else {
      const glucose = isAnomaly ? faker.number.int({ min: 210, max: 370 }) : faker.number.int({ min: 90, max: 135 });
      const band = glucose >= 350 ? 'Critical' : glucose >= 200 ? 'HighRisk' : glucose >= 140 ? 'Watch' : 'Normal';

      const vitalLog: VitalLog = {
        id: `vital-${r}`,
        seniorId: senior.id,
        type: 'BloodGlucose',
        glucoseMgDl: glucose,
        rawInput: `${glucose} mg/dl`,
        band,
        loggedAt: new Date(Date.now() - faker.number.int({ min: 1, max: 85 }) * 86400000).toISOString(),
        flagged: band === 'HighRisk' || band === 'Critical',
        ruleVersion: '1.0.0-placeholder',
        isAssisted: false,
      };
      vitalLogs.push(vitalLog);
    }
  }

  // 8. ~45 SOS Events (Real and Drills, with 6 SMS fallbacks)
  const sosEvents: SosEvent[] = [];
  const smsFallbackRecords: SmsFallbackRecord[] = [];

  for (let e = 1; e <= 45; e++) {
    const senior = seniorCitizens[e * 7];
    const isDrill = e % 6 === 0;
    const isDisconnected = e % 7 === 0; // 6 disconnected events triggering SMS fallback
    const triggeredTime = new Date(Date.now() - (46 - e) * 2 * 86400000);
    const latencyMs = faker.number.int({ min: 380, max: 890 }); // Sub-second!
    const alertedTime = new Date(triggeredTime.getTime() + latencyMs);

    const isResolved = e < 43; // 2 open cases right now
    const ackTime = isResolved ? new Date(triggeredTime.getTime() + faker.number.int({ min: 45, max: 110 }) * 1000) : undefined;
    const resolvedTime = isResolved ? new Date(triggeredTime.getTime() + faker.number.int({ min: 300, max: 1800 }) * 1000) : undefined;

    const sosId = `sos-2026-${String(e).padStart(3, '0')}`;

    let fallbackStatus: SosEvent['fallbackSmsStatus'] = 'NotNeeded';
    if (isDisconnected) {
      fallbackStatus = 'Delivered';
      const nok = senior.emergencyContacts?.[0];
      smsFallbackRecords.push({
        id: `sms-fb-${smsFallbackRecords.length + 1}`,
        sosId,
        seniorId: senior.id,
        recipientName: nok?.name || 'Next of Kin',
        recipientPhone: nok?.phone || '+91 98220 99887',
        relationship: nok?.relationship || 'Son',
        templateId: 'DLT-TE-11071689234',
        messageText: `EMERGENCY ALERT: ${senior.fullName} has triggered an SOS at ${chapters[0].name}. Vayoh Vikas care team is responding. For info: 1800-VAYOH.`,
        status: 'Delivered',
        sentAt: new Date(triggeredTime.getTime() + 1500).toISOString(),
        deliveredAt: new Date(triggeredTime.getTime() + 3200).toISOString(),
        retryCount: 0,
      });
    }

    sosEvents.push({
      id: sosId,
      seniorId: senior.id,
      seniorName: senior.fullName,
      seniorPhone: senior.phone,
      chapterId: senior.chapterId,
      regionId: 'REG-W',
      triggeredAt: triggeredTime.toISOString(),
      enqueuedAt: triggeredTime.toISOString(),
      dashboardAlertedAt: alertedTime.toISOString(),
      latencyMs,
      networkStatus: isDisconnected ? 'Disconnected' : 'Online',
      status: isResolved ? 'Resolved' : e === 44 ? 'Acknowledged' : 'Triggered',
      isDrill,
      assigneeId: isResolved ? 'u-ct-1' : e === 44 ? 'u-cm-pun' : undefined,
      assigneeName: isResolved ? 'Meera Kulkarni (CT)' : e === 44 ? 'Sunita Patil (CM)' : undefined,
      acknowledgedAt: ackTime?.toISOString(),
      resolvedAt: resolvedTime?.toISOString(),
      outcomeCode: isResolved ? (isDrill ? 'DrillCompleted' : 'AssistanceRendered') : undefined,
      notes: [`SOS incident logged automatically. Trigger latency: ${latencyMs}ms.`],
      escalationLevel: 1,
      slaRemainingSeconds: isResolved ? 0 : 75,
      fallbackSmsDispatched: isDisconnected,
      fallbackSmsStatus: fallbackStatus,
      locationAddress: senior.address,
    });
  }

  // 9. Reminder Templates
  const templates: ReminderTemplate[] = [
    {
      id: 'tmpl-med-01',
      name: 'Morning Wellness & Prescription Reminder',
      type: 'Medication',
      content: {
        English: 'Good morning {name}, time to take your morning wellness prescription and log your blood pressure.',
        Hindi: 'शुभ प्रभात {name} जी, आपकी सुबह की दवाई लेने और ब्लड प्रेशर दर्ज करने का समय हो गया है।',
        Marathi: 'शुभ सकाळ {name}, तुमची सकाळची औषधे घेण्याची आणि रक्तदाब नोंदवण्याची वेळ झाली आहे.',
        Kannada: 'ಶುಭೋದಯ {name}, ನಿಮ್ಮ ಬೆಳಗಿನ ಔಷಧಿ ಸೇವಿಸಲು ಮತ್ತು ರಕ್ತದೊತ್ತಡ ದಾಖಲಿಸಲು ಸಮಯವಾಗಿದೆ.',
        Tamil: 'காலை வணக்கம் {name}, உங்கள் காலை மருந்தை உட்கொண்டு இரத்த அழுத்தத்தை பதிவு செய்ய வேண்டிய நேரம் இது.',
      },
      variables: ['name', 'chapter'],
      status: 'Approved',
      updatedBy: 'Arjun Nambiar (RA)',
      updatedAt: '2026-08-01T10:00:00.000Z',
      approvedBy: 'Vandana Sharma (NM)',
    },
    {
      id: 'tmpl-vital-01',
      name: 'Evening Vitals Check-in',
      type: 'Vitals',
      content: {
        English: 'Namaste {name}, please reply with your evening blood glucose or blood pressure reading when convenient.',
        Hindi: 'नमस्ते {name} जी, कृपया अपनी शाम की शुगर या ब्लड प्रेशर रीडिंग भेजें।',
        Marathi: 'नमस्ते {name}, कृपया तुमची संध्याकाळची रक्तदाब नोंद पाठवा.',
        Kannada: 'ನಮಸ್ಕಾರ {name}, ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಕ್ತದ ಸಕ್ಕರೆ ಮಟ್ಟವನ್ನು ಕಳುಹಿಸಿ.',
        Tamil: 'வணக்கம் {name}, தயவுசெய்து உங்கள் மாலை சர்க்கரை அளவை அனுப்பவும்.',
      },
      variables: ['name'],
      status: 'Approved',
      updatedBy: 'Arjun Nambiar (RA)',
      updatedAt: '2026-08-01T10:00:00.000Z',
      approvedBy: 'Vandana Sharma (NM)',
    },
  ];

  // 10. Onboarding Bot Script
  const onboardingScript: OnboardingScript = {
    id: 'script-v1',
    version: '1.0.0',
    status: 'Approved',
    updatedBy: 'Arjun Nambiar (RA)',
    updatedAt: '2026-08-01T10:00:00.000Z',
    approvedBy: 'Vandana Sharma (NM)',
    steps: [
      {
        stepNumber: 1,
        key: 'welcome_consent',
        promptText: {
          English: 'Namaste! Welcome to Vayoshreshtha by Vayoh Vikas. We support seniors in our community with emergency SOS help and wellness check-ins. Do you consent to receive WhatsApp messages and emergency safety support?',
          Hindi: 'नमस्ते! वयोविकास के वयोश्रेष्ठ में आपका स्वागत है। क्या आप व्हाट्सएप सहायता संदेश प्राप्त करने के लिए सहमत हैं?',
          Marathi: 'नमस्ते! वयोविकासच्या वयोश्रेष्ठ मध्ये आपले स्वागत आहे. आपण व्हॉट्सअॅप संदेश स्वीकारण्यास सहमत आहात का?',
        },
        required: true,
      },
      {
        stepNumber: 2,
        key: 'full_name',
        promptText: {
          English: 'Thank you! Please type your Full Name as you would like us to address you.',
          Hindi: 'धन्यवाद! कृपया अपना पूरा नाम लिखें।',
          Marathi: 'धन्यवाद! कृपया आपले पूर्ण नाव लिहा.',
        },
        required: true,
      },
      {
        stepNumber: 3,
        key: 'language',
        promptText: {
          English: 'Which language do you prefer for daily messages? 1. English 2. Hindi 3. Marathi 4. Kannada 5. Tamil',
          Hindi: 'आप किस भाषा में संदेश चाहते हैं? 1. English 2. हिन्दी 3. मराठी',
          Marathi: 'आपण कोणत्या भाषेत संदेश पसंत करता? 1. English 2. हिन्दी 3. मराठी',
        },
        required: true,
      },
      {
        stepNumber: 4,
        key: 'emergency_contact',
        promptText: {
          English: 'Please provide the name and 10-digit mobile number of your primary Next-of-Kin (e.g. Son, Daughter, or Spouse) who can be contacted during an emergency.',
          Hindi: 'कृपया अपने मुख्य आपातकालीन संपर्क (बेटा, बेटी, या जीवनसाथी) का नाम और 10 अंकों का मोबाइल नंबर साझा करें।',
          Marathi: 'कृपया आपल्या निकटवर्तीयाचे नाव आणि 10 अंकी मोबाइल क्रमांक सांगा.',
        },
        required: true,
      },
      {
        stepNumber: 5,
        key: 'abha_optional',
        promptText: {
          English: 'Optional: If you have an Ayushman Bharat Health Account (ABHA) 14-digit number, you may enter it now (Phase 2 readiness). Otherwise reply SKIP.',
          Hindi: 'वैकल्पिक: यदि आपके पास 14 अंकों का आभा (ABHA) नंबर है, तो लिखें अन्यथा SKIP लिखें।',
          Marathi: 'पर्यायी: आपल्याकडे 14 अंकी आभा (ABHA) क्रमांक असल्यास लिहा, किंवा SKIP म्हणा.',
        },
        required: false,
      },
      {
        stepNumber: 6,
        key: 'medication_schedule',
        promptText: {
          English: 'Would you like a daily 08:00 AM WhatsApp reminder for your morning medication and blood pressure check? Reply YES or SKIP.',
          Hindi: 'क्या आप सुबह 08:00 बजे अपनी दवा और बीपी का दैनिक रिमाइंडर चाहते हैं? YES या SKIP लिखें।',
          Marathi: 'तुम्हाला रोज सकाळी 08:00 वाजता औषधांची आठवण हवी आहे का? YES किंवा SKIP म्हणा.',
        },
        required: false,
      },
      {
        stepNumber: 7,
        key: 'confirmation',
        promptText: {
          English: 'All set! Your Vayoshreshtha membership is now active. You can tap the 🚨 Trigger Emergency SOS button anytime you need immediate assistance.',
          Hindi: 'बहुत बहुत धन्यवाद! आपका वयोश्रेष्ठ खाता सक्रिय हो गया है। आपातकाल में आप कभी भी 🚨 आपातकालीन SOS बटन दबा सकते हैं।',
          Marathi: 'अभिनंदन! आपले खाते सक्रिय झाले आहे. मदतीसाठी आपण कधीही 🚨 आणीबाणी SOS बटण दाबू शकता.',
        },
        required: true,
      },
    ],
  };

  // 11. SOS Settings
  const sosSettings: SosSettings = {
    id: 'sos-cfg-v1',
    ackSlaMinutes: 2,
    escalationChain: [
      { level: 1, role: 'CM', afterMinutes: 0 },
      { level: 2, role: 'RA', afterMinutes: 2 },
      { level: 3, role: 'NM', afterMinutes: 5 },
    ],
    fallbackBehavior: 'first_delivered',
    smsTemplates: {
      English: 'EMERGENCY ALERT: {name} has triggered an SOS at {chapter}. Vayoh Vikas care team is responding. For info: 1800-VAYOH.',
      Hindi: 'आपातकालीन सूचना: {name} ने {chapter} पर SOS भेजा है। वयोविकास टीम सहायता कर रही है। संपर्क: 1800-VAYOH.',
      Marathi: 'आणीबाणी सूचना: {name} यांनी {chapter} येथे SOS पाठवला आहे. वयोविकास पथक कार्यरत आहे. संपर्क: 1800-VAYOH.',
    },
    emergency112Notice: 'In a life-threatening medical emergency, call 112 immediately.',
    drillModeEnabled: true,
    version: '1.2.0',
    status: 'Approved',
    updatedBy: 'Arjun Nambiar (RA)',
    updatedAt: '2026-08-01T10:00:00.000Z',
    approvedBy: 'Vandana Sharma (NM)',
  };

  // 12. System Settings
  const systemSettings: SystemSettings = {
    pilotTargetSeniors: 1000,
    activeWindowDays: 14,
    quietHoursStart: '21:00',
    quietHoursEnd: '07:00',
    dailyMessageVolumeCap: 5,
    supportedLanguages: ['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil'],
    sessionTimeoutMinutes: 15,
    idleWarningSeconds: 60,
    featureFlags: {
      abhaCapture: true,
      drillMode: true,
      sosChimeDefault: false,
    },
  };

  // 13. Audit Events (~200 records)
  const auditEvents: AuditEvent[] = [
    {
      id: 'aud-001',
      timestamp: '2026-08-01T10:00:00.000Z',
      actorId: 'u-nm-1',
      actorName: 'Vandana Sharma',
      actorRole: 'NM',
      action: 'APPROVE',
      entityType: 'SETTINGS',
      entityId: 'sys-001',
      details: 'Approved v2 Pilot configuration parameters and quiet hours.',
      previousHash: 'GENESIS_VAYOSHRESTHA_2026',
      hash: 'h-001-f923c8a',
    },
    {
      id: 'aud-002',
      timestamp: '2026-08-01T10:30:00.000Z',
      actorId: 'u-nm-1',
      actorName: 'Vandana Sharma',
      actorRole: 'NM',
      action: 'APPROVE',
      entityType: 'THRESHOLD',
      entityId: 'thresh-default-v1',
      details: 'Approved clinician placeholder threshold rules for Blood Pressure and Glucose.',
      previousHash: 'h-001-f923c8a',
      hash: 'h-002-3b78d1e',
    },
    {
      id: 'aud-003',
      timestamp: '2026-08-02T09:15:00.000Z',
      actorId: 'u-sa-1',
      actorName: 'Rajesh Varma',
      actorRole: 'SA',
      action: 'CREATE',
      entityType: 'USER',
      entityId: 'u-ra-west',
      details: 'Created Regional Admin account for Arjun Nambiar (West Region).',
      previousHash: 'h-002-3b78d1e',
      hash: 'h-003-99fa42c',
    },
  ];

  return {
    regions,
    chapters,
    users,
    seniorCitizens,
    stalledSessions,
    emergencyContacts: emergencyContactsList,
    medicationSchedules,
    vitalLogs,
    healthFlags,
    wellnessCalls,
    sosEvents,
    smsFallbackRecords,
    templates,
    onboardingScript,
    thresholdConfig: DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS,
    sosSettings,
    systemSettings,
    auditEvents,
    outboundMessages: [] as OutboundMessage[],
  };
}
