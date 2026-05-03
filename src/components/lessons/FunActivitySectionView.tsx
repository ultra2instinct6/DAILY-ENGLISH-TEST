import Button from '../Button';
import { FunActivitySection } from '../../types/lessonTypes';

interface Props {
  section: FunActivitySection;
  onComplete: () => void;
}

const FunActivitySectionView = ({ section, onComplete }: Props) => {
  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en} 🎉</h2>
      <p className="punjabi muted">{section.title.pa}</p>

      <div className="help-box">
        <p>{section.instruction.en}</p>
        <p className="punjabi muted">{section.instruction.pa}</p>
      </div>

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete}>
          I did it ✅
        </Button>
      </div>
    </section>
  );
};

export default FunActivitySectionView;
