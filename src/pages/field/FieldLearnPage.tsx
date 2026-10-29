import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const FieldLearnPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'quiz'>('modules');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_trained') === 'true';
  });

  const questions = [
    {
      id: 1,
      question: 'What is mandatory before taking a peer’s personal contact details in the field?',
      options: [
        'Read aloud the plain-language consent script in their preferred language and obtain affirmative consent.',
        'Assume consent if a family member is standing nearby.',
        'Record their details first and ask for permission later.',
        'Collect their Aadhaar card photocopy for NGO records.',
      ],
      correctIndex: 0,
      explanation:
        'DPDP compliance and Vayoh Vikas ethics require proactive in-person consent in the elder’s preferred language before recording any data.',
    },
    {
      id: 2,
      question: 'What should a field associate do if an elder receives an SMS asking to share an OTP or bank PIN?',
      options: [
        'Assist them in sharing the PIN if it looks like a government pension SMS.',
        'Advise the elder never to share OTP/PINs, explain that banks/NGOs never ask for PINs, and flag as a potential scam.',
        'Ignore the SMS because it does not relate to hub activities.',
        'Forward the SMS to other chapter members.',
      ],
      correctIndex: 1,
      explanation:
        'Vayoh Vikas associates act as frontline digital defenders, actively warning elders against OTP fraud and pension scams.',
    },
  ];

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    const isAllCorrect = questions.every(
      (q, idx) => selectedAnswers[idx] === q.correctIndex
    );
    if (isAllCorrect) {
      setIsCompleted(true);
      localStorage.setItem('vayoshrestha_field_trained', 'true');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-text flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          Field Associate Training
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Essential guidelines for ethical field outreach and peer protection.
        </p>
      </div>

      {/* Certification Badge */}
      <div
        className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
          isCompleted
            ? 'bg-positive-tint/50 border-positive/30 text-positive font-semibold'
            : 'bg-surface-subtle border-border text-text-secondary'
        }`}
      >
        <div className="flex items-center gap-2">
          <Award className={`w-5 h-5 ${isCompleted ? 'text-positive' : 'text-text-secondary'}`} />
          <div>
            <div className="font-semibold text-text">
              {isCompleted ? 'Certified Senior Field Associate' : 'Training Pending Completion'}
            </div>
            <div className="text-xs text-text-secondary">
              {isCompleted ? 'Certified for DPDP peer onboarding' : 'Complete the modules and quiz below'}
            </div>
          </div>
        </div>
        {isCompleted && <CheckCircle2 className="w-4 h-4 text-positive" />}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            activeTab === 'modules'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Learning Modules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            activeTab === 'quiz'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Knowledge Check ({isCompleted ? 'Passed' : 'Pending'})
        </button>
      </div>

      {activeTab === 'modules' ? (
        <div className="space-y-3">
          {/* Module 1 */}
          <div className="p-4 bg-bg-surface rounded-lg border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-tint text-accent">
                Module 1
              </span>
              <span className="text-xs text-text-secondary">3 min read</span>
            </div>
            <h2 className="text-sm font-semibold text-text">
              Ethical Peer Consent & Plain-Language Explanation
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              When meeting fellow seniors in your neighborhood, always explain that Vayoh Vikas is an NGO dedicated to elder well-being.
            </p>
            <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1">
              <li>Always speak in their preferred native tongue (Marathi, Hindi, Kannada, English).</li>
              <li>Never collect passwords, Aadhaar card copies, or banking details.</li>
              <li>Explain that Consent 2 will arrive on their WhatsApp so they remain in complete control.</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="p-4 bg-bg-surface rounded-lg border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-tint text-accent">
                Module 2
              </span>
              <span className="text-xs text-text-secondary">4 min read</span>
            </div>
            <h2 className="text-sm font-semibold text-text">
              Frontline Defense: Recognizing Elder Cyber-Scams
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Older adults are frequently targeted by pension update scams, fake electricity bill threats, and KYC calls.
            </p>
            <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1">
              <li>Warn elders that electricity boards never disconnect power via SMS links.</li>
              <li>Teach peers the golden rule: "Never share OTP with anyone, even if they claim to be from a bank."</li>
              <li>Encourage peers to attend weekly Digital Literacy sessions at the Ekta Hub.</li>
            </ul>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setActiveTab('quiz')}
            className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Knowledge Quiz</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 bg-bg-surface rounded-lg border border-border space-y-3"
            >
              <div className="text-xs font-semibold text-text">
                Q{idx + 1}: {q.question}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[idx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(idx, optIdx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs leading-relaxed transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent-tint/50 font-semibold text-text'
                          : 'border-border bg-surface text-text-secondary hover:border-accent'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswers[idx] !== undefined && (
                <div className="p-2.5 bg-surface-subtle rounded text-xs text-text-secondary">
                  <span className="font-semibold text-text">Guidance: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}

          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Submit Answers & Verify Certification</span>
          </Button>
        </div>
      )}
    </div>
  );
};
