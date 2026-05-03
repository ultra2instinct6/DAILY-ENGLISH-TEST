import { ttsSupported, speak, stopSpeaking, TtsLang } from '../../utils/tts';

interface SpeakButtonProps {
  text: string;
  lang?: TtsLang;
  label?: string;
}

const SpeakButton = ({ text, lang = 'en-US', label = 'Listen' }: SpeakButtonProps) => {
  if (!ttsSupported() || !text.trim()) {
    return null;
  }

  return (
    <button
      type="button"
      className="ghost-button speak-button"
      onClick={() => {
        stopSpeaking();
        speak(text, lang);
      }}
      aria-label={`${label}: ${text}`}
    >
      🔊 {label}
    </button>
  );
};

export default SpeakButton;
