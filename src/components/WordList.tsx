import React from 'react';
import { RotateCcw, Trash2, Volume2 } from 'lucide-react';
import { PlaybackSpeed, WordEntry } from '../types';

interface WordListProps {
  words: WordEntry[];
  activeWordId: string | null;
  speakingWordId: string | null;
  isSpeaking: boolean;
  speed: PlaybackSpeed;
  onSelectAndSpeak: (entry: WordEntry) => void;
  onRemoveWord: (id: string) => void;
  onClearAll: () => void;
  onRestoreStarterWords: () => void;
}

export const WordList: React.FC<WordListProps> = ({
  words,
  activeWordId,
  speakingWordId,
  isSpeaking,
  speed,
  onSelectAndSpeak,
  onRemoveWord,
  onClearAll,
  onRestoreStarterWords,
}) => {
  return (
    <aside
      id="word-list"
      aria-labelledby="word-list-heading"
      className="bg-white border border-[#EADEC6] rounded-xl p-5 md:p-6 shadow-[0_1px_2px_rgba(28,20,13,0.04)] flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F2E8D5]">
        <div>
          <h2 id="word-list-heading" className="text-sm font-semibold text-stone-900">
            Session Word List
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
            {words.length} {words.length === 1 ? 'word' : 'words'}
            <span aria-hidden="true"> · </span>
            Click any word to hear at {speed}×
          </p>
        </div>

        {words.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="min-h-[36px] px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            Clear all
          </button>
        )}
      </div>

      {words.length === 0 ? (
        <div className="flex-1 flex flex-col items-start justify-center py-10 text-left">
          <p className="text-sm font-medium text-stone-900">
            Your session list is empty
          </p>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Add any English word above, or load a few starter words to test playback speeds right away.
          </p>
          <button
            type="button"
            onClick={onRestoreStarterWords}
            className="mt-4 inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold text-stone-900 bg-[#FEF7E0] hover:bg-amber-200/75 border border-[#EADEC6] rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
            <span>Load starter words</span>
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-[#F2E8D5] -mx-2 mt-1 overflow-y-auto">
          {words.map((entry) => {
            const isActive = entry.id === activeWordId;
            const isPlayingThis = isSpeaking && speakingWordId === entry.id;

            return (
              <li
                key={entry.id}
                className={`group flex items-center justify-between gap-2 px-2 py-2 transition-colors rounded-lg my-0.5 ${
                  isActive ? 'bg-[#FEF7E0]' : 'hover:bg-[#FCFBF7]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectAndSpeak(entry)}
                  className="flex-1 min-w-0 text-left px-2 py-1.5 rounded-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-semibold truncate ${
                        isActive ? 'text-orange-900' : 'text-stone-900'
                      }`}
                    >
                      {entry.text}
                    </span>
                    {isPlayingThis && (
                      <span className="text-xs font-medium text-orange-700 shrink-0">
                        Speaking
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 tabular-nums">
                    <span>
                      Practiced {entry.practiceCount}×
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Added {entry.addedAt}</span>
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectAndSpeak(entry)}
                    aria-label={`Pronounce ${entry.text}`}
                    title={`Pronounce ${entry.text}`}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700 ${
                      isPlayingThis
                        ? 'bg-amber-400 text-stone-950'
                        : isActive
                        ? 'bg-orange-700 text-white hover:bg-orange-800'
                        : 'text-stone-600 hover:text-orange-800 hover:bg-amber-100/70'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveWord(entry.id)}
                    aria-label={`Remove ${entry.text}`}
                    title={`Remove ${entry.text}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-stone-400 hover:text-orange-800 hover:bg-orange-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};
