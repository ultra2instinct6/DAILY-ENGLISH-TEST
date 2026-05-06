import { useState } from 'react';
import Button from '../Button';
import SpeakButton from './SpeakButton';
import { FlashcardsSection } from '../../types/lessonTypes';

interface Props {
  section: FlashcardsSection;
  difficultWords: string[];
  onToggleDifficult: (word: string) => void;
  onComplete: () => void;
}

const FlashcardsSectionView = ({ section, difficultWords, onToggleDifficult, onComplete }: Props) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = section.cards[index];
  const isLast = index === section.cards.length - 1;
  const isDifficult = difficultWords.includes(card.term);

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setFlipped(false);
    setIndex(index + 1);
  };

  const prev = () => {
    if (index === 0) return;
    setFlipped(false);
    setIndex(index - 1);
  };

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p className="muted">Card {index + 1} of {section.cards.length}</p>

      <button
        type="button"
        className="flashcard"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={flipped ? `Showing meaning of ${card.term}. Activate to see word.` : `Showing word ${card.term}. Activate to see meaning.`}
      >
        {flipped ? (
          <div className="flashcard-face">
            <p className="label">Meaning</p>
            <p>{card.definition.en}</p>
            <p className="punjabi muted">{card.definition.pa}</p>
            {card.example ? (
              <p className="flashcard-example"><em>{card.example}</em></p>
            ) : null}
            <p className="muted small">Tap to see word</p>
          </div>
        ) : (
          <div className="flashcard-face">
            <p className="label">Word</p>
            <p className="flashcard-term">{card.term}</p>
            <p className="muted small">Tap to see meaning</p>
          </div>
        )}
      </button>

      <div className="button-row">
        <SpeakButton text={card.term} label="Word" />
        <SpeakButton text={card.definition.en} label="Meaning" />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={isDifficult}
          onChange={() => onToggleDifficult(card.term)}
        />
        <span>Mark as difficult / ਔਖਾ ਸ਼ਬਦ</span>
      </label>

      <div className="footer-nav">
        <Button variant="secondary" onClick={prev} disabled={index === 0}>
          ◀ Back
        </Button>
        <Button onClick={next}>
          {isLast ? 'Done ✅' : 'Next ▶'}
        </Button>
      </div>
    </section>
  );
};

export default FlashcardsSectionView;
