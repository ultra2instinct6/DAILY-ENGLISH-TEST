import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';

interface Round {
  hour: number; // 1-12
  minute: number; // 0,5,10,...,55
  options: string[]; // 4 strings
  correctIndex: number;
}

const formatTime = (h: number, m: number) =>
  `${h}:${m.toString().padStart(2, '0')}`;

const randomMinute = () => {
  // Mix easy (:00, :30) and harder (:15, :45, :05, :40)
  const pool = [0, 0, 15, 30, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55];
  return pool[Math.floor(Math.random() * pool.length)];
};

const buildRound = (): Round => {
  const hour = 1 + Math.floor(Math.random() * 12);
  const minute = randomMinute();
  const correct = formatTime(hour, minute);
  const options = new Set<string>([correct]);
  while (options.size < 4) {
    const altH = 1 + Math.floor(Math.random() * 12);
    const altM = randomMinute();
    options.add(formatTime(altH, altM));
  }
  const arr = Array.from(options);
  // shuffle
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { hour, minute, options: arr, correctIndex: arr.indexOf(correct) };
};

const ClockSvg = ({ hour, minute }: { hour: number; minute: number }) => {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  // Hour hand: each hour = 30°, plus minute contribution (0.5°/min)
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const hourLen = r * 0.5;
  const minuteLen = r * 0.78;
  const polar = (angleDeg: number, len: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(a) * len, y: cy + Math.sin(a) * len };
  };
  const hourEnd = polar(hourAngle, hourLen);
  const minuteEnd = polar(minuteAngle, minuteLen);
  const ticks = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30;
    const inner = polar(angle, r - 14);
    const outer = polar(angle, r);
    return (
      <line
        key={i}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="#222"
        strokeWidth={2}
      />
    );
  });
  const numbers = Array.from({ length: 12 }).map((_, i) => {
    const num = i === 0 ? 12 : i;
    const p = polar(i * 30, r - 28);
    return (
      <text
        key={`n-${i}`}
        x={p.x}
        y={p.y + 5}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        fill="#222"
      >
        {num}
      </text>
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Analog clock showing ${hour}:${minute.toString().padStart(2, '0')}`}
      style={{ display: 'block', margin: '0 auto' }}
    >
      <title>{`Analog clock showing ${hour}:${minute.toString().padStart(2, '0')}`}</title>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#222" strokeWidth={3} />
      {ticks}
      {numbers}
      {/* hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke="#222"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke="#1f4fb6"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={4} fill="#222" />
    </svg>
  );
};

const ClockQuizActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const totalRounds = question.clockRounds ?? 5;
  const [playSeed, setPlaySeed] = useState(0);
  const rounds = useMemo(
    () => Array.from({ length: totalRounds }).map(() => buildRound()),
    [totalRounds, question.id, playSeed],
  );

  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [triedThisRound, setTriedThisRound] = useState(false);
  const firstTryRef = useRef(0);
  const attemptsRef = useRef(0);
  const [finished, setFinished] = useState(false);

  const playAgain = () => {
    firstTryRef.current = 0;
    attemptsRef.current = 0;
    setRoundIdx(0);
    setSelected(null);
    setRevealed(false);
    setTriedThisRound(false);
    setFinished(false);
    setPlaySeed((s) => s + 1);
  };

  const round = rounds[roundIdx];

  const writeSummary = (firstTry: number, attempts: number, done: boolean) => {
    const summary = done
      ? `Clock quiz: ${firstTry}/${totalRounds} first try, ${attempts} total attempts`
      : `Clock quiz in progress (${roundIdx}/${totalRounds})`;
    updateResponse({
      studentAnswer: summary,
      studentAnswers: [String(firstTry), String(attempts), String(totalRounds)],
    });
  };

  useEffect(() => {
    writeSummary(firstTryRef.current, attemptsRef.current, finished);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, roundIdx]);

  const pick = (idx: number) => {
    if (revealed && idx === round.correctIndex) return;
    setSelected(idx);
    attemptsRef.current += 1;
    if (idx === round.correctIndex) {
      if (!triedThisRound) firstTryRef.current += 1;
      setRevealed(true);
    } else {
      setTriedThisRound(true);
      setRevealed(true);
    }
  };

  const next = () => {
    if (roundIdx + 1 >= totalRounds) {
      setFinished(true);
      return;
    }
    setRoundIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setTriedThisRound(false);
  };

  const retry = () => {
    setSelected(null);
    setRevealed(false);
  };

  if (finished) {
    return (
      <div className="say-out-loud-card">
        <p className="say-out-loud-badge">🎉 Clock quiz complete</p>
        <p style={{ margin: 0 }}>
          You got <strong>{firstTryRef.current}/{totalRounds}</strong> on the first try.
        </p>
        <p className="muted" style={{ margin: 0 }}>
          Total attempts: {attemptsRef.current}
        </p>
        <div style={{ marginTop: 12 }}>
          <Button variant="secondary" onClick={playAgain}>
            🔁 Play again
          </Button>
        </div>
      </div>
    );
  }

  const correct = selected === round.correctIndex;

  return (
    <div className="stack-gap-md">
      <p className="muted" style={{ margin: 0 }}>
        Round {roundIdx + 1} of {totalRounds}
      </p>
      <div className="card" style={{ padding: 14 }}>
        <ClockSvg hour={round.hour} minute={round.minute} />
        <p style={{ textAlign: 'center', margin: '10px 0 0 0', fontWeight: 600 }}>
          What time does the clock show?
        </p>
        <p className="punjabi muted" style={{ textAlign: 'center', margin: 0 }}>
          ਘੜੀ ਵਿੱਚ ਕਿਹੜਾ ਸਮਾਂ ਹੈ?
        </p>
      </div>

      <div className="stack-gap-md">
        {round.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === round.correctIndex;
          let variant: 'primary' | 'secondary' = 'secondary';
          if (revealed && isCorrect) variant = 'primary';
          else if (isSelected) variant = 'primary';
          return (
            <Button
              key={`${roundIdx}-${idx}`}
              fullWidth
              variant={variant}
              disabled={revealed && correct}
              onClick={() => pick(idx)}
            >
              {String.fromCharCode(65 + idx)}. {opt}
              {revealed && isSelected && !isCorrect ? '  ❌' : ''}
              {revealed && isCorrect ? '  ✅' : ''}
            </Button>
          );
        })}
      </div>

      {revealed && !correct ? (
        <div>
          <p className="help-box">Not quite — try again. / ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</p>
          <Button variant="secondary" onClick={retry}>🔁 Try again</Button>
        </div>
      ) : null}

      {revealed && correct ? (
        <Button variant="primary" onClick={next}>
          {roundIdx + 1 >= totalRounds ? 'See results →' : 'Next round →'}
        </Button>
      ) : null}
    </div>
  );
};

export default ClockQuizActivity;
