import { ActivityProps } from './types';
import Button from '../Button';

const DEFAULT_CONJUNCTIONS = [
  { en: 'because', pa: 'ਕਿਉਂਕਿ' },
  { en: 'and', pa: 'ਅਤੇ' },
  { en: 'but', pa: 'ਪਰ' },
  { en: 'so', pa: 'ਇਸ ਲਈ' },
  { en: 'when', pa: 'ਜਦੋਂ' },
];

// studentAnswers slot layout:
//   [0] emoji        e.g. "🙂"
//   [1] moodLabelEn  e.g. "happy"
//   [2] conj1        e.g. "because"
//   [3] clauseB      e.g. "I slept well"
//   [4] conj2        e.g. "and"
//   [5] clauseC      e.g. "the sun is out"
const MoodLikertActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const options = question.likertOptions ?? [];
  const conjunctions = question.conjunctions ?? DEFAULT_CONJUNCTIONS;
  const answers = response.studentAnswers ?? [];

  const emoji = answers[0] ?? '';
  const moodLabel = answers[1] ?? '';
  const conj1 = answers[2] ?? '';
  const clauseB = answers[3] ?? '';
  const conj2 = answers[4] ?? '';
  const clauseC = answers[5] ?? '';

  const buildSummary = (a: string[]) => {
    const e = a[0] ?? '';
    const m = a[1] ?? '';
    const c1 = a[2] ?? '';
    const b = (a[3] ?? '').trim();
    const c2 = a[4] ?? '';
    const c = (a[5] ?? '').trim();
    if (!m) return '';
    let s = `Today, I feel ${m}${e ? ` ${e}` : ''}`;
    if (c1 && b) s += ` ${c1} ${b}`;
    if (c1 && b && c2 && c) s += ` ${c2} ${c}`;
    return `${s}.`;
  };

  const setSlot = (idx: number, value: string) => {
    const next = [...answers];
    while (next.length <= idx) next.push('');
    next[idx] = value;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };

  const handlePickMood = (e: string, labelEn: string) => {
    const next = [...answers];
    while (next.length < 6) next.push('');
    next[0] = e;
    next[1] = labelEn;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };

  const showRow1 = !!moodLabel;
  const showRow2 = showRow1 && !!conj1 && clauseB.trim().length > 0;
  const summary = response.studentAnswer ?? '';

  return (
    <div className="stack-gap-md">
      <p className="label">How do I feel today? / ਮੈਂ ਅੱਜ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ?</p>
      <div className="filter-pills" role="radiogroup" aria-label="Mood">
        {options.map((opt) => {
          const isSelected = emoji === opt.emoji;
          return (
            <Button
              key={opt.emoji}
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => handlePickMood(opt.emoji, opt.labelEn)}
              role="radio"
              ariaChecked={isSelected}
              ariaLabel={opt.labelEn}
            >
              <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
              <br />
              <span style={{ fontSize: '0.85rem' }}>{opt.labelEn}</span>
            </Button>
          );
        })}
      </div>

      {showRow1 && (
        <div className="compound-row">
          <div className="compound-row-header">
            <strong>Add a reason</strong>
            <span className="punjabi muted">ਕਾਰਨ ਜੋੜੋ</span>
          </div>
          <div className="compound-row-clauses">
            <p className="answer-frame" style={{ margin: 0 }}>
              Today, I feel {moodLabel} {emoji}
            </p>
            <div className="conjunction-pills" role="radiogroup" aria-label="Connector for reason 1">
              {conjunctions.map((c) => (
                <button
                  key={c.en}
                  type="button"
                  className={`conjunction-pill${conj1 === c.en ? ' is-selected' : ''}`}
                  onClick={() => setSlot(2, c.en)}
                >
                  {c.en} <span className="punjabi muted">/ {c.pa}</span>
                </button>
              ))}
            </div>
            <input
              aria-label="Reason 1"
              className="input"
              placeholder="finish the sentence…"
              type="text"
              value={clauseB}
              onChange={(e) => setSlot(3, e.target.value)}
            />
          </div>
        </div>
      )}

      {showRow2 && (
        <div className="compound-row">
          <div className="compound-row-header">
            <strong>Add another reason (optional)</strong>
            <span className="punjabi muted">ਹੋਰ ਕਾਰਨ ਜੋੜੋ (ਚਾਹੋ ਤਾਂ)</span>
          </div>
          <div className="compound-row-clauses">
            <div className="conjunction-pills" role="radiogroup" aria-label="Connector for reason 2">
              {conjunctions.map((c) => (
                <button
                  key={c.en}
                  type="button"
                  className={`conjunction-pill${conj2 === c.en ? ' is-selected' : ''}`}
                  onClick={() => setSlot(4, c.en)}
                >
                  {c.en} <span className="punjabi muted">/ {c.pa}</span>
                </button>
              ))}
            </div>
            <input
              aria-label="Reason 2"
              className="input"
              placeholder="add one more idea…"
              type="text"
              value={clauseC}
              onChange={(e) => setSlot(5, e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <p className="label">My sentence:</p>
        <p className="answer-frame">{summary || 'Today, I feel ____.'}</p>
      </div>
    </div>
  );
};

export default MoodLikertActivity;
