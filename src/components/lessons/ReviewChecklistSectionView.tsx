import Button from '../Button';
import ReportCard from '../ReportCard';
import { Lesson, LessonProgress, ReviewChecklistSection } from '../../types/lessonTypes';

interface Props {
  section: ReviewChecklistSection;
  lesson: Lesson;
  progress: LessonProgress;
  onSaveTeacherNotes: (value: string) => void;
  onSaveParentReview: (value: string) => void;
  onComplete: () => void;
}

const sectionLabel = (id: string): string => {
  const map: Record<string, string> = {
    intro: 'Lesson Intro',
    flashcards: 'Flashcards',
    reading: 'Reading',
    mcq: 'MCQ Practice',
    trueFalse: 'True / False',
    matching: 'Matching',
    fillBlanks: 'Fill in the Blanks',
    speaking: 'Speaking Practice',
    funActivity: 'Fun Activity',
    reviewChecklist: 'Review',
  };
  return map[id] ?? id;
};

const ReviewChecklistSectionView = ({
  section,
  lesson,
  progress,
  onSaveTeacherNotes,
  onSaveParentReview,
  onComplete,
}: Props) => {
  const itemSections = lesson.sections.filter((entry) => entry.id !== 'reviewChecklist');

  return (
    <section className="card question-card">
      <h2 className="section-title">{section.title.en}</h2>
      <p className="punjabi muted">{section.title.pa}</p>

      <ReportCard lesson={lesson} progress={progress} />

      <div>
        <p className="label">What you finished:</p>
        <ul className="lesson-checklist">
          {itemSections.map((entry) => {
            const done = progress.completedSections.includes(entry.id);
            return (
              <li key={entry.id}>
                <span aria-hidden="true">{done ? '☑' : '☐'}</span> {sectionLabel(entry.id)}
              </li>
            );
          })}
        </ul>
      </div>

      {progress.difficultWords.length > 0 ? (
        <div>
          <p className="label">Words you marked as difficult:</p>
          <ul>
            {progress.difficultWords.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <label className="form-stack">
        <span className="label">Teacher notes (optional):</span>
        <textarea
          className="textarea notebook-input"
          value={progress.teacherNotes}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => onSaveTeacherNotes(event.target.value)}
        />
      </label>

      <label className="form-stack">
        <span className="label">Parent review (optional):</span>
        <textarea
          className="textarea notebook-input"
          value={progress.parentReview}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => onSaveParentReview(event.target.value)}
        />
      </label>

      <div className="footer-nav">
        <Button fullWidth onClick={onComplete}>
          Finish lesson 🎓
        </Button>
      </div>
    </section>
  );
};

export default ReviewChecklistSectionView;
