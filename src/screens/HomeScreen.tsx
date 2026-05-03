import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { DailyTestRecord } from '../types/appTypes';
import { Course, LessonProgressMap } from '../types/lessonTypes';
import { formatDateLabel } from '../utils/dateUtils';
import { getCompletedCount, getTotalCount } from '../utils/progressUtils';

interface HomeScreenProps {
  todayTest: DailyTestRecord | null;
  lastInProgressTest: DailyTestRecord | null;
  savedCount: number;
  socialScienceCourse: Course;
  lessonProgressMap: LessonProgressMap;
  onStartToday: () => void;
  onContinueLast: () => void;
  onOpenSavedTests: () => void;
  onOpenSocialScience: () => void;
}

const HomeScreen = ({
  todayTest,
  lastInProgressTest,
  savedCount,
  socialScienceCourse,
  lessonProgressMap,
  onStartToday,
  onContinueLast,
  onOpenSavedTests,
  onOpenSocialScience,
}: HomeScreenProps) => {
  const continueDisabled = !lastInProgressTest;
  const continueTarget = lastInProgressTest;
  const completedCount = continueTarget ? getCompletedCount(continueTarget) : 0;
  const totalCount = getTotalCount();
  const hasTodayInProgress = todayTest?.status === 'in_progress';

  const lessons = socialScienceCourse.lessons;
  const availableLessons = lessons.filter((lesson) => !lesson.comingSoon);
  const completedLessons = availableLessons.filter(
    (lesson) => lessonProgressMap[lesson.id]?.completedAt,
  ).length;
  const inProgressLesson = availableLessons.find((lesson) => {
    const progress = lessonProgressMap[lesson.id];
    return progress && !progress.completedAt && progress.completedSections.length > 0;
  });

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

      <section className="card course-card" aria-labelledby="course-card-title">
        <p className="eyebrow">Lessons</p>
        <h2 id="course-card-title" className="section-title section-title-icon">
          <span aria-hidden="true" className="section-icon">📖</span>
          {socialScienceCourse.title.en}
        </h2>
        <p className="punjabi muted">{socialScienceCourse.title.pa}</p>
        <p className="muted">
          {availableLessons.length} lesson{availableLessons.length === 1 ? '' : 's'} available
          {' • '}
          {completedLessons} finished
        </p>
        {inProgressLesson ? (
          <p>
            <strong>In progress:</strong> {inProgressLesson.title.en}
          </p>
        ) : null}
        <Button fullWidth onClick={onOpenSocialScience}>
          {completedLessons === 0 && !inProgressLesson
            ? 'Open Social Science 🚀'
            : inProgressLesson
              ? 'Continue lesson ▶'
              : 'Open Social Science 📖'}
        </Button>
        <p className="punjabi muted small">ਸੋਸ਼ਲ ਸਾਇੰਸ ਖੋਲ੍ਹੋ</p>
      </section>

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
