import { ActivityProps } from './types';

type DayKey = 'yesterday' | 'today' | 'tomorrow';

interface DayDef {
  key: DayKey;
  en: string;
  pa: string;
  verb: string;
  offset: number; // days from today
}

const DAYS: DayDef[] = [
  { key: 'yesterday', en: 'Yesterday', pa: 'ਕੱਲ੍ਹ (ਬੀਤਿਆ)', verb: 'was', offset: -1 },
  { key: 'today', en: 'Today', pa: 'ਅੱਜ', verb: 'is', offset: 0 },
  { key: 'tomorrow', en: 'Tomorrow', pa: 'ਕੱਲ੍ਹ (ਆਉਣ ਵਾਲਾ)', verb: 'will be', offset: 1 },
];

const formatShortDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
};

const WeatherThreeDayActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const weatherOptions = question.weatherOptions ?? [];
  const excitementOptions = question.excitementOptions ?? [];

  // studentAnswers: [yesterday, today, tomorrow, excitement] each "emoji|labelEn|labelPa"
  const values = response.studentAnswers ?? ['', '', '', ''];

  const findOpt = (list: any[], value: string) => {
    if (!value) return null;
    const [emoji, labelEn] = value.split('|');
    return list.find((o) => o.emoji === emoji && o.labelEn === labelEn) ?? null;
  };

  const updateAt = (index: number, value: string) => {
    const next = [...values];
    while (next.length < 4) next.push('');
    // toggle off if same value tapped again
    next[index] = next[index] === value ? '' : value;
    const sentences: string[] = [];
    DAYS.forEach((day, i) => {
      const v = next[i];
      if (v) {
        const [, label] = v.split('|');
        sentences.push(`${day.en} ${day.verb} ${label}.`);
      }
    });
    if (next[3]) {
      const [emoji, label] = next[3].split('|');
      sentences.push(`I feel ${label} ${emoji} about the weather.`);
    }
    updateResponse({ studentAnswers: next, studentAnswer: sentences.join(' ') });
  };

  const filledDays = DAYS.filter((_, i) => values[i]).length;
  const totalSteps = 4;
  const filledTotal = filledDays + (values[3] ? 1 : 0);
  const allDone = filledTotal === totalSteps;

  return (
    <div className="weather-activity stack-gap-md">
      <div className="weather-progress" aria-live="polite">
        <span className="weather-progress-label">
          Picked <strong>{filledTotal}</strong> of {totalSteps}
        </span>
        <div className="weather-progress-track" aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`weather-progress-pip ${i < filledTotal ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>

      <p className="label" style={{ margin: 0 }}>
        Pick the weather for each day{' '}
        <span className="punjabi muted">· ਹਰ ਦਿਨ ਦਾ ਮੌਸਮ ਚੁਣੋ</span>
      </p>

      {DAYS.map((day, idx) => {
        const current = values[idx] ?? '';
        const selected = findOpt(weatherOptions, current);
        return (
          <section
            key={day.key}
            className={`weather-day-card ${selected ? 'is-selected' : ''}`}
            aria-label={`${day.en} weather`}
          >
            <header className="weather-day-head">
              <div className="weather-day-title">
                <span className="weather-day-name">{day.en}</span>
                <span className="weather-day-date">{formatShortDate(day.offset)}</span>
              </div>
              <span className="weather-day-pa punjabi muted">{day.pa}</span>
            </header>

            <div
              className="weather-tile-grid"
              role="radiogroup"
              aria-label={`${day.en} weather options`}
            >
              {weatherOptions.map((opt) => {
                const value = `${opt.emoji}|${opt.labelEn}`;
                const isSelected = current === value;
                return (
                  <button
                    key={`${day.key}-${opt.emoji}-${opt.labelEn}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`weather-tile ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => updateAt(idx, value)}
                  >
                    <span className="weather-tile-emoji" aria-hidden="true">
                      {opt.emoji}
                    </span>
                    <span className="weather-tile-label">{opt.labelEn}</span>
                    {opt.labelPa ? (
                      <span className="weather-tile-label-pa punjabi">{opt.labelPa}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {selected ? (
              <p className="weather-day-sentence">
                <span aria-hidden="true" className="weather-day-sentence-emoji">
                  {selected.emoji}
                </span>
                <span>
                  {day.en} {day.verb} <strong>{selected.labelEn}</strong>.
                </span>
              </p>
            ) : (
              <p className="weather-day-empty muted">Tap a weather above.</p>
            )}
          </section>
        );
      })}

      <section className="weather-excitement-card" aria-label="Excitement scale">
        <header className="weather-excitement-head">
          <p className="label" style={{ margin: 0 }}>
            How excited are you about the weather?
          </p>
          <p className="punjabi muted" style={{ margin: 0 }}>
            ਮੌਸਮ ਬਾਰੇ ਕਿੰਨਾ ਉਤਸ਼ਾਹ ਹੈ?
          </p>
        </header>
        <div className="weather-excitement-scale" role="radiogroup" aria-label="Excitement">
          {excitementOptions.map((opt, i) => {
            const value = `${opt.emoji}|${opt.labelEn}`;
            const isSelected = (values[3] ?? '') === value;
            return (
              <button
                key={`exc-${opt.emoji}-${i}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`weather-excitement-step ${isSelected ? 'is-selected' : ''}`}
                onClick={() => updateAt(3, value)}
              >
                <span className="weather-excitement-emoji" aria-hidden="true">
                  {opt.emoji}
                </span>
                <span className="weather-excitement-label">{opt.labelEn}</span>
                {opt.labelPa ? (
                  <span className="weather-excitement-label-pa punjabi">{opt.labelPa}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {filledTotal > 0 ? (
        <section
          className={`weather-report-card ${allDone ? 'is-complete' : ''}`}
          aria-live="polite"
        >
          <header className="weather-report-head">
            <span className="weather-report-title">📋 Your Weather Report</span>
            {allDone ? <span className="weather-report-done">All set ✓</span> : null}
          </header>
          <ul className="weather-report-list">
            {DAYS.map((day, i) => {
              const sel = findOpt(weatherOptions, values[i] ?? '');
              return (
                <li key={day.key} className="weather-report-row">
                  <span className="weather-report-day">{day.en}</span>
                  {sel ? (
                    <span className="weather-report-value">
                      <span aria-hidden="true">{sel.emoji}</span> {day.verb} {sel.labelEn}
                    </span>
                  ) : (
                    <span className="weather-report-value muted">— not picked</span>
                  )}
                </li>
              );
            })}
            {values[3] ? (
              <li className="weather-report-row weather-report-mood">
                <span className="weather-report-day">Feeling</span>
                <span className="weather-report-value">
                  <span aria-hidden="true">{values[3].split('|')[0]}</span>{' '}
                  {values[3].split('|')[1]}
                </span>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

export default WeatherThreeDayActivity;
