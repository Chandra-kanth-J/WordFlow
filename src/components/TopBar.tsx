import React from 'react';

interface TopBarProps {
  onFocusInput: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onFocusInput }) => {
  return (
    <header className="border-b border-[#EADEC6] bg-[#FCFBF7]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-stone-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 rounded"
        >
          WordFlow
        </a>

        <nav
          aria-label="Primary"
          className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          <a
            href="#stage"
            className="hover:text-orange-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 rounded"
          >
            Practice
          </a>
          <a
            href="#add-word"
            className="hover:text-orange-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 rounded"
          >
            Add Word
          </a>
          <a
            href="#word-list"
            className="hover:text-orange-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 rounded"
          >
            Word List
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onFocusInput}
            className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            New Word
          </button>
        </div>
      </div>
    </header>
  );
};
