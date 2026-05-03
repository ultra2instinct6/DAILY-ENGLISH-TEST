import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { Course, LessonProgressMap } from '../types/lessonTypes';

interface Props {
  course: Course;
  progressMap: LessonProgressMap;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
}

const CourseHomeScreen = ({ course, progressMap, onBack, onOpenLesson }: Props) => {
  const totalLessons = course.lessons.length;
  const finishedLessons = course.lessons.filter(
    (lesson) => progressMap[lesson.id]?.completedAt,
  ).length;

  return (
    <div className="screen-stack">
      <AppHeader
        title={course.title.en}
        subtitle={course.title.pa}
        onBack={onBack}
      />

      <section className="card hero-card">
        <p>{course.subtitle.en}</p>
        <p className="punjabi muted">{course.subtitle.pa}</p>
        <p className="muted">
          <strong>{finishedLessons}</strong> of {totalLessons} lessons finished
        </p>
      </section>

      <div className="stack-gap-md">
        {course.lessons.map((lesson, index) => {
          const progress = progressMap[lesson.id];
          const totalSections = lesson.sections.length;
          const doneSections = progress ? progress.completedSections.length : 0;
          const isComplete = Boolean(progress?.completedAt);
          const percent = totalSections > 0 ? Math.round((doneSections / totalSections) * 100) : 0;
          const isLocked = lesson.comingSoon === true;

          return (
            <article key={lesson.id} className={`card lesson-card${isLocked ? ' lesson-card-locked' : ''}`}>
              <p className="muted small">
                {lesson.unit} • Lesson {index + 1}
                {isLocked ? ' • Coming soon 🔒' : ''}
              </p>
              <h2 className="section-title">{lesson.title.en}</h2>
              <p className="punjabi muted">{lesson.title.pa}</p>
              <p className="muted">⏱ {lesson.estimatedMinutes} min • {lesson.level}</p>

              {!isLocked ? (
                <>
                  <div className="progress-line" aria-label={`Progress ${percent}%`}>
                    <span className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="muted small">
                    {doneSections} / {totalSections} sections {isComplete ? ' ✅' : ''}
                  </p>
                  <Button fullWidth onClick={() => onOpenLesson(lesson.id)}>
                    {doneSections === 0
                      ? 'Start lesson 🚀'
                      : isComplete
                        ? 'Review again ↻'
                        : 'Continue ▶'}
                  </Button>
                </>
              ) : (
                <>
                  <p className="muted">This lesson is being prepared.</p>
                  <p className="punjabi muted">ਇਹ ਪਾਠ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ।</p>
                  <Button fullWidth variant="secondary" disabled>
                    Coming soon 🔒
                  </Button>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CourseHomeScreen;
