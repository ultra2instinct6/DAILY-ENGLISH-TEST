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
      </section>

      <div className="stack-gap-md">
        {course.lessons.map((lesson, index) => {
          const progress = progressMap[lesson.id];
          const totalSections = lesson.sections.length;
          const doneSections = progress ? progress.completedSections.length : 0;
          const isComplete = Boolean(progress?.completedAt);

          return (
            <article key={lesson.id} className="card lesson-card">
              <p className="muted small">{lesson.unit} • Lesson {index + 1}</p>
              <h2 className="section-title">{lesson.title.en}</h2>
              <p className="punjabi muted">{lesson.title.pa}</p>
              <p className="muted">⏱ {lesson.estimatedMinutes} min • {lesson.level}</p>
              <p className="muted">
                Progress: {doneSections} / {totalSections} {isComplete ? ' ✅' : ''}
              </p>
              <Button fullWidth onClick={() => onOpenLesson(lesson.id)}>
                {doneSections === 0 ? 'Start lesson 🚀' : isComplete ? 'Review again ↻' : 'Continue ▶'}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CourseHomeScreen;
