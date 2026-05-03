import { useMemo, useState } from 'react';
import CompletionScreen from './screens/CompletionScreen';
import DailyReviewScreen from './screens/DailyReviewScreen';
import HomeScreen from './screens/HomeScreen';
import RulesScreen from './screens/RulesScreen';
import SavedTestDetailScreen from './screens/SavedTestDetailScreen';
import SavedTestsScreen from './screens/SavedTestsScreen';
import SpeakingRuleScreen from './screens/SpeakingRuleScreen';
import StudentInfoScreen from './screens/StudentInfoScreen';
import TestFlowScreen from './screens/TestFlowScreen';
import { DailyTestRecord, QuestionResponse, ScreenName } from './types/appTypes';
import { getCurrentTimeString, getTodayDateString } from './utils/dateUtils';
import { deleteTest, loadAllTests, saveTest } from './utils/storage';
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
      onStartToday={startToday}
      onContinueLast={continueLast}
      onOpenSavedTests={() => setScreen('savedTests')}
    />
  );

  if (screen === 'studentInfo') {
    content = (
      <StudentInfoScreen
        initialDate={todayDate}
        initialName={todayInProgressTest?.studentName ?? ''}
        initialStartTime={todayInProgressTest?.startTime ?? getCurrentTimeString()}
        onBack={() => setScreen('home')}
        onStart={(studentName, date, startTime) => {
          const timestamp = new Date().toISOString();
          const nextTest: DailyTestRecord = {
            id: `${date}-${Date.now()}`,
            studentName,
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