import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { DailyTestRecord } from '../types/appTypes';
import { formatDateLabel } from '../utils/dateUtils';
import { getCompletedCount, getTotalCount } from '../utils/progressUtils';

interface HomeScreenProps {
  todayTest: DailyTestRecord | null;
  lastInProgressTest: DailyTestRecord | null;
  savedCount: number;
  onStartToday: () => void;
  onContinueLast: () => void;
  onOpenSavedTests: () => void;
}

const HomeScreen = ({
  todayTest,
  lastInProgressTest,
  savedCount,
  onStartToday,
  onContinueLast,
  onOpenSavedTests,
}: HomeScreenProps) => {
  const continueDisabled = !lastInProgressTest;
  const continueTarget = lastInProgressTest;
  const completedCount = continueTarget ? getCompletedCount(continueTarget) : 0;
  const totalCount = getTotalCount();
  const hasTodayInProgress = todayTest?.status === 'in_progress';

  return (
    <div className="screen-stack">
      <AppHeader
        title="Daily English Self-Test"
        subtitle="ਰੋਜ਼ਾਨਾ ਅੰਗਰੇਜ਼ੀ ਸੈਲਫ-ਟੈਸਟ"
      />

      <section className="card hero-card">
        <p>Practice speaking English every day. 🗣️</p>
        <p>Answer out loud. Save your answers to see later.</p>
        {hasTodayInProgress ? <p><strong>You have a test in progress today.</strong></p> : null}
      </section>

      <div className="stack-gap-md home-actions">
        <Button fullWidth onClick={onStartToday}>
          Start Today’s Test 🚀
        </Button>
        <Button
          fullWidth
          variant="secondary"
          disabled={continueDisabled}
          onClick={onContinueLast}
        >
          Continue Last Test ▶️
        </Button>
        <Button fullWidth variant="secondary" onClick={onOpenSavedTests}>
          My Saved Practice 📚
        </Button>
      </div>

      <section className="card meta-card">
        {todayTest ? (
          <p>
            <strong>Today:</strong> {formatDateLabel(todayTest.date)}
          </p>
        ) : (
          <p>No test started today yet.</p>
        )}
        {continueTarget ? (
          <p>
            <strong>Progress / ਤਰੱਕੀ:</strong> {completedCount} / {totalCount}
          </p>
        ) : (
          <p>Progress / ਤਰੱਕੀ: 0 / {totalCount}</p>
        )}
        <p>
          <strong>Saved tests:</strong> {savedCount}
        </p>
      </section>
    </div>
  );
};

export default HomeScreen;
