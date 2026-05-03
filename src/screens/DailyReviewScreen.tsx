import AppHeader from '../components/AppHeader';
import ReviewForm from '../components/ReviewForm';
import { DailyTestRecord } from '../types/appTypes';
import { getTotalCount } from '../utils/progressUtils';

interface DailyReviewScreenProps {
  completedCount: number;
  endTime: string;
  onChangeReview: (review: DailyTestRecord['dailyReview']) => void;
  onSave: (review: DailyTestRecord['dailyReview'], endTime: string) => void;
  test: DailyTestRecord;
  onBack: () => void;
}

const DailyReviewScreen = ({
  completedCount,
  endTime,
  onChangeReview,
  onSave,
  test,
  onBack,
}: DailyReviewScreenProps) => {
  return (
    <div className="screen-stack">
      <AppHeader title="How did I do today? 📝" subtitle="ਅੱਜ ਮੈਂ ਕਿਵੇਂ ਕੀਤਾ?" onBack={onBack} progressText={`Done / ਪੂਰਾ ਕੀਤਾ: ${completedCount} / ${getTotalCount()}`} />

      <section className="card">
        <p><strong>End Time / ਖਤਮ ਸਮਾਂ</strong></p>
        <input className="input" readOnly value={endTime} />
      </section>

      <ReviewForm dailyReview={test.dailyReview} onChange={onChangeReview} onSave={() => onSave(test.dailyReview, endTime)} />
    </div>
  );
};

export default DailyReviewScreen;