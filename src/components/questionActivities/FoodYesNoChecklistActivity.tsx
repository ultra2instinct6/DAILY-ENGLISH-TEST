import { ActivityProps } from './types';

const FoodYesNoChecklistActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const items = question.foodChecklist ?? [];
  const values = response.studentAnswers ?? [];

  const setAt = (idx: number, choice: 'Yes' | 'No') => {
    const next = [...values];
    while (next.length < items.length) next.push('');
    next[idx] = choice;
    const yes = next.filter((v) => v === 'Yes').length;
    const no = next.filter((v) => v === 'No').length;
    updateResponse({
      studentAnswers: next,
      studentAnswer: `Likes ${yes}, dislikes ${no} of ${items.length} items`,
    });
  };

  const yes = values.filter((v) => v === 'Yes').length;
  const no = values.filter((v) => v === 'No').length;
  const remaining = items.length - yes - no;

  // Group items by category while preserving the original order and original index.
  type Row = { item: (typeof items)[number]; idx: number };
  const groups: { category: string; categoryPa?: string; rows: Row[] }[] = [];
  items.forEach((item, idx) => {
    const cat = item.category ?? 'Items';
    const last = groups[groups.length - 1];
    if (last && last.category === cat) {
      last.rows.push({ item, idx });
    } else {
      groups.push({ category: cat, categoryPa: item.categoryPa, rows: [{ item, idx }] });
    }
  });

  return (
    <div className="stack-gap-md">
      <p className="muted" style={{ margin: 0 }}>
        Vocabulary builder — tap ✅ if you like it, ❌ if you don't.
        <br />
        <span className="punjabi">vocabulary ਵਧਾਉਣ ਲਈ — ਜੇ ਪਸੰਦ ਹੈ ✅, ਜੇ ਨਹੀਂ ❌।</span>
      </p>
      <p style={{ margin: 0 }}>
        ✅ Yes: <strong>{yes}</strong> &nbsp; ❌ No: <strong>{no}</strong> &nbsp; ⏳ Left: <strong>{remaining}</strong> &nbsp; / {items.length}
      </p>
      {groups.map((group) => (
        <div key={group.category} className="stack-gap-sm">
          <h4 style={{ margin: '0.5rem 0 0.25rem' }}>
            {group.category}
            {group.categoryPa ? (
              <>
                {' '}
                <span className="punjabi muted" style={{ fontWeight: 'normal' }}>
                  / {group.categoryPa}
                </span>
              </>
            ) : null}
            <span className="muted" style={{ marginLeft: 8, fontWeight: 'normal' }}>
              ({group.rows.length})
            </span>
          </h4>
          <div className="food-yesno-list">
            {group.rows.map(({ item, idx }) => {
              const v = values[idx] ?? '';
              return (
                <div className="yesno-row" key={item.id}>
                  <div>
                    <strong>{item.en}</strong>{' '}
                    <span className="punjabi muted">/ {item.pa}</span>
                  </div>
                  <div className="food-yesno-buttons" role="radiogroup" aria-label={item.en}>
                    <button
                      type="button"
                      className={v === 'Yes' ? 'is-yes' : ''}
                      onClick={() => setAt(idx, 'Yes')}
                    >
                      ✅
                    </button>
                    <button
                      type="button"
                      className={v === 'No' ? 'is-no' : ''}
                      onClick={() => setAt(idx, 'No')}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodYesNoChecklistActivity;
