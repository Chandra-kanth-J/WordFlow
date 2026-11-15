import React, { FormEvent, useState } from 'react';
import { Plus, Volume2 } from 'lucide-react';

interface WordInputBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAddWord: (rawWord: string, speakImmediately: boolean) => {
    status: 'added' | 'duplicate' | 'empty';
    word?: string;
  };
}

export const WordInputBar: React.FC<WordInputBarProps> = ({
  inputRef,
  onAddWord,
}) => {
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent, speakImmediately: boolean) => {
    e.preventDefault();
    const result = onAddWord(draft, speakImmediately);

    if (result.status === 'empty') {
      setFeedback('Enter an English word or short phrase first.');
      inputRef.current?.focus();
      return;
    }

    if (result.status === 'duplicate') {
      setFeedback(`"${result.word}" is already in your list — selected for practice.`);
      setDraft('');
      return;
    }

    setFeedback(null);
    setDraft('');
  };

  return (
    <section
      id="add-word"
      aria-labelledby="add-word-heading"
      className="bg-white border border-[#EADEC6] rounded-xl p-5 md:p-6 shadow-[0_1px_2px_rgba(28,20,13,0.04)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <label
          id="add-word-heading"
          htmlFor="word-input-field"
          className="text-sm font-semibold text-stone-900"
        >
          Type a word to save &amp; hear
        </label>
        <span className="text-xs text-stone-500">
          Saved in webpage memory only
        </span>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, true)}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          ref={inputRef}
          id="word-input-field"
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (feedback) setFeedback(null);
          }}
          placeholder="e.g., thorough, entrepreneur, subtle"
          autoComplete="off"
          spellCheck={true}
          maxLength={80}
          className="flex-1 min-h-[44px] px-4 py-2.5 text-base text-stone-950 placeholder:text-stone-400 bg-[#FCFBF7] border border-[#E2D3B5] rounded-lg transition-colors focus:bg-white focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Save &amp; Speak</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-stone-800 bg-[#FEF7E0] hover:bg-amber-200/70 border border-[#EADEC6] active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Save</span>
          </button>
        </div>
      </form>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className="mt-2.5 text-xs font-medium text-orange-800"
        >
          {feedback}
        </p>
      )}
    </section>
  );
};
