import { useEffect, useMemo, useState } from 'react';
import { ActivityProps } from './types';
import SignaturePad from './SignaturePad';

const isSigned = (s: string | undefined) => !!s && s.startsWith('data:');

/**
 * Multi-prompt finger-written answers.
 * Each prompt has ONE saved drawing. Same look-and-feel as the signature page.
 */
const FingerWrittenAnswersActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const prompts = question.fingerPrompts ?? [];
  const target = prompts.length;

  const saved = useMemo(() => {
    const arr = [...(response.studentAnswers ?? [])];
    while (arr.length < target) arr.push('');
    return arr;
  }, [response.studentAnswers, target]);

  const filledCount = saved.filter(isSigned).length;
  const allDone = target > 0 && filledCount >= target;
  const remaining = target - filledCount;
  const progressPct = target > 0 ? Math.round((filledCount / target) * 100) : 0;

  const [activeSlot, setActiveSlot] = useState<number>(() => {
    const firstEmpty = saved.findIndex((s) => !isSigned(s));
    return firstEmpty === -1 ? Math.max(0, target - 1) : firstEmpty;
  });

  useEffect(() => {
    if (allDone) return;
    if (isSigned(saved[activeSlot])) {
      const nextEmpty = saved.findIndex((s) => !isSigned(s));
      if (nextEmpty !== -1) setActiveSlot(nextEmpty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filledCount, target]);

  const buildSummary = (next: string[]) => {
    const parts: string[] = [];
    next.forEach((s, i) => {
      if (isSigned(s)) parts.push(`${prompts[i]?.questionEn ?? `Q${i + 1}`}: ✍️ written`);
    });
    return parts.join(' · ') || 'Finger-written answers in progress';
  };

  const writeNext = (next: string[]) => {
    updateResponse({
      studentAnswers: next,
      studentAnswer: buildSummary(next),
    });
  };

  const handleSave = (dataUrl: string) => {
    if (allDone) return;
    const next = [...saved];
    next[activeSlot] = dataUrl;
    writeNext(next);
    const newCount = next.filter(isSigned).length;
    if (newCount < target) {
      const nextEmpty = next.findIndex((s) => !isSigned(s));
      if (nextEmpty !== -1) setActiveSlot(nextEmpty);
    }
  };

  const clearSlot = (idx: number) => {
    const next = [...saved];
    next[idx] = '';
    writeNext(next);
    setActiveSlot(idx);
  };

  if (target === 0) return null;

  const activePrompt = prompts[activeSlot];

  return (
    <div className="stack-gap-md">
      <div className="card" style={{ padding: 14 }}>
        <p className="punjabi" style={{ marginTop: 0, fontSize: '1.05rem' }}>
          ✍️ ਹਰ ਸਵਾਲ ਦਾ ਜਵਾਬ ਉਂਗਲ ਨਾਲ ਡੱਬੇ ਵਿੱਚ ਲਿਖੋ।
        </p>
        <p className="muted" style={{ marginTop: 4 }}>
          Use your finger (or mouse) to write your answer to each question once.
          Tap <strong>“Save answer”</strong> when finished.
        </p>

        <div style={{ marginTop: 12 }}>
          <div
            aria-live="polite"
            className="label"
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
          >
            <span>
              Progress / ਤਰੱਕੀ: <strong>{filledCount}</strong> / {target}
            </span>
            <span className="muted">{allDone ? '✅ All done' : `${remaining} left`}</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={filledCount}
            style={{
              height: 8,
              borderRadius: 999,
              background: '#edf2f7',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: allDone ? '#2f9e44' : '#3a86ff',
                transition: 'width 200ms ease',
              }}
            />
          </div>
          <div
            style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}
            aria-hidden="true"
          >
            {saved.map((s, i) => {
              const done = isSigned(s);
              const isActive = i === activeSlot && !allDone;
              return (
                <span
                  key={i}
                  title={prompts[i]?.questionEn ?? `Question ${i + 1}`}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: done ? '#ffffff' : isActive ? '#0a2540' : '#6b7c93',
                    background: done ? '#2f9e44' : isActive ? '#fff7c2' : '#edf2f7',
                    border: isActive ? '2px solid #f59f00' : '1px solid #cbd5e0',
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
              );
            })}
          </div>
        </div>

        {!allDone && activePrompt ? (
          <>
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                background: '#f5f9ff',
                border: '1px solid #d6e4ff',
                borderRadius: 8,
              }}
            >
              <p className="punjabi" style={{ margin: 0, fontSize: '1rem' }}>
                {activePrompt.questionPa}
              </p>
              <p style={{ margin: '4px 0 0' }}>
                <strong>{activePrompt.questionEn}</strong>
              </p>
              {activePrompt.frame ? (
                <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
                  Frame: <code>{activePrompt.frame}</code>
                </p>
              ) : null}
              {activePrompt.formatHint ? (
                <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
                  Format: <code>{activePrompt.formatHint}</code>
                </p>
              ) : null}
            </div>

            <SignaturePad
              resetKey={`${question.id}-${activeSlot}`}
              saveLabel={`✅ Save answer (${filledCount + 1}/${target})`}
              onSave={handleSave}
              leftLabel={
                <>
                  Answer <strong>{activeSlot + 1}</strong> of {target}
                </>
              }
            />
          </>
        ) : (
          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              background: '#e8f7ec',
              border: '1px solid #b7e4c7',
              borderRadius: 8,
            }}
          >
            <p style={{ margin: 0 }}>
              ✅ <strong>All {target} answers saved.</strong>{' '}
              <span className="punjabi">
                ਹੁਣ ਹੇਠਾਂ <strong>Mark Done</strong> ਦਬਾਓ।
              </span>
            </p>
            <p className="muted" style={{ margin: '4px 0 0' }}>
              Need to change one? Tap <strong>“Redo”</strong> under any answer below.
            </p>
          </div>
        )}
      </div>

      {filledCount > 0 ? (
        <div className="card" style={{ padding: 12 }}>
          <p className="label" style={{ marginTop: 0, marginBottom: 8 }}>
            Your saved answers:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {saved.map((src, i) => {
              if (!isSigned(src)) return null;
              const p = prompts[i];
              return (
                <div
                  key={i}
                  style={{
                    border: '1px solid #cbd5e0',
                    borderRadius: 8,
                    padding: 8,
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 6,
                    }}
                  >
                    <span>
                      <strong>#{i + 1}</strong> {p?.questionEn}
                    </span>
                    <span style={{ color: '#2f9e44' }}>✓</span>
                  </div>
                  <img
                    alt={`Answer ${i + 1}: ${p?.questionEn ?? ''}`}
                    src={src}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: 4,
                      background: '#fafafa',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => clearSlot(i)}
                    className="button button-secondary"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                    aria-label={`Redo answer ${i + 1}`}
                  >
                    ↻ Redo
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FingerWrittenAnswersActivity;
