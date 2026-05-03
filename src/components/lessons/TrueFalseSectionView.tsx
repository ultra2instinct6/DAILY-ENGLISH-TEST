import { useState } from 'react';
import Button from '../Button';
import SpeakButton from './SpeakButton';
import { TrueFalseSection } from '../../types/lessonTypes';

interface Props {
  section: TrueFalseSection;
  onComplete: () => void;
}

const TrueFalseSectionView = ({ section, onComplete }: Props) => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const item = section.items[index];
  const isLast = index === section.items.length - 1;
  const correct = picked !== null && picked === item.answer;

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setPicked(null);
    setIndex(index + 1);
  };

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>
      <p className="muted">Statement {index + 1} of {section.items.length}</p>

      <div>
        <p>{item.statement.en}</p>
        <p className="punjabi muted">{item.statement.pa}</p>
        <SpeakButton text={item.statement.en} />
      </div>

      <div className="stack-gap-md">
        <Button
          fullWidth
          variant={picked === true ? 'primary' : 'secondary'}
          onClick={() => setPicked(true)}
        >
          ✅ True / ਸਹੀ
        </Button>
        <Button
          fullWidth
          variant={picked === false ? 'primary' : 'secondary'}
          onClick={() => setPicked(false)}
        >
          ❌ False / ਗਲਤ
        </Button>
      </div>

      {picked !== null ? (
        <div className="help-box">
          {correct ? (
            <p>✅ Great! / ਸ਼ਾਬਾਸ਼!</p>
          ) : (
            <>
              <p>Try again. Read the sentence one more time.</p>
              <p className="punjabi muted">ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਵਾਕ ਫਿਰ ਪੜ੍ਹੋ।</p>              {item.correction ? (
                <>
                  <p>{item.correction.en}</p>
                  <p className="punjabi muted">{item.correction.pa}</p>
                </>
              ) : null}              <div className="footer-nav" style={{ marginTop: 8 }}>
                <Button variant="secondary" onClick={() => setPicked(null)}>
                  🔁 Try again
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="footer-nav">
        <Button fullWidth onClick={next} disabled={picked === null || !correct}>
          {isLast ? 'Done ✅' : 'Next ▶'}
        </Button>
      </div>
    </section>
  );
};

export default TrueFalseSectionView;
