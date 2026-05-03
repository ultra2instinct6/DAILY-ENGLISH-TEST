import { useMemo, useState } from 'react';
import Button from '../Button';
import { MatchingSection } from '../../types/lessonTypes';

interface Props {
  section: MatchingSection;
  onComplete: () => void;
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const MatchingSectionView = ({ section, onComplete }: Props) => {
  const shuffledMeanings = useMemo(() => shuffle(section.pairs), [section.pairs]);
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  // matched[termId] = meaningId

  const allDone = Object.keys(matched).length === section.pairs.length;

  const handleMeaningClick = (meaningId: string) => {
    if (!activeTermId) return;
    if (activeTermId === meaningId) {
      setMatched({ ...matched, [activeTermId]: meaningId });
    } else {
      // Wrong — give a gentle nudge by clearing selection.
      setActiveTermId(null);
      window.setTimeout(() => {
        // No-op; visual state already cleared.
      }, 0);
      return;
    }
    setActiveTermId(null);
  };

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p>Tap a word, then tap its meaning. / ਸ਼ਬਦ ’ਤੇ ਟੈਪ ਕਰੋ, ਫਿਰ ਉਸ ਦੇ ਮਤਲਬ ’ਤੇ।</p>

      <div className="matching-grid">
        <div className="matching-column">
          <p className="label">Words</p>
          {section.pairs.map((pair) => {
            const isMatched = matched[pair.id];
            const isActive = activeTermId === pair.id;
            return (
              <Button
                key={pair.id}
                fullWidth
                variant={isActive || isMatched ? 'primary' : 'secondary'}
                disabled={Boolean(isMatched)}
                onClick={() => setActiveTermId(pair.id)}
              >
                {pair.term} {isMatched ? '✅' : ''}
              </Button>
            );
          })}
        </div>
        <div className="matching-column">
          <p className="label">Meanings</p>
          {shuffledMeanings.map((pair) => {
            const isUsed = Object.values(matched).includes(pair.id);
            return (
              <Button
                key={pair.id}
                fullWidth
                variant="secondary"
                disabled={isUsed || !activeTermId}
                onClick={() => handleMeaningClick(pair.id)}
              >
                <span style={{ display: 'block', textAlign: 'left' }}>
                  {pair.meaning.en}
                  <br />
                  <span className="punjabi muted">{pair.meaning.pa}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete} disabled={!allDone}>
          {allDone ? 'Done ✅' : `Match ${section.pairs.length - Object.keys(matched).length} more`}
        </Button>
      </div>
    </section>
  );
};

export default MatchingSectionView;
