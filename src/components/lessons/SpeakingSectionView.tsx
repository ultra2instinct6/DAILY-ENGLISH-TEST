import { useState } from 'react';
import Button from '../Button';
import SpeakButton from './SpeakButton';
import { SpeakingSection } from '../../types/lessonTypes';

interface Props {
  section: SpeakingSection;
  speakingCompleted: string[];
  writtenAnswers: Record<string, string>;
  onMarkDone: (itemId: string) => void;
  onSaveAnswer: (key: string, value: string) => void;
  onComplete: () => void;
}

const SpeakingSectionView = ({
  section,
  speakingCompleted,
  writtenAnswers,
  onMarkDone,
  onSaveAnswer,
  onComplete,
}: Props) => {
  const [index, setIndex] = useState(0);
  const item = section.items[index];
  const isLast = index === section.items.length - 1;
  const answerKey = `speaking:${item.id}`;
  const answer = writtenAnswers[answerKey] ?? '';
  const isDone = speakingCompleted.includes(item.id);

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex(index + 1);
  };

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p className="muted">Question {index + 1} of {section.items.length}</p>

      <div>
        <p className="label">Question:</p>
        <p>{item.question.en}</p>
        <p className="punjabi muted">{item.question.pa}</p>
        <SpeakButton text={item.question.en} />
      </div>

      <div className="answer-frame">
        <p>{item.frame.en}</p>
        <p className="punjabi muted">{item.frame.pa}</p>
      </div>

      <label className="form-stack">
        <span className="label">Write your answer (optional):</span>
        <textarea
          className="textarea notebook-input"
          value={answer}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => onSaveAnswer(answerKey, event.target.value)}
          placeholder="Type what you said out loud..."
        />
      </label>

      <div className="footer-nav">
        <Button
          variant={isDone ? 'primary' : 'secondary'}
          onClick={() => onMarkDone(item.id)}
        >
          {isDone ? '✅ Said it' : '🗣️ Mark as said'}
        </Button>
        <Button onClick={next} disabled={!isDone}>
          {isLast ? 'Done ✅' : 'Next ▶'}
        </Button>
      </div>
    </section>
  );
};

export default SpeakingSectionView;
