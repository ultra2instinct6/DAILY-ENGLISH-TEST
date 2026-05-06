import { ActivityProps } from './types';
import WordCounter from './WordCounter';
import { countWords } from '../../utils/wordCount';

const pad2 = (n: number) => n.toString().padStart(2, '0');

const formatDmy = (date: Date) => {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const dateForOffset = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDmy(d);
};

const buildSummary = (
  parts: { questionEn: string; frame?: string; value: string }[],
): string => {
  return parts
    .map(({ questionEn, frame, value }) => {
      const v = (value ?? '').trim();
      if (!v) return '';
      if (frame && frame.includes('___')) {
        return frame.replace(/_+/g, v);
      }
      return `${questionEn} → ${v}`;
    })
    .filter(Boolean)
    .join(' · ');
};

const MultiSentenceActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const parts = question.multiSentenceParts ?? [];
  const values = response.studentAnswers ?? [];

  const updateAt = (idx: number, value: string) => {
    const next = [...values];
    while (next.length < parts.length) next.push('');
    next[idx] = value;
    const summary = buildSummary(
      parts.map((p, i) => ({ questionEn: p.questionEn, frame: p.frame, value: next[i] ?? '' })),
    );
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  return (
    <div className="stack-gap-md">
      {parts.map((part, idx) => {
        const value = values[idx] ?? '';
        const isDate = part.inputType === 'date_dmy';
        const min = part.requiredWords ?? question.requiredWords ?? 0;
        const showCounter = !isDate && min > 0;
        const id = `${question.id}-ms-${part.id}`;
        const exampleDate =
          isDate && part.exampleDateOffsetDays !== undefined
            ? dateForOffset(part.exampleDateOffsetDays)
            : null;
        const previewSentence =
          part.frame && part.frame.includes('___') && value.trim()
            ? part.frame.replace(/_+/g, value.trim())
            : '';
        const counterOk = !showCounter || countWords(value) >= min;

        return (
          <div key={part.id} className="card multi-sentence-part">
            <p className="prompt-pa">{part.questionPa}</p>
            <p className="prompt-en">{part.questionEn}</p>

            {part.frame ? (
              <p className="answer-frame">{part.frame}</p>
            ) : null}

            <label className="label" htmlFor={id} style={{ display: 'block' }}>
              {isDate ? 'Date (DD/MM/YYYY)' : `Your answer${min ? ` (at least ${min} words)` : ''}`}
              <input
                aria-label={part.questionEn}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="input"
                id={id}
                onChange={(event) => updateAt(idx, event.target.value)}
                pattern={isDate ? '\\d{2}/\\d{2}/\\d{4}' : undefined}
                placeholder={isDate ? 'DD/MM/YYYY' : 'Write a clear sentence…'}
                spellCheck={false}
                type="text"
                inputMode={isDate ? 'numeric' : 'text'}
                value={value}
              />
            </label>

            {showCounter ? <WordCounter text={value} min={min} /> : null}

            {previewSentence && counterOk ? (
              <p className="multi-sentence-preview">📝 {previewSentence}</p>
            ) : null}

            {exampleDate ? (
              <p className="muted small">
                Example: yesterday was <strong>{exampleDate}</strong>. Today's date is one day later.
                <br />
                <span className="punjabi">ਉਦਾਹਰਨ: ਕੱਲ੍ਹ {exampleDate} ਸੀ। ਅੱਜ ਉਸ ਤੋਂ ਇੱਕ ਦਿਨ ਅੱਗੇ ਹੈ।</span>
              </p>
            ) : null}

            {part.hintEn ? (
              <p className="muted small">{part.hintEn}</p>
            ) : null}
            {part.hintPa ? (
              <p className="punjabi muted small">{part.hintPa}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default MultiSentenceActivity;
