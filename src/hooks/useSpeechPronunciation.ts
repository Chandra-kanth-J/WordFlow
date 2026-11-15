import { useCallback, useEffect, useRef, useState } from 'react';
import { PlaybackSpeed } from '../types';

interface UseSpeechPronunciationReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  speakingWordId: string | null;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  setSelectedVoiceURI: (uri: string) => void;
  speechError: string | null;
  clearError: () => void;
  speak: (word: string, speed: PlaybackSpeed, wordId?: string | null) => void;
  stop: () => void;
}

function sortEnglishVoices(allVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const englishVoices = allVoices.filter((v) =>
    v.lang.toLowerCase().startsWith('en')
  );
  const pool = englishVoices.length > 0 ? englishVoices : allVoices;

  return [...pool].sort((a, b) => {
    if (a.default !== b.default) return a.default ? -1 : 1;
    if (a.lang === 'en-US' && b.lang !== 'en-US') return -1;
    if (b.lang === 'en-US' && a.lang !== 'en-US') return 1;
    return a.name.localeCompare(b.name);
  });
}

export function useSpeechPronunciation(): UseSpeechPronunciationReturn {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0) return;

      const sorted = sortEnglishVoices(available);
      setVoices(sorted);
      setSelectedVoiceURI((prev) => {
        if (prev && sorted.some((v) => v.voiceURI === prev)) {
          return prev;
        }
        return sorted[0]?.voiceURI ?? '';
      });
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setSpeakingWordId(null);
  }, [isSupported]);

  const speak = useCallback(
    (word: string, speed: PlaybackSpeed, wordId: string | null = null) => {
      const trimmed = word.trim();
      if (!trimmed) return;

      if (!isSupported) {
        setSpeechError(
          'Speech synthesis is not supported in this browser. Try a recent version of Chrome, Safari, Edge, or Firefox.'
        );
        return;
      }

      setSpeechError(null);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.rate = speed;
      utterance.pitch = 1;
      utterance.volume = 1;

      const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingWordId(wordId);
      };

      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          setIsSpeaking(false);
          setSpeakingWordId(null);
          utteranceRef.current = null;
        }
      };

      utterance.onerror = (event) => {
        if (event.error === 'canceled' || event.error === 'interrupted') {
          return;
        }
        setIsSpeaking(false);
        setSpeakingWordId(null);
        utteranceRef.current = null;
        setSpeechError(
          'Unable to play audio right now. Check your device volume or try selecting another English voice.'
        );
      };

      utteranceRef.current = utterance;
      // Set speaking state immediately for crisp UI feedback even before onstart fires
      setIsSpeaking(true);
      setSpeakingWordId(wordId);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoiceURI, voices]
  );

  const clearError = useCallback(() => setSpeechError(null), []);

  return {
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
  };
}
