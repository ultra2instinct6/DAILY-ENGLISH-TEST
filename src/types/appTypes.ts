export type QuestionType =
  | 'sentence'
  | 'memory'
  | 'three_sentence'
  | 'word_list'
  | 'question_answer'
  | 'timer_challenge';

export interface Question {
  id: number;
  sectionNumber: number;
  sectionTitleEnglish: string;
  sectionTitlePunjabi: string;
  prompt: string;
  answerFrame?: string;
  helpText: string;
  type: QuestionType;
  inputLabels?: string[];
  exampleWords?: string[];
}

export interface QuestionResponse {
  questionId: number;
  completed: boolean;
  studentAnswer: string;
  studentAnswers?: string[];
  reviewNote: string;
  completedAt?: string;
  skipped?: boolean;
}

export interface DailyReview {
  didWell: string;
  needsPractice: string;
  tomorrowPractice: string;
}

export type QuestionResponseMap = Record<number, QuestionResponse>;

export interface DailyTest {
  id: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime?: string;
  responses: QuestionResponseMap;
  dailyReview: DailyReview;
  createdAt: string;
  updatedAt: string;
}

export type AppScreen =
  | 'home'
  | 'studentInfo'
  | 'rules'
  | 'speakingRule'
  | 'testFlow'
  | 'dailyReview'
  | 'completion'
  | 'savedTests'
  | 'savedTestDetail';

export type TestStatus = 'in_progress' | 'completed';

export interface SectionDefinition {
  id: string;
  titleEn: string;
  titlePa: string;
  descriptionEn: string;
  descriptionPa: string;
  icon?: string;
}

export interface QuestionState {
  answer: string;
  completed: boolean;
}

export interface DailyTestRecord extends DailyTest {
  studentClass: string;
  status: TestStatus;
  currentItemIndex: number;
  startedAt: string;
  completedAt?: string;
  questionStates: Record<string, QuestionState>;
  skipsRemaining: number;
}

export type ScreenName = AppScreen | 'speakingRules';

export type FlowItem =
  | { type: 'section'; section: SectionDefinition }
  | { type: 'question'; question: Question };