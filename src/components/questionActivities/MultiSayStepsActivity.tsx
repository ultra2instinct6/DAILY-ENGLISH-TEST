import { ActivityProps } from './types';
import Button from '../Button';

const MultiSayStepsActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const steps = question.sayingSteps ?? [];
  const values = response.studentAnswers ?? [];

  const toggle = (idx: number) => {
    const next = [...values];
    while (next.length < steps.length) next.push('');
    next[idx] = next[idx] === '✓' ? '' : '✓';
    const summary = steps
      .map((s, i) => `${s.labelEn} ${next[i] === '✓' ? '✓' : '○'}`)
      .join(' · ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      {steps.map((step, idx) => {
        const done = values[idx] === '✓';
        return (
          <div key={step.id} className="say-out-loud-card">
            <p className="say-out-loud-badge">🗣️ {step.labelEn}</p>
            <p className="punjabi muted no-margin">{step.labelPa}</p>
            {step.hintEn ? (
              <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem' }}>{step.hintEn}</p>
            ) : null}
            {step.hintPa ? (
              <p className="punjabi muted" style={{ margin: 0, fontSize: '0.9rem' }}>{step.hintPa}</p>
            ) : null}
            <div style={{ marginTop: 10 }}>
              <Button
                variant={done ? 'primary' : 'secondary'}
                onClick={() => toggle(idx)}
              >
                {done ? '✅ I said it' : 'I said it'}
              </Button>
            </div>
            {done && step.revealEn ? (
              <div
                style={{
                  marginTop: 10,
                  padding: '10px 12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: 8,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
              >
                {step.revealEn}
              </div>
            ) : null}
            {done && step.revealPa ? (
              <p className="punjabi muted" style={{ margin: '4px 0 0 0' }}>
                {step.revealPa}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default MultiSayStepsActivity;
