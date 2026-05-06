import { ActivityProps } from './types';

const PeopleJobsEducationActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const levels = question.educationLevels ?? [];
  const answers = response.studentAnswers ?? [];

  const setName = (i: number, val: string) => {
    const next = [...answers];
    while (next.length < 10) next.push('');
    next[i * 2] = val;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next, levels) });
  };
  const setLevel = (i: number, levelId: string) => {
    const next = [...answers];
    while (next.length < 10) next.push('');
    next[i * 2 + 1] = levelId;
    updateResponse({ studentAnswers: next, studentAnswer: buildSummary(next, levels) });
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Name 5 people or jobs. For each, choose the education level usually needed in India.
        <br />
        <span className="punjabi">ਹਰ ਕੰਮ ਲਈ ਪੜ੍ਹਾਈ ਦਾ ਪੱਧਰ ਚੁਣੋ।</span>
      </p>
      {[0, 1, 2, 3, 4].map((i) => {
        const name = answers[i * 2] ?? '';
        const sel = answers[i * 2 + 1] ?? '';
        return (
          <div className="compound-row" key={i}>
            <label className="label">
              {i + 1}. Person or job
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(i, e.target.value)}
                placeholder="e.g., doctor, shopkeeper, teacher"
              />
            </label>
            <div>
              <p className="label" style={{ margin: '4px 0' }}>Education needed:</p>
              <div className="education-level-pills" role="radiogroup" aria-label={`Education for ${name || `job ${i + 1}`}`}>
                {levels.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={sel === l.id ? 'is-selected' : ''}
                    onClick={() => setLevel(i, l.id)}
                  >
                    {l.en} <span className="punjabi muted">/ {l.pa}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const buildSummary = (
  answers: string[],
  levels: { id: string; en: string }[],
): string =>
  [0, 1, 2, 3, 4]
    .map((i) => {
      const name = answers[i * 2] ?? '';
      const lvl = levels.find((l) => l.id === answers[i * 2 + 1])?.en ?? '-';
      return name ? `${name} (${lvl})` : '';
    })
    .filter(Boolean)
    .join(', ');

export default PeopleJobsEducationActivity;
