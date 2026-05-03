import { DailyReview } from '../types/appTypes';
import Button from './Button';

interface ReviewFormProps {
  dailyReview: DailyReview;
  onChange: (review: DailyReview) => void;
  onSave: () => void;
}

const ReviewForm = ({ dailyReview, onChange, onSave }: ReviewFormProps) => {
  return (
    <form className="card form-stack" onSubmit={(event) => {
      event.preventDefault();
      onSave();
    }}>
      <label className="label" htmlFor="didWell">
        I was good at
        <span className="punjabi muted review-label-help"> — ਮੈਂ ਕਿਸ ਵਿੱਚ ਚੰਗਾ ਸੀ</span>
        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="textarea"
          id="didWell"
          onChange={(event) => onChange({ ...dailyReview, didWell: event.target.value })}
          placeholder="E.g., I was good at counting numbers."
          rows={4}
          spellCheck={false}
          value={dailyReview.didWell}
        />
      </label>

      <label className="label" htmlFor="needsPractice">
        I need more practice with
        <span className="punjabi muted review-label-help"> — ਮੈਨੂੰ ਕਿਸ ਦਾ ਵੱਧ ਅਭਿਆਸ ਚਾਹੀਦਾ ਹੈ</span>
        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="textarea"
          id="needsPractice"
          onChange={(event) => onChange({ ...dailyReview, needsPractice: event.target.value })}
          placeholder="E.g., I need more practice with the alphabet."
          rows={4}
          spellCheck={false}
          value={dailyReview.needsPractice}
        />
      </label>

      <label className="label" htmlFor="tomorrowPractice">
        Tomorrow I will practice
        <span className="punjabi muted review-label-help"> — ਕੱਲ੍ਹ ਮੈਂ ਕੀ ਅਭਿਆਸ ਕਰਾਂਗਾ</span>
        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="textarea"
          id="tomorrowPractice"
          onChange={(event) => onChange({ ...dailyReview, tomorrowPractice: event.target.value })}
          placeholder="E.g., Tomorrow I will practice saying my address."
          rows={4}
          spellCheck={false}
          value={dailyReview.tomorrowPractice}
        />
      </label>

      <Button fullWidth type="submit" variant="primary">
        Save & Finish ✅
      </Button>
    </form>
  );
};

export default ReviewForm;