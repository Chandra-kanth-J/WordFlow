import React from 'react';
import { AlertCircle, RotateCcw, Square, Volume2 } from 'lucide-react';
import { PlaybackSpeed, SPEED_OPTIONS, WordEntry } from '../types';

interface PronunciationStageProps {
  activeWord: WordEntry | null;
  speed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  onVoiceChange: (uri: string) => void;
  speechError: string | null;
  onDismissError: () => void;
  onSpeakActive: (overrideSpeed?: PlaybackSpeed) => void;
  onStop: () => void;
}

export const PronunciationStage: React.FC<PronunciationStageProps> = ({
  activeWord,
  speed,
  onSpeedChange,
  isSpeaking,
  isSupported,
  voices,
  selectedVoiceURI,
  onVoiceChange,
  speechError,
  onDismissError,
  onSpeakActive,
  onStop,
}) => {
  const activeSpeedMeta = SPEED_OPTIONS.find((opt) => opt.value === speed);

  return (
    <section
      id="stage"
      aria-labelledby="stage-heading"
      className="bg-white border border-[#EADEC6] rounded-xl p-6 md:p-8 shadow-[0_1px_2px_rgba(28,20,13,0.04)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#F2E8D5]">
        <div>
          <h2 id="stage-heading" className="text-sm font-semibold text-stone-900">
            Pronunciation Stage
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Listen at natural speed or slow down to catch every syllable
          </p>
        </div>

        <div
          role="group"
          aria-label="Playback speed"
          className="inline-flex items-center gap-1 p-1 bg-[#F7F1E3] border border-[#EADEC6] rounded-lg"
        >
          {SPEED_OPTIONS.map((option) => {
            const isSelected = speed === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSpeedChange(option.value)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-mono font-semibold tabular-nums rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {!isSupported && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-300 text-stone-900 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Browser speech synthesis unavailable</p>
            <p className="text-stone-700 mt-0.5">
              This browser does not expose the Web Speech API. Open WordFlow in Chrome, Safari, Edge, or Firefox to hear words spoken aloud.
            </p>
          </div>
        </div>
      )}

      {speechError && (
        <div
          role="alert"
          className="mt-5 flex items-start justify-between gap-3 p-4 rounded-lg bg-orange-50 border border-orange-300 text-stone-900 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{speechError}</p>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            className="text-xs font-semibold text-orange-800 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="py-8 md:py-10">
        {activeWord ? (
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 tabular-nums">
              <span>Selected word</span>
              <span aria-hidden="true">·</span>
              <span>
                Practiced {activeWord.practiceCount}{' '}
                {activeWord.practiceCount === 1 ? 'time' : 'times'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {activeSpeedMeta?.label} {activeSpeedMeta?.description}
              </span>
              {isSpeaking && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-orange-800">
                    <span className="inline-flex items-end gap-0.5 h-3.5" aria-hidden="true">
                      <span
                        className="speaking-bar w-0.5 h-full bg-orange-600 rounded-full"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="speaking-bar w-0.5 h-full bg-amber-500 rounded-full"
                        style={{ animationDelay: '160ms' }}
                      />
                      <span
                        className="speaking-bar w-0.5 h-full bg-orange-600 rounded-full"
                        style={{ animationDelay: '320ms' }}
                      />
                    </span>
                    Speaking
                  </span>
                </>
              )}
            </div>

            <h1
              className="mt-3 font-display font-bold text-stone-950 tracking-tight break-words"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                lineHeight: 1.12,
                textWrap: 'balance',
              }}
            >
              {activeWord.text}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-6 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  <Square className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                  <span>Stop Audio</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSpeakActive()}
                  disabled={!isSupported}
                  className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-6 py-3 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Pronounce ({speed}×)</span>
                </button>
              )}

              {speed !== 0.5 && (
                <button
                  type="button"
                  onClick={() => onSpeakActive(0.5)}
                  disabled={!isSupported}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 text-sm font-semibold text-stone-900 bg-[#FEF7E0] hover:bg-amber-200/75 border border-[#EADEC6] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  <RotateCcw className="w-4 h-4 text-orange-700 shrink-0" aria-hidden="true" />
                  <span>Hear at 0.5×</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-950 tracking-tight">
              No word selected
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-md leading-relaxed">
              Type an English word in the field above to save it to your current page session and hear it spoken aloud.
            </p>
          </div>
        )}
      </div>

      <div className="pt-5 border-t border-[#F2E8D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label
          htmlFor="voice-select"
          className="text-xs font-medium text-stone-600 whitespace-nowrap"
        >
          English Voice
        </label>
        <select
          id="voice-select"
          value={selectedVoiceURI}
          onChange={(e) => onVoiceChange(e.target.value)}
          disabled={!isSupported || voices.length === 0}
          className="sm:max-w-xs w-full min-h-[40px] px-3 py-2 text-xs font-medium text-stone-900 bg-[#FCFBF7] border border-[#E2D3B5] rounded-lg focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
        >
          {voices.length === 0 ? (
            <option value="">Browser default English voice</option>
          ) : (
            voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))
          )}
        </select>
      </div>
    </section>
  );
};
