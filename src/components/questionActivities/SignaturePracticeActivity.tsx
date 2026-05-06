import { useEffect, useMemo, useState } from 'react';
import { ActivityProps } from './types';
import SignaturePad from './SignaturePad';

const DEFAULT_SLOT_COUNT = 10;

const isSigned = (s: string | undefined) => !!s && s.startsWith('data:');

const SignaturePracticeActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const target = question.signatureCount ?? DEFAULT_SLOT_COUNT;

  const saved = useMemo(() => {
    const arr = [...(response.studentAnswers ?? [])];
    while (arr.length < target) arr.push('');
    return arr;
  }, [response.studentAnswers, target]);

  const filledCount = saved.filter(isSigned).length;
  const allDone = filledCount >= target;
  const remaining = target - filledCount;
  const progressPct = Math.round((filledCount / target) * 100);

  const [activeSlot, setActiveSlot] = useState<number>(() => {
    const firstEmpty = saved.findIndex((s) => !isSigned(s));
    return firstEmpty === -1 ? Math.max(0, target - 1) : firstEmpty;
  });

  // Re-anchor active slot when filled count changes from outside.
  useEffect(() => {
    if (allDone) return;
    if (isSigned(saved[activeSlot])) {
      const nextEmpty = saved.findIndex((s) => !isSigned(s));
      if (nextEmpty !== -1) setActiveSlot(nextEmpty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filledCount, target]);

  const writeNext = (next: string[]) => {
    const newCount = next.filter(isSigned).length;
    updateResponse({
      studentAnswers: next,
      studentAnswer: `Finger-written signature: ${newCount}/${target}`,
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

  return (
    <div className="stack-gap-md">
      <div className="card" style={{ padding: 14 }}>
        <p className="punjabi" style={{ marginTop: 0, fontSize: '1.05rem' }}>
          ✍️ ਆਪਣਾ ਪੂਰਾ ਨਾਮ (ਪਹਿਲਾ + ਆਖ਼ਰੀ) ਉਂਗਲ ਨਾਲ <strong>{target}</strong> ਵਾਰ ਲਿਖੋ।
        </p>
        <p className="muted" style={{ marginTop: 4 }}>
          Use your finger (or mouse) to write your full name {target} times. Tap{' '}
          <strong>“Save signature”</strong> after each one.
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
                  title={done ? `Signature ${i + 1} saved` : `Signature ${i + 1}`}
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

        {!allDone ? (
          <SignaturePad
            resetKey={`${question.id}-${activeSlot}`}
            saveLabel={`✅ Save signature (${filledCount + 1}/${target})`}
            onSave={handleSave}
            leftLabel={
              <>
                Signature <strong>{activeSlot + 1}</strong> of {target}
              </>
            }
          />
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
              ✅ <strong>All {target} signatures saved.</strong>{' '}
              <span className="punjabi">
                ਹੁਣ ਹੇਠਾਂ <strong>Mark Done</strong> ਦਬਾਓ।
              </span>
            </p>
            <p className="muted" style={{ margin: '4px 0 0' }}>
              Need to redo any? Tap <strong>“Redo”</strong> under any signature below.
            </p>
          </div>
        )}
      </div>

      {filledCount > 0 ? (
        <div className="card" style={{ padding: 12 }}>
          <p className="label" style={{ marginTop: 0, marginBottom: 8 }}>
            Your saved signatures:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 10,
            }}
          >
            {saved.map((src, i) => {
              if (!isSigned(src)) return null;
              return (
                <div
                  key={i}
                  style={{
                    border: '1px solid #cbd5e0',
                    borderRadius: 8,
                    padding: 6,
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div
                    className="muted"
                    style={{
                      fontSize: 11,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>#{i + 1}</span>
                    <span style={{ color: '#2f9e44' }}>✓ saved</span>
                  </div>
                  <img
                    alt={`Signature ${i + 1}`}
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
                    style={{ padding: '4px 8px', fontSize: 12, marginTop: 2 }}
                    aria-label={`Redo signature ${i + 1}`}
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

export default SignaturePracticeActivity;
