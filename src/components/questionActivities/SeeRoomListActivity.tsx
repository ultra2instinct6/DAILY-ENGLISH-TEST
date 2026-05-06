import { ActivityProps } from './types';

const SeeRoomListActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const total = question.seeListCount ?? 10;
  const answers = response.studentAnswers ?? [];

  const setAt = (i: number, val: string) => {
    const next = [...answers];
    while (next.length < total) next.push('');
    next[i] = val;
    updateResponse({
      studentAnswers: next,
      studentAnswer: next.filter(Boolean).join(', '),
    });
  };

  const filled = Array.from({ length: total }).filter((_, i) => (answers[i] ?? '').trim()).length;

  return (
    <div className="stack-gap-md">
      <p className="muted" style={{ margin: 0 }}>
        Look around your room right now. List <strong>{total}</strong> things you see.
        <br />
        <span className="punjabi">ਆਪਣੇ ਕਮਰੇ ਵਿੱਚ ਦੇਖੋ ਅਤੇ {total} ਚੀਜ਼ਾਂ ਲਿਖੋ।</span>
      </p>
      <p style={{ margin: 0 }}>
        Filled: <strong>{filled}</strong> / {total}
      </p>
      <div className="see-room-list">
        {Array.from({ length: total }).map((_, i) => (
          <div className="input-row" key={i}>
            <label className="label input-row-label" htmlFor={`see-${i}`}>
              {i + 1}. I see
            </label>
            <input
              className="input input-row-field"
              id={`see-${i}`}
              type="text"
              value={answers[i] ?? ''}
              onChange={(e) => setAt(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeRoomListActivity;
