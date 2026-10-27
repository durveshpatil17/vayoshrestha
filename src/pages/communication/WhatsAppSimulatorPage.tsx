import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Send, Smartphone, RefreshCw, UserCheck, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { SeniorCitizen } from '@/api/contracts';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actions?: string[];
}

export const WhatsAppSimulatorPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  // Pick a simulated senior citizen (e.g. Ramesh Sharma)
  const defaultSenior = data.seniorCitizens.find((s) => s.fullName.includes('Ramesh') || s.fullName.includes('Sharma')) || data.seniorCitizens[0];
  const [selectedSeniorId, setSelectedSeniorId] = useState(defaultSenior?.id || '');
  const activeSenior = data.seniorCitizens.find((s) => s.id === selectedSeniorId) || defaultSenior;

  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [inputMessage, setInputMessage] = useState('');
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [optedOut, setOptedOut] = useState(activeSenior?.optedOutChannels.includes('WhatsApp') || false);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Namaste ${activeSenior?.fullName || 'Elder'} ji! 🙏 Welcome to Vayoshrestha WhatsApp Assistant (Vayoh Vikas).\n\nPlease choose your preferred language / कृपया अपनी भाषा चुनें:`,
      time: '10:00 AM',
      actions: ['1. English', '2. हिंदी', '3. मराठी'],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Simulate Bot Response logic based on keywords
    setTimeout(() => {
      handleBotReply(text.toUpperCase());
    }, 600);
  };

  const handleBotReply = (textUpper: string) => {
    const time = getTimeString();

    // Opt-out logic (FR-29)
    if (textUpper === 'STOP' || textUpper.includes('UNSUBSCRIBE') || textUpper.includes('OPT OUT')) {
      mockStore.updateData((draft) => {
        const elder = draft.seniorCitizens.find((s) => s.id === activeSenior.id);
        if (elder) {
          if (!elder.optedOutChannels.includes('WhatsApp')) {
            elder.optedOutChannels.push('WhatsApp');
          }
          elder.consentStatus = 'OptedOut';
        }
      });

      mockStore.writeAudit(
        activeSenior.id,
        activeSenior.fullName,
        'SC',
        'CONSENT_CHANGE',
        'SeniorCitizen',
        activeSenior.id,
        'Senior citizen sent STOP keyword via WhatsApp simulation',
        { optedOut: false },
        { optedOut: true },
        activeSenior.centreId
      );

      setOptedOut(true);

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'You have been successfully opted out of Vayoshrestha WhatsApp updates (FR-29). No further notifications will be sent to this number. To resume, reply START.',
        time,
        actions: ['START'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper === 'START' || textUpper === 'RESUME') {
      mockStore.updateData((draft) => {
        const elder = draft.seniorCitizens.find((s) => s.id === activeSenior.id);
        if (elder) {
          elder.optedOutChannels = elder.optedOutChannels.filter((c) => c !== 'WhatsApp');
          elder.consentStatus = 'OptedIn';
        }
      });
      setOptedOut(false);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Welcome back! You have opted back in to WhatsApp communications from Vayoh Vikas.',
        time,
        actions: ['Main Menu'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper === '1' || textUpper.includes('ENGLISH') || textUpper === 'MAIN MENU' || textUpper === 'MENU') {
      setLanguage('English');
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Main Menu for ${activeSenior.fullName} ji:\n\n1. Upcoming Programmes at my centre\n2. My Bookings\n3. Senior Healthcare & Referrals\n4. Talk to Ekta Hub Coordinator\n5. Help & Grievance\n\n(Reply with number 1-5 or STOP to opt out)`,
        time,
        actions: ['1. Programmes', '2. My Bookings', '3. Healthcare', '4. Talk to Coordinator', '5. Help'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper === '2' || textUpper.includes('हिंदी')) {
      setLanguage('Hindi');
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `नमस्ते ${activeSenior.fullName} जी! मुख्य सूची:\n\n1. केंद्र के आगामी कार्यक्रम\n2. मेरी बुकिंग\n3. स्वास्थ्य परामर्श\n4. केंद्र समन्वयक से बात करें\n5. सहायता\n\n(नंबर 1-5 भेजें या STOP लिखकर बंद करें)`,
        time,
        actions: ['1. कार्यक्रम', '2. मेरी बुकिंग', '3. स्वास्थ्य', '4. समन्वयक', '5. सहायता'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper.includes('PROGRAMME') || textUpper === '1.' || textUpper === '1') {
      const centreSessions = data.sessions.filter((s) => s.centreId === activeSenior.centreId).slice(0, 3);
      const sessionList = centreSessions
        .map((s, idx) => `${idx + 1}. ${s.programmeTitle} - ${s.date} (${s.startTime})`)
        .join('\n');

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Upcoming sessions at your Ekta Hub:\n\n${sessionList || '1. Morning Yoga Circle - Tomorrow 09:00 AM\n2. Digital Literacy - Thursday 10:30 AM'}\n\nTo book, reply with session number or "Book 1".`,
        time,
        actions: ['Book 1', 'Main Menu'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper.includes('BOOK 1') || textUpper.includes('BOOK')) {
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✅ Booking Confirmed!\n\nSession: Morning Yoga Circle\nDate: Tomorrow at 09:00 AM\nVenue: Ekta Hub Hall\n\nPlease arrive 10 minutes before the start time with your membership card (${activeSenior.membershipId}).`,
        time,
        actions: ['My Bookings', 'Main Menu'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper.includes('MY BOOKINGS') || textUpper === '2.' || textUpper === '2') {
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `You have 1 active upcoming booking:\n\n• Yoga & Pranayama Circle\nDate: 28 Oct 2026, 09:00 AM\nStatus: Confirmed`,
        time,
        actions: ['Main Menu'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (textUpper.includes('COORDINATOR') || textUpper.includes('TALK') || textUpper === '4.' || textUpper === '4') {
      setIsHandoverOpen(true);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Handover requested (FR-42). Your centre coordinator (Meera Joshi - 9822011223) has been notified. They will call you at your registered number within 2 hours.`,
        time,
        actions: ['Main Menu'],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    // Default Fallback
    const botReply: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `I received your message. You can reply with "MENU" to see available options, or reply "STOP" to unsubscribe anytime.`,
      time,
      actions: ['Main Menu', 'STOP'],
    };
    setMessages((prev) => [...prev, botReply]);
  };

  const handleResetSimulator = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Interactive WhatsApp Simulator"
        description="Experience the end-to-end senior citizen communication journey as experienced on their mobile phone (FR-24 & FR-46)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Simulator' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={handleResetSimulator}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Restart Conversation
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Simulator Configuration Controls Left Rail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-sm font-semibold text-text-primary">Simulated Persona Selection</h4>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">Simulate As Senior Citizen:</label>
              <select
                value={selectedSeniorId}
                onChange={(e) => {
                  setSelectedSeniorId(e.target.value);
                  setMessages(initialMessages);
                }}
                className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                {data.seniorCitizens.slice(0, 15).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.membershipId}) - {s.preferredLanguage}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs space-y-1">
              <div><strong>Active Persona:</strong> {activeSenior.fullName} (Age: {new Date().getFullYear() - parseInt(activeSenior.dateOfBirth.slice(0, 4))})</div>
              <div><strong>Membership ID:</strong> <span className="font-mono">{activeSenior.membershipId}</span></div>
              <div><strong>Phone Number:</strong> {activeSenior.phone}</div>
              <div><strong>Consent Status:</strong> {activeSenior.consentStatus}</div>
              {optedOut && (
                <div className="text-rose-700 font-semibold mt-1">
                  ⚠️ Currently Opted Out (Replied STOP)
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border-hairline space-y-2">
              <h5 className="font-medium text-xs text-text-primary">Simulated Quick Triggers:</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSendMessage('1. Programmes')}
                  className="text-xs px-2.5 py-1 bg-bg-subtle border border-border-hairline rounded hover:border-accent"
                >
                  Browse Programmes
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Book 1')}
                  className="text-xs px-2.5 py-1 bg-bg-subtle border border-border-hairline rounded hover:border-accent"
                >
                  Quick Book
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Talk to Coordinator')}
                  className="text-xs px-2.5 py-1 bg-bg-subtle border border-border-hairline rounded hover:border-accent"
                >
                  Request Call Handover
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('STOP')}
                  className="text-xs px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded hover:bg-rose-100 font-semibold"
                >
                  Send "STOP" (Opt-out)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-bg-base border border-border-hairline rounded p-4 text-xs text-text-muted space-y-2">
            <div className="flex items-center gap-2 font-medium text-text-primary">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Architectural Alignment (FR-24 & FR-29)</span>
            </div>
            <p>
              Technology supports human delivery; it does not replace it. If an elder is confused or requests help,
              the conversation can seamlessly hand over to their Ekta Hub coordinator.
            </p>
          </div>
        </div>

        {/* WhatsApp Mobile Frame Center Column */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-[380px] h-[640px] bg-[#EFEAE2] border-[10px] border-zinc-800 rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative">
            {/* Phone Top Notch */}
            <div className="h-5 bg-zinc-800 flex items-center justify-center">
              <div className="w-24 h-3 bg-black rounded-b-md" />
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-serif font-bold flex items-center justify-center text-sm shadow">
                VV
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold leading-tight">Vayoh Vikas Senior Care</div>
                <div className="text-[11px] text-emerald-100">Official verified service</div>
              </div>
            </div>

            {/* Chat Transcript Scroll Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((m) => {
                const isBot = m.sender === 'bot';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-sm ${
                        isBot
                          ? 'bg-white text-zinc-900 rounded-tl-none border border-zinc-200'
                          : 'bg-[#DCF8C6] text-zinc-900 rounded-tr-none border border-[#c2e4ab]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] text-zinc-400 text-right mt-1">
                        {m.time} {isBot ? '' : '✓✓'}
                      </div>
                    </div>

                    {/* Action Quick-Reply Chips */}
                    {isBot && m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.actions.map((act) => (
                          <button
                            key={act}
                            onClick={() => handleSendMessage(act)}
                            className="text-[11px] px-2.5 py-1 bg-white border border-accent/40 text-accent font-medium rounded-full shadow-xs hover:bg-accent hover:text-white transition-colors"
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="bg-[#F0F2F5] p-2 border-t border-zinc-300 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message or number..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 text-xs border border-zinc-300 rounded-full px-3.5 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center hover:bg-[#128C7E] transition-colors shrink-0 shadow"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
