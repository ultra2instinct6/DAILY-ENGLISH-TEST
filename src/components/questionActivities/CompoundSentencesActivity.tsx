import { ActivityProps } from './types';
import { countWords, getWordCountState, wordCountBadgeText } from '../../utils/wordCount';

const CompoundSentencesActivity = ({ question, response, updateResponse }: ActivityProps) => {
  // Layout: 3 rows. Each row stores 3 slots in studentAnswers:
  //   [rowIndex*3 + 0] = clauseA (text)
  //   [rowIndex*3 + 1] = conjunction (en label)
  //   [rowIndex*3 + 2] = clauseB (text)
  const answers = response.studentAnswers ?? [];
  const min = question.wordCountMin ?? 6;
  const max = question.wordCountMax ?? 10;
  const conjunctions = question.conjunctions ?? [
    { en: 'and', pa: 'ਅਤੇ' },
    { en: 'but', pa: 'ਪਰ' },
    { en: 'because', pa: 'ਕਿਉਂਕਿ' },
    { en: 'so', pa: 'ਇਸ ਲਈ' },
    { en: 'when', pa: 'ਜਦੋਂ' },
  ];
  const frames = question.clauseFrames ?? ['', ''];
  const reminder = question.truthReminder ?? {
    en: 'Only true sentences — no pretending.',
    pa: 'ਸਿਰਫ਼ ਸੱਚੀਆਂ ਗੱਲਾਂ — ਨਕਲੀ ਨਹੀਂ।',
  };

  const setSlot = (idx: number, value: string) => {
    const next = [...answers];
    while (next.length <= idx) next.push('');
    next[idx] = value;
    const summary = [0, 1, 2]
      .map((row) => {
        const a = next[row * 3] ?? '';
        const c = next[row * 3 + 1] ?? '';
        const b = next[row * 3 + 2] ?? '';
        return `${a} ${c} ${b}`.trim();
      })
      .filter(Boolean)
      .join(' | ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      <div className="truth-banner">
        <strong>🎯 {reminder.en}</strong>
        <div className="punjabi muted">{reminder.pa}</div>
      </div>
      <p className="muted no-margin">
        Make 3 longer sentences. Two ideas joined by a connector word.
        <br />
        <span className="punjabi">ਦੋ ਵਿਚਾਰ ਜੋੜੋ। ਜਿਵੇਂ: "I am tired" + "because" + "I played all day."</span>
      </p>
      {[0, 1, 2].map((row) => {
        const a = answers[row * 3] ?? '';
        const conj = answers[row * 3 + 1] ?? '';
        const b = answers[row * 3 + 2] ?? '';
        const wc = countWords(`${a} ${b}`);
        const state = getWordCountState(wc, min, max);
        const frameStart = frames[0] ?? '';
        const frameEnd = frames[1] ?? '';
        return (
          <div className="compound-row" key={row}>
            <div className="compound-row-header">
              <strong>Sentence {row + 1}</strong>
              <span className={`word-count-badge is-${state}`}>{wordCountBadgeText(wc, min, max)}</span>
            </div>
            <div className="compound-row-clauses">
              <input
                aria-label={`Sentence ${row + 1} part A`}
                className="input"
                placeholder={frameStart ? `${frameStart} …` : 'First idea'}
                type="text"
                value={a}
                onChange={(e) => setSlot(row * 3, e.target.value)}
              />
              <div className="conjunction-pills" role="radiogroup" aria-label={`Connector for sentence ${row + 1}`}>
                {conjunctions.map((c) => (
                  <button
                    key={c.en}
                    type="button"
                    className={`conjunction-pill${conj === c.en ? ' is-selected' : ''}`}
                    onClick={() => setSlot(row * 3 + 1, c.en)}
                  >
                    {c.en} <span className="punjabi muted">/ {c.pa}</span>
                  </button>
                ))}
              </div>
              <input
                aria-label={`Sentence ${row + 1} part B`}
                className="input"
                placeholder={frameEnd ? `${frameEnd} …` : 'Second idea'}
                type="text"
                value={b}
                onChange={(e) => setSlot(row * 3 + 2, e.target.value)}
              />
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
              {frameStart ? `Start: "${frameStart} ___"` : null}
            </p>
          </div>
        );
      })}
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        🟢 Badge turns green at {min} words. Going over {max} is fine.
        <br />
        <span className="punjabi">ਸ਼ਬਦ ਗਿਣਤੀ {min} ਹੋਣ ਉੱਤੇ ਹਰਾ ਹੋ ਜਾਵੇਗਾ।</span>
      </p>
    </div>
  );
};

export default CompoundSentencesActivity;
