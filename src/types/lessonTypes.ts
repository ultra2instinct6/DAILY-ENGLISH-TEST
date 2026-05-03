export interface Bilingual {
  en: string;
  pa: string;
}

export type LessonSectionType =
  | 'intro'
  | 'flashcards'
  | 'reading'
  | 'mcq'
  | 'trueFalse'
  | 'matching'
  | 'fillBlanks'
  | 'speaking'
  | 'funActivity'
  | 'reviewChecklist';

export interface IntroSection {
  id: string;
  type: 'intro';
  title: Bilingual;
  body: Bilingual;
  goals: Bilingual[];
}

export interface Flashcard {
  term: string;
  definition: Bilingual;
  example?: string;
}

export interface FlashcardsSection {
  id: string;
  type: 'flashcards';
  title: Bilingual;
  cards: Flashcard[];
}

export interface ReadingSection {
  id: string;
  type: 'reading';
  title: Bilingual;
  passage: Bilingual;
}

export interface McqQuestion {
  id: string;
  question: Bilingual;
  options: string[];
  correctIndex: number;
  explanation?: Bilingual;
}

export interface McqSection {
  id: string;
  type: 'mcq';
  title: Bilingual;
  questions: McqQuestion[];
  retryMessage: Bilingual;
}

export interface TrueFalseItem {
  id: string;
  statement: Bilingual;
  answer: boolean;
  correction?: Bilingual;
}

export interface TrueFalseSection {
  id: string;
  type: 'trueFalse';
  title: Bilingual;
  items: TrueFalseItem[];
}

export interface MatchingPair {
  id: string;
  term: string;
  meaning: Bilingual;
}

export interface MatchingSection {
  id: string;
  type: 'matching';
  title: Bilingual;
  pairs: MatchingPair[];
}

export interface FillBlankItem {
  id: string;
  before: Bilingual;
  after: Bilingual;
  answer: string;
}

export interface FillBlanksSection {
  id: string;
  type: 'fillBlanks';
  title: Bilingual;
  wordBank: string[];
  items: FillBlankItem[];
}

export interface SpeakingItem {
  id: string;
  question: Bilingual;
  frame: Bilingual;
}

export interface SpeakingSection {
  id: string;
  type: 'speaking';
  title: Bilingual;
  items: SpeakingItem[];
}

export interface FunActivityItem {
  title?: Bilingual;
  instruction: Bilingual;
  example?: Bilingual;
  punjabiHelp?: Bilingual;
}

export interface FunActivitySection {
  id: string;
  type: 'funActivity';
  title: Bilingual;
  instruction: Bilingual;
  activities?: FunActivityItem[];
}

export interface ReviewChecklistSection {
  id: string;
  type: 'reviewChecklist';
  title: Bilingual;
}

export type LessonSection =
  | IntroSection
  | FlashcardsSection
  | ReadingSection
  | McqSection
  | TrueFalseSection
  | MatchingSection
  | FillBlanksSection
  | SpeakingSection
  | FunActivitySection
  | ReviewChecklistSection;

export interface Lesson {
  id: string;
  title: Bilingual;
  unit: string;
  level: string;
  estimatedMinutes: string;
  sections: LessonSection[];
}

export interface Course {
  id: string;
  title: Bilingual;
  subtitle: Bilingual;
  lessons: Lesson[];
}

export interface LessonProgress {
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  completedSections: string[];
  difficultWords: string[];
  writtenAnswers: Record<string, string>;
  speakingCompleted: string[];
  teacherNotes: string;
  parentReview: string;
}

export type LessonProgressMap = Record<string, LessonProgress>;
