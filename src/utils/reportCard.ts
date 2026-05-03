import { Lesson, LessonProgress, LessonSection, SectionScore } from '../types/lessonTypes';

export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export interface GradeBand {
  letter: GradeLetter;
  labelEn: string;
  labelPa: string;
  messageEn: string;
  messagePa: string;
}

export const GRADED_SECTION_TYPES: LessonSection['type'][] = [
  'mcq',
  'trueFalse',
  'matching',
  'fillBlanks',
];

const GRADE_BANDS: GradeBand[] = [
  {
    letter: 'A',
    labelEn: 'Excellent',
    labelPa: 'ਸ਼ਾਨਦਾਰ',
    messageEn: 'Outstanding work! You really know this lesson.',
    messagePa: 'ਬਹੁਤ ਵਧੀਆ! ਤੁਸੀਂ ਇਹ ਪਾਠ ਚੰਗੀ ਤਰ੍ਹਾਂ ਜਾਣਦੇ ਹੋ।',
  },
  {
    letter: 'B',
    labelEn: 'Great',
    labelPa: 'ਬਹੁਤ ਵਧੀਆ',
    messageEn: 'Great job. A small review will make you even stronger.',
    messagePa: 'ਸ਼ਾਬਾਸ਼। ਥੋੜ੍ਹੀ ਜਿਹੀ ਦੁਹਰਾਈ ਨਾਲ ਤੁਸੀਂ ਹੋਰ ਪੱਕੇ ਹੋ ਜਾਓਗੇ।',
  },
  {
    letter: 'C',
    labelEn: 'Good',
    labelPa: 'ਠੀਕ',
    messageEn: 'Good effort. Try the harder parts one more time.',
    messagePa: 'ਚੰਗੀ ਮਿਹਨਤ। ਔਖੇ ਹਿੱਸੇ ਇੱਕ ਵਾਰ ਹੋਰ ਅਜ਼ਮਾਓ।',
  },
  {
    letter: 'D',
    labelEn: 'Keep practicing',
    labelPa: 'ਅਭਿਆਸ ਜਾਰੀ ਰੱਖੋ',
    messageEn: 'Keep going. Review the lesson and try the quizzes again.',
    messagePa: 'ਜਾਰੀ ਰੱਖੋ। ਪਾਠ ਦੁਹਰਾਓ ਅਤੇ ਕੁਇਜ਼ ਫਿਰ ਅਜ਼ਮਾਓ।',
  },
  {
    letter: 'E',
    labelEn: 'Needs more practice',
    labelPa: 'ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦਾ',
    messageEn: 'No worries. Read the lesson again, then retry the quizzes.',
    messagePa: 'ਚਿੰਤਾ ਨਾ ਕਰੋ। ਪਾਠ ਫਿਰ ਪੜ੍ਹੋ, ਫਿਰ ਕੁਇਜ਼ ਅਜ਼ਮਾਓ।',
  },
];

export const gradeFromPercent = (percent: number): GradeBand => {
  if (percent >= 90) return GRADE_BANDS[0];
  if (percent >= 75) return GRADE_BANDS[1];
  if (percent >= 60) return GRADE_BANDS[2];
  if (percent >= 40) return GRADE_BANDS[3];
  return GRADE_BANDS[4];
};

export const scorePercent = (score: SectionScore): number => {
  if (!score || score.total <= 0) return 0;
  return Math.round((score.firstTry / score.total) * 100);
};

export interface SectionReportRow {
  sectionId: string;
  type: LessonSection['type'];
  titleEn: string;
  titlePa: string;
  graded: boolean;
  completed: boolean;
  score?: SectionScore;
  percent?: number;
  grade?: GradeBand;
}

const sectionLabel = (
  section: LessonSection,
): { en: string; pa: string } => {
  // Most sections carry their own bilingual title.
  if ('title' in section && section.title) {
    return { en: section.title.en, pa: section.title.pa };
  }
  return { en: section.id, pa: '' };
};

export interface LessonReport {
  rows: SectionReportRow[];
  gradedCount: number;
  totalQuestions: number;
  totalFirstTry: number;
  overallPercent: number;
  overallGrade: GradeBand;
  sectionsCompleted: number;
  sectionsTotal: number;
}

export const buildLessonReport = (
  lesson: Lesson,
  progress: LessonProgress,
): LessonReport => {
  const rows: SectionReportRow[] = lesson.sections.map((section) => {
    const label = sectionLabel(section);
    const graded = (GRADED_SECTION_TYPES as string[]).includes(section.type);
    const score = progress.sectionScores?.[section.id];
    const completed = progress.completedSections.includes(section.id);

    const row: SectionReportRow = {
      sectionId: section.id,
      type: section.type,
      titleEn: label.en,
      titlePa: label.pa,
      graded,
      completed,
    };

    if (graded && score) {
      const percent = scorePercent(score);
      row.score = score;
      row.percent = percent;
      row.grade = gradeFromPercent(percent);
    }

    return row;
  });

  const gradedRows = rows.filter((row) => row.graded && row.score);
  const totalQuestions = gradedRows.reduce(
    (sum, row) => sum + (row.score?.total ?? 0),
    0,
  );
  const totalFirstTry = gradedRows.reduce(
    (sum, row) => sum + (row.score?.firstTry ?? 0),
    0,
  );
  const overallPercent =
    totalQuestions > 0 ? Math.round((totalFirstTry / totalQuestions) * 100) : 0;

  return {
    rows,
    gradedCount: gradedRows.length,
    totalQuestions,
    totalFirstTry,
    overallPercent,
    overallGrade: gradeFromPercent(overallPercent),
    sectionsCompleted: rows.filter((row) => row.completed).length,
    sectionsTotal: rows.length,
  };
};
