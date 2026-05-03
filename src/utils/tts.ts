export type TtsLang = 'en-US' | 'pa-IN';

const isAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
};

let cachedVoices: SpeechSynthesisVoice[] | null = null;

const getVoices = (): SpeechSynthesisVoice[] => {
  if (!isAvailable()) {
    return [];
  }

  if (!cachedVoices || cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }

  return cachedVoices ?? [];
};

if (isAvailable() && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export const ttsSupported = (): boolean => isAvailable();

export const ttsHasLanguage = (lang: TtsLang): boolean => {
  if (!isAvailable()) {
    return false;
  }

  const prefix = lang.split('-')[0];
  return getVoices().some((voice) => voice.lang === lang || voice.lang.startsWith(`${prefix}-`));
};

export const speak = (text: string, lang: TtsLang = 'en-US'): void => {
  if (!isAvailable() || !text.trim()) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const prefix = lang.split('-')[0];
    const voices = getVoices();
    const exact = voices.find((voice) => voice.lang === lang);
    const fallback = voices.find((voice) => voice.lang.startsWith(`${prefix}-`));
    const englishFallback =
      lang !== 'en-US' ? voices.find((voice) => voice.lang.startsWith('en-')) : undefined;

    const chosen = exact ?? fallback ?? englishFallback;
    if (chosen) {
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
    } else {
      utterance.lang = lang;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Silent fail — TTS is a nice-to-have.
  }
};

export const stopSpeaking = (): void => {
  if (!isAvailable()) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore.
  }
};
