import { useState } from 'react';
import Button from '../Button';
import SpeakButton from './SpeakButton';
import { McqSection } from '../../types/lessonTypes';

interface Props {
  section: McqSection;
  onComplete: () => void;
}

const McqSectionView = ({ section, onComplete }: Props) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const question = section.questions[index];
  const isLast = index === section.questions.length - 1;
  const isCorrect = selected !== null && selected === question.correctIndex;

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setSelected(null);
    setRevealed(false);
    setIndex(index + 1);
  };

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p className="muted">Question {index + 1} of {section.questions.length}</p>

      <div>
        <p>{question.question.en}</p>
        <p className="punjabi muted">{question.question.pa}</p>
        <SpeakButton text={question.question.en} />
      </div>

      <div className="stack-gap-md">
        {question.options.map((option, optionIndex) => {
          const isThisSelected = selected === optionIndex;
          const isThisCorrect = optionIndex === question.correctIndex;
          let variant: 'primary' | 'secondary' = 'secondary';
          if (revealed && isThisCorrect) variant = 'primary';
          if (!revealed && isThisSelected) variant = 'primary';

          return (
            <Button
              key={optionIndex}
              fullWidth
              variant={variant}
              disabled={revealed && !isThisCorrect && !isThisSelected}
              onClick={() => {
                setSelected(optionIndex);
                setRevealed(true);
              }}
            >
              {String.fromCharCode(65 + optionIndex)}. {option}
            </Button>
          );
        })}
      </div>

      {revealed && !isCorrect ? (
        <div className="help-box">
          <p>{section.retryMessage.en}</p>
          <p className="punjabi muted">{section.retryMessage.pa}</p>
          <div className="footer-nav" style={{ marginTop: 8 }}>
            <Button
              variant="secondary"
              onClick={() => {
                setSelected(null);
                setRevealed(false);
              }}
            >
              🔁 Try again
            </Button>
          </div>
        </div>
      ) : null}

      {revealed && isCorrect ? (
        <div className="help-box">
          <p>✅ Great! / ਸ਼ਾਬਾਸ਼!</p>
          {question.explanation ? (
            <>
              <p>{question.explanation.en}</p>
              <p className="punjabi muted">{question.explanation.pa}</p>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="footer-nav">
        <Button fullWidth onClick={next} disabled={!revealed}>
          {isLast ? 'Done ✅' : 'Next ▶'}
        </Button>
      </div>
    </section>
  );
};

export default McqSectionView;
