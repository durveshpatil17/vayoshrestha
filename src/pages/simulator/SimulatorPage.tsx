import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { eventQueue } from '@/mock/eventQueue';
import { parseVitalsInput } from '@/domain/vitalsParser';
import { evaluateVitalsReading } from '@/domain/thresholds';
import { isValidIndianMobile } from '@/domain/onboarding';
import { isValidAbhaNumber, formatAbhaNumber } from '@/domain/abha';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import {
  Smartphone,
  Radio,
  Terminal,
  Send,
  AlertOctagon,
  Clock,
  Wifi,
  WifiOff,
  CheckCheck,
  Check,
  ExternalLink,
  RotateCcw,
  Languages,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  timestamp: string;
  options?: string[];
  isSosAck?: boolean;
}

interface SmsMessage {
  id: string;
  recipient: string;
  senderId: string;
  text: string;
  timestamp: string;
  priority: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  latencyMs?: number;
}

export const SimulatorPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  // Active senior for simulation
  const [selectedSeniorId, setSelectedSeniorId] = useState<string>(
    data.seniorCitizens[0]?.id || ''
  );
  const activeSenior =
    data.seniorCitizens.find((s) => s.id === selectedSeniorId) || data.seniorCitizens[0];

  // Simulator controls
  const [simulateDisconnect, setSimulateDisconnect] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('ENGLISH');
  const [inputText, setInputText] = useState('');

  // 3-Pane States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  // Onboarding Script Bot Step
  const [botStep, setBotStep] = useState<
    | 'IDLE'
    | 'ONBOARDING_GREETING'
    | 'ONBOARDING_NAME'
    | 'ONBOARDING_LANG'
    | 'ONBOARDING_CONTACT'
    | 'ONBOARDING_ABHA'
    | 'ONBOARDING_DONE'
  >('IDLE');

  const [draftName, setDraftName] = useState('');
  const [draftLang, setDraftLang] = useState('ENGLISH');
  const [draftContactName, setDraftContactName] = useState('');
  const [draftContactPhone, setDraftContactPhone] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const tickerEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting or main menu
  useEffect(() => {
    resetChat();
  }, [selectedSeniorId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    tickerEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  // Subscribe to BroadcastChannel & EventQueue
  useEffect(() => {
    const unsub = eventQueue.subscribe((ev) => {
      const now = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
      if (ev.type === 'SOS_TRIGGERED') {
        setSystemLogs((prev) => [
          ...prev,
          {
            id: `LOG-${Date.now()}`,
            timestamp: now,
            type: 'QUEUE_INGEST',
            message: `SOS payload queued. Latency: ${ev.payload.latencyMs}ms. Cross-tab sync emitted.`,
            latencyMs: ev.payload.latencyMs,
          },
        ]);
      } else if (ev.type === 'FALLBACK_SMS_TRIGGERED') {
        setSystemLogs((prev) => [
          ...prev,
          {
            id: `LOG-${Date.now()}`,
            timestamp: now,
            type: 'CELLULAR_FALLBACK',
            message: `Fallback SMS dispatched to NOK carrier. Reason: DATA_DISCONNECT.`,
          },
        ]);
      }
    });
    return () => unsub();
  }, []);

  const addLog = (type: string, message: string, latencyMs?: number) => {
    const now = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    setSystemLogs((prev) => [
      ...prev,
      {
        id: `LOG-${Date.now()}-${Math.random()}`,
        timestamp: now,
        type,
        message,
        latencyMs,
      },
    ]);
  };

  const resetChat = () => {
    const now = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });
    setChatMessages([
      {
        id: 'msg-init-1',
        sender: 'BOT',
        text: `Namaste ${activeSenior?.fullName || 'Senior'}! Welcome to Vayoshreshtha by Vayoh Vikas.\n\nHow can we support you today?`,
        timestamp: now,
        options: [
          '🚨 Trigger Emergency SOS',
          '💊 Medication & Readings',
          '🎟️ View Digital Vouchers',
          '📚 Daily Micro-Lesson',
          '🧠 Mastermind Quiz',
          '⚖️ Legal Inquiry',
          '📝 Start Onboarding',
          '🛑 Stop Messages',
        ],
      },
    ]);
    setBotStep('IDLE');
  };

  // Trigger SOS from WhatsApp
  const handleTriggerSos = () => {
    const now = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });
    const triggerIso = new Date().toISOString();
    const latency = Math.floor(Math.random() * 160) + 110; // 110-270ms

    // User message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: '🚨 Trigger Emergency SOS',
      timestamp: now,
    };

    // Instant bot acknowledgement
    const ackMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'BOT',
      text: '🚨 EMERGENCY ALERT RECEIVED. Immediate assistance is being coordinated with your regional hub.\n\nReply CANCEL if this was triggered in error.\n\n⚠️ In a life-threatening emergency, dial 112 directly.',
      timestamp: now,
      options: ['CANCEL'],
      isSosAck: true,
    };

    setChatMessages((prev) => [...prev, userMsg, ackMsg]);

    addLog('WEBHOOK_RECV', `Inbound WhatsApp webhook received for senior ${activeSenior?.id}`);
    addLog(
      'EVENT_QUEUE',
      `Enqueued SOS alert event into BroadcastChannel. Measured latency: ${latency}ms`,
      latency
    );

    // Save to store
    const sosId = `SOS-${Date.now()}`;
    const newSos = {
      id: sosId,
      seniorId: activeSenior?.id || 'SENIOR-01',
      chapterId: activeSenior?.chapterId || 'CH-BLR-01',
      triggeredAt: triggerIso,
      status: 'TRIGGERED' as const,
      isDrill: false,
      networkStatusAtTrigger: (simulateDisconnect ? 'DISCONNECTED' : 'ONLINE') as any,
      cellularFallbackTriggered: simulateDisconnect,
      cellularFallbackDelivered: simulateDisconnect,
      latencyMs: latency,
      slaBreached: false,
      notes: `Triggered from WhatsApp Phone Simulator. Disconnect simulated: ${simulateDisconnect}`,
    };
    data.sosEvents.unshift(newSos);

    // Broadcast across tabs
    eventQueue.enqueue({
      id: `EV-${Date.now()}`,
      type: 'SOS_TRIGGERED',
      timestamp: Date.now(),
      payload: newSos,
    });

    // Cellular Fallback SMS logic if data disconnect simulated
    if (simulateDisconnect) {
      addLog(
        'NETWORK_DROP',
        'Senior mobile data disconnected mid-transaction. Initiating fallback SMS.'
      );
      const contacts = data.emergencyContacts.filter((c) => c.seniorId === activeSenior?.id);
      const targetContact = contacts[0] || {
        name: 'Daughter / Next-of-Kin',
        phoneNumber: '+919876543210',
        priority: 1,
      };

      const fallbackText = `EMERGENCY: Vayoh Vikas safety alert for ${
        activeSenior?.fullName || 'Senior'
      }. Mobile data disconnected. Help is being notified. Dial 112 in immediate danger.`;

      const smsId = `SMS-${Date.now()}`;
      const newFallbackRecord = {
        id: smsId,
        sosEventId: sosId,
        recipientPhoneNumber: targetContact.phoneNumber,
        messageText: fallbackText,
        dltTemplateId: '1407161234567890123',
        status: 'DELIVERED' as const,
        dispatchedAt: triggerIso,
        deliveredAt: new Date(Date.now() + 1200).toISOString(),
        triggerReason: 'DATA_DISCONNECT_MID_TRANSACTION',
        retryCount: 0,
      };
      data.smsFallbackRecords.unshift(newFallbackRecord);

      // Append to SMS phone screen
      setSmsMessages((prev) => [
        ...prev,
        {
          id: smsId,
          recipient: targetContact.phoneNumber || targetContact.phone || '+91 98220 11223',
          senderId: 'VK-VAYOHV',
          text: fallbackText,
          timestamp: now,
          priority: targetContact.priority || 1,
        },
      ]);

      addLog(
        'GATEWAY_DISPATCH',
        `Pushed transactional SMS to ${targetContact.phoneNumber} (DLT ID: 1407161234567890123)`
      );
    }

    mockStore.persist();
  };

  // Push 08:00 Morning Reminder
  const handlePush0800Reminder = () => {
    const now = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });

    const reminderMsg: ChatMessage = {
      id: `rem-${Date.now()}`,
      sender: 'BOT',
      text: `Good morning ${
        activeSenior?.fullName || 'Senior'
      }! Time for your morning wellness prescription from Vayoh Vikas.\n\nPlease confirm your medication below and reply with your blood pressure (e.g. 130/85) or glucose (e.g. 112).`,
      timestamp: now,
      options: ['💊 Taken', '⏳ Not yet', '⏭️ Skip', '⏰ Remind me in 30 min'],
    };

    setChatMessages((prev) => [...prev, reminderMsg]);
    addLog(
      'SCHEDULER_JOB',
      `Fired scheduled 08:00 utility reminder for ${activeSenior?.fullName} (${activeSenior?.id})`
    );
  };

  // Handle User Input Submission
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    setInputText('');

    const now = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: now,
    };
    setChatMessages((prev) => [...prev, userMsg]);

    addLog('INBOUND_TEXT', `Senior replied: "${text}"`);

    // Handle Quick Reply Actions
    if (text === '🚨 Trigger Emergency SOS') {
      handleTriggerSos();
      return;
    }

    if (text === 'CANCEL') {
      const cancelAck: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Noted. Your alert has been marked "Cancelled by senior". A regional coordinator will still place a brief confirmation call to verify your safety.',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, cancelAck]);
      addLog('SOS_CANCEL', `Senior replied CANCEL. Tagged for human confirmation.`);
      return;
    }

    if (text === '💊 Medication & Readings' || text === '08:00 Reminder') {
      handlePush0800Reminder();
      return;
    }

    if (text === '💊 Taken') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Thank you! Your morning wellness prescription is recorded as Taken. Have a wonderful day!',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('HEALTH_LOG', `Senior confirmed medication: TAKEN`);
      return;
    }

    if (text === '⏳ Not yet') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Understood. We will check in again later. Please remember to take your prescription when convenient.',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, ack]);
      return;
    }

    if (text === '⏭️ Skip') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Medication recorded as Skipped for today. If you feel unwell, do let your coordinator know.',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, ack]);
      return;
    }

    if (text === '🎟️ View Digital Vouchers') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `🎟️ *Your Vayoshrestha Health & Grocery Vouchers*\n\n1. *Winter Diagnostic Screening*\n   Code: *7X9K-4MB2-K* (₹600)\n   Status: Valid at Metropolis / Thyrocare\n\n2. *Ekta Nutrition Grocery Drive*\n   Code: *3N8W-9PL5-Y* (₹1,000)\n   Status: Single-use subsidy\n\nPresent this code to the partner cashier or visit https://vayoshrestha.org/me/vouchers`,
        timestamp: now,
        options: ['💊 Medication & Readings', '🚨 Trigger Emergency SOS'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('VOUCHER_QUERY', `Senior viewed digital voucher wallet via WhatsApp`);
      return;
    }

    if (text === '📚 Daily Micro-Lesson') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `⚠️ *सावध रहा: वीज बिल फसवणूक संदेश! (२ मिनिटे वाचन)*\n\nप्रिय मित्र,\nजर असा संदेश आला: _"वीज बिल भरले नाही, रात्री वीज कापली जाईल"_, तर:\n1️⃣ कोणत्याही अनोळखी नंबरवर त्वरित फोन करू नका.\n2️⃣ मेसेजमधील लिंकवर क्लिक करू नका.\n3️⃣ अधिकृत माहिती: https://cybercrime.gov.in\n\n- वयोश्रेष्ठ डिजिटल साक्षरता मंच`,
        timestamp: now,
        options: ['🧠 Mastermind Quiz', '🎟️ View Digital Vouchers'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('LITERACY_DISPATCH', `Dispatched Micro-Lesson 001 (Fraud Defense) to WhatsApp simulator`);
      return;
    }

    if (text === '🧠 Mastermind Quiz') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `🧠 *Weekly Mastermind Challenge: Question 1*\n\nIf you receive an SMS saying your bank account or electricity will be suspended today, what should you do?\n\n1️⃣ Call the phone number inside the SMS immediately\n2️⃣ Ignore or verify via Ekta Hub coordinator\n3️⃣ Send your Aadhaar OTP\n\nReply with 1, 2, or 3!`,
        timestamp: now,
        options: ['2️⃣ Verify with Hub', '1️⃣ Call the number', '3️⃣ Send OTP'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('QUIZ_START', `Senior started Mastermind Quiz round`);
      return;
    }

    if (text.includes('2️⃣ Verify with Hub')) {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `🎉 *Correct!* You earned 1 point for your Chapter team!\n\nOfficial electricity boards and banks never send mobile phone numbers for emergency bill recovery.\n\nLeaderboard: Team Kothrud Elders is in 1st place!`,
        timestamp: now,
        options: ['📚 Daily Micro-Lesson', '🎟️ View Digital Vouchers'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('QUIZ_CORRECT', `Senior answered Quiz Q1 correctly (Score +1)`);
      return;
    }

    if (text === '⚖️ Legal Inquiry') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `⚖️ *Vayoshrestha Pro-Bono Legal Intake*\n\nNotice: Vayoh Vikas is an NGO and does not provide direct legal counsel. All cases are mediated by independent verified advocates under the Senior Citizens Act 2007.\n\nWould you like an advocate to contact you regarding property dispute mediation or maintenance allowance?`,
        timestamp: now,
        options: ['Yes, Request Legal Support', 'No, return to menu'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('LEGAL_INTAKE_INQUIRY', `Senior inquired about Pro-Bono Legal Intake`);
      return;
    }

    if (text === 'Yes, Request Legal Support') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `✅ Your confidential intake has been routed to Vidhi Centre for Senior Legal Aid (Case ID: LEG-2026-084).\n\nAn advocate will contact you within 48 working hours. Thank you.`,
        timestamp: now,
        options: ['🎟️ View Digital Vouchers', '💊 Medication & Readings'],
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('LEGAL_INTAKE_SUBMITTED', `Created Case LEG-2026-084 and routed to Vidhi Centre`);
      return;
    }

    if (text === '🛑 Stop Messages') {
      const ack: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'You have been opted out of daily reminders. You can text START anytime to resume. Emergency SOS remains functional.',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, ack]);
      addLog('CONSENT_REVOKE', `Senior requested STOP. Reminders paused.`);
      return;
    }

    if (text === '📝 Start Onboarding') {
      setBotStep('ONBOARDING_GREETING');
      const step1: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Welcome to Vayoshreshtha Onboarding! By continuing, you consent to Vayoh Vikas keeping your emergency contact details safe for life-safety outreach.\n\nDo you consent?',
        timestamp: now,
        options: ['Yes, I Consent', 'No, cancel'],
      };
      setChatMessages((prev) => [...prev, step1]);
      return;
    }

    // Onboarding step processing
    if (botStep === 'ONBOARDING_GREETING') {
      if (text.toLowerCase().includes('yes')) {
        setBotStep('ONBOARDING_NAME');
        const next: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'BOT',
          text: 'Thank you. Please type your Full Legal Name:',
          timestamp: now,
        };
        setChatMessages((prev) => [...prev, next]);
      } else {
        setBotStep('IDLE');
        resetChat();
      }
      return;
    }

    if (botStep === 'ONBOARDING_NAME') {
      setDraftName(text);
      setBotStep('ONBOARDING_LANG');
      const next: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `Nice to meet you, ${text}! What language do you prefer for WhatsApp messages?`,
        timestamp: now,
        options: ['English', 'Hindi', 'Kannada', 'Marathi', 'Tamil'],
      };
      setChatMessages((prev) => [...prev, next]);
      return;
    }

    if (botStep === 'ONBOARDING_LANG') {
      setDraftLang(text.toUpperCase());
      setBotStep('ONBOARDING_CONTACT');
      const next: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Please enter your Primary Next-of-Kin Emergency Contact (Name and 10-digit Mobile Number, e.g. "Ananya +919876543210"):',
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, next]);
      return;
    }

    if (botStep === 'ONBOARDING_CONTACT') {
      setDraftContactName(text);
      setBotStep('ONBOARDING_ABHA');
      const next: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: 'Optional: If you have a 14-digit Ayushman Bharat Health Account (ABHA) number (XX-XXXX-XXXX-XXXX), type it now. Otherwise reply SKIP.\n\n(Note: ABHA linkage is Phase 2 ready structure only).',
        timestamp: now,
        options: ['SKIP'],
      };
      setChatMessages((prev) => [...prev, next]);
      return;
    }

    if (botStep === 'ONBOARDING_ABHA') {
      setBotStep('ONBOARDING_DONE');
      const memberId = `VV-BLR-26-${Math.floor(Math.random() * 90000 + 10000)}`;
      const doneMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: `🎉 Congratulations ${draftName}! Your Vayoshreshtha onboarding is complete!\n\nYour Member ID is: ${memberId}\nChapter: Bengaluru Hub\n\nYou are now protected by our 24/7 SOS safety network.`,
        timestamp: now,
        options: ['🚨 Trigger Emergency SOS', '💊 Medication & Readings'],
      };
      setChatMessages((prev) => [...prev, doneMsg]);
      addLog('ONBOARDING_COMPLETE', `Senior self-onboarded via WhatsApp bot. ID: ${memberId}`);
      return;
    }

    // Vital log text parser (e.g. 130/85 or 112)
    const parsedVital = parseVitalsInput(text);
    if (parsedVital) {
      const evaluation = evaluateVitalsReading(parsedVital, data.thresholdConfig);

      let replyMsg = '';
      if (evaluation.band === 'CRITICAL') {
        replyMsg = `⚠️ ALERT: Your reading of ${
          parsedVital.systolic
            ? `${parsedVital.systolic}/${parsedVital.diastolic} mmHg`
            : `${parsedVital.glucoseValue} mg/dL`
        } is in a critical band. An urgent safety alert has been routed to your regional care team. If in distress, dial 112.`;
      } else if (evaluation.band === 'HIGH_RISK') {
        replyMsg = `Thank you. We have recorded your reading of ${
          parsedVital.systolic
            ? `${parsedVital.systolic}/${parsedVital.diastolic} mmHg`
            : `${parsedVital.glucoseValue} mg/dL`
        }. A chapter coordinator will place a wellness check-in call with you shortly.`;
      } else {
        replyMsg = `Thank you! Your reading of ${
          parsedVital.systolic
            ? `${parsedVital.systolic}/${parsedVital.diastolic} mmHg`
            : `${parsedVital.glucoseValue} mg/dL`
        } has been recorded in your wellness log. Keep up the great health habits!`;
      }

      const vitalAck: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: replyMsg,
        timestamp: now,
      };
      setChatMessages((prev) => [...prev, vitalAck]);

      // Add to mockStore vital logs
      data.vitalLogs.unshift({
        id: `VIT-${Date.now()}`,
        seniorId: activeSenior?.id || 'SENIOR-01',
        chapterId: activeSenior?.chapterId || 'CH-BLR-01',
        recordedAt: new Date().toISOString(),
        readingType: parsedVital.readingType,
        systolic: parsedVital.systolic,
        diastolic: parsedVital.diastolic,
        glucoseValue: parsedVital.glucoseValue,
        rawText: text,
        riskBand: evaluation.band,
        isFlagged: evaluation.band === 'HIGH_RISK' || evaluation.band === 'CRITICAL',
      });

      if (evaluation.action === 'FLAG_FOR_CALL') {
        data.healthFlags.unshift({
          id: `FLAG-${Date.now()}`,
          seniorId: activeSenior?.id || 'SENIOR-01',
          chapterId: activeSenior?.chapterId || 'CH-BLR-01',
          flaggedAt: new Date().toISOString(),
          readingValue: parsedVital.systolic
            ? `${parsedVital.systolic}/${parsedVital.diastolic}`
            : `${parsedVital.glucoseValue}`,
          bandCrossed: evaluation.band,
          ruleVersion: 'v1.0-clinician-placeholder',
          status: 'NEW',
        });
      }

      mockStore.persist();
      addLog(
        'VITAL_PARSED',
        `Parsed ${parsedVital.readingType} (${evaluation.band}). Action: ${evaluation.action}`
      );
      return;
    }

    // Default polite re-ask if input not recognized
    const fallbackBot: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'BOT',
      text: 'Thank you for your message. To log vitals, please type numbers like 130/85 or 110. Tap 🚨 Trigger Emergency SOS if you need immediate assistance.',
      timestamp: now,
    };
    setChatMessages((prev) => [...prev, fallbackBot]);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Top Banner with Cross-Tab Hint */}
      <div className="p-3 bg-accent-tint border border-accent/20 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-text-primary">
            <strong>Cross-Tab Sync Active:</strong> Open{' '}
            <a href="/sos" target="_blank" rel="noreferrer" className="underline font-semibold text-accent">
              /sos in another browser tab
            </a>{' '}
            to watch alerts arrive in under 1 second via BroadcastChannel.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded border border-border-hairline">
            <input
              type="checkbox"
              checked={simulateDisconnect}
              onChange={(e) => setSimulateDisconnect(e.target.checked)}
              className="text-danger rounded"
            />
            <span
              className={`text-xs font-semibold ${
                simulateDisconnect ? 'text-danger' : 'text-text-muted'
              }`}
            >
              Simulate Data Disconnect (Cellular Fallback)
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="WhatsApp & SMS Gateway Simulator"
          description="Test senior WhatsApp interactions, cellular fallback SMS to next-of-kin, and real-time event pipeline latency."
        />
        <div className="flex items-center gap-2">
          <select
            value={selectedSeniorId}
            onChange={(e) => setSelectedSeniorId(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-border-hairline rounded bg-white"
          >
            {data.seniorCitizens.slice(0, 15).map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.memberId} - {s.chapterId})
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            className="text-xs gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Chat
          </Button>
        </div>
      </div>

      {/* 3-Pane Side-by-Side Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANE 1: Senior Citizen WhatsApp Phone Frame (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold text-text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              Pane 1: Senior WhatsApp Chat
            </span>
            <span className="text-[10px] text-text-muted tabular-nums">{activeSenior?.phoneNumber}</span>
          </div>

          <div className="bg-[#ECE5DD] border border-[#DDD4C9] rounded-2xl overflow-hidden flex flex-col h-[650px] font-sans">
            {/* Phone Top Chrome */}
            <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold text-xs text-white">
                  VV
                </div>
                <div>
                  <div className="font-semibold text-xs leading-none">Vayoh Vikas Support</div>
                  <div className="text-[10px] text-white/80 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePush0800Reminder}
                  className="text-[10px] h-6 px-2 bg-white/10 hover:bg-white/20 text-white border-transparent"
                >
                  08:00 Push
                </Button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'USER' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-2.5 text-xs max-w-[85%]  leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-[#DCF8C6] text-[#111]'
                        : msg.isSosAck
                        ? 'bg-negative-tint border border-negative/30 text-negative font-medium'
                        : 'bg-white text-[#111] border border-black/5'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-gray-500 tabular-nums mt-1">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'USER' && (
                        <CheckCheck className="w-3 h-3 text-[#34B7F1]" />
                      )}
                    </div>
                  </div>

                  {/* Quick-reply button suggestions */}
                  {msg.options && (
                    <div className="mt-2 space-y-1 w-[85%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSendMessage(opt)}
                          className={`w-full py-1.5 px-3 text-xs font-semibold rounded  text-center transition-colors ${
                            opt.includes('SOS')
                              ? 'bg-danger text-white hover:bg-danger/90 font-semibold'
                              : 'bg-white hover:bg-gray-50 border border-gray-200 text-[#00A884]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-2 bg-[#F0F0F0] border-t border-[#DDD] flex items-center gap-2">
              <input
                type="text"
                placeholder="Type reading (130/85) or message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-xs px-3 py-2 bg-white rounded-full border border-gray-300 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PANE 2: Next-of-Kin SMS Phone Frame (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-semibold text-text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-accent" />
              Pane 2: NOK SMS Phone
            </span>
            <span className="text-[10px] text-text-muted tabular-nums">Cellular</span>
          </div>

          <div className="bg-[#1C1B19] text-white rounded-2xl overflow-hidden flex flex-col h-[650px] font-sans border-4 border-[#333]">
            {/* SMS Header */}
            <div className="bg-[#2A2926] p-3 text-center border-b border-[#3F3D38]">
              <div className="font-semibold text-xs">Messages (Next-of-Kin)</div>
              <div className="text-[10px] text-text-muted mt-0.5">Transactional Carrier Channel</div>
            </div>

            {/* SMS Messages List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {smsMessages.length === 0 ? (
                <div className="text-center py-12 text-text-muted text-xs">
                  <Radio className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>No SMS Fallback Received</p>
                  <p className="text-[11px] mt-1 text-[#888]">
                    Toggle "Simulate Data Disconnect" and trigger SOS to simulate cellular fallback.
                  </p>
                </div>
              ) : (
                smsMessages.map((sms) => (
                  <div key={sms.id} className="space-y-1">
                    <div className="text-[10px] text-[#A19D94] flex items-center justify-between tabular-nums">
                      <span>Sender: {sms.senderId}</span>
                      <span>{sms.timestamp}</span>
                    </div>
                    <div className="p-3 bg-[#2A2926] border border-danger/40 rounded-lg text-xs leading-relaxed text-red-200">
                      {sms.text}
                    </div>
                    <div className="text-[9px] text-[#888] tabular-nums text-right">
                      Priority {sms.priority} Recipient · DLT Verified
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SMS Footer */}
            <div className="p-2 bg-[#222] text-center text-[10px] text-[#777] border-t border-[#333]">
              GSM 7-bit Cellular Fallback Screen
            </div>
          </div>
        </div>

        {/* PANE 3: System Event Ticker (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              Pane 3: System Event Ticker
            </span>
            <span className="text-[10px] text-success tabular-nums">● LIVE</span>
          </div>

          <div className="bg-[#1C1B19] text-[#D5DADD] rounded-xl p-3 tabular-nums text-[11px] h-[650px] overflow-y-auto border border-[#3F3D38] space-y-2.5">
            <div className="text-[10px] text-[#888] border-b border-[#333] pb-1.5">
              // Event pipeline telemetry (BroadcastChannel & Gateway logs)
            </div>

            {systemLogs.length === 0 ? (
              <div className="py-8 text-center text-[#777]">Listening for pipeline events...</div>
            ) : (
              systemLogs.map((log) => (
                <div key={log.id} className="space-y-0.5 border-b border-[#2C2B28] pb-1.5">
                  <div className="flex items-center justify-between text-[10px] text-[#A19D94]">
                    <span className="text-accent font-semibold">[{log.type}]</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-white/90 leading-tight">{log.message}</p>
                  {log.latencyMs !== undefined && (
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      ⚡ Measured Latency: {log.latencyMs} ms (&lt; 1,000 ms target)
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={tickerEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
