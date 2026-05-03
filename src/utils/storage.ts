import { DailyReview, DailyTest, DailyTestRecord, QuestionResponse } from '../types/appTypes';
import { getCurrentTimeString, getTodayDateString } from './dateUtils';

const STORAGE_KEY = 'dailyEnglishSelfTest.savedTests';
const LEGACY_STORAGE_KEY = 'daily-english-self-test-records';

type StoredTest = DailyTestRecord;

const defaultDailyReview = (): DailyReview => ({
  didWell: '',
  needsPractice: '',
  tomorrowPractice: '',
});

const getSafeStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const sortNewestFirst = (tests: StoredTest[]) => {
  return [...tests].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
};

const buildResponsesFromQuestionStates = (
  questionStates: DailyTestRecord['questionStates'] = {},
): DailyTest['responses'] => {
  return Object.entries(questionStates).reduce<DailyTest['responses']>((allResponses, [key, state]) => {
    const questionId = Number(key);

    if (Number.isNaN(questionId)) {
      return allResponses;
    }

    return {
      ...allResponses,
      [questionId]: {
        questionId,
        completed: state.completed,
        studentAnswer: state.answer,
        reviewNote: '',
        completedAt: state.completed ? new Date().toISOString() : undefined,
      },
    };
  }, {});
};

const buildQuestionStatesFromResponses = (
  responses: DailyTest['responses'] = {},
): DailyTestRecord['questionStates'] => {
  return Object.values(responses).reduce<DailyTestRecord['questionStates']>((allStates, response) => {
    return {
      ...allStates,
      [response.questionId]: {
        answer:
          response.studentAnswer ||
          (response.studentAnswers ? response.studentAnswers.join(', ') : ''),
        completed: response.completed,
      },
    };
  }, {});
};

const normalizeResponse = (response: QuestionResponse): QuestionResponse => {
  return {
    questionId: response.questionId,
    completed: response.completed,
    studentAnswer: response.studentAnswer ?? '',
    studentAnswers: response.studentAnswers,
    reviewNote: response.reviewNote ?? '',
    completedAt: response.completed
      ? response.completedAt ?? new Date().toISOString()
      : undefined,
    skipped: response.skipped ?? false,
  };
};

const normalizeStoredTest = (test: Partial<StoredTest>): StoredTest => {
  const timestamp = new Date().toISOString();
  const date = test.date ?? getTodayDateString();
  const responsesFromStates = buildResponsesFromQuestionStates(test.questionStates);
  const normalizedResponses = Object.values(test.responses ?? {}).reduce<DailyTest['responses']>(
    (allResponses, response) => ({
      ...allResponses,
      [response.questionId]: normalizeResponse(response),
    }),
    responsesFromStates,
  );
  const questionStates = {
    ...buildQuestionStatesFromResponses(normalizedResponses),
    ...(test.questionStates ?? {}),
  };
  const endTime = test.endTime;
  const completedAt = test.completedAt ?? (endTime ? timestamp : undefined);

  return {
    id: test.id ?? `${date}-${Date.now()}`,
    studentName: test.studentName ?? '',
    studentClass: test.studentClass ?? '',
    date,
    startTime: test.startTime ?? getCurrentTimeString(),
    endTime,
    responses: normalizedResponses,
    dailyReview: {
      ...defaultDailyReview(),
      ...(test.dailyReview ?? {}),
    },
    createdAt: test.createdAt ?? timestamp,
    updatedAt: test.updatedAt ?? timestamp,
    status: test.status ?? (endTime ? 'completed' : 'in_progress'),
    currentItemIndex: test.currentItemIndex ?? 0,
    startedAt: test.startedAt ?? test.startTime ?? timestamp,
    completedAt,
    questionStates,
    skipsRemaining: typeof test.skipsRemaining === 'number' ? test.skipsRemaining : 3,
  };
};

const toDailyTest = (test: StoredTest): DailyTest => {
  return {
    id: test.id,
    studentName: test.studentName,
    date: test.date,
    startTime: test.startTime,
    endTime: test.endTime,
    responses: test.responses,
    dailyReview: test.dailyReview,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
  };
};

const readStoredValue = () => {
  const storage = getSafeStorage();

  if (!storage) {
    return [];
  }

  let raw: string | null = null;

  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }
  }

  let legacyRaw: string | null = null;

  try {
    legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    return [];
  }

  if (!legacyRaw) {
    return [];
  }

  try {
    const parsed = JSON.parse(legacyRaw) as Record<string, StoredTest> | StoredTest[];

    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch {
    return [];
  }
};

const writeStoredTests = (tests: StoredTest[]) => {
  const storage = getSafeStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sortNewestFirst(tests)));
  } catch {
    return;
  }
};

const getStoredTests = (): StoredTest[] => {
  return sortNewestFirst(
    readStoredValue().map((test) => normalizeStoredTest(test as Partial<StoredTest>)),
  );
};

const saveStoredTest = (test: Partial<StoredTest>) => {
  const normalizedTest = normalizeStoredTest(test);
  const currentTests = getStoredTests();
  const nextTests = currentTests.filter((currentTest) => currentTest.id !== normalizedTest.id);

  writeStoredTests([normalizedTest, ...nextTests]);

  return normalizedTest;
};

const requireStoredTest = (testId: string) => {
  const test = getStoredTests().find((item) => item.id === testId);

  if (!test) {
    throw new Error(`Test not found: ${testId}`);
  }

  return test;
};

export const getSavedTests = (): DailyTest[] => {
  return getStoredTests().map(toDailyTest);
};

export const saveTest = (test: DailyTest): void => {
  saveStoredTest(test as Partial<StoredTest>);
};

export const getTestById = (id: string): DailyTest | undefined => {
  const test = getStoredTests().find((item) => item.id === id);

  return test ? toDailyTest(test) : undefined;
};

export const getTodayTest = (): DailyTest | undefined => {
  const today = getTodayDateString();
  const tests = getStoredTests().filter((test) => test.date === today);
  const unfinishedTest = tests.find((test) => !test.endTime);

  return unfinishedTest ? toDailyTest(unfinishedTest) : tests[0] ? toDailyTest(tests[0]) : undefined;
};

export const createNewDailyTest = (studentName: string): DailyTest => {
  const todayTest = getStoredTests().find(
    (test) => test.date === getTodayDateString() && !test.endTime,
  );

  if (todayTest) {
    return toDailyTest(todayTest);
  }

  const timestamp = new Date().toISOString();
  const test = saveStoredTest({
    id: `${getTodayDateString()}-${Date.now()}`,
    studentName,
    date: getTodayDateString(),
    startTime: getCurrentTimeString(),
    createdAt: timestamp,
    updatedAt: timestamp,
    responses: {},
    dailyReview: defaultDailyReview(),
    status: 'in_progress',
    currentItemIndex: 0,
    startedAt: timestamp,
    questionStates: {},
    studentClass: '',
  });

  return toDailyTest(test);
};

export const updateQuestionResponse = (
  testId: string,
  response: QuestionResponse,
): DailyTest => {
  const test = requireStoredTest(testId);
  const previousResponse = test.responses[response.questionId];
  const nextResponse = normalizeResponse({
    ...previousResponse,
    ...response,
    questionId: response.questionId,
    completedAt: response.completed
      ? response.completedAt ?? previousResponse?.completedAt ?? new Date().toISOString()
      : undefined,
  });
  const nextTest = saveStoredTest({
    ...test,
    responses: {
      ...test.responses,
      [response.questionId]: nextResponse,
    },
    questionStates: {
      ...test.questionStates,
      [response.questionId]: {
        answer:
          nextResponse.studentAnswer ||
          (nextResponse.studentAnswers ? nextResponse.studentAnswers.join(', ') : ''),
        completed: nextResponse.completed,
      },
    },
    updatedAt: new Date().toISOString(),
  });

  return toDailyTest(nextTest);
};

export const updateDailyReview = (
  testId: string,
  review: DailyTest['dailyReview'],
): DailyTest => {
  const test = requireStoredTest(testId);
  const nextTest = saveStoredTest({
    ...test,
    dailyReview: review,
    updatedAt: new Date().toISOString(),
  });

  return toDailyTest(nextTest);
};

export const markTestFinished = (testId: string): DailyTest => {
  const test = requireStoredTest(testId);
  const timestamp = new Date().toISOString();
  const nextTest = saveStoredTest({
    ...test,
    endTime: getCurrentTimeString(),
    updatedAt: timestamp,
    status: 'completed',
    completedAt: timestamp,
  });

  return toDailyTest(nextTest);
};

export const deleteTest = (testId: string): void => {
  writeStoredTests(getStoredTests().filter((test) => test.id !== testId));
};

export const loadAllTests = (): Record<string, DailyTestRecord> => {
  return getStoredTests().reduce<Record<string, DailyTestRecord>>((allTests, test) => {
    if (!allTests[test.date]) {
      allTests[test.date] = test;
    }

    return allTests;
  }, {});
};

export const saveAllTests = (tests: Record<string, DailyTestRecord>) => {
  writeStoredTests(Object.values(tests).map((test) => normalizeStoredTest(test)));
};

export const createEmptyTestRecord = (date: string): DailyTestRecord => {
  return normalizeStoredTest({
    id: `${date}-${Date.now()}`,
    date,
    studentName: '',
    studentClass: '',
    startTime: getCurrentTimeString(),
    responses: {},
    dailyReview: defaultDailyReview(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'in_progress',
    currentItemIndex: 0,
    startedAt: new Date().toISOString(),
    questionStates: {},
  });
};