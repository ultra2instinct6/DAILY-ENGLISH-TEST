export type QuestionType =
  | 'sentence'
  | 'memory'
  | 'three_sentence'
  | 'word_list'
  | 'question_answer'
  | 'timer_challenge'
  // Sub-activities used by existing data files
  | 'address_fields'
  | 'phone_contacts'
  | 'mood_likert'
  | 'weather_three_day'
  | 'scenarios'
  | 'vocab_match'
  | 'yesno_checklist'
  | 'phrases_review'
  | 'multi_say_steps'
  | 'clock_quiz'
  // Generic per-question multi-part Q&A (Punjabi-first, sentence frames, word counts)
  | 'multi_sentence'
  // New activities (Phase A–F)
  | 'compound_sentences'
  | 'color_memory_game'
  | 'color_tap_game'
  | 'food_likert'
  | 'inventory_likert'
  | 'action_words_plus_summary'
  | 'people_jobs_education'
  | 'school_day_blocks'
  | 'food_yesno_50'
  | 'see_room_list'
  | 'multi_prompt_timer'
  | 'bilingual_speaking_timer'
  | 'signature_practice'
  | 'finger_written_answers';

export interface BilingualText {
  en: string;
  pa: string;
}

export interface ConjunctionOption extends BilingualText {}

export interface InventoryItem extends BilingualText {
  id: string;
}

export interface VegetableLikertItem extends BilingualText {
  id: string;
}

export interface FoodChecklistItem extends BilingualText {
  id: string;
  category?: string;
  categoryPa?: string;
}

export interface EducationLevel extends BilingualText {
  id: string;
}

export interface TimeBlock {
  id: string;
  labelEn: string;
  labelPa: string;
  wordMin: number;
}

export interface MultiTimerPrompt {
  id: string;
  promptEn: string;
  promptPa: string;
  seconds: number;
  /** Optional sentence starters shown as tappable hints to scaffold open speaking. */
  sentenceStarters?: BilingualText[];
}

export interface ColorMemoryConfig {
  winRounds: number;
  palette?: { id: string; en: string; pa: string; hex: string }[];
}

export interface ColorTapConfig {
  /** Number of correct taps in a row needed to win. */
  winStreak: number;
  palette?: { id: string; en: string; pa: string; hex: string; emoji?: string }[];
}

export interface BilingualTimerConfig {
  punjabiSeconds: number;
  englishSeconds: number;
}

export interface FingerPrompt {
  id: string;
  questionEn: string;
  questionPa: string;
  /** Optional sentence frame shown as a hint, e.g. `I am ___ years old.` */
  frame?: string;
  /** Optional format hint shown as a hint, e.g. `DD/MM/YYYY`. */
  formatHint?: string;
}

export interface MultiSentencePart {
  id: string;
  questionEn: string;
  questionPa: string;
  frame?: string;
  requiredWords?: number;
  inputType?: 'text' | 'date_dmy';
  hintEn?: string;
  hintPa?: string;
  /** When inputType === 'date_dmy', show this offset's date (in days) as the example. e.g. -1 = yesterday */
  exampleDateOffsetDays?: number;
}

export interface Question {
  id: number;
  sectionNumber: number;
  sectionTitleEnglish: string;
  sectionTitlePunjabi: string;
  prompt: string;
  /** Optional Punjabi version of the prompt — when present, displayed first/large with English smaller below. */
  promptPa?: string;
  /** Default minimum words for free-text answers in this question (when no per-part override is given). 5–10 word range expected. */
  requiredWords?: number;
  answerFrame?: string;
  helpText: string;
  type: QuestionType;
  multiSentenceParts?: MultiSentencePart[];
  inputLabels?: string[];
  exampleWords?: string[];
  timerSeconds?: number;
  // Loose props consumed by existing activity components — kept permissive
  // (`any[]`) to avoid touching pre-existing components/data shapes that
  // are outside the scope of the current change.
  safetyStatements?: any[];
  scenarios?: any[];
  phrases?: any[];
  sayingSteps?: any[];
  clockRounds?: number;
  likertOptions?: any[];
  addressFields?: any[];
  phoneContacts?: any[];
  weatherOptions?: any[];
  excitementOptions?: any[];
  vocabPairs?: any[];
  vocabRoundSize?: number;
  // New activity configs
  clauseFrames?: string[];
  conjunctions?: ConjunctionOption[];
  wordCountMin?: number;
  wordCountMax?: number;
  truthReminder?: BilingualText;
  summaryWordMin?: number;
  colorMemoryConfig?: ColorMemoryConfig;
  colorTapConfig?: ColorTapConfig;
  vegetableLikert?: VegetableLikertItem[];
  inventoryLikert?: InventoryItem[];
  educationLevels?: EducationLevel[];
  timeBlocks?: TimeBlock[];
  foodChecklist?: FoodChecklistItem[];
  seeListCount?: number;
  multiTimerPrompts?: MultiTimerPrompt[];
  bilingualTimer?: BilingualTimerConfig;
  feedbackLikert?: boolean;
  /** For `signature_practice`: how many finger-drawn signatures the student must save. Defaults to 10. */
  signatureCount?: number;
  /** For `finger_written_answers`: prompts the student answers by finger-writing once each. */
  fingerPrompts?: FingerPrompt[];
  /** Optional sentence starters shown as hints to scaffold open speaking. */
  sentenceStarters?: BilingualText[];
  /** Optional verb chips for `three_sentence` past/future practice (Q37/Q38). */
  verbFrames?: BilingualText[];
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

export interface StudentProfile {
  firstName: string;
  lastName: string;
  height: string;
  weight: string;
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  nationality: string;
}

export interface DailyTest {
  id: string;
  studentName: string;
  studentProfile?: StudentProfile;
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
  | 'savedTestDetail'
  | 'courseHome'
  | 'lessonHome'
  | 'lessonSection';

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

export type ScreenName = AppScreen | 'speakingRules' | 'commonMistakes';

export type FlowItem =
  | { type: 'section'; section: SectionDefinition }
  | { type: 'question'; question: Question };