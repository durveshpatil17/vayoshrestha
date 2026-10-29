import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Trophy,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SEED_QUIZZES,
  MastermindQuiz,
} from '@/domain/learning/learningEngine';

export const QuizzesPage: React.FC = () => {
  const [quiz] = useState<MastermindQuiz>(() => SEED_QUIZZES[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regional Senior Mastermind Quiz"
        subtitle="Weekly gamified knowledge challenges on cyber safety, rights, and healthy aging."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Virtual Literacy', href: '/learning' },
          { label: 'Mastermind Quiz' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Quiz Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-brand-primary rounded font-semibold capitalize">
                  November 2026 Challenge
                </span>
                <h3 className="text-xl font-serif font-semibold text-text-primary mt-1">
                  {quiz.title}
                </h3>
              </div>
              <div className="text-xs text-text-secondary">
                Active until: {new Date(quiz.activeUntil).toLocaleDateString()}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6 pt-2">
              {quiz.questions.map((q, idx) => {
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-bg-canvas border border-border rounded-xl space-y-3"
                  >
                    <div className="font-semibold text-sm text-text-primary flex items-start gap-2">
                      <span className="text-brand-primary">Q{idx + 1}.</span>
                      <span>{q.prompt}</span>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let optionStyle = 'bg-bg-surface border-border hover:border-brand-primary';

                        if (isSubmitted) {
                          if (optIdx === q.correctOptionIndex) {
                            optionStyle = 'bg-emerald-50 border-brand-primary font-semibold text-brand-primary';
                          } else if (isChosen) {
                            optionStyle = 'bg-red-50 border-negative text-negative';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-emerald-50/50 border-brand-primary text-brand-primary font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full p-3 border rounded-lg text-left text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && optIdx === q.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isSubmitted && (
                      <div className="p-3 bg-bg-surface border border-border rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-text-primary">Explanation:</div>
                        <p className="text-text-secondary leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              {isSubmitted ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-text-primary">
                    Your Score: <span className="text-brand-primary">{score} / {quiz.questions.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="px-3.5 py-1.5 border border-border rounded-lg text-xs font-semibold text-text-secondary hover:bg-bg-canvas flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                >
                  <Award className="w-4 h-4" />
                  Submit Answers & Calculate Score
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Privacy-Safe Anonymous Leaderboard */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand-primary" />
              Chapter Team Leaderboard
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Privacy-by-design: Scores reflect aggregated chapter team aliases only. Zero individual senior
              names or personal identifiers are published.
            </p>

            <div className="space-y-2.5">
              {quiz.leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-bg-canvas border border-border rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-brand-primary font-semibold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{entry.anonymousTeam}</div>
                      <div className="text-[11px] text-text-secondary">{entry.chapterName}</div>
                    </div>
                  </div>

                  <div className="font-semibold text-brand-primary">
                    {entry.score} / {quiz.questions.length} pts
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-1.5 text-xs text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
              <span>Complies with DPDP Act 2023 non-exposure standards.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
