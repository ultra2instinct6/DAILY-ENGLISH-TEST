import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

interface RulesScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const RulesScreen = ({ onBack, onContinue }: RulesScreenProps) => {
  return (
    <div className="screen-stack">
      <AppHeader title="Main Rule / ਮੁੱਖ ਨਿਯਮ" onBack={onBack} />

      <section className="card question-card">
        <p>Answer out loud in English first. 🗣️</p>
        <p className="punjabi">ਪਹਿਲਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਉੱਚੀ ਆਵਾਜ਼ ਨਾਲ ਜਵਾਬ ਦਿਓ।</p>

        <div className="divider" />

        <p>Mark done only after you say it out loud and clear. ✅</p>
        <p className="punjabi">ਸਿਰਫ਼ ਉਦੋਂ ਪੂਰਾ ਕਰੋ ਜਦੋਂ ਤੁਸੀਂ ਸਾਫ਼ ਬੋਲਿਆ।</p>

        <Button fullWidth onClick={onContinue} variant="primary">
          OK, Got It 👍
        </Button>
      </section>
    </div>
  );
};

export default RulesScreen;