import { LessonProgress, LessonProgressMap } from '../types/lessonTypes';

const STORAGE_KEY = 'dailyEnglishSelfTest.lessonProgress';

const getSafeStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const emptyProgress = (): LessonProgress => {
  const timestamp = new Date().toISOString();
  return {
    startedAt: timestamp,
    updatedAt: timestamp,
    completedSections: [],
    difficultWords: [],
    writtenAnswers: {},
    speakingCompleted: [],
    teacherNotes: '',
    parentReview: '',
  };
};

export const loadAllLessonProgress = (): LessonProgressMap => {
  const storage = getSafeStorage();
  if (!storage) {
    return {};
  }

  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {};
  }

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as LessonProgressMap;
    }
  } catch {
    return {};
  }

  return {};
};

export const saveAllLessonProgress = (progress: LessonProgressMap): void => {
  const storage = getSafeStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota errors.
  }
};

export const getLessonProgress = (lessonId: string): LessonProgress => {
  const all = loadAllLessonProgress();
  return all[lessonId] ?? emptyProgress();
};

export const updateLessonProgress = (
  lessonId: string,
  updater: (current: LessonProgress) => LessonProgress,
): LessonProgress => {
  const all = loadAllLessonProgress();
  const current = all[lessonId] ?? emptyProgress();
  const next: LessonProgress = {
    ...updater(current),
    updatedAt: new Date().toISOString(),
  };
  all[lessonId] = next;
  saveAllLessonProgress(all);
  return next;
};

export const markSectionComplete = (lessonId: string, sectionId: string): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => {
    if (current.completedSections.includes(sectionId)) {
      return current;
    }
    return {
      ...current,
      completedSections: [...current.completedSections, sectionId],
    };
  });
};

export const toggleDifficultWord = (lessonId: string, word: string): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => {
    const exists = current.difficultWords.includes(word);
    return {
      ...current,
      difficultWords: exists
        ? current.difficultWords.filter((entry) => entry !== word)
        : [...current.difficultWords, word],
    };
  });
};

export const saveWrittenAnswer = (
  lessonId: string,
  key: string,
  answer: string,
): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => ({
    ...current,
    writtenAnswers: { ...current.writtenAnswers, [key]: answer },
  }));
};

export const markSpeakingItemDone = (
  lessonId: string,
  itemId: string,
): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => {
    if (current.speakingCompleted.includes(itemId)) {
      return current;
    }
    return {
      ...current,
      speakingCompleted: [...current.speakingCompleted, itemId],
    };
  });
};

export const saveTeacherNotes = (lessonId: string, notes: string): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => ({ ...current, teacherNotes: notes }));
};

export const saveParentReview = (lessonId: string, review: string): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => ({ ...current, parentReview: review }));
};

export const markLessonCompleted = (lessonId: string): LessonProgress => {
  return updateLessonProgress(lessonId, (current) => ({
    ...current,
    completedAt: new Date().toISOString(),
  }));
};
