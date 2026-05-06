import { ActivityProps } from './types';

const LEVELS: { id: string; emoji: string; en: string; pa: string }[] = [
  { id: 'none', emoji: '🚫', en: 'None', pa: 'ਕੋਈ ਨਹੀਂ' },
  { id: 'few', emoji: '👌', en: 'A few', pa: 'ਥੋੜ੍ਹੇ' },
  { id: 'enough', emoji: '👍', en: 'Enough', pa: 'ਪੂਰੇ' },
  { id: 'plenty', emoji: '📚', en: 'Plenty', pa: 'ਬਹੁਤ' },
];

const InventoryLikertActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const items = question.inventoryLikert ?? [];
  const answers = response.studentAnswers ?? [];

  const setLevel = (idx: number, levelId: string) => {
    const next = [...answers];
    while (next.length < items.length) next.push('');
    next[idx] = levelId;
    const summary = items
      .map((it, i) => `${it.en}: ${LEVELS.find((l) => l.id === next[i])?.en ?? '-'}`)
      .join(', ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Check your supplies. How much do you have of each item?
        <br />
        <span className="punjabi">ਆਪਣਾ ਸਮਾਨ ਚੈੱਕ ਕਰੋ — ਹਰ ਚੀਜ਼ ਕਿੰਨੀ ਹੈ?</span>
      </p>
      <div>
        {items.map((it, idx) => {
          const sel = answers[idx] ?? '';
          return (
            <div className="likert-row" key={it.id}>
              <div>
                <strong>{it.en}</strong> <span className="punjabi muted">/ {it.pa}</span>
              </div>
              <div className="filter-pills" role="radiogroup" aria-label={it.en}>
                {LEVELS.map((l) => {
                  const isChecked = sel === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      aria-label={`${it.en}: ${l.en}`}
                      className={`conjunction-pill${isChecked ? ' is-selected' : ''}`}
                      onClick={() => setLevel(idx, l.id)}
                    >
                      {l.emoji} {l.en} <span className="punjabi muted">/ {l.pa}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryLikertActivity;
