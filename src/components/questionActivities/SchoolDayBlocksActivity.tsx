import { ActivityProps } from './types';
import { countWords, getWordCountState, wordCountBadgeText } from '../../utils/wordCount';

const SchoolDayBlocksActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const blocks = question.timeBlocks ?? [];
  const answers = response.studentAnswers ?? [];

  const setBlock = (i: number, val: string) => {
    const next = [...answers];
    while (next.length < blocks.length) next.push('');
    next[i] = val;
    const summary = blocks.map((b, idx) => `${b.labelEn}: ${next[idx] ?? ''}`).join(' || ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted" style={{ margin: 0 }}>
        Tell me about your school day in three time blocks. Write at least 10 words for each.
        <br />
        <span className="punjabi">ਸਕੂਲ ਦੇ ਦਿਨ ਨੂੰ ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦੱਸੋ। ਹਰ ਹਿੱਸੇ ਲਈ ਘੱਟੋ-ਘੱਟ 10 ਸ਼ਬਦ।</span>
      </p>
      {blocks.map((b, i) => {
        const val = answers[i] ?? '';
        const wc = countWords(val);
        const state = getWordCountState(wc, b.wordMin);
        return (
          <div className="school-day-block" key={b.id}>
            <div className="compound-row-header">
              <strong>{b.labelEn}</strong>
              <span className={`word-count-badge is-${state}`}>{wordCountBadgeText(wc, b.wordMin)}</span>
            </div>
            <p className="punjabi muted" style={{ margin: 0 }}>{b.labelPa}</p>
            <textarea
              className="textarea"
              rows={3}
              value={val}
              onChange={(e) => setBlock(i, e.target.value)}
              placeholder={`What did you do during ${b.labelEn}?`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SchoolDayBlocksActivity;
