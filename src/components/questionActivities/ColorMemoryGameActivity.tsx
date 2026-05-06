import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';

interface ColorDef {
  id: string;
  en: string;
  pa: string;
  hex: string;
  emoji: string;
}

const DEFAULT_PALETTE: ColorDef[] = [
  { id: 'red', en: 'Red', pa: 'ਲਾਲ', hex: '#dc2626', emoji: '🔴' },
  { id: 'blue', en: 'Blue', pa: 'ਨੀਲਾ', hex: '#2563eb', emoji: '🔵' },
  { id: 'green', en: 'Green', pa: 'ਹਰਾ', hex: '#16a34a', emoji: '🟢' },
  { id: 'yellow', en: 'Yellow', pa: 'ਪੀਲਾ', hex: '#eab308', emoji: '🟡' },
  { id: 'orange', en: 'Orange', pa: 'ਸੰਤਰੀ', hex: '#ea580c', emoji: '🟠' },
  { id: 'purple', en: 'Purple', pa: 'ਜਾਮਨੀ', hex: '#7c3aed', emoji: '🟣' },
];

type Phase = 'idle' | 'showing' | 'awaiting' | 'lost';

const ColorMemoryGameActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const targetForCompletion = question.colorMemoryConfig?.winRounds ?? 5;
  const palette = useMemo<ColorDef[]>(
    () => (question.colorMemoryConfig?.palette as ColorDef[] | undefined) ?? DEFAULT_PALETTE,
    [question.colorMemoryConfig?.palette],
  );

  const [pattern, setPattern] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [flashId, setFlashId] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState<{ id: string; ok: boolean } | null>(null);
  const [studentIdx, setStudentIdx] = useState(0);
  const showTimerRef = useRef<number | null>(null);
  const tapTimerRef = useRef<number | null>(null);

  const bestRef = useRef(Number(response.studentAnswers?.[0] ?? 0));

  const persistBest = (val: number) => {
    if (val > bestRef.current) bestRef.current = val;
    updateResponse({
      studentAnswers: [String(bestRef.current)],
      studentAnswer: `Best round: ${bestRef.current} (target ${targetForCompletion})`,
    });
  };

  const clearTimers = () => {
    if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
    if (tapTimerRef.current) window.clearTimeout(tapTimerRef.current);
  };

  const startGame = () => {
    clearTimers();
    const first = palette[Math.floor(Math.random() * palette.length)].id;
    setPattern([first]);
    setRound(1);
    setStudentIdx(0);
    setLastTap(null);
    setPhase('showing');
  };

  const nextRound = (current: string[]) => {
    const next = [...current, palette[Math.floor(Math.random() * palette.length)].id];
    setPattern(next);
    setRound(next.length);
    setStudentIdx(0);
    setLastTap(null);
    setPhase('showing');
  };

  // Show pattern sequentially, getting a touch faster each round.
  useEffect(() => {
    if (phase !== 'showing') return;
    let i = 0;
    const speed = Math.max(260, 600 - pattern.length * 25);
    const gap = Math.max(140, 220 - pattern.length * 8);
    const tick = () => {
      if (i >= pattern.length) {
        setFlashId(null);
        setPhase('awaiting');
        return;
      }
      setFlashId(pattern[i]);
      showTimerRef.current = window.setTimeout(() => {
        setFlashId(null);
        showTimerRef.current = window.setTimeout(() => {
          i += 1;
          tick();
        }, gap);
      }, speed);
    };
    tick();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pattern]);

  useEffect(() => () => clearTimers(), []);

  const handleTap = (id: string) => {
    if (phase !== 'awaiting') return;
    const expected = pattern[studentIdx];
    const ok = id === expected;
    setLastTap({ id, ok });
    if (tapTimerRef.current) window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => setLastTap(null), 350);

    if (!ok) {
      persistBest(round - 1 < 0 ? 0 : round - 1);
      setPhase('lost');
      return;
    }
    if (studentIdx + 1 >= pattern.length) {
      const reached = pattern.length;
      persistBest(reached);
      window.setTimeout(() => nextRound(pattern), 450);
    } else {
      setStudentIdx(studentIdx + 1);
    }
  };

  const best = bestRef.current;
  const progress =
    phase === 'awaiting'
      ? `Your turn — tap ${studentIdx + 1} of ${pattern.length}`
      : phase === 'showing'
        ? '👀 Watch carefully…'
        : phase === 'lost'
          ? '💥 Game over'
          : '▶️ Press Start to play';

  const goalReached = best >= targetForCompletion;

  return (
    <div className="stack-gap-md">
      <div className="color-game-hero">
        <div className="color-game-hero-row">
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Round</span>
            <span className="color-game-hero-value">{round}</span>
          </div>
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Best</span>
            <span className="color-game-hero-value">{best}</span>
          </div>
          <div className="color-game-hero-cell">
            <span className="color-game-hero-label">Goal</span>
            <span className="color-game-hero-value">
              {targetForCompletion}{goalReached ? ' ✅' : ''}
            </span>
          </div>
        </div>
        <p className={`color-game-hero-status${phase === 'showing' ? ' is-watching' : ''}${phase === 'awaiting' ? ' is-your-turn' : ''}`} aria-live="polite">
          {progress}
        </p>
      </div>

      <div className="color-game-grid">
        {palette.map((c) => {
          const isFlash = flashId === c.id;
          const isLast = lastTap?.id === c.id;
          const tapClass = isLast ? (lastTap?.ok ? ' is-correct' : ' is-wrong') : '';
          return (
            <button
              key={c.id}
              type="button"
              disabled={phase !== 'awaiting'}
              className={`color-game-button${isFlash ? ' is-flash' : ''}${tapClass}`}
              style={{ background: c.hex }}
              onClick={() => handleTap(c.id)}
              aria-label={c.en}
            >
              <span className="color-game-emoji" aria-hidden="true">{c.emoji}</span>
              <span className="color-game-name">{c.en}</span>
              <span className="color-game-name-pa">{c.pa}</span>
            </button>
          );
        })}
      </div>

      {phase === 'lost' ? (
        <div className="color-game-gameover">
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>
            💥 Wrong color! You reached round <strong>{round - 1 < 0 ? 0 : round - 1}</strong>.
          </p>
          <p className="muted no-margin">Best so far: {best}</p>
        </div>
      ) : null}

      <div className="filter-pills">
        <Button onClick={startGame} variant="primary">
          {phase === 'idle' ? '▶️ Start Game' : phase === 'lost' ? '🔁 Play again' : '🔄 Restart'}
        </Button>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
        Endless mode — keep going as long as you can! Reach round <strong>{targetForCompletion}</strong> to unlock the next step.
        <br />
        <span className="punjabi">ਜਿੰਨੀ ਦੇਰ ਹੋ ਸਕੇ ਖੇਡੋ। ਅਗਲਾ ਕਦਮ ਖੋਲ੍ਹਣ ਲਈ ਰਾਊਂਡ {targetForCompletion} ਤੱਕ ਪਹੁੰਚੋ।</span>
      </p>
    </div>
  );
};

export default ColorMemoryGameActivity;
