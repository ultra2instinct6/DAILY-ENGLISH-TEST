import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';
import { speak, stopSpeaking } from '../../utils/tts';

interface ColorDef {
  id: string;
  en: string;
  pa: string;
  hex: string;
  emoji?: string;
}

const DEFAULT_PALETTE: ColorDef[] = [
  { id: 'red', en: 'Red', pa: 'ਲਾਲ', hex: '#dc2626', emoji: '🔴' },
  { id: 'blue', en: 'Blue', pa: 'ਨੀਲਾ', hex: '#2563eb', emoji: '🔵' },
  { id: 'green', en: 'Green', pa: 'ਹਰਾ', hex: '#16a34a', emoji: '🟢' },
  { id: 'yellow', en: 'Yellow', pa: 'ਪੀਲਾ', hex: '#eab308', emoji: '🟡' },
  { id: 'orange', en: 'Orange', pa: 'ਸੰਤਰੀ', hex: '#ea580c', emoji: '🟠' },
  { id: 'purple', en: 'Purple', pa: 'ਜਾਮਨੀ', hex: '#7c3aed', emoji: '🟣' },
  { id: 'pink', en: 'Pink', pa: 'ਗੁਲਾਬੀ', hex: '#ec4899', emoji: '🩷' },
  { id: 'black', en: 'Black', pa: 'ਕਾਲਾ', hex: '#111827', emoji: '⚫' },
];

type Phase = 'idle' | 'prompting' | 'awaiting' | 'lost' | 'won';

const ColorTapGameActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const winStreak = question.colorTapConfig?.winStreak ?? 8;
  const palette = useMemo<ColorDef[]>(
    () => (question.colorTapConfig?.palette as ColorDef[] | undefined) ?? DEFAULT_PALETTE,
    [question.colorTapConfig?.palette],
  );

  const [phase, setPhase] = useState<Phase>('idle');
  const [target, setTarget] = useState<ColorDef | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastTap, setLastTap] = useState<{ id: string; ok: boolean } | null>(null);
  const tapTimerRef = useRef<number | null>(null);

  const bestRef = useRef(Number(response.studentAnswers?.[0] ?? 0));

  const persistBest = (val: number) => {
    if (val > bestRef.current) bestRef.current = val;
    updateResponse({
      studentAnswers: [String(bestRef.current)],
      studentAnswer: `Best streak: ${bestRef.current} (target ${winStreak})`,
    });
  };

  const clearTimers = () => {
    if (tapTimerRef.current) window.clearTimeout(tapTimerRef.current);
  };

  const pickNext = (excludeId?: string) => {
    const pool = excludeId ? palette.filter((c) => c.id !== excludeId) : palette;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setTarget(next);
    setPhase('prompting');
    // Speak after a tiny delay so the UI updates first.
    window.setTimeout(() => {
      speak(next.en, 'en-US');
      setPhase('awaiting');
    }, 120);
  };

  const startGame = () => {
    clearTimers();
    stopSpeaking();
    setStreak(0);
    setLastTap(null);
    pickNext();
  };

  useEffect(() => {
    return () => {
      clearTimers();
      stopSpeaking();
    };
  }, []);

  const handleTap = (id: string) => {
    if (phase !== 'awaiting' || !target) return;
    const ok = id === target.id;
    setLastTap({ id, ok });
    if (tapTimerRef.current) window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => setLastTap(null), 350);

    if (!ok) {
      persistBest(streak);
      stopSpeaking();
      setPhase('lost');
      return;
    }

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    persistBest(nextStreak);

    if (nextStreak >= winStreak) {
      stopSpeaking();
      setPhase('won');
      return;
    }

    window.setTimeout(() => pickNext(target.id), 450);
  };

  const replay = () => {
    if (!target) return;
    stopSpeaking();
    speak(target.en, 'en-US');
  };

  const best = bestRef.current;
  const goalReached = best >= winStreak;

  const status =
    phase === 'idle'
      ? '▶️ Press Start to play'
      : phase === 'prompting'
        ? '👂 Listen…'
        : phase === 'awaiting'
          ? `Tap the color you hear (${streak}/${winStreak})`
          : phase === 'won'
            ? '🏆 You won!'
            : '💥 Game over';

  return (
    <div className="stack-gap-md">
      <div className="color-game-hero">
        <div className="color-game-hero-row">
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Streak</span>
            <span className="color-game-hero-value">{streak}</span>
          </div>
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Best</span>
            <span className="color-game-hero-value">{best}</span>
          </div>
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Goal</span>
            <span className="color-game-hero-value">
              {winStreak}{goalReached ? ' ✅' : ''}
            </span>
          </div>
        </div>
        <p
          className={`color-game-hero-status${phase === 'prompting' ? ' is-watching' : ''}${phase === 'awaiting' ? ' is-your-turn' : ''}`}
          aria-live="polite"
        >
          {status}
        </p>
        {(phase === 'prompting' || phase === 'awaiting') && target ? (
          <div className="filter-pills" style={{ justifyContent: 'center' }}>
            <Button variant="secondary" onClick={replay}>
              🔊 Hear again
            </Button>
          </div>
        ) : null}
      </div>

      <div className="color-game-grid">
        {palette.map((c) => {
          const isLast = lastTap?.id === c.id;
          const tapClass = isLast ? (lastTap?.ok ? ' is-correct' : ' is-wrong') : '';
          const disabled = phase !== 'awaiting';
          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled}
              className={`color-game-button${tapClass}`}
              style={{ background: c.hex }}
              onClick={() => handleTap(c.id)}
              aria-label={c.en}
            >
              {c.emoji ? (
                <span className="color-game-emoji" aria-hidden="true">{c.emoji}</span>
              ) : null}
              <span className="color-game-name">{c.en}</span>
              <span className="color-game-name-pa">{c.pa}</span>
            </button>
          );
        })}
      </div>

      {phase === 'lost' && target ? (
        <div className="color-game-gameover">
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>
            💥 The color was <strong>{target.en}</strong> ({target.pa}). Streak: <strong>{streak}</strong>.
          </p>
          <p className="muted no-margin">Best so far: {best}</p>
        </div>
      ) : null}

      {phase === 'won' ? (
        <div className="color-game-gameover" style={{ background: '#dcfce7', borderColor: '#16a34a' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>
            🏆 Amazing! You got {winStreak} colors in a row!
          </p>
          <p className="muted no-margin">ਸ਼ਾਬਾਸ਼! ਤੁਸੀਂ ਸਾਰੇ ਰੰਗ ਪਛਾਣ ਲਏ।</p>
        </div>
      ) : null}

      <div className="filter-pills">
        <Button onClick={startGame} variant="primary">
          {phase === 'idle'
            ? '▶️ Start Game'
            : phase === 'lost'
              ? '🔁 Play again'
              : phase === 'won'
                ? '🔁 Play again'
                : '🔄 Restart'}
        </Button>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
        Listen to the English color name and tap the matching color. Get <strong>{winStreak}</strong> in a row to win!
        <br />
        <span className="punjabi">
          ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਰੰਗ ਦਾ ਨਾਮ ਸੁਣੋ ਅਤੇ ਉਸ ਰੰਗ ’ਤੇ ਟੈਪ ਕਰੋ। ਜਿੱਤਣ ਲਈ ਲਗਾਤਾਰ {winStreak} ਸਹੀ ਕਰੋ।
        </span>
      </p>
    </div>
  );
};

export default ColorTapGameActivity;
