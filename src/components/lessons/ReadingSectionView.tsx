import { useState } from 'react';
import Button from '../Button';
import SpeakButton from './SpeakButton';
import { ReadingSection } from '../../types/lessonTypes';

interface Props {
  section: ReadingSection;
  onComplete: () => void;
}

type Mode = null | 'self' | 'aloud' | 'help';

const ReadingSectionView = ({ section, onComplete }: Props) => {
  const [mode, setMode] = useState<Mode>(null);

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>

      <div className="reading-passage">
        <p>{section.passage.en}</p>
        <p className="punjabi muted">{section.passage.pa}</p>
      </div>

      <div className="button-row">
        <SpeakButton text={section.passage.en} label="Read aloud" />
      </div>

      <p className="label">How will you read?</p>
      <div className="stack-gap-md">
        <Button
          fullWidth
          variant={mode === 'self' ? 'primary' : 'secondary'}
          onClick={() => setMode('self')}
        >
          📖 Read by myself
        </Button>
        <Button
          fullWidth
          variant={mode === 'aloud' ? 'primary' : 'secondary'}
          onClick={() => setMode('aloud')}
        >
          🗣️ Read out loud
        </Button>
        <Button
          fullWidth
          variant={mode === 'help' ? 'primary' : 'secondary'}
          onClick={() => setMode('help')}
        >
          🙋 I need help
        </Button>
      </div>

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete} disabled={mode === null}>
          Done ✅
        </Button>
      </div>
    </section>
  );
};

export default ReadingSectionView;
