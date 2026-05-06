import { ActivityProps } from './types';

const FoodLikertActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const items = question.vegetableLikert ?? [];
  const answers = response.studentAnswers ?? [];

  const setRating = (idx: number, value: string) => {
    const next = [...answers];
    while (next.length <= items.length) next.push('');
    next[idx] = value;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(items, next) });
  };

  const setFavorite = (val: string) => {
    const next = [...answers];
    while (next.length <= items.length) next.push('');
    next[items.length] = val;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(items, next) });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Rate each food 1 (don't like) → 10 (love it).
        <br />
        <span className="punjabi">ਹਰ ਖਾਣੇ ਨੂੰ 1 ਤੋਂ 10 ਤੱਕ ਅੰਕ ਦਿਓ।</span>
      </p>
      <div>
        {items.map((it, idx) => {
          const v = answers[idx] ?? '';
          return (
            <div className="likert-row" key={it.id}>
              <div>
                <strong>{it.en}</strong> <span className="punjabi muted">/ {it.pa}</span>
              </div>
              <div className="likert-scale-buttons" role="radiogroup" aria-label={it.en}>
                {Array.from({ length: 10 }).map((_, n) => {
                  const num = String(n + 1);
                  const isChecked = v === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      aria-label={`${it.en}: ${num} of 10`}
                      className={isChecked ? 'is-selected' : ''}
                      onClick={() => setRating(idx, num)}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <label className="label">
        ⭐ What is my favorite food? / ਮੇਰਾ ਪਸੰਦੀਦਾ ਖਾਣਾ ਕੀ ਹੈ?
        <input
          aria-label="Favorite food"
          className="input"
          type="text"
          value={answers[items.length] ?? ''}
          onChange={(e) => setFavorite(e.target.value)}
          placeholder="e.g., aloo paratha"
        />
      </label>
    </div>
  );
};

const buildSummary = (items: { en: string }[], answers: string[]): string => {
  const ratings = items.map((it, i) => `${it.en}:${answers[i] || '-'}`).join(', ');
  const fav = answers[items.length] ?? '';
  return `${ratings}${fav ? ` | favorite: ${fav}` : ''}`;
};

export default FoodLikertActivity;
