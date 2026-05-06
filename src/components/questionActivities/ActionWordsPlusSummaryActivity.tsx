import { ActivityProps } from './types';
import { countWords, getWordCountState, wordCountBadgeText } from '../../utils/wordCount';

const ActionWordsPlusSummaryActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const answers = response.studentAnswers ?? [];
  const summaryMin = question.summaryWordMin ?? 8;
  const summary = answers[5] ?? '';
  const wc = countWords(summary);
  const state = getWordCountState(wc, summaryMin);

  const setVerb = (idx: number, val: string) => {
    const next = [...answers];
    while (next.length < 6) next.push('');
    next[idx] = val;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };
  const setSummary = (val: string) => {
    const next = [...answers];
    while (next.length < 6) next.push('');
    next[5] = val;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next) });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Think about today. List 5 action verbs (things you DID).
        <br />
        <span className="punjabi">ਅੱਜ ਤੁਸੀਂ ਜੋ ਕੰਮ ਕੀਤੇ ਉਹਨਾਂ ਦੇ 5 ਕਿਰਿਆ ਸ਼ਬਦ ਲਿਖੋ।</span>
      </p>
      <div className="stack-gap-md">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="input-row" key={i}>
            <label className="label input-row-label" htmlFor={`verb-${i}`}>
              {i + 1}. Today, I...
            </label>
            <input
              className="input input-row-field"
              id={`verb-${i}`}
              type="text"
              value={answers[i] ?? ''}
              onChange={(e) => setVerb(i, e.target.value)}
              placeholder="e.g., walked, ate, studied"
            />
          </div>
        ))}
      </div>
      <label className="label">
        ✍️ Write one sentence about your day using these verbs (at least {summaryMin} words).
        <br />
        <span className="punjabi muted">ਆਪਣੇ ਦਿਨ ਬਾਰੇ ਇੱਕ ਵਾਕ ਲਿਖੋ।</span>
        <textarea
          className="textarea"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Today I woke up early, ate roti, walked to school, studied math, and played cricket."
        />
        <span className={`word-count-badge is-${state}`} style={{ marginTop: 6 }}>
          {wordCountBadgeText(wc, summaryMin)}
        </span>
      </label>
    </div>
  );
};

const buildSummary = (a: string[]): string => {
  const verbs = a.slice(0, 5).filter(Boolean).join(', ');
  const sum = a[5] ?? '';
  return `${verbs}${sum ? ` | ${sum}` : ''}`;
};

export default ActionWordsPlusSummaryActivity;
