import { useMemo, useState } from 'react';
import CompletionScreen from './screens/CompletionScreen';
import CourseHomeScreen from './screens/CourseHomeScreen';
import DailyReviewScreen from './screens/DailyReviewScreen';
import HomeScreen from './screens/HomeScreen';
import LessonHomeScreen from './screens/LessonHomeScreen';
import LessonSectionScreen from './screens/LessonSectionScreen';
import RulesScreen from './screens/RulesScreen';
import SavedTestDetailScreen from './screens/SavedTestDetailScreen';
import SavedTestsScreen from './screens/SavedTestsScreen';
import SpeakingRuleScreen from './screens/SpeakingRuleScreen';
import StudentInfoScreen from './screens/StudentInfoScreen';
import TestFlowScreen from './screens/TestFlowScreen';
import { DailyTestRecord, QuestionResponse, ScreenName } from './types/appTypes';
import { LessonProgressMap } from './types/lessonTypes';
import { getCurrentTimeString, getTodayDateString } from './utils/dateUtils';
import { deleteTest, loadAllTests, saveTest } from './utils/storage';
import {
  loadAllLessonProgress,
  markLessonCompleted,
  markSectionComplete,
  markSpeakingItemDone,
  recordSectionScore,
  saveParentReview,
  saveTeacherNotes,
  saveWrittenAnswer,
  toggleDifficultWord,
} from './utils/lessonStorage';
import { socialScienceCourse } from './data/courses/socialScience';
import { getCompletedCount, getTotalCount } from './utils/progressUtils';
import { questions } from './data/questions';

const createInitialResponses = (): DailyTestRecord['responses'] => {
  return questions.reduce<DailyTestRecord['responses']>((allResponses, question) => {
    const baseResponse: QuestionResponse = {
      questionId: question.id,
      completed: false,
      studentAnswer: '',
      reviewNote: '',
    };

    if (question.type === 'three_sentence') {
      baseResponse.studentAnswers = ['', '', ''];
    }

    if (question.type === 'word_list') {
      baseResponse.studentAnswers = ['', '', '', '', ''];
    }

    return {
      ...allResponses,
      [question.id]: baseResponse,
    };
  }, {});
};

const createInitialQuestionStates = (): DailyTestRecord['questionStates'] => {
  return questions.reduce<DailyTestRecord['questionStates']>((allStates, question) => {
    return {
      ...allStates,
      [question.id]: {
        answer: '',
        completed: false,
      },
    };
  }, {});
};

const App = () => {
  const [tests, setTests] = useState<Record<string, DailyTestRecord>>(() => loadAllTests());
  const [screen, setScreen] = useState<ScreenName>('home');
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [selectedSavedDate, setSelectedSavedDate] = useState<string | null>(null);
  const [lessonProgressMap, setLessonProgressMap] = useState<LessonProgressMap>(() =>
    loadAllLessonProgress(),
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  const todayDate = getTodayDateString();
  const todayTest = tests[todayDate] ?? null;
  const activeTest = activeDate ? tests[activeDate] ?? null : null;
  const selectedSavedTest = selectedSavedDate ? tests[selectedSavedDate] ?? null : null;

  const savedTests = useMemo(
    () => Object.values(tests).sort((left, right) => right.date.localeCompare(left.date)),
    [tests],
  );

  const lastInProgressTest = useMemo(
    () => savedTests.find((test) => test.status === 'in_progress') ?? null,
    [savedTests],
  );

  const todayInProgressTest = todayTest?.status === 'in_progress' ? todayTest : null;

  const persistTest = (test: DailyTestRecord) => {
    saveTest(test);
    setTests((current) => ({ ...current, [test.date]: test }));
    setActiveDate(test.date);
  };

  const updateActiveTest = (updater: (current: DailyTestRecord) => DailyTestRecord) => {
    if (!activeTest) {
      return;
    }

    persistTest(updater(activeTest));
  };

  const startToday = () => {
    if (todayInProgressTest) {
      setActiveDate(todayInProgressTest.date);
      setScreen('testFlow');
      return;
    }

    setActiveDate(null);
    setScreen('studentInfo');
  };

  const continueLast = () => {
    const target = todayInProgressTest ?? lastInProgressTest;

    if (!target) {
      return;
    }

    setActiveDate(target.date);
    setScreen('testFlow');
  };

  const saveDailyReviewAndFinish = (review: DailyTestRecord['dailyReview'], endTime: string) => {
    if (!activeTest) {
      return;
    }

    persistTest({
      ...activeTest,
      dailyReview: review,
      endTime,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setScreen('completion');
  };

  const updateActiveReview = (review: DailyTestRecord['dailyReview']) => {
    updateActiveTest((current) => ({
      ...current,
      dailyReview: review,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteSavedTest = (date: string) => {
    setTests((current) => {
      const nextTests = { ...current };
      delete nextTests[date];
      if (current[date]) {
        deleteTest(current[date].id);
      }
      return nextTests;
    });

    if (selectedSavedDate === date) {
      setSelectedSavedDate(null);
      setScreen('savedTests');
    }
  };

  let content = (
    <HomeScreen
      todayTest={todayTest}
      lastInProgressTest={lastInProgressTest}
      savedCount={savedTests.length}
      socialScienceCourse={socialScienceCourse}
      lessonProgressMap={lessonProgressMap}
      onStartToday={startToday}
      onContinueLast={continueLast}
      onOpenSavedTests={() => setScreen('savedTests')}
      onOpenSocialScience={() => setScreen('courseHome')}
    />
  );

  if (screen === 'studentInfo') {
    content = (
      <StudentInfoScreen
        initialDate={todayDate}
        initialName={todayInProgressTest?.studentName ?? ''}
        initialProfile={todayInProgressTest?.studentProfile}
        initialStartTime={todayInProgressTest?.startTime ?? getCurrentTimeString()}
        onBack={() => setScreen('home')}
        onStart={(studentName, date, startTime, studentProfile) => {
          const timestamp = new Date().toISOString();
          const nextTest: DailyTestRecord = {
            id: `${date}-${Date.now()}`,
            studentName,
            studentProfile,
            studentClass: '',
            date,
            startTime,
            responses: createInitialResponses(),
            dailyReview: {
              didWell: '',
              needsPractice: '',
              tomorrowPractice: '',
            },
            createdAt: timestamp,
            updatedAt: timestamp,
            status: 'in_progress',
            currentItemIndex: 0,
            startedAt: timestamp,
            questionStates: createInitialQuestionStates(),
            skipsRemaining: 3,
          };
          persistTest(nextTest);
          setScreen('rules');
        }}
      />
    );
  }

  if (screen === 'rules') {
    content = <RulesScreen onBack={() => setScreen('studentInfo')} onContinue={() => setScreen('speakingRules')} />;
  }

  if (screen === 'speakingRules') {
    content = <SpeakingRuleScreen onBack={() => setScreen('rules')} onContinue={() => setScreen('testFlow')} />;
  }

  if (screen === 'testFlow' && activeTest) {
    content = (
      <TestFlowScreen
        test={activeTest}
        onBackHome={() => setScreen('home')}
        onComplete={() => setScreen('dailyReview')}
        onUpdateTest={updateActiveTest}
      />
    );
  }

  if (screen === 'dailyReview' && activeTest) {
    content = (
      <DailyReviewScreen
        completedCount={getCompletedCount(activeTest)}
        endTime={activeTest.endTime ?? getCurrentTimeString()}
        onChangeReview={updateActiveReview}
        onSave={saveDailyReviewAndFinish}
        test={activeTest}
        onBack={() => setScreen('testFlow')}
      />
    );
  }

  if (screen === 'savedTests') {
    content = (
      <SavedTestsScreen
        tests={savedTests}
        onBack={() => setScreen('home')}
        onDeleteTest={deleteSavedTest}
        onOpenTest={(date) => {
          setSelectedSavedDate(date);
          setScreen('savedTestDetail');
        }}
      />
    );
  }

  if (screen === 'savedTestDetail' && selectedSavedTest) {
    content = (
      <SavedTestDetailScreen
        onBackHome={() => setScreen('home')}
        test={selectedSavedTest}
        onBack={() => setScreen('savedTests')}
      />
    );
  }

  if (screen === 'completion' && activeTest) {
    content = (
      <CompletionScreen
        completedCount={getCompletedCount(activeTest)}
        onOpenSavedTest={() => {
          setSelectedSavedDate(activeTest.date);
          setScreen('savedTestDetail');
        }}
        onHome={() => setScreen('home')}
      />
    );
  }

  const refreshLessonProgress = () => {
    setLessonProgressMap(loadAllLessonProgress());
  };

  const activeLesson = activeLessonId
    ? socialScienceCourse.lessons.find((entry) => entry.id === activeLessonId) ?? null
    : null;

  const blankLessonProgress = {
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedSections: [],
    difficultWords: [],
    writtenAnswers: {},
    speakingCompleted: [],
    teacherNotes: '',
    parentReview: '',
    sectionScores: {},
  };

  if (screen === 'courseHome') {
    content = (
      <CourseHomeScreen
        course={socialScienceCourse}
        progressMap={lessonProgressMap}
        onBack={() => setScreen('home')}
        onOpenLesson={(lessonId) => {
          const target = socialScienceCourse.lessons.find((entry) => entry.id === lessonId);
          if (!target || target.comingSoon) {
            return;
          }
          setActiveLessonId(lessonId);
          setActiveSectionIndex(0);
          setScreen('lessonHome');
        }}
      />
    );
  }

  if (screen === 'lessonHome' && activeLesson) {
    content = (
      <LessonHomeScreen
        lesson={activeLesson}
        progress={lessonProgressMap[activeLesson.id] ?? blankLessonProgress}
        onBack={() => setScreen('courseHome')}
        onOpenSection={(index) => {
          setActiveSectionIndex(index);
          setScreen('lessonSection');
        }}
        onFinishLesson={() => {
          markLessonCompleted(activeLesson.id);
          refreshLessonProgress();
          setScreen('courseHome');
        }}
      />
    );
  }

  if (screen === 'lessonSection' && activeLesson) {
    const lessonId = activeLesson.id;
    content = (
      <LessonSectionScreen
        lesson={activeLesson}
        sectionIndex={activeSectionIndex}
        progress={lessonProgressMap[lessonId] ?? blankLessonProgress}
        onBack={() => setScreen('lessonHome')}
        onSectionComplete={(sectionId) => {
          markSectionComplete(lessonId, sectionId);
          refreshLessonProgress();
          const nextIndex = activeSectionIndex + 1;
          if (nextIndex < activeLesson.sections.length) {
            setActiveSectionIndex(nextIndex);
          } else {
            setScreen('lessonHome');
          }
        }}
        onToggleDifficultWord={(word) => {
          toggleDifficultWord(lessonId, word);
          refreshLessonProgress();
        }}
        onSaveAnswer={(key, value) => {
          saveWrittenAnswer(lessonId, key, value);
          refreshLessonProgress();
        }}
        onMarkSpeakingDone={(itemId) => {
          markSpeakingItemDone(lessonId, itemId);
          refreshLessonProgress();
        }}
        onSaveTeacherNotes={(value) => {
          saveTeacherNotes(lessonId, value);
          refreshLessonProgress();
        }}
        onSaveParentReview={(value) => {
          saveParentReview(lessonId, value);
          refreshLessonProgress();
        }}
        onRecordScore={(sectionId, score) => {
          recordSectionScore(lessonId, sectionId, score);
          refreshLessonProgress();
        }}
        onFinishLesson={() => {
          markLessonCompleted(lessonId);
          refreshLessonProgress();
          setScreen('courseHome');
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        {content}
        <footer className="app-footer">Daily English Practice</footer>
      </div>
    </div>
  );
};

export default App;