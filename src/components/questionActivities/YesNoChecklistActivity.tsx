import { ActivityProps } from './types';
import Button from '../Button';

type Choice = 'Always' | 'Sometimes' | 'Never';

const CHOICES: { value: Choice; en: string; pa: string; emoji: string }[] = [
  { value: 'Always', en: 'Always', pa: 'ਹਮੇਸ਼ਾ', emoji: '🟢' },
  { value: 'Sometimes', en: 'Sometimes', pa: 'ਕਦੇ-ਕਦੇ', emoji: '🟡' },
  { value: 'Never', en: 'Never', pa: 'ਕਦੇ ਨਹੀਂ', emoji: '🔴' },
];

// Tolerate legacy saved values from the old Yes/No version (display only).
const normalize = (raw: string): Choice | '' => {
  if (raw === 'Yes') return 'Always';
  if (raw === 'No') return 'Never';
  if (raw === 'Always' || raw === 'Sometimes' || raw === 'Never') return raw;
  return '';
};

const YesNoChecklistActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const items = question.safetyStatements ?? [];
  const values = response.studentAnswers ?? [];

  const updateAt = (idx: number, choice: Choice) => {
    const next = [...values];
    while (next.length < items.length) next.push('');
    next[idx] = choice;
    const always = next.filter((v) => v === 'Always' || v === 'Yes').length;
    const sometimes = next.filter((v) => v === 'Sometimes').length;
    const never = next.filter((v) => v === 'Never' || v === 'No').length;
    const skipped = items.length - always - sometimes - never;
    const summary = `Always: ${always}  Sometimes: ${sometimes}  Never: ${never}  Skipped: ${skipped}`;
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Self-check — no right or wrong. / ਆਪਣਾ ਚੈੱਕ — ਕੋਈ ਸਹੀ ਜਾਂ ਗਲਤ ਨਹੀਂ।
      </p>
      <ol style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 12 }}>
        {items.map((item, idx) => {
          const current = normalize(values[idx] ?? '');
          return (
            <li key={item.id}>
              <p style={{ margin: '0 0 4px 0' }}>{item.en}</p>
              <p className="punjabi muted" style={{ margin: '0 0 8px 0' }}>{item.pa}</p>
              <div className="filter-pills" role="radiogroup" aria-label={item.en}>
                {CHOICES.map((c) => (
                  <Button
                    key={c.value}
                    variant={current === c.value ? 'primary' : 'secondary'}
                    onClick={() => updateAt(idx, c.value)}
                  >
                    {c.emoji} {c.en} / {c.pa}
                  </Button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default YesNoChecklistActivity;
