import { useEffect, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';

const FEEDBACK: { id: string; emoji: string; en: string; pa: string }[] = [
  { id: 'notgood', emoji: '👎', en: 'Not good', pa: 'ਚੰਗਾ ਨਹੀਂ' },
  { id: 'okay', emoji: '👌', en: 'Okay', pa: 'ਠੀਕ' },
  { id: 'good', emoji: '👍', en: 'Good', pa: 'ਚੰਗਾ' },
  { id: 'great', emoji: '⭐', en: 'Great', pa: 'ਬਹੁਤ ਵਧੀਆ' },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

type Channel = 'pa' | 'en';

const BilingualSpeakingTimerActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const cfg = question.bilingualTimer ?? { punjabiSeconds: 30, englishSeconds: 60 };
  const requireFeedback = question.feedbackLikert ?? true;
  const answers = response.studentAnswers ?? [];

  const [active, setActive] = useState<Channel | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (active) markDone(active);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const markDone = (which: Channel) => {
    const next = [...answers];
    while (next.length < 3) next.push('');
    if (which === 'pa') next[0] = 'done';
    else next[1] = 'done';
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };

  const setFeedback = (id: string) => {
    const next = [...answers];
    while (next.length < 3) next.push('');
    next[2] = id;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };

  const start = (which: Channel) => {
    setActive(which);
    setSeconds(which === 'pa' ? cfg.punjabiSeconds : cfg.englishSeconds);
    setRunning(true);
  };

  const paDone = answers[0] === 'done';
  const enDone = answers[1] === 'done';
  const fb = answers[2] ?? '';

  const renderCard = (which: Channel) => {
    const isPa = which === 'pa';
    const total = isPa ? cfg.punjabiSeconds : cfg.englishSeconds;
    const done = isPa ? paDone : enDone;
    const isActive = active === which;
    return (
      <div className={`dual-timer-card${done ? ' is-finished' : ''}`}>
        <div className="dual-timer-label">
          {isPa ? '🟠 Punjabi warm-up' : '🟢 English speaking'}
        </div>
        <div className="punjabi muted">
          {isPa ? 'ਪਹਿਲਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ' : 'ਫਿਰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ'}
        </div>
        <div
          className={`timer-display${isActive && running ? ' timer-display-running' : ''}${done && !running ? ' timer-display-finished' : ''}`}
          role="timer"
        >
          {isActive ? formatTime(seconds) : formatTime(total)}
        </div>
        <Button
          variant={done ? 'secondary' : 'primary'}
          disabled={running && !isActive}
          onClick={() => start(which)}
        >
          {done ? `🔁 Restart ${total}s` : `⏱️ Start ${total}s`}
        </Button>
      </div>
    );
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Step 1: Speak in Punjabi for {cfg.punjabiSeconds}s. Step 2: Speak in English for {cfg.englishSeconds}s.
        You can do them in any order.
        <br />
        <span className="punjabi">ਪਹਿਲਾਂ ਪੰਜਾਬੀ, ਫਿਰ ਅੰਗਰੇਜ਼ੀ — ਕਿਸੇ ਵੀ ਕ੍ਰਮ ਵਿੱਚ।</span>
      </p>
      {question.sentenceStarters && question.sentenceStarters.length > 0 ? (
        <details className="starter-details" open>
          <summary>💡 Sentence starters / ਵਾਕ ਸ਼ੁਰੂਆਤਾਂ</summary>
          <div className="starter-chips">
            {question.sentenceStarters.map((s) => (
              <span className="starter-chip" key={s.en}>
                {s.en}
                <span className="pa punjabi">{s.pa}</span>
              </span>
            ))}
          </div>
        </details>
      ) : null}
      <div className="dual-timer-grid">
        {renderCard('pa')}
        {renderCard('en')}
      </div>
      {paDone && enDone && requireFeedback ? (
        <div>
          <p className="label" style={{ margin: '4px 0' }}>Did I do well? / ਮੈਂ ਕਿਵੇਂ ਕੀਤਾ?</p>
          <div className="feedback-likert" role="radiogroup" aria-label="Self feedback">
            {FEEDBACK.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`conjunction-pill${fb === f.id ? ' is-selected' : ''}`}
                onClick={() => setFeedback(f.id)}
              >
                {f.emoji} {f.en} <span className="punjabi muted">/ {f.pa}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const buildSummary = (a: string[]): string => {
  const pa = a[0] === 'done' ? '✅ Punjabi 30s' : '⏳ Punjabi 30s';
  const en = a[1] === 'done' ? '✅ English 60s' : '⏳ English 60s';
  const fb = a[2] ? ` | feedback: ${a[2]}` : '';
  return `${pa} | ${en}${fb}`;
};

export default BilingualSpeakingTimerActivity;
