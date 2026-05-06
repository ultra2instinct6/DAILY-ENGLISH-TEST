import { ActivityProps } from './types';
import SpeakButton from '../lessons/SpeakButton';

const AddressFieldsActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const fields = question.addressFields ?? [];
  const values = response.studentAnswers ?? [];

  const updateField = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    const parts = next.map((v, i) => ({ v: (v ?? '').trim(), key: fields[i]?.key ?? '' }));
    const joined = parts
      .filter((p) => p.v.length > 0)
      .map((p) => (p.key === 'pin' ? `PIN ${p.v}` : p.v))
      .join(', ');
    const summary = joined ? `My home address is ${joined}.` : '';
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  const previewParts = fields.map((field, i) => ({
    field,
    value: (values[i] ?? '').trim(),
  }));
  const filled = previewParts.filter((p) => p.value.length > 0);
  const previewSentence = filled.length
    ? `My home address is ${filled
        .map((p) => (p.field.key === 'pin' ? `PIN ${p.value}` : p.value))
        .join(', ')}.`
    : '';

  return (
    <fieldset className="input-group">
      <legend className="label">My home address</legend>
      <div className="stack-gap-md">
        {fields.map((field, index) => {
          const id = `${question.id}-addr-${field.key}`;
          return (
            <div className="input-row" key={field.key}>
              <label className="label input-row-label" htmlFor={id}>
                {index + 1}. {field.labelEn}
                <br />
                <span className="punjabi muted">{field.labelPa}</span>
              </label>
              <input
                aria-label={field.labelEn}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="input input-row-field"
                id={id}
                onChange={(event) => updateField(index, event.target.value)}
                placeholder={field.placeholder ?? ''}
                spellCheck={false}
                type="text"
                value={values[index] ?? ''}
              />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <p className="label">Speak your address:</p>
        <p className="answer-frame">{previewSentence || 'Fill in the fields above to build your sentence.'}</p>
        <SpeakButton text={previewSentence} label="Speak my address" />
      </div>
    </fieldset>
  );
};

export default AddressFieldsActivity;
