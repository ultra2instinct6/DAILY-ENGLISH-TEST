import { ActivityProps } from './types';
import Button from '../Button';
import SpeakButton from '../lessons/SpeakButton';

const PhrasesReviewActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const phrases = question.phrases ?? [];
  const values = response.studentAnswers ?? [];

  const toggle = (idx: number) => {
    const next = [...values];
    while (next.length < phrases.length) next.push('');
    next[idx] = next[idx] === '✓' ? '' : '✓';
    const reviewed = next.filter((v) => v === '✓').length;
    updateResponse({
      studentAnswers: next,
      studentAnswer: `Reviewed ${reviewed}/${phrases.length} phrases`,
    });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Listen to each phrase. Tap “Got it” when you understand it. / ਹਰ ਵਾਕ ਸੁਣੋ ਅਤੇ ਸਮਝਣ ’ਤੇ ‘Got it’ ਦਬਾਓ।
      </p>
      {phrases.map((p, idx) => {
        const got = values[idx] === '✓';
        return (
          <div key={p.id} className="card" style={{ padding: 14 }}>
            <p style={{ fontWeight: 600, margin: '0 0 4px 0', fontSize: '1.05rem' }}>{p.en}</p>
            <p className="punjabi muted" style={{ margin: '0 0 10px 0' }}>{p.pa}</p>
            <div className="filter-pills">
              <SpeakButton text={p.en} label="Listen" />
              <Button
                variant={got ? 'primary' : 'secondary'}
                onClick={() => toggle(idx)}
              >
                {got ? '✅ Got it' : 'Got it'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhrasesReviewActivity;
