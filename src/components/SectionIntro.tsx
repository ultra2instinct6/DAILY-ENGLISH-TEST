import Button from './Button';

interface SectionIntroProps {
  sectionNumber: number;
  sectionTitleEnglish: string;
  sectionTitlePunjabi: string;
  questionRange: string;
  icon?: string;
  onBegin: () => void;
}

const SectionIntro = ({
  sectionNumber,
  sectionTitleEnglish,
  sectionTitlePunjabi,
  questionRange,
  icon,
  onBegin,
}: SectionIntroProps) => {
  return (
    <section className="card question-card">
      <p className="section-kicker">Section {sectionNumber}</p>
      <h2 className="section-title section-title-icon">
        {icon ? <span aria-hidden="true" className="section-icon">{icon}</span> : null}
        {sectionTitleEnglish}
      </h2>
      <p className="punjabi muted">{sectionTitlePunjabi}</p>
      <p className="answer-frame">Questions {questionRange}</p>
      <p>Answer the next questions one by one. 📝</p>
      <p className="punjabi muted">ਅਗਲੇ ਸਵਾਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਪੂਰੇ ਕਰੋ।</p>

      <div className="footer-nav">
        <Button fullWidth onClick={onBegin} variant="primary">
          Start 🚀
        </Button>
      </div>
    </section>
  );
};

export default SectionIntro;