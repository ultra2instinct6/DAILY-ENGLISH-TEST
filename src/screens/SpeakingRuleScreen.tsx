import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

interface SpeakingRuleScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const SpeakingRuleScreen = ({ onBack, onContinue }: SpeakingRuleScreenProps) => {
  return (
    <div className="screen-stack">
      <AppHeader
        title="Speaking Rule / ਬੋਲਣ ਦਾ ਨਿਯਮ"
        onBack={onBack}
      />

      <section className="card question-card">
        <p>No one-word answers for sentence questions. 💬</p>
        <p>Use the whole sentence shown below.</p>

        <div className="divider" />

        <p className="punjabi">ਵਾਕ ਵਾਲੇ ਸਵਾਲਾਂ ਲਈ ਇੱਕ ਸ਼ਬਦ ਦਾ ਜਵਾਬ ਨਹੀਂ।</p>
        <p className="punjabi">ਪੂਰਾ ਵਾਕ ਬੋਲੋ।</p>

        <div className="help-box">
          <p><strong>Example:</strong></p>
          <p>Question: What food do you like?</p>
          <p>Answer: I like to eat rice.</p>
        </div>

        <Button fullWidth onClick={onContinue} variant="primary">
          Start Test 🚀
        </Button>
      </section>
    </div>
  );
};

export default SpeakingRuleScreen;