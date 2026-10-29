/**
 * Virtual Literacy & Micro-Lesson Domain Logic
 * Vayoshreshtha Ecosystem Layer 4 (Education & Gamified Literacy)
 *
 * Implements:
 * - 4-Category Bite-Sized Micro-Lessons (Fraud, Health, Rights, Smartphone)
 * - WhatsApp Bubble Simulation Preview
 * - Drip Campaign Scheduler with Quiet Hours (21:00 to 08:00 blocked)
 * - Regional Mastermind Quiz with Privacy-Safe Anonymous Leaderboard
 */

export type LessonCategory =
  | 'digital_safety_fraud'
  | 'health_literacy'
  | 'rights_schemes'
  | 'smartphone_mastery';

export interface MicroLesson {
  id: string;
  title: string;
  category: LessonCategory;
  language: 'Marathi' | 'Hindi' | 'English' | 'Kannada' | 'Tamil';
  estimatedMinutes: number;
  summary: string;
  whatsappBubbleText: string;
  externalLink?: string;
  status: 'draft' | 'approved' | 'archived';
  author: string;
  approvedBy?: string;
  createdAt: string;
}

export interface DripCampaign {
  id: string;
  name: string;
  lessonIds: string[];
  targetChapter: string;
  frequency: 'daily' | 'biweekly';
  enrolledSeniorsCount: number;
  status: 'scheduled' | 'active' | 'paused' | 'completed';
  startDate: string;
  nextSendHour: number; // e.g. 10 (10:00 AM)
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface MastermindQuiz {
  id: string;
  title: string;
  region: string;
  category: LessonCategory;
  questions: QuizQuestion[];
  leaderboard: {
    anonymousTeam: string;
    chapterName: string;
    score: number;
    completedAt: string;
  }[];
  activeUntil: string;
}

export interface CommunityWebinar {
  id: string;
  title: string;
  speaker: string;
  category: LessonCategory;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  rsvpCount: number;
  isRegistered?: boolean;
}

/**
 * Checks whether current hour is in Quiet Hours (21:00 to 08:00).
 * Quiet hours strictly block automated messages to elders.
 */
export function isQuietHours(hour: number = new Date().getHours()): boolean {
  return hour >= 21 || hour < 8;
}

/**
 * Validates a link against safe allow-list
 */
export function isAllowlistedLink(url: string): boolean {
  const allowlist = [
    'vayoshrestha.org',
    'cybercrime.gov.in',
    'sbi.co.in',
    'abdm.gov.in',
    'mohfw.gov.in',
    'epfindia.gov.in',
  ];
  try {
    const parsed = new URL(url);
    return allowlist.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

// Seed Micro-Lessons
export let SEED_LESSONS: MicroLesson[] = [
  {
    id: 'les-001',
    title: 'Spotting Fake Electricity Bill & Courier SMS Fraud',
    category: 'digital_safety_fraud',
    language: 'Marathi',
    estimatedMinutes: 2,
    summary: 'How to recognize urgent extortion SMS claiming electricity will be disconnected tonight.',
    whatsappBubbleText: `⚠️ *सावध रहा: वीज बिल फसवणूक संदेश!*

प्रिय ज्येष्ठ नागरिक मित्र,
जर तुम्हाला असा मेसेज आला: _"तुमचे वीज बिल भरले नाही, रात्री ९ वाजता वीज खंडित होईल, या नंबरवर कॉल करा"_, तर:
1️⃣ कोणत्याही अनोळखी नंबरवर त्वरित फोन करू नका.
2️⃣ मेसेजमधील लिंकवर क्लिक करू नका.
3️⃣ महावितरण कधीही व्हॉट्सॲपवर वैयक्तिक खात्यात पैसे मागत नाही.

अधिकृत माहिती: https://cybercrime.gov.in
- वयोश्रेष्ठ डिजिटल साक्षरता मंच`,
    externalLink: 'https://cybercrime.gov.in',
    status: 'approved',
    author: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'les-002',
    title: 'Understanding Your Blood Pressure Readings (Systolic vs Diastolic)',
    category: 'health_literacy',
    language: 'Marathi',
    estimatedMinutes: 3,
    summary: 'What do 120/80 numbers mean, when to rest before checking, and salt moderation.',
    whatsappBubbleText: `🩺 *आरोग्य संवाद: रक्तदाब (BP) कसा तपासावा?*

रक्तदाब मोजताना या ३ सोप्या गोष्टी पाळा:
1️⃣ तपासण्यापूर्वी ५ मिनिटे शांत बसा (चहा किंवा चालणे टाळा).
2️⃣ पाठीला आधार देऊन खुर्चीवर बसा आणि हात हृदयाच्या पातळीवर ठेवा.
3️⃣ वरचा आकडा १३० आणि खालचा आकडा ८५ च्या आत असणे सामान्य मानले जाते.

एकदाच आकडा वाढल्यास घाबरू नका; ३ दिवस सलग नोंद घेऊन केंद्रातील परिचारिकेला दाखवा.
- वयोश्रेष्ठ आरोग्य पथक`,
    status: 'approved',
    author: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
    createdAt: '2026-10-18T11:00:00Z',
  },
  {
    id: 'les-003',
    title: 'Senior Citizens Maintenance Act 2007: Know Your Rights',
    category: 'rights_schemes',
    language: 'Marathi',
    estimatedMinutes: 3,
    summary: 'Legal safeguards against eviction and monthly maintenance claim procedures without court fees.',
    whatsappBubbleText: `⚖️ *ज्येष्ठ नागरिक हक्क: पोटगी व देखभाल कायदा २००७*

या कायद्यानुसार:
1️⃣ मुले किंवा कायदेशीर वारसांवर पालकांची योग्य काळजी घेण्याची कायदेशीर जबाबदारी आहे.
2️⃣ छळ किंवा घरातून बेदखल करण्याचा प्रयत्न झाल्यास प्रांत अधिकारी (SDM) कडे मोफत तक्रार करता येते.
3️⃣ वकीलांची मोठी फी देण्याची गरज नाही; एकता हबचे प्रो-बोनो मार्गदर्शक मोफत मदत करतात.

अधिकृत मार्गदर्शन: https://vayoshrestha.org
- वयोश्रेष्ठ विधी सहाय्य`,
    externalLink: 'https://vayoshrestha.org',
    status: 'approved',
    author: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
    createdAt: '2026-10-20T14:30:00Z',
  },
  {
    id: 'les-004',
    title: 'How to Share Location & Voice Notes on WhatsApp',
    category: 'smartphone_mastery',
    language: 'Marathi',
    estimatedMinutes: 2,
    summary: 'Step-by-step guide on sending voice recordings and sharing live location with family.',
    whatsappBubbleText: `📱 *स्मार्टफोन मित्र: व्हॉट्सॲप व्हॉइस मेसेज कसा पाठवावा?*

टायपिंग करायला त्रास होतो का? आता बोला आणि मेसेज पाठवा:
1️⃣ चॅटच्या तळाशी असलेल्या *माइक चिन्हावर* बोट दाबून ठेवा.
2️⃣ तुमचा संदेश स्पष्ट आवाजात बोला.
3️⃣ बोट वर उचलल्यास मेसेज आपोआप जाईल! रद्द करायचा असल्यास बोट डावीकडे सरकवा.

सराव करा आणि तुमच्या मित्राला व्हॉइस मेसेज पाठवून पहा!
- वयोश्रेष्ठ डिजिटल साक्षरता`,
    status: 'approved',
    author: 'Pooja Verma (PM)',
    approvedBy: 'Dr. Anita Joshi (NM)',
    createdAt: '2026-10-22T09:15:00Z',
  },
];

// Seed Drip Campaigns
export let SEED_DRIP_CAMPAIGNS: DripCampaign[] = [
  {
    id: 'drip-fraud-pune',
    name: 'Pune Elders Digital Fraud Defense 7-Day Series',
    lessonIds: ['les-001', 'les-004'],
    targetChapter: 'pune',
    frequency: 'daily',
    enrolledSeniorsCount: 385,
    status: 'active',
    startDate: '2026-10-20',
    nextSendHour: 10, // 10 AM (Safe from quiet hours)
  },
  {
    id: 'drip-health-winter',
    name: 'Winter Wellness & Vital Self-Care 5-Day Series',
    lessonIds: ['les-002', 'les-003'],
    targetChapter: 'all',
    frequency: 'daily',
    enrolledSeniorsCount: 620,
    status: 'active',
    startDate: '2026-10-25',
    nextSendHour: 11, // 11 AM
  },
];

// Seed Mastermind Quiz
export let SEED_QUIZZES: MastermindQuiz[] = [
  {
    id: 'quiz-nov-2026',
    title: 'Maharashtra Senior Digital & Health Mastermind (Nov 2026)',
    region: 'pune',
    category: 'digital_safety_fraud',
    activeUntil: '2026-11-30',
    questions: [
      {
        id: 'q1',
        prompt: 'If you receive an SMS saying your bank account or electricity will be suspended today, what should you do?',
        options: [
          'Call the mobile number written inside the SMS immediately',
          'Ignore the message or verify via official branch / Ekta Hub staff',
          'Send your Aadhaar card number to avoid disconnection',
          'Forward the SMS to 10 friends',
        ],
        correctOptionIndex: 1,
        explanation: 'Official electricity boards and banks never send mobile phone numbers for emergency bill recovery.',
      },
      {
        id: 'q2',
        prompt: 'Before checking your blood pressure at the Ekta Hub clinic, you should:',
        options: [
          'Drink a cup of hot strong coffee',
          'Run or walk briskly for 10 minutes',
          'Sit calmly in a chair for 5 minutes without talking',
          'Hold your breath during measurement',
        ],
        correctOptionIndex: 2,
        explanation: 'Resting quietly for 5 minutes ensures resting baseline blood pressure without exertion spikes.',
      },
      {
        id: 'q3',
        prompt: 'Under the Senior Citizens Act 2007, where can an elder file for maintenance support?',
        options: [
          'Directly in Supreme Court only',
          'At the Sub-Divisional Magistrate (SDM) Tribunal with zero court fees',
          'Police station with criminal charges only',
          'Nowhere; parents have no legal rights',
        ],
        correctOptionIndex: 1,
        explanation: 'The Act established summary tribunals before SDMs specifically to avoid court delays and fees for senior citizens.',
      },
    ],
    leaderboard: [
      { anonymousTeam: 'Team Kothrud Elders (Alpha)', chapterName: 'Kothrud Hub', score: 3, completedAt: '2026-10-28T10:15:00Z' },
      { anonymousTeam: 'Team Aundh Seniors (Prerna)', chapterName: 'Aundh Hub', score: 3, completedAt: '2026-10-28T11:20:00Z' },
      { anonymousTeam: 'Team Shivajinagar Circle', chapterName: 'Shivajinagar Hub', score: 2, completedAt: '2026-10-28T14:40:00Z' },
    ],
  },
];

// Seed Webinars
export let SEED_WEBINARS: CommunityWebinar[] = [
  {
    id: 'web-01',
    title: 'Cyber Safety & Safe Digital Payments for Elders',
    speaker: 'Inspector Ramesh Patil (Cyber Crime Cell) & Dr. Anita Joshi',
    category: 'digital_safety_fraud',
    scheduledAt: '2026-11-05T16:00:00Z',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/vay-ekta-safe',
    rsvpCount: 142,
    isRegistered: true,
  },
  {
    id: 'web-02',
    title: 'Winter Heart & Joint Care: Simple Daily Exercises',
    speaker: 'Dr. Suresh Rao (Senior Cardiologist, Sahyadri Hospital)',
    category: 'health_literacy',
    scheduledAt: '2026-11-12T17:00:00Z',
    durationMinutes: 60,
    meetingLink: 'https://meet.google.com/vay-heart-care',
    rsvpCount: 188,
    isRegistered: false,
  },
];
