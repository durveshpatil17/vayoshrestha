import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Plus, Star, FileText, CheckCircle2 } from 'lucide-react';

export const FeedbackFormBuilderPage: React.FC = () => {
  const [formTitle, setFormTitle] = useState('Standard Post-Session Feedback (Ekta Hub)');
  const [questions, setQuestions] = useState([
    { id: 1, text: 'Overall satisfaction with today’s session', type: 'stars' },
    { id: 2, text: 'Did the instructor explain exercises at a comfortable pace?', type: 'yes_no' },
    { id: 3, text: 'Any suggestions or difficulties experienced today?', type: 'text' },
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('stars');
  const [saved, setSaved] = useState(false);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), text: newQuestionText, type: newQuestionType },
    ]);
    setNewQuestionText('');
  };

  const handleSaveForm = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Session Feedback Form Builder"
        description="Design accessible multilingual feedback surveys for mobile app and assisted volunteer entry (FR-35)"
        breadcrumb={[
          { label: 'Feedback', href: '/feedback' },
          { label: 'Form Builder' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleSaveForm}>
            Save Active Template
          </Button>
        }
      />

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Feedback template updated for all Ekta Hub sessions.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Builder Questions Column */}
        <div className="md:col-span-7 bg-bg-base border border-border-hairline rounded p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Form Survey Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-text-primary">Survey Questions ({questions.length})</h4>

            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-text-primary mr-2">Q{idx + 1}.</span>
                    <span>{q.text}</span>
                    <span className="ml-2 font-mono text-[10px] text-text-muted">[{q.type}]</span>
                  </div>
                  <button
                    onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                    className="text-text-muted hover:text-rose-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Question Form */}
          <form onSubmit={handleAddQuestion} className="pt-3 border-t border-border-hairline space-y-3">
            <h5 className="font-medium text-xs text-text-primary">Add New Survey Question:</h5>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Question label..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="col-span-2 text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
                className="text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="stars">1-5 Stars</option>
                <option value="yes_no">Yes / No</option>
                <option value="text">Short Text</option>
              </select>
            </div>
            <Button type="submit" variant="outline" size="sm" className="text-xs" disabled={!newQuestionText.trim()}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Question
            </Button>
          </form>
        </div>

        {/* Live Senior Tablet / Mobile Preview */}
        <div className="md:col-span-5 bg-bg-base border border-border-hairline rounded p-6 flex flex-col items-center">
          <h4 className="font-serif text-sm font-semibold text-text-primary mb-3">Senior Participant View Preview</h4>

          <div className="w-full max-w-sm bg-bg-subtle border-2 border-border-hairline rounded-xl p-5 space-y-4 shadow-sm text-sm">
            <div className="text-center border-b border-border-hairline pb-2">
              <h5 className="font-serif font-bold text-text-primary text-base">{formTitle}</h5>
              <p className="text-xs text-text-muted">Takes less than 1 minute</p>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-1.5 text-xs">
                <div className="font-medium text-text-primary">{idx + 1}. {q.text}</div>
                {q.type === 'stars' && (
                  <div className="flex gap-2 text-amber-500 text-lg">
                    {'★'.repeat(5)}
                  </div>
                )}
                {q.type === 'yes_no' && (
                  <div className="flex gap-3">
                    <button type="button" className="px-3 py-1 bg-white border border-border-hairline rounded">Yes</button>
                    <button type="button" className="px-3 py-1 bg-white border border-border-hairline rounded">No</button>
                  </div>
                )}
                {q.type === 'text' && (
                  <input
                    type="text"
                    disabled
                    placeholder="Elder speaks or types comments here..."
                    className="w-full text-xs p-2 bg-white border border-border-hairline rounded"
                  />
                )}
              </div>
            ))}

            <button type="button" disabled className="w-full py-2 bg-accent text-white rounded font-medium text-xs">
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
