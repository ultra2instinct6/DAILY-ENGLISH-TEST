import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';
import { Lesson, LessonProgress, LessonSection } from '../types/lessonTypes';

interface Props {
  lesson: Lesson;
  progress: LessonProgress;
  onBack: () => void;
  onOpenSection: (sectionIndex: number) => void;
  onFinishLesson: () => void;
}

const sectionLabel = (section: LessonSection): { en: string; pa: string; icon: string } => {
  const map: Record<string, { en: string; pa: string; icon: string }> = {
    intro: { en: 'Lesson Intro', pa: 'ਪਾਠ ਜਾਣ-ਪਛਾਣ', icon: '📘' },
    flashcards: { en: 'Flashcards', pa: 'ਸ਼ਬਦ ਕਾਰਡ', icon: '🃏' },
    reading: { en: 'Reading', pa: 'ਪੜ੍ਹਨਾ', icon: '📖' },
    mcq: { en: 'MCQ Practice', pa: 'ਬਹੁ-ਚੋਣ', icon: '❓' },
    trueFalse: { en: 'True / False', pa: 'ਸਹੀ / ਗਲਤ', icon: '⚖️' },
    matching: { en: 'Matching', pa: 'ਮਿਲਾਨ', icon: '🔗' },
    fillBlanks: { en: 'Fill in the Blanks', pa: 'ਖਾਲੀ ਥਾਂ', icon: '✍️' },
    speaking: { en: 'Speaking Practice', pa: 'ਬੋਲਣ ਦੀ ਅਭਿਆਸ', icon: '🗣️' },
    funActivity: { en: 'Fun Activity', pa: 'ਮਜ਼ੇਦਾਰ ਕੰਮ', icon: '🎉' },
    reviewChecklist: { en: 'Review', pa: 'ਸਮੀਖਿਆ', icon: '✅' },
  };
  return map[section.id] ?? { en: section.id, pa: '', icon: '•' };
};

const LessonHomeScreen = ({ lesson, progress, onBack, onOpenSection, onFinishLesson }: Props) => {
  const total = lesson.sections.length;
  const done = progress.completedSections.length;
  const allDone = done === total;
  const [showReport, setShowReport] = useState(false);
  const hasAnyScores = Object.keys(progress.sectionScores ?? {}).length > 0;

  return (
    <div className="screen-stack">
      <AppHeader
        title={lesson.title.en}
        subtitle={lesson.title.pa}
        onBack={onBack}
      />

      <section className="card hero-card">
        <p className="muted">{lesson.unit} • {lesson.level} • ⏱ {lesson.estimatedMinutes} min</p>
        <p>Progress: {done} / {total} {allDone ? '✅' : ''}</p>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowReport((value) => !value)}
        >
          {showReport ? 'Hide Report Card 📊' : `View Report Card 📊${hasAnyScores ? '' : ' (no scores yet)'}`}
        </Button>
      </section>

      {showReport ? (
        <section className="card">
          <ReportCard lesson={lesson} progress={progress} />
        </section>
      ) : null}

      <div className="stack-gap-md">
        {lesson.sections.map((section, index) => {
          const label = sectionLabel(section);
          const isDone = progress.completedSections.includes(section.id);
          return (
            <button
              key={section.id}
              type="button"
              className={`lesson-section-row${isDone ? ' done' : ''}`}
              onClick={() => onOpenSection(index)}
            >
              <span className="lesson-section-check" aria-hidden="true">
                {isDone ? '☑' : '☐'}
              </span>
              <span className="lesson-section-icon" aria-hidden="true">{label.icon}</span>
              <span className="lesson-section-text">
                <span>{label.en}</span>
                <span className="punjabi muted">{label.pa}</span>
              </span>
              <span className="lesson-section-arrow" aria-hidden="true">▸</span>
            </button>
          );
        })}
      </div>

      {allDone && !progress.completedAt ? (
        <Button fullWidth onClick={onFinishLesson}>
          Finish lesson 🎓
        </Button>
      ) : null}
    </div>
  );
};

export default LessonHomeScreen;
