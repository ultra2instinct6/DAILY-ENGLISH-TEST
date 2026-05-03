import { questions, sections } from '../data/questions';
import {
  DailyTestRecord,
  FlowItem,
  QuestionResponse,
  QuestionState,
} from '../types/appTypes';
import { buildFlowItems, getCompletedCount, getTotalCount } from '../utils/progressUtils';
import AppHeader from '../components/AppHeader';
import QuestionScreen from '../components/QuestionScreen';
import SectionIntro from '../components/SectionIntro';

interface TestFlowScreenProps {
  test: DailyTestRecord;
  onBackHome: () => void;
  onUpdateTest: (updater: (current: DailyTestRecord) => DailyTestRecord) => void;
  onComplete: () => void;
}

const flowItems: FlowItem[] = buildFlowItems(sections, questions);

const getQuestionState = (
  questionStates: Record<string, QuestionState>,
  questionId: number,
) => {
  return questionStates[questionId] ?? { answer: '', completed: false };
};

const getQuestionResponse = (test: DailyTestRecord, questionId: number): QuestionResponse => {
  const existingResponse = test.responses[questionId];
  const fallbackState = getQuestionState(test.questionStates, questionId);

  return existingResponse ?? {
    questionId,
    completed: fallbackState.completed,
    studentAnswer: fallbackState.answer,
    reviewNote: '',
  };
};

const TestFlowScreen = ({
  test,
  onBackHome,
  onUpdateTest,
  onComplete,
}: TestFlowScreenProps) => {
  const item = flowItems[test.currentItemIndex];
  const completedCount = getCompletedCount(test);
  const totalCount = getTotalCount();
  const skipsRemaining = test.skipsRemaining ?? 3;

  if (!item) {
    onComplete();
    return null;
  }

  const goToIndex = (nextIndex: number) => {
    onUpdateTest((current) => ({
      ...current,
      currentItemIndex: Math.max(0, nextIndex),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleNext = () => {
    if (test.currentItemIndex >= flowItems.length - 1) {
      onComplete();
      return;
    }

    goToIndex(test.currentItemIndex + 1);
  };

  const handleBack = () => {
    if (test.currentItemIndex === 0) {
      onBackHome();
      return;
    }

    goToIndex(test.currentItemIndex - 1);
  };

  return (
    <div className="screen-stack">
      <AppHeader
        title="Today’s Test"
        subtitle="ਅੱਜ ਦਾ ਸੈਲਫ-ਟੈਸਟ"
        progressText={`Progress / ਤਰੱਕੀ: ${completedCount} / ${totalCount}`}
        onBack={handleBack}
      />

      {item.type === 'section' ? (
        <SectionIntro
          onBegin={handleNext}
          questionRange={`${questions.find((question) => `${question.sectionNumber}` === item.section.id)?.id ?? ''}–${questions.filter((question) => `${question.sectionNumber}` === item.section.id).slice(-1)[0]?.id ?? ''}`}
          sectionNumber={Number(item.section.id)}
          sectionTitleEnglish={item.section.titleEn}
          sectionTitlePunjabi={item.section.titlePa}
          icon={item.section.icon}
        />
      ) : (
        <QuestionScreen
          completedCount={completedCount}
          question={item.question}
          response={getQuestionResponse(test, item.question.id)}
          totalCount={totalCount}
          skipsRemaining={skipsRemaining}
          onUpdateResponse={(response) =>
            onUpdateTest((current) => ({
              ...current,
              responses: {
                ...current.responses,
                [item.question.id]: response,
              },
              questionStates: {
                ...current.questionStates,
                [item.question.id]: {
                  ...getQuestionState(current.questionStates, item.question.id),
                  answer: response.studentAnswer || response.studentAnswers?.join(' | ') || '',
                  completed: response.completed,
                },
              },
              updatedAt: new Date().toISOString(),
            }))
          }
          onMarkComplete={() =>
            onUpdateTest((current) => ({
              ...current,
              responses: {
                ...current.responses,
                [item.question.id]: {
                  ...getQuestionResponse(current, item.question.id),
                  completed: true,
                  skipped: false,
                  completedAt:
                    getQuestionResponse(current, item.question.id).completedAt ??
                    new Date().toISOString(),
                },
              },
              questionStates: {
                ...current.questionStates,
                [item.question.id]: {
                  ...getQuestionState(current.questionStates, item.question.id),
                  completed: true,
                },
              },
              updatedAt: new Date().toISOString(),
            }))
          }
          onPracticeAgain={() =>
            onUpdateTest((current) => ({
              ...current,
              responses: {
                ...current.responses,
                [item.question.id]: {
                  ...getQuestionResponse(current, item.question.id),
                  completed: false,
                  completedAt: undefined,
                },
              },
              questionStates: {
                ...current.questionStates,
                [item.question.id]: {
                  ...getQuestionState(current.questionStates, item.question.id),
                  completed: false,
                },
              },
              updatedAt: new Date().toISOString(),
            }))
          }
          onSkip={() => {
            const currentResponse = getQuestionResponse(test, item.question.id);
            if (
              (test.skipsRemaining ?? 3) <= 0 ||
              currentResponse.completed ||
              currentResponse.skipped
            ) {
              return;
            }

            onUpdateTest((current) => ({
              ...current,
              skipsRemaining: Math.max(0, (current.skipsRemaining ?? 3) - 1),
              responses: {
                ...current.responses,
                [item.question.id]: {
                  ...getQuestionResponse(current, item.question.id),
                  skipped: true,
                  completed: false,
                  completedAt: undefined,
                },
              },
              updatedAt: new Date().toISOString(),
            }));
            handleNext();
          }}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default TestFlowScreen;