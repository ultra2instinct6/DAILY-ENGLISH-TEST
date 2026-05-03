import { useRef, useState } from 'react';
import Button from '../Button';
import { FillBlanksSection, SectionScore } from '../../types/lessonTypes';

interface Props {
  section: FillBlanksSection;
  onComplete: () => void;
  onScoreRecorded?: (score: Omit<SectionScore, 'recordedAt'>) => void;
}

const FillBlanksSectionView = ({ section, onComplete, onScoreRecorded }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const triedItems = useRef<Set<string>>(new Set());
  const firstTryRef = useRef(0);
  const attemptsRef = useRef(0);

  const setAnswer = (itemId: string, word: string) => {
    attemptsRef.current += 1;
    const item = section.items.find((entry) => entry.id === itemId);
    if (item && !triedItems.current.has(itemId)) {
      triedItems.current.add(itemId);
      if (word.toLowerCase() === item.answer.toLowerCase()) {
        firstTryRef.current += 1;
      }
    }
    setAnswers({ ...answers, [itemId]: word });
  };

  const usedWords = new Set(Object.values(answers));
  const allCorrect = section.items.every(
    (item) => answers[item.id]?.toLowerCase() === item.answer.toLowerCase(),
  );
  const allFilled = section.items.every((item) => Boolean(answers[item.id]));

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p>Tap a word from the word bank to fill in each blank.</p>
      <p className="punjabi muted">ਸ਼ਬਦਾਂ ਦੇ ਖਜ਼ਾਨੇ ਵਿੱਚੋਂ ਸ਼ਬਦ ਚੁਣ ਕੇ ਖਾਲੀ ਥਾਂ ਭਰੋ।</p>

      <div className="word-bank">
        {section.wordBank.map((word) => (
          <button
            key={word}
            type="button"
            className={`word-chip${usedWords.has(word) ? ' used' : ''}`}
            disabled={usedWords.has(word)}
            onClick={() => {
              // Place into the first empty slot.
              const target = section.items.find((item) => !answers[item.id]);
              if (target) setAnswer(target.id, word);
            }}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="stack-gap-md">
        {section.items.map((item, index) => {
          const filled = answers[item.id] ?? '';
          const isWrong = filled && filled.toLowerCase() !== item.answer.toLowerCase();
          return (
            <div key={item.id} className="fill-blank-row">
              <p className="muted small">{index + 1}.</p>
              <p>
                {item.before.en.split('____________________')[0]}
                <strong className={`blank${isWrong ? ' blank-wrong' : ''}`}>
                  {filled || '____________'}
                </strong>
                {item.before.en.split('____________________')[1] ?? ''}
              </p>
              <p className="punjabi muted">{item.before.pa}</p>
              {filled ? (
                <button
                  type="button"
                  className="ghost-button small-ghost"
                  onClick={() => {
                    const next = { ...answers };
                    delete next[item.id];
                    setAnswers(next);
                  }}
                >
                  Clear
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      {allFilled && !allCorrect ? (
        <div className="help-box">
          <p>Some answers do not match. Try again.</p>
          <p className="punjabi muted">ਕੁਝ ਜਵਾਬ ਠੀਕ ਨਹੀਂ ਹਨ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</p>
        </div>
      ) : null}

      <div className="footer-nav">
        <Button
          fullWidth
          onClick={() => {
            onScoreRecorded?.({
              total: section.items.length,
              firstTry: firstTryRef.current,
              attempts: attemptsRef.current,
            });
            onComplete();
          }}
          disabled={!allCorrect}
        >
          {allCorrect ? 'Done ✅' : 'Fill all blanks correctly'}
        </Button>
      </div>
    </section>
  );
};

export default FillBlanksSectionView;
