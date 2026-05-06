import { ActivityProps } from './types';
import SpeakButton from '../lessons/SpeakButton';

const digitize = (raw: string) => {
  // Keep only digits, then space them out so TTS reads each digit.
  const digits = raw.replace(/\D/g, '');
  return digits.split('').join(' ');
};

const SECTION_LABELS: Record<string, { en: string; pa: string }> = {
  usa: { en: 'Family in the United States of America', pa: 'ਅਮਰੀਕਾ ਵਿੱਚ ਪਰਿਵਾਰ (ਜੇ ਚਾਹੋ)' },
};

const PhoneContactsActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const contacts = question.phoneContacts ?? [];
  const values = response.studentAnswers ?? [];

  const updateContact = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    const summary = contacts
      .map((c: any, i: number) => {
        const v = (next[i] ?? '').trim();
        return v ? `${c.labelEn}: ${v}` : '';
      })
      .filter(Boolean)
      .join(' · ');
    updateResponse({ studentAnswers: next, studentAnswer: summary });
  };

  // Group contacts by section, preserving order. Default section is 'main'.
  const groups: { section: string; items: { contact: any; index: number }[] }[] = [];
  contacts.forEach((contact: any, index: number) => {
    const section = contact.section ?? 'main';
    let group = groups.find((g) => g.section === section);
    if (!group) {
      group = { section, items: [] };
      groups.push(group);
    }
    group.items.push({ contact, index });
  });

  const renderRow = (contact: any, index: number, displayNumber: number) => {
    const id = `${question.id}-phone-${contact.key}`;
    const value = values[index] ?? '';
    const spoken = digitize(value);
    const required = contact.required !== false && !contact.section;
    return (
      <div key={contact.key} className="stack-gap-md">
        <div className="input-row">
          <label className="label input-row-label" htmlFor={id}>
            {displayNumber}. {contact.labelEn}
            {required ? ' *' : ''}
            <br />
            <span className="punjabi muted">{contact.labelPa}</span>
          </label>
          <input
            aria-label={`${contact.labelEn} phone number`}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="input input-row-field"
            id={id}
            inputMode="tel"
            onChange={(event) => updateContact(index, event.target.value)}
            placeholder={required ? 'e.g., 9876543210' : 'optional / ਜੇ ਚਾਹੋ'}
            spellCheck={false}
            type="tel"
            value={value}
          />
        </div>
        {spoken ? (
          <div>
            <SpeakButton text={spoken} label={`Listen to ${contact.labelEn}'s number`} />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="stack-gap-lg">
      {groups.map((group) => {
        if (group.section === 'main') {
          return (
            <fieldset key={group.section} className="input-group">
              <legend className="label">Phone numbers</legend>
              <div className="stack-gap-md">
                {group.items.map(({ contact, index }, i) => renderRow(contact, index, i + 1))}
              </div>
            </fieldset>
          );
        }
        const label = SECTION_LABELS[group.section] ?? { en: group.section, pa: '' };
        return (
          <fieldset key={group.section} className="input-group">
            <legend className="label">
              {label.en}
              {label.pa ? (
                <>
                  <br />
                  <span className="punjabi muted">{label.pa}</span>
                </>
              ) : null}
            </legend>
            <div className="stack-gap-md">
              {group.items.map(({ contact, index }, i) => renderRow(contact, index, i + 1))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
};

export default PhoneContactsActivity;
