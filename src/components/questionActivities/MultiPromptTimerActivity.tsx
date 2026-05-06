import { useEffect, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';

const FEEDBACK: { id: string; emoji: string; en: string; pa: string }[] = [
  { id: 'sad', emoji: '😞', en: 'Hard', pa: 'ਔਖਾ' },
  { id: 'ok', emoji: '😐', en: 'Okay', pa: 'ਠੀਕ' },
  { id: 'good', emoji: '😊', en: 'Good', pa: 'ਚੰਗਾ' },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const MultiPromptTimerActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const prompts = question.multiTimerPrompts ?? [];
  const requireFeedback = question.feedbackLikert ?? false;
  const answers = response.studentAnswers ?? [];

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (activeIdx !== null) markDone(activeIdx);
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

  const markDone = (i: number) => {
    const next = [...answers];
    while (next.length < prompts.length * 2) next.push('');
    next[i] = 'done';
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(prompts, next, requireFeedback) });
  };

  const setFeedback = (i: number, fb: string) => {
    const next = [...answers];
    while (next.length < prompts.length * 2) next.push('');
    next[prompts.length + i] = fb;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(prompts, next, requireFeedback) });
  };

  const start = (i: number) => {
    setActiveIdx(i);
    setSeconds(prompts[i].seconds);
    setRunning(true);
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Speak about each prompt for the time shown. Tap Start when ready.
        <br />
        <span className="punjabi">ਹਰ ਪ੍ਰੋਮਪਟ ਉੱਤੇ ਸਮੇਂ ਅਨੁਸਾਰ ਬੋਲੋ।</span>
      </p>
      {prompts.map((p, i) => {
        const done = answers[i] === 'done';
        const fb = answers[prompts.length + i] ?? '';
        const isActive = activeIdx === i;
        return (
          <div className={`dual-timer-card${done ? ' is-finished' : ''}`} key={p.id}>
            <div className="dual-timer-label">
              {i + 1}. {p.promptEn}
            </div>
            <div className="punjabi muted">{p.promptPa}</div>
            {p.sentenceStarters && p.sentenceStarters.length > 0 ? (
              <details className="starter-details">
                <summary>💡 Sentence starters / ਵਾਕ ਸ਼ੁਰੂਆਤਾਂ</summary>
                <div className="starter-chips">
                  {p.sentenceStarters.map((s) => (
                    <span className="starter-chip" key={s.en}>
                      {s.en}
                      <span className="pa punjabi">{s.pa}</span>
                    </span>
                  ))}
                </div>
              </details>
            ) : null}
            <div
              className={`timer-display${isActive && running ? ' timer-display-running' : ''}${done && !running ? ' timer-display-finished' : ''}`}
              role="timer"
            >
              {isActive ? formatTime(seconds) : formatTime(p.seconds)}
            </div>
            <Button
              variant={done ? 'secondary' : 'primary'}
              disabled={running && !isActive}
              onClick={() => start(i)}
            >
              {done ? `🔁 Restart ${p.seconds}s` : `⏱️ Start ${p.seconds}s`}
            </Button>
            {done && requireFeedback ? (
              <div>
                <p className="label" style={{ margin: '4px 0' }}>How did I do?</p>
                <div className="feedback-likert" role="radiogroup" aria-label={`Feedback for prompt ${i + 1}`}>
                  {FEEDBACK.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`conjunction-pill${fb === f.id ? ' is-selected' : ''}`}
                      onClick={() => setFeedback(i, f.id)}
                    >
                      {f.emoji} {f.en} <span className="punjabi muted">/ {f.pa}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const buildSummary = (
  prompts: { promptEn: string }[],
  answers: string[],
  requireFeedback: boolean,
): string =>
  prompts
    .map((p, i) => {
      const done = answers[i] === 'done' ? '✅' : '⏳';
      const fb = requireFeedback ? ` (${answers[prompts.length + i] || '-'})` : '';
      return `${done} ${p.promptEn}${fb}`;
    })
    .join(' | ');

export default MultiPromptTimerActivity;
