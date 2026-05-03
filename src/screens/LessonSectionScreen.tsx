import { useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import IntroSectionView from '../components/lessons/IntroSectionView';
import FlashcardsSectionView from '../components/lessons/FlashcardsSectionView';
import ReadingSectionView from '../components/lessons/ReadingSectionView';
import McqSectionView from '../components/lessons/McqSectionView';
import TrueFalseSectionView from '../components/lessons/TrueFalseSectionView';
import MatchingSectionView from '../components/lessons/MatchingSectionView';
import FillBlanksSectionView from '../components/lessons/FillBlanksSectionView';
import SpeakingSectionView from '../components/lessons/SpeakingSectionView';
import FunActivitySectionView from '../components/lessons/FunActivitySectionView';
import ReviewChecklistSectionView from '../components/lessons/ReviewChecklistSectionView';
import { Lesson, LessonProgress, SectionScore } from '../types/lessonTypes';
import { stopSpeaking } from '../utils/tts';

interface Props {
  lesson: Lesson;
  sectionIndex: number;
  progress: LessonProgress;
  onBack: () => void;
  onSectionComplete: (sectionId: string) => void;
  onToggleDifficultWord: (word: string) => void;
  onSaveAnswer: (key: string, value: string) => void;
  onMarkSpeakingDone: (itemId: string) => void;
  onSaveTeacherNotes: (value: string) => void;
  onSaveParentReview: (value: string) => void;
  onRecordScore: (sectionId: string, score: Omit<SectionScore, 'recordedAt'>) => void;
  onFinishLesson: () => void;
}

const LessonSectionScreen = ({
  lesson,
  sectionIndex,
  progress,
  onBack,
  onSectionComplete,
  onToggleDifficultWord,
  onSaveAnswer,
  onMarkSpeakingDone,
  onSaveTeacherNotes,
  onSaveParentReview,
  onRecordScore,
  onFinishLesson,
}: Props) => {
  const section = lesson.sections[sectionIndex];

  useEffect(() => {
    return () => stopSpeaking();
  }, [sectionIndex]);

  const complete = () => {
    stopSpeaking();
    onSectionComplete(section.id);
  };

  const recordScore = (score: Omit<SectionScore, 'recordedAt'>) => {
    onRecordScore(section.id, score);
  };

  let body = null;

  if (section.type === 'intro') {
    body = <IntroSectionView section={section} onComplete={complete} />;
  } else if (section.type === 'flashcards') {
    body = (
      <FlashcardsSectionView
        section={section}
        difficultWords={progress.difficultWords}
        onToggleDifficult={onToggleDifficultWord}
        onComplete={complete}
      />
    );
  } else if (section.type === 'reading') {
    body = <ReadingSectionView section={section} onComplete={complete} />;
  } else if (section.type === 'mcq') {
    body = <McqSectionView section={section} onComplete={complete} onScoreRecorded={recordScore} />;
  } else if (section.type === 'trueFalse') {
    body = <TrueFalseSectionView section={section} onComplete={complete} onScoreRecorded={recordScore} />;
  } else if (section.type === 'matching') {
    body = <MatchingSectionView section={section} onComplete={complete} onScoreRecorded={recordScore} />;
  } else if (section.type === 'fillBlanks') {
    body = <FillBlanksSectionView section={section} onComplete={complete} onScoreRecorded={recordScore} />;
  } else if (section.type === 'speaking') {
    body = (
      <SpeakingSectionView
        section={section}
        speakingCompleted={progress.speakingCompleted}
        writtenAnswers={progress.writtenAnswers}
        onMarkDone={onMarkSpeakingDone}
        onSaveAnswer={onSaveAnswer}
        onComplete={complete}
      />
    );
  } else if (section.type === 'funActivity') {
    body = <FunActivitySectionView section={section} onComplete={complete} />;
  } else if (section.type === 'reviewChecklist') {
    body = (
      <ReviewChecklistSectionView
        section={section}
        lesson={lesson}
        progress={progress}
        onSaveTeacherNotes={onSaveTeacherNotes}
        onSaveParentReview={onSaveParentReview}
        onComplete={() => {
          onSectionComplete(section.id);
          onFinishLesson();
        }}
      />
    );
  }

  return (
    <div className="screen-stack">
      <AppHeader
        title={lesson.title.en}
        subtitle={lesson.title.pa}
        onBack={onBack}
        progressText={`Section ${sectionIndex + 1} of ${lesson.sections.length}`}
      />
      {body}
    </div>
  );
};

export default LessonSectionScreen;
