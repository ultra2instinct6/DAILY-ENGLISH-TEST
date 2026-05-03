import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { getTotalCount } from '../utils/progressUtils';

interface CompletionScreenProps {
  completedCount: number;
  onOpenSavedTest: () => void;
  onHome: () => void;
}

const CompletionScreen = ({ completedCount, onOpenSavedTest, onHome }: CompletionScreenProps) => {
  return (
    <div className="screen-stack">
      <AppHeader title="Your Practice Is Saved! 🎉" subtitle="ਤੁਹਾਡੀ ਪ੍ਰੈਕਟਿਸ ਸੇਵ ਹੋ ਗਈ" />
      <section className="card question-card">
        <p>
          <strong>Done / ਪੂਰਾ ਕੀਤਾ:</strong>
        </p>
        <p className="title">{completedCount} / {getTotalCount()}</p>

        <p>Great job! Your test is saved. ⭐</p>
        <p className="punjabi">ਸ਼ਾਬਾਸ਼! ਤੁਹਾਡਾ ਟੈਸਟ ਸੇਵ ਹੋ ਗਿਆ ਹੈ।</p>

        <div className="stack-gap-md">
          <Button fullWidth onClick={onOpenSavedTest} variant="primary">
            See My Answers 📄
          </Button>
          <Button fullWidth variant="secondary" onClick={onHome}>
            Back Home 🏠
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompletionScreen;