import { useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';
import SpeakButton from '../lessons/SpeakButton';

const ScenariosActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const scenarios = question.scenarios ?? [];
  const values = response.studentAnswers ?? [];
  const [stepIndex, setStepIndex] = useState(0);

  const updateScenario = (idx: number, value: string) => {
    const next = [...values];
    while (next.length < scenarios.length) next.push('');
    next[idx] = value;
    const summary = scenarios
      .map((s, i) => {
        const v = (next[i] ?? '').trim();
        return v ? `${s.promptEn} → ${v}` : '';
      })
      .filter(Boolean)
      .join(' · ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  if (scenarios.length === 0) return null;
  const current = scenarios[stepIndex];
  const value = values[stepIndex] ?? '';
  const isLast = stepIndex === scenarios.length - 1;

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Scenario {stepIndex + 1} of {scenarios.length}
      </p>

      <div className="card" style={{ padding: 14 }}>
        <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{current.promptEn}</p>
        <p className="punjabi muted" style={{ margin: '0 0 8px 0' }}>{current.promptPa}</p>
        <SpeakButton text={current.promptEn} label="Listen" />
        {current.hintEn ? (
          <p className="help-box" style={{ marginTop: 10 }}>{current.hintEn}</p>
        ) : null}

        <label className="label" htmlFor={`${question.id}-scn-${current.id}`} style={{ marginTop: 12, display: 'block' }}>
          My answer
          <input
            aria-label="Scenario answer"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="input"
            id={`${question.id}-scn-${current.id}`}
            onChange={(event) => updateScenario(stepIndex, event.target.value)}
            spellCheck={false}
            type="text"
            value={value}
          />
        </label>
      </div>

      <div className="filter-pills">
        <Button
          variant="secondary"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
        >
          ← Previous
        </Button>
        <Button
          variant="primary"
          onClick={() => setStepIndex((i) => Math.min(scenarios.length - 1, i + 1))}
          disabled={isLast || value.trim().length === 0}
        >
          {isLast ? 'All scenarios done ✅' : 'Next scenario →'}
        </Button>
      </div>

      <ul className="lesson-checklist">
        {scenarios.map((s, i) => {
          const filled = (values[i] ?? '').trim().length > 0;
          return (
            <li key={s.id}>
              <span aria-hidden="true">{filled ? '☑' : '☐'}</span> {s.promptEn}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScenariosActivity;
