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

      {section.activities?.map((activity, index) => (
        <div key={index} className="help-box">
          {activity.title ? (
            <>
              <p className="label">{activity.title.en}</p>
              <p className="punjabi muted">{activity.title.pa}</p>
            </>
          ) : null}
          <p>{activity.instruction.en}</p>
          <p className="punjabi muted">{activity.instruction.pa}</p>
          {activity.example ? (
            <>
              <p><em>{activity.example.en}</em></p>
              <p className="punjabi muted"><em>{activity.example.pa}</em></p>
            </>
          ) : null}
          {activity.punjabiHelp ? (
            <>
              <p className="label small">Say:</p>
              <p>{activity.punjabiHelp.en}</p>
              <p className="punjabi muted">{activity.punjabiHelp.pa}</p>
            </>
          ) : null}
        </div>
      ))}

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete}>
          I did it ✅
        </Button>
      </div>
    </section>
  );
};

export default FunActivitySectionView;
