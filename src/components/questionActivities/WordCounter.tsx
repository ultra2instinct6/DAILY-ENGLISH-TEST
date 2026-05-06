import { countWords } from '../../utils/wordCount';

interface Props {
  text: string;
  min: number;
  max?: number;
}

const WordCounter = ({ text, min, max }: Props) => {
  const count = countWords(text);
  const ok = count >= min && (max === undefined || count <= max);
  const className = `word-counter ${ok ? 'word-counter-ok' : 'word-counter-under'}`;
  const label = max !== undefined ? `${count} / ${min}–${max} words` : `${count} / ${min}+ words`;
  return (
    <p className={className} aria-live="polite">
      {ok ? '✅' : '✏️'} {label}
    </p>
  );
};

export default WordCounter;
