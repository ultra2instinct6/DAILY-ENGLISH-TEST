import { questions } from '../data/questions';
import { DailyTest, FlowItem, Question, QuestionState, SectionDefinition } from '../types/appTypes';

export const buildFlowItems = (
  sections: SectionDefinition[],
  questions: Question[],
): FlowItem[] => {
  return sections.flatMap((section) => {
    const sectionQuestions = questions.filter(
      (question) => `${question.sectionNumber}` === section.id,
    );

    return [{ type: 'section' as const, section }, ...sectionQuestions.map((question) => ({ type: 'question' as const, question }))];
  });
};

export const getCompletedCount = (test: DailyTest) => {
  return Object.values(test.responses).filter((response) => response.completed).length;
};

export const getTotalCount = () => {
  return questions.length;
};

export const getSectionCompletedCount = (test: DailyTest, sectionNumber: number) => {
  return questions.filter(
    (question) =>
      question.sectionNumber === sectionNumber &&
      test.responses[question.id]?.completed,
  ).length;
};

export const isSectionComplete = (test: DailyTest, sectionNumber: number) => {
  const sectionTotal = questions.filter(
    (question) => question.sectionNumber === sectionNumber,
  ).length;

  return sectionTotal > 0 && getSectionCompletedCount(test, sectionNumber) === sectionTotal;
};

export const getCompletedQuestionCount = (
  questionStates: Record<string, QuestionState>,
  questions: Question[],
) => {
  return questions.filter((question) => questionStates[question.id]?.completed).length;
};

export const getQuestionNumber = (
  questions: Question[],
  questionId: number,
) => {
  return questions.findIndex((question) => question.id === questionId) + 1;
};

export const getCompletionPercent = (
  questionStates: Record<string, QuestionState>,
  questions: Question[],
) => {
  const completed = getCompletedQuestionCount(questionStates, questions);

  return Math.round((completed / questions.length) * 100);
};