import Button from '../Button';
import SpeakButton from './SpeakButton';
import { IntroSection } from '../../types/lessonTypes';

interface Props {
  section: IntroSection;
  onComplete: () => void;
}

const IntroSectionView = ({ section, onComplete }: Props) => {
  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>

      <p>{section.body.en}</p>
      <p className="punjabi muted">{section.body.pa}</p>
      <SpeakButton text={section.body.en} />

      <div className="lesson-goals">
        <p className="label">Today’s goals / ਅੱਜ ਦੇ ਟੀਚੇ:</p>
        <ul>
          {section.goals.map((goal, index) => (
            <li key={index}>
              <span>{goal.en}</span>
              <br />
              <span className="punjabi muted">{goal.pa}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete}>
          Start Lesson 🚀
        </Button>
      </div>
    </section>
  );
};

export default IntroSectionView;
