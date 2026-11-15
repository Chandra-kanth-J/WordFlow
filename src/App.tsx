import { useCallback, useMemo, useRef, useState } from 'react';
import { PronunciationStage } from './components/PronunciationStage';
import { TopBar } from './components/TopBar';
import { WordInputBar } from './components/WordInputBar';
import { WordList } from './components/WordList';
import { useSpeechPronunciation } from './hooks/useSpeechPronunciation';
import { PlaybackSpeed, STARTER_WORDS, WordEntry } from './types';

function formatAddedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function createEntry(text: string): WordEntry {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    text,
    practiceCount: 0,
    addedAt: formatAddedTime(),
  };
}

function buildStarterEntries(): WordEntry[] {
  return STARTER_WORDS.map((word) => createEntry(word));
}

export default function App() {
  const [words, setWords] = useState<WordEntry[]>(() => buildStarterEntries());
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    isSupported,
    isSpeaking,
    speakingWordId,
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speechError,
    clearError,
    speak,
    stop,
  } = useSpeechPronunciation();

  const activeWord = useMemo(
    () =>
      words.find((item) => item.id === activeWordId) ?? words[0] ?? null,
    [words, activeWordId]
  );

  const incrementPracticeCount = useCallback((id: string) => {
    setWords((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, practiceCount: item.practiceCount + 1 }
          : item
      )
    );
  }, []);

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleAddWord = useCallback(
    (rawWord: string, speakImmediately: boolean) => {
      const cleaned = rawWord.trim().replace(/\s+/g, ' ');
      if (!cleaned) {
        return { status: 'empty' as const };
      }

      const existing = words.find(
        (item) => item.text.toLowerCase() === cleaned.toLowerCase()
      );

      if (existing) {
        setActiveWordId(existing.id);
        if (speakImmediately) {
          incrementPracticeCount(existing.id);
          speak(existing.text, speed, existing.id);
        }
        return { status: 'duplicate' as const, word: existing.text };
      }

      const newEntry: WordEntry = {
        ...createEntry(cleaned),
        practiceCount: speakImmediately ? 1 : 0,
      };

      setWords((prev) => [newEntry, ...prev]);
      setActiveWordId(newEntry.id);

      if (speakImmediately) {
        speak(newEntry.text, speed, newEntry.id);
      }

      return { status: 'added' as const, word: newEntry.text };
    },
    [incrementPracticeCount, speak, speed, words]
  );

  const handleSpeakActive = useCallback(
    (overrideSpeed?: PlaybackSpeed) => {
      if (!activeWord) return;
      const targetSpeed = overrideSpeed ?? speed;
      incrementPracticeCount(activeWord.id);
      speak(activeWord.text, targetSpeed, activeWord.id);
    },
    [activeWord, incrementPracticeCount, speak, speed]
  );

  const handleSelectAndSpeak = useCallback(
    (entry: WordEntry) => {
      setActiveWordId(entry.id);
      incrementPracticeCount(entry.id);
      speak(entry.text, speed, entry.id);
    },
    [incrementPracticeCount, speak, speed]
  );

  const handleRemoveWord = useCallback(
    (id: string) => {
      if (speakingWordId === id) {
        stop();
      }

      setWords((prev) => {
        const remaining = prev.filter((item) => item.id !== id);
        if (activeWordId === id) {
          setActiveWordId(remaining[0]?.id ?? null);
        }
        return remaining;
      });
    },
    [activeWordId, speakingWordId, stop]
  );

  const handleClearAll = useCallback(() => {
    stop();
    setWords([]);
    setActiveWordId(null);
  }, [stop]);

  const handleRestoreStarterWords = useCallback(() => {
    const starter = buildStarterEntries();
    setWords(starter);
    setActiveWordId(starter[0]?.id ?? null);
  }, []);

  const handleSpeedChange = useCallback(
    (nextSpeed: PlaybackSpeed) => {
      setSpeed(nextSpeed);
      if (isSpeaking && activeWord) {
        speak(activeWord.text, nextSpeed, activeWord.id);
      }
    },
    [activeWord, isSpeaking, speak]
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FCFBF7] text-stone-950">
      <div
        aria-hidden="true"
        className="h-1 w-full bg-gradient-to-r from-orange-700 via-amber-400 to-yellow-300"
      />

      <TopBar onFocusInput={handleFocusInput} />

      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-10">
        <div className="mb-7 max-w-2xl">
          <p className="text-xs font-medium text-orange-800">
            Zero-database English pronunciation trainer
          </p>
          <p className="mt-1.5 text-sm md:text-base text-stone-600 leading-relaxed">
            Save words for this session and hear natural browser speech synthesis at 1×, 0.75×, or 0.5× speed. Refreshing clears your list automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <WordInputBar inputRef={inputRef} onAddWord={handleAddWord} />

            <PronunciationStage
              activeWord={activeWord}
              speed={speed}
              onSpeedChange={handleSpeedChange}
              isSpeaking={isSpeaking}
              isSupported={isSupported}
              voices={voices}
              selectedVoiceURI={selectedVoiceURI}
              onVoiceChange={setSelectedVoiceURI}
              speechError={speechError}
              onDismissError={clearError}
              onSpeakActive={handleSpeakActive}
              onStop={stop}
            />
          </div>

          <div className="lg:col-span-5">
            <WordList
              words={words}
              activeWordId={activeWord?.id ?? null}
              speakingWordId={speakingWordId}
              isSpeaking={isSpeaking}
              speed={speed}
              onSelectAndSpeak={handleSelectAndSpeak}
              onRemoveWord={handleRemoveWord}
              onClearAll={handleClearAll}
              onRestoreStarterWords={handleRestoreStarterWords}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#EADEC6] bg-[#FCFBF7]">
        <div className="mx-auto max-w-5xl px-6 py-5 md:px-10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <span>WordFlow · In-page session memory only</span>
          <span>Powered by your browser&apos;s Web Speech API</span>
        </div>
      </footer>
    </div>
  );
}
