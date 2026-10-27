import { faker } from '@faker-js/faker';
import {
  UserAccount,
  EktaHub,
  SeniorCitizen,
  FamilyLink,
  Programme,
  ProgrammeSession,
  AttendanceRecord,
  MessageTemplate,
  OutboundMessage,
  ServicePartner,
  Referral,
  HealthEscalation,
  AuditEvent,
  SystemSettings,
} from '@/api/contracts';
import { generateMembershipId } from '@/domain/idGenerator';

export function createDeterministicSeed() {
  faker.seed(20261027);

  // 1. Ekta Hubs (6 centres)
  const centres: EktaHub[] = [
    {
      id: 'HUB-PUN',
      code: 'PUN',
      name: 'Ekta Hub Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Plot 42, Senapati Bapat Road, Shivajinagar, Pune 411016',
      contactPerson: 'Meera Joshi',
      contactPhone: '9822011223',
      seatingCapacity: 45,
      facilities: ['Wheelchair Ramp', 'Elevator', 'Accessible Restroom', 'Medical Room', 'Drinking Water'],
      operatingSchedule: 'Mon-Sat 08:30 - 18:00',
      status: 'Active',
    },
    {
      id: 'HUB-NSK',
      code: 'NSK',
      name: 'Ekta Hub Gangapur',
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Near Old Pandit Colony, Gangapur Road, Nashik 422005',
      contactPerson: 'Sunil Kulkarni',
      contactPhone: '9822044556',
      seatingCapacity: 40,
      facilities: ['Wheelchair Ramp', 'Restroom', 'Digital Lab', 'Air Cooled Hall'],
      operatingSchedule: 'Mon-Sat 09:00 - 17:30',
      status: 'Active',
    },
    {
      id: 'HUB-NAG',
      code: 'NAG',
      name: 'Ekta Hub Dharampeth',
      city: 'Nagpur',
      state: 'Maharashtra',
      address: 'West High Court Road, Dharampeth, Nagpur 440010',
      contactPerson: 'Dr. Vivek Deshmukh',
      contactPhone: '9823055667',
      seatingCapacity: 50,
      facilities: ['Ramp Access', 'Elevator', 'Quiet Reading Corner', 'First Aid Station'],
      operatingSchedule: 'Mon-Sat 08:00 - 18:00',
      status: 'Active',
    },
    {
      id: 'HUB-IND',
      code: 'IND',
      name: 'Ekta Hub Palasia',
      city: 'Indore',
      state: 'Madhya Pradesh',
      address: '14/2 Old Palasia, Main Road, Indore 452001',
      contactPerson: 'Anjali Verma',
      contactPhone: '9826077889',
      seatingCapacity: 35,
      facilities: ['Wheelchair Ramp', 'Air Conditioning', 'Projector Screen', 'Restroom'],
      operatingSchedule: 'Mon-Sat 09:00 - 17:00',
      status: 'Active',
    },
    {
      id: 'HUB-JAI',
      code: 'JAI',
      name: 'Ekta Hub C-Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'Subhash Marg, C-Scheme, Jaipur 302001',
      contactPerson: 'Rajesh Sharma',
      contactPhone: '9829033445',
      seatingCapacity: 40,
      facilities: ['Wheelchair Ramp', 'Garden Walkway', 'Drinking Water Station', 'Restroom'],
      operatingSchedule: 'Mon-Sat 08:30 - 17:30',
      status: 'Active',
    },
    {
      id: 'HUB-LUK',
      code: 'LUK',
      name: 'Ekta Hub Gomti Nagar',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010',
      contactPerson: 'Shabana Khan',
      contactPhone: '9839011224',
      seatingCapacity: 45,
      facilities: ['Elevator', 'Accessible Restroom', 'Medical Examination Room', 'Activity Hall'],
      operatingSchedule: 'Mon-Sat 09:00 - 18:00',
      status: 'Active',
    },
  ];

  // 2. User Personas (1 persona per role + extras for scope testing)
  const users: UserAccount[] = [
    {
      id: 'u-sa-1',
      email: 'admin@vayohvikas.org',
      fullName: 'Vikramaditya Rao',
      role: 'SA',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: true,
      failedLoginAttempts: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-nm-1',
      email: 'director@vayohvikas.org',
      fullName: 'Dr. Kalyani Sen',
      role: 'NM',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: true,
      failedLoginAttempts: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-pm-1',
      email: 'programmes@vayohvikas.org',
      fullName: 'Arjun Nambiar',
      role: 'PM',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-cc-pune',
      email: 'coordinator.pune@vayohvikas.org',
      fullName: 'Meera Joshi',
      role: 'CC',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-cc-nashik',
      email: 'coordinator.nashik@vayohvikas.org',
      fullName: 'Sunil Kulkarni',
      role: 'CC',
      assignedCentres: ['HUB-NSK'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-vf-pune',
      email: 'volunteer.pune@vayohvikas.org',
      fullName: 'Pooja Shinde',
      role: 'VF',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-sp-clinic',
      email: 'partner.health@sanctuaryclinic.in',
      fullName: 'Dr. Anand Dighe',
      role: 'SP',
      partnerOrganisationId: 'sp-1',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-sp-legal',
      email: 'partner.legal@justiceelders.org',
      fullName: 'Adv. Smita Ranade',
      role: 'SP',
      partnerOrganisationId: 'sp-2',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-ct-1',
      email: 'care.expert@vayohvikas.org',
      fullName: 'Sister Mary Teresa Fernandez',
      role: 'CT',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-cd-1',
      email: 'csr.reviewer@tata-trusts.org',
      fullName: 'Navin Singhal',
      role: 'CD',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-sc-1',
      email: '',
      phone: '9822011223',
      fullName: 'Bhagwandas Sharma',
      role: 'SC',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'u-fm-1',
      email: '',
      phone: '9822099881',
      fullName: 'Alok Sharma',
      role: 'FM',
      linkedSeniors: ['m-1'], // linked to Bhagwandas Sharma
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    },
  ];

  // 3. 1,000 Senior Citizens
  const seniorCitizens: SeniorCitizen[] = [];
  const femaleFirstNames = ['Shanta', 'Kusum', 'Laxmi', 'Usha', 'Saraswati', 'Kamala', 'Savitri', 'Parvati', 'Anandi', 'Shakuntala', 'Geeta', 'Sudha', 'Indira', 'Mandakini', 'Tara', 'Pushpa', 'Vidya', 'Mangala', 'Kanta', 'Suniti'];
  const maleFirstNames = ['Bhagwandas', 'Ramchandra', 'Govind', 'Vishwanath', 'Dattatray', 'Madhav', 'Gopal', 'Shankar', 'Kashinath', 'Balkrishna', 'Purushottam', 'Narayan', 'Gajanan', 'Pandurang', 'Raghunath', 'Vithal', 'Shantaram', 'Vasant', 'Keshav', 'Mukund'];
  const lastNames = ['Sharma', 'Joshi', 'Patil', 'Kulkarni', 'Deshmukh', 'Verma', 'Gupta', 'Shinde', 'Chavan', 'Kale', 'More', 'Ranade', 'Pawar', 'Bhide', 'Gadgil', 'Gokhale', 'Apte', 'Bapat', 'Kadam', 'Sathe'];

  const centreCounts: Record<string, number> = {
    'HUB-PUN': 0,
    'HUB-NSK': 0,
    'HUB-NAG': 0,
    'HUB-IND': 0,
    'HUB-JAI': 0,
    'HUB-LUK': 0,
  };

  for (let i = 1; i <= 1000; i++) {
    const isFemale = i <= 580; // ~58% women
    const firstName = isFemale
      ? femaleFirstNames[(i * 7) % femaleFirstNames.length]
      : maleFirstNames[(i * 11) % maleFirstNames.length];
    const lastName = lastNames[(i * 13) % lastNames.length];
    const fullName = i === 1 ? 'Bhagwandas Sharma' : `${firstName} ${lastName}`;

    const centre = centres[i % centres.length];
    centreCounts[centre.id]++;
    const membershipId = generateMembershipId(centre.code, 26, centreCounts[centre.id]);

    // Age 60 to 92
    const age = 60 + (i % 33);
    const birthYear = 2026 - age;
    const birthMonth = String(1 + (i % 12)).padStart(2, '0');
    const birthDay = String(1 + (i % 28)).padStart(2, '0');
    const dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;

    // Language mix
    const primaryLanguage = centre.state === 'Maharashtra'
      ? (i % 4 === 0 ? 'Hindi' : 'Marathi')
      : (i % 5 === 0 ? 'English' : 'Hindi');

    // Phone: unique 10 digits
    const phone = i === 1 ? '9822011223' : `98${String(20000000 + i).padStart(8, '0')}`;
    const emergencyPhone = `98${String(70000000 + i).padStart(8, '0')}`;

    // Consent: ~6% opted out, ~4% pending, ~90% opted in
    let consentStatus: 'OptedIn' | 'OptedOut' | 'Pending' = 'OptedIn';
    let optedOutChannels: string[] = [];
    if (i % 25 === 0) {
      consentStatus = 'Pending';
    } else if (i % 16 === 0) {
      consentStatus = 'OptedOut';
      optedOutChannels = ['WhatsApp'];
    }

    // Assisted registration: ~12%
    const isAssisted = i % 8 === 0;

    // Digital confidence
    const confidenceLevels: ('Basic' | 'Assisted' | 'Confident' | 'None')[] = ['Basic', 'Assisted', 'Confident', 'None'];
    const digitalConfidence = confidenceLevels[i % confidenceLevels.length];

    // Registration date (staggered over past 90 days)
    const daysAgo = i % 85;
    const regDate = new Date(2026, 9, 27 - daysAgo).toISOString().split('T')[0];

    // Active status: attended in last 30 days (~68% active)
    const isActive = (i % 3 !== 0);

    seniorCitizens.push({
      id: `m-${i}`,
      membershipId,
      fullName,
      dateOfBirth,
      gender: isFemale ? 'Female' : 'Male',
      phone,
      emergencyContactName: `${isFemale ? 'Suresh' : 'Sunita'} ${lastName}`,
      emergencyContactPhone: emergencyPhone,
      centreId: centre.id,
      primaryLanguage,
      address: `${100 + i}, Lane ${1 + (i % 10)}, ${centre.city}`,
      digitalConfidence,
      isAssistedRegistration: isAssisted,
      assistedBy: isAssisted ? 'Pooja Shinde (Field Volunteer)' : undefined,
      consentStatus,
      consentRecordedAt: consentStatus === 'OptedIn' ? regDate : undefined,
      optedOutChannels,
      registeredAt: regDate,
      isActive,
      status: consentStatus === 'OptedOut' ? 'OptedOut' : (isActive ? 'Active' : 'Registered'),
    });
  }

  // 4. Family Links (~40 linked seniors)
  const familyLinks: FamilyLink[] = [
    {
      id: 'fl-1',
      seniorId: 'm-1',
      familyUserId: 'u-fm-1',
      relationship: 'Son',
      consentGranted: true,
      consentGrantedAt: '2026-08-15T10:00:00Z',
      status: 'Active',
    },
  ];
  for (let f = 2; f <= 40; f++) {
    familyLinks.push({
      id: `fl-${f}`,
      seniorId: `m-${f}`,
      familyUserId: `u-fm-${f}`,
      relationship: f % 2 === 0 ? 'Daughter' : 'Son',
      consentGranted: f % 10 !== 0,
      consentGrantedAt: '2026-09-01T10:00:00Z',
      status: f % 10 === 0 ? 'Pending' : 'Active',
    });
  }

  // 5. 24 Programmes across all Hubs
  const programmes: Programme[] = [
    {
      id: 'prog-1',
      title: 'Gentle Morning Yoga & Joint Mobility',
      category: 'Yoga & Wellness',
      description: 'Senior-tailored breathing techniques, light stretching, and seated asanas designed to improve mobility and circulation.',
      eligibility: 'Ages 60+, self-paced',
      capacityPerSession: 25,
      waitlistEnabled: true,
      walkInsAllowed: true,
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-NAG', 'HUB-IND', 'HUB-JAI', 'HUB-LUK'],
      status: 'Ongoing',
      createdAt: '2026-07-15T09:00:00Z',
    },
    {
      id: 'prog-2',
      title: 'Smartphone & UPI Digital Independence',
      category: 'Digital Literacy',
      description: 'Hands-on practical training on safe WhatsApp navigation, utility bill payments, and cyber-fraud awareness for seniors.',
      eligibility: 'All registered seniors with a smartphone',
      capacityPerSession: 20,
      waitlistEnabled: true,
      walkInsAllowed: false,
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-IND'],
      status: 'Ongoing',
      createdAt: '2026-07-20T10:00:00Z',
    },
    {
      id: 'prog-3',
      title: 'Monthly Preventive Health & Eye Camp',
      category: 'Health Camp',
      description: 'Non-clinical vitals screening, vision tests, and consultation routing with empanelled charitable medical specialists.',
      eligibility: 'All Ekta Hub members',
      capacityPerSession: 50,
      waitlistEnabled: true,
      walkInsAllowed: true,
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-NAG', 'HUB-IND', 'HUB-JAI', 'HUB-LUK'],
      status: 'Ongoing',
      createdAt: '2026-07-25T08:00:00Z',
    },
    {
      id: 'prog-4',
      title: 'Senior Citizens Legal Rights & Will Guidance',
      category: 'Legal Aid',
      description: 'Free consultations with verified legal advocates covering succession, maintenance rights, and government pension assistance.',
      eligibility: 'Ages 60+',
      capacityPerSession: 15,
      waitlistEnabled: true,
      walkInsAllowed: false,
      assignedCentres: ['HUB-PUN', 'HUB-NAG'],
      status: 'Ongoing',
      createdAt: '2026-08-01T11:00:00Z',
    },
    {
      id: 'prog-5',
      title: 'Geet-Sangeet & Social Reminiscence Circle',
      category: 'Social Meet',
      description: 'Weekly musical assembly, traditional board games, storytelling, and mutual companionship to overcome social isolation.',
      eligibility: 'All members and spouses',
      capacityPerSession: 40,
      waitlistEnabled: false,
      walkInsAllowed: true,
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-NAG', 'HUB-IND', 'HUB-JAI', 'HUB-LUK'],
      status: 'Ongoing',
      createdAt: '2026-08-05T15:00:00Z',
    },
    {
      id: 'prog-6',
      title: 'Nutrition & Seasonal Diet for Longevity',
      category: 'Nutrition',
      description: 'Practical workshops led by clinical nutritionists on easy digestion, hydration, and managing diabetes through traditional Indian grains.',
      eligibility: 'All members',
      capacityPerSession: 30,
      waitlistEnabled: true,
      walkInsAllowed: true,
      assignedCentres: ['HUB-PUN', 'HUB-IND', 'HUB-JAI'],
      status: 'Ongoing',
      createdAt: '2026-08-10T14:00:00Z',
    },
  ];

  // Fill up to 24 programmes
  const progCategories: Programme['category'][] = ['Yoga & Wellness', 'Digital Literacy', 'Health Camp', 'Legal Aid', 'Social Meet', 'Nutrition'];
  for (let p = 7; p <= 24; p++) {
    const cat = progCategories[p % progCategories.length];
    programmes.push({
      id: `prog-${p}`,
      title: `${cat} Workshop Series ${p}`,
      category: cat,
      description: `Structured senior engagement curriculum focused on ${cat.toLowerCase()} in community centres.`,
      eligibility: 'All registered seniors',
      capacityPerSession: 25 + (p % 15),
      waitlistEnabled: true,
      walkInsAllowed: p % 2 === 0,
      assignedCentres: ['HUB-PUN', 'HUB-NSK', 'HUB-NAG', 'HUB-IND', 'HUB-JAI', 'HUB-LUK'].slice(0, 2 + (p % 5)),
      status: p > 20 ? 'Draft' : 'Ongoing',
      createdAt: '2026-08-15T10:00:00Z',
    });
  }

  // 6. ~600 Sessions across 90 days past and 30 days future
  const sessions: ProgrammeSession[] = [];
  let sessCounter = 1;
  // Generate sessions for past 75 days (every 3 days per hub) and next 25 days
  for (let dayOffset = -75; dayOffset <= 25; dayOffset += 2) {
    const sessionDate = new Date(2026, 9, 27 + dayOffset).toISOString().split('T')[0];
    const isPast = dayOffset <= 0;

    for (const hub of centres) {
      const prog = programmes[(sessCounter) % programmes.length];
      const isRecorded = isPast && dayOffset < 0;

      sessions.push({
        id: `sess-${sessCounter}`,
        programmeId: prog.id,
        programmeTitle: prog.title,
        centreId: hub.id,
        centreName: hub.name,
        date: sessionDate,
        startTime: '10:00',
        endTime: '11:30',
        capacity: prog.capacityPerSession,
        confirmedCount: Math.min(prog.capacityPerSession, 15 + (sessCounter % 15)),
        waitlistCount: sessCounter % 5 === 0 ? 3 : 0,
        walkInCount: isRecorded ? (sessCounter % 4) : 0,
        attendanceRecorded: isRecorded,
        attendanceRecordedAt: isRecorded ? `${sessionDate}T12:00:00Z` : undefined,
        attendanceRecordedBy: isRecorded ? 'Pooja Shinde (Field Volunteer)' : undefined,
        status: 'Scheduled',
      });
      sessCounter++;
      if (sessCounter > 600) break;
    }
    if (sessCounter > 600) break;
  }

  // 7. Attendance Records (~3,000 attendance records across past sessions)
  const attendanceRecords: AttendanceRecord[] = [];
  let attCounter = 1;
  for (const s of sessions) {
    if (!s.attendanceRecorded) continue;
    const count = s.confirmedCount + s.walkInCount;
    for (let mIdx = 1; mIdx <= count; mIdx++) {
      const member = seniorCitizens[(mIdx * 3 + attCounter) % seniorCitizens.length];
      const isPresent = (attCounter % 7 !== 0);

      attendanceRecords.push({
        id: `att-${attCounter}`,
        sessionId: s.id,
        centreId: s.centreId,
        memberId: member.id,
        memberName: member.fullName,
        membershipId: member.membershipId,
        sessionDate: s.date,
        status: isPresent ? 'Present' : 'Absent',
        recordedBy: 'u-vf-pune',
        recordedAt: `${s.date}T12:00:00Z`,
        corrected: attCounter % 50 === 0,
      });
      attCounter++;
      if (attCounter > 3000) break;
    }
    if (attCounter > 3000) break;
  }

  // 8. 12 Service Partners & Referrals
  const servicePartners: ServicePartner[] = [
    {
      id: 'sp-1',
      name: 'Sanctuary Elder Health & Geriatric Clinic',
      category: 'Clinic',
      contactPerson: 'Dr. Anand Dighe',
      email: 'partner.health@sanctuaryclinic.in',
      phone: '9822019900',
      address: '12 Erandwane, Karve Road, Pune 411004',
      city: 'Pune',
      approvalStatus: 'Approved',
      approvedAt: '2026-07-01T10:00:00Z',
      notes: 'Charitable outpatient consultations on Tuesdays and Thursdays.',
    },
    {
      id: 'sp-2',
      name: 'Justice For Elders Legal Aid Foundation',
      category: 'Legal Aid',
      contactPerson: 'Adv. Smita Ranade',
      email: 'partner.legal@justiceelders.org',
      phone: '9822028811',
      address: 'Bar Association Chambers, District Court, Pune 411005',
      city: 'Pune',
      approvalStatus: 'Approved',
      approvedAt: '2026-07-05T10:00:00Z',
      notes: 'Assistance with pension entitlements, maintenance tribunal filings.',
    },
    {
      id: 'sp-3',
      name: 'Drushti Netralaya & Charitable Eye Trust',
      category: 'Eye Care',
      contactPerson: 'Dr. Nilesh Shah',
      email: 'drushti.nashik@trusteyes.org',
      phone: '9822037722',
      address: 'Opp. City Hospital, College Road, Nashik 422005',
      city: 'Nashik',
      approvalStatus: 'Approved',
      approvedAt: '2026-07-10T10:00:00Z',
      notes: 'Subsidized cataract surgeries and free monthly screenings.',
    },
    {
      id: 'sp-4',
      name: 'ActiveAge Physiotherapy & Rehabilitation Center',
      category: 'Physiotherapy',
      contactPerson: 'Dr. Sneha Vaidya (PT)',
      email: 'contact@activeagephysio.com',
      phone: '9823046633',
      address: 'Plot 8, Ramdaspeth, Nagpur 440010',
      city: 'Nagpur',
      approvalStatus: 'Approved',
      approvedAt: '2026-07-12T10:00:00Z',
      notes: 'Gait training, balance recovery, and joint pain management.',
    },
  ];

  for (let sp = 5; sp <= 12; sp++) {
    servicePartners.push({
      id: `sp-${sp}`,
      name: `Community Partner Organisation ${sp}`,
      category: sp % 2 === 0 ? 'Physiotherapy' : 'Pension Helpdesk',
      contactPerson: `Director ${sp}`,
      email: `partner${sp}@vayohvikas-network.in`,
      phone: `98220${String(10000 + sp)}`,
      address: `Ward ${sp}, Sector B`,
      city: centres[sp % centres.length].city,
      approvalStatus: sp === 11 ? 'Pending' : (sp === 12 ? 'Suspended' : 'Approved'),
      approvedAt: sp <= 10 ? '2026-08-01T10:00:00Z' : undefined,
      notes: 'Standard pilot MoU signed.',
    });
  }

  // 9. ~350 Referrals across statuses
  const referrals: Referral[] = [];
  const referralStatuses: Referral['status'][] = ['Created', 'Sent', 'Accepted', 'InProgress', 'Closed', 'Declined'];
  for (let r = 1; r <= 350; r++) {
    const member = seniorCitizens[r * 2 % seniorCitizens.length];
    const partner = servicePartners[r % servicePartners.length];
    const status = referralStatuses[r % referralStatuses.length];

    referrals.push({
      id: `ref-${r}`,
      memberId: member.id,
      memberName: member.fullName,
      memberAgeBand: '70–74',
      centreId: member.centreId,
      partnerId: partner.id,
      partnerName: partner.name,
      serviceId: 'srv-1',
      serviceName: 'Mobility & Gait Evaluation',
      urgency: r % 8 === 0 ? 'Immediate' : (r % 3 === 0 ? 'High' : 'Normal'),
      nonClinicalReason: 'Senior expressed difficulty with stairs and requested assessment for assistive walking stick.',
      status,
      createdBy: 'u-cc-pune',
      createdByName: 'Meera Joshi',
      createdAt: new Date(2026, 8, 1 + (r % 50)).toISOString(),
      partnerNotes: status === 'InProgress' || status === 'Closed' ? 'Consultation scheduled at centre hall.' : undefined,
      closedAt: status === 'Closed' ? new Date(2026, 9, 20).toISOString() : undefined,
      closureOutcome: status === 'Closed' ? 'Resolved' : undefined,
    });
  }

  // 10. ~40 Health Escalations
  const escalations: HealthEscalation[] = [];
  const escalationSeverities: HealthEscalation['severity'][] = ['Immediate', 'High', 'Standard'];
  for (let e = 1; e <= 40; e++) {
    const member = seniorCitizens[(e * 17) % seniorCitizens.length];
    const sev = escalationSeverities[e % escalationSeverities.length];
    const isResolved = e > 15;

    escalations.push({
      id: `esc-${e}`,
      memberId: member.id,
      memberName: member.fullName,
      centreId: member.centreId,
      severity: sev,
      source: e % 3 === 0 ? 'WhatsApp' : 'CentreWalkIn',
      triggerKeywords: sev === 'Immediate' ? ['chest pain'] : (sev === 'High' ? ['dizziness', 'fall'] : ['lonely']),
      summary: sev === 'Immediate'
        ? 'Senior sent WhatsApp message complaining of acute breathlessness.'
        : 'Senior reported feeling unsteady and dizzy during morning prayers.',
      slaHours: sev === 'Immediate' ? 2 : (sev === 'High' ? 6 : 24),
      assignedExpertId: 'u-ct-1',
      assignedExpertName: 'Sister Mary Teresa Fernandez',
      status: isResolved ? 'Resolved' : (e % 2 === 0 ? 'Acknowledged' : 'Open'),
      createdAt: new Date(2026, 9, 27, 8 + (e % 10)).toISOString(),
      acknowledgedAt: new Date(2026, 9, 27, 8, 30).toISOString(),
      resolvedAt: isResolved ? new Date(2026, 9, 27, 11).toISOString() : undefined,
      resolutionSummary: isResolved ? 'Family contacted; neighbor assisted senior to primary health clinic.' : undefined,
      handoverNotes: 'Advised local volunteer to visit residence tomorrow morning.',
    });
  }

  // 11. ~2,000 Messages with mixed delivery statuses
  const outboundMessages: OutboundMessage[] = [];
  const msgStatuses: OutboundMessage['status'][] = ['Read', 'Delivered', 'Sent', 'Failed', 'Queued'];
  for (let m = 1; m <= 2000; m++) {
    const member = seniorCitizens[m % seniorCitizens.length];
    const status = member.consentStatus === 'OptedOut' ? 'Failed' : msgStatuses[m % msgStatuses.length];

    outboundMessages.push({
      id: `msg-${m}`,
      recipientMemberId: member.id,
      recipientPhone: member.phone,
      recipientName: member.fullName,
      centreId: member.centreId,
      templateCode: 'REM_01',
      category: 'SessionReminder',
      content: `Namaste ${member.fullName}, gentle reminder for your Yoga session tomorrow at 10 AM at ${centres[0].name}. Reply STOP to opt out.`,
      status,
      failureReason: status === 'Failed' ? (member.consentStatus === 'OptedOut' ? 'Member has opted out' : 'Number not registered on WhatsApp') : undefined,
      scheduledFor: new Date(2026, 9, 25, 9).toISOString(),
      sentAt: status !== 'Queued' ? new Date(2026, 9, 25, 9, 1).toISOString() : undefined,
      deliveredAt: status === 'Delivered' || status === 'Read' ? new Date(2026, 9, 25, 9, 2).toISOString() : undefined,
      readAt: status === 'Read' ? new Date(2026, 9, 25, 9, 15).toISOString() : undefined,
      retryCount: status === 'Failed' ? 1 : 0,
    });
  }

  // 12. Message Templates
  const templates: MessageTemplate[] = [
    {
      id: 'tpl-1',
      code: 'BOOK_CONF_01',
      title: 'Programme Booking Confirmation',
      category: 'BookingConfirmation',
      body: 'Namaste {name}, your seat is confirmed for {programme} on {date} at {time} at {centre}. We look forward to welcoming you! Reply STOP to opt out.',
      variables: ['name', 'programme', 'date', 'time', 'centre'],
      languages: ['English', 'Hindi', 'Marathi'],
      status: 'Approved',
      submittedBy: 'u-pm-1',
      reviewedBy: 'u-nm-1',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'tpl-2',
      code: 'REM_SESS_01',
      title: 'Upcoming Session Reminder',
      category: 'SessionReminder',
      body: 'Namaste {name}, this is a gentle reminder that your session {programme} will take place tomorrow at {time} at {centre}. Please carry your water bottle. Reply STOP to opt out.',
      variables: ['name', 'programme', 'time', 'centre'],
      languages: ['English', 'Hindi', 'Marathi'],
      status: 'Approved',
      submittedBy: 'u-pm-1',
      reviewedBy: 'u-nm-1',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'tpl-3',
      code: 'ANN_CAMP_01',
      title: 'Free Health & Eye Camp Announcement',
      category: 'Announcement',
      body: 'Vayoh Vikas Ekta Hub is organizing a Free Preventive Health & Eye Camp this Saturday from 9 AM to 1 PM at {centre}. All senior members and families welcome! Reply STOP to opt out.',
      variables: ['centre'],
      languages: ['English', 'Hindi'],
      status: 'Approved',
      submittedBy: 'u-pm-1',
      reviewedBy: 'u-nm-1',
      updatedAt: '2026-08-10T10:00:00Z',
    },
  ];

  // 13. System Settings
  const settings: SystemSettings = {
    organisationName: 'Vayoh Vikas NGO',
    pilotStartDate: '2026-08-01',
    pilotEndDate: '2026-10-31',
    pilotRegistrationTarget: 1000,
    activeMemberWindowDays: 30,
    attendanceLockHours: 12,
    whatsappMessageVolumeCap: 10000,
    supportedLanguages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    sessionTimeoutMinutes: 15,
    featureFlags: {
      voiceCheckins: true,
      familyAccess: true,
      advancedReferrals: true,
    },
    consentTextVersion: 'v2.1 (October 2026)',
  };

  // 14. Audit Events (~100 events)
  const auditEvents: AuditEvent[] = [
    {
      id: 'aud-1',
      actorId: 'u-sa-1',
      actorName: 'Vikramaditya Rao',
      actorRole: 'SA',
      action: 'CREATE',
      entity: 'SystemSettings',
      entityId: 'settings-global',
      reason: 'Initial 90-day pilot parameters configured',
      timestamp: '2026-08-01T08:00:00Z',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'aud-2',
      actorId: 'u-vf-pune',
      actorName: 'Pooja Shinde',
      actorRole: 'VF',
      centreId: 'HUB-PUN',
      action: 'PII_REVEAL',
      entity: 'SeniorCitizen',
      entityId: 'm-1',
      reason: 'Emergency call to arrange transport for clinic follow-up',
      timestamp: '2026-10-20T14:30:00Z',
      hash: '7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0e336d329da6',
    },
  ];

  return {
    centres,
    users,
    seniorCitizens,
    familyLinks,
    programmes,
    sessions,
    attendanceRecords,
    servicePartners,
    referrals,
    escalations,
    outboundMessages,
    templates,
    settings,
    auditEvents,
  };
}
