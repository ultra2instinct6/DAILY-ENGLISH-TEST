import { useEffect, useRef, useState } from 'react';
import { Question, QuestionResponse } from '../types/appTypes';
import Button from './Button';
import ProgressLine from './ProgressLine';

interface QuestionScreenProps {
  question: Question;
  response: QuestionResponse;
  onUpdateResponse: (response: QuestionResponse) => void;
  onMarkComplete: () => void;
  onPracticeAgain: () => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  skipsRemaining: number;
  completedCount: number;
  totalCount: number;
}

const QuestionScreen = ({
  question,
  response,
  onUpdateResponse,
  onMarkComplete,
  onPracticeAgain,
  onNext,
  onBack,
  onSkip,
  skipsRemaining,
  completedCount,
  totalCount,
}: QuestionScreenProps) => {
  const initialTimerSeconds = question.timerSeconds ?? 30;
  const [timerSeconds, setTimerSeconds] = useState(initialTimerSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [showSavedCue, setShowSavedCue] = useState(false);
  const wasCompletedRef = useRef(response.completed);

  useEffect(() => {
    if (!timerRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimerSeconds((currentValue) => {
        if (currentValue <= 1) {
          setTimerRunning(false);
          setTimerFinished(true);
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    setTimerSeconds(initialTimerSeconds);
    setTimerRunning(false);
    setTimerFinished(false);
    setShowSavedCue(false);
    wasCompletedRef.current = response.completed;
    // We intentionally only reset on question change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (response.completed && !wasCompletedRef.current) {
      setShowSavedCue(true);
      const timeoutId = window.setTimeout(() => setShowSavedCue(false), 1500);
      wasCompletedRef.current = true;
      return () => window.clearTimeout(timeoutId);
    }

    if (!response.completed) {
      wasCompletedRef.current = false;
    }

    return undefined;
  }, [response.completed]);

  const updateResponse = (partial: Partial<QuestionResponse>) => {
    onUpdateResponse({
      ...response,
      ...partial,
    });
  };

  const updateAnswerList = (index: number, value: string) => {
    const nextAnswers = [...(response.studentAnswers ?? [])];
    nextAnswers[index] = value;

    updateResponse({
      studentAnswers: nextAnswers,
      studentAnswer: nextAnswers.filter(Boolean).join(' | '),
    });
  };

  const startTimer = () => {
    setTimerSeconds(initialTimerSeconds);
    setTimerRunning(true);
    setTimerFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMultiInputs = (count: number, labels: string[]) => {
    return (
      <div className="stack-gap-md">
        {Array.from({ length: count }).map((_, index) => (
          <div className="input-row" key={`${question.id}-${index}`}>
            <label className="label input-row-label" htmlFor={`${question.id}-${index}`}>
              {index + 1}. {labels[index]}
            </label>
            <input
              aria-label={`${labels[index]} answer ${index + 1}`}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="input input-row-field"
              id={`${question.id}-${index}`}
              onChange={(event) => updateAnswerList(index, event.target.value)}
              spellCheck={false}
              type="text"
              value={response.studentAnswers?.[index] ?? ''}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderWordListInputs = () => {
    return (
      <div className="stack-gap-md">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="input-row" key={`${question.id}-word-${index}`}>
            <label className="label input-row-label" htmlFor={`${question.id}-word-${index}`}>
              {index + 1}.
            </label>
            <input
              aria-label={`Word list answer ${index + 1}`}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="input input-row-field"
              id={`${question.id}-word-${index}`}
              onChange={(event) => updateAnswerList(index, event.target.value)}
              spellCheck={false}
              type="text"
              value={response.studentAnswers?.[index] ?? ''}
            />
          </div>
        ))}
      </div>
    );
  };

  const isMemory = question.type === 'memory';

  const renderStudentAnswer = () => {
    switch (question.type) {
      case 'memory':
        return (
          <div className="say-out-loud-card" aria-live="polite">
            <p className="say-out-loud-badge">🗣️ Say it out loud</p>
            <p className="punjabi muted">ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਬੋਲੋ</p>
          </div>
        );
      case 'sentence':
      case 'question_answer':
        return (
          <label className="label" htmlFor={`${question.id}-answer`}>
            Student Answer
            <input
              aria-label="Student answer"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="input"
              id={`${question.id}-answer`}
              onChange={(event) => updateResponse({ studentAnswer: event.target.value })}
              spellCheck={false}
              type="text"
              value={response.studentAnswer}
            />
          </label>
        );
      case 'three_sentence':
        return (
          <fieldset className="input-group">
            <legend className="label">Student Answer</legend>
            {renderMultiInputs(3, question.inputLabels ?? ['I am', 'I am', 'I am'])}
          </fieldset>
        );
      case 'word_list':
        return (
          <fieldset className="input-group">
            <legend className="label">Student Answer</legend>
            {renderWordListInputs()}
          </fieldset>
        );
      case 'timer_challenge':
        return (
          <div className="stack-gap-md timer-challenge">
            <div
              aria-live="polite"
              className={`timer-display${timerRunning ? ' timer-display-running' : ''}${timerFinished ? ' timer-display-finished' : ''}`}
              role="timer"
            >
              {formatTime(timerSeconds)}
            </div>
            <Button disabled={timerRunning} onClick={startTimer} variant="secondary">
              {timerFinished
                ? `⏱️ Restart ${initialTimerSeconds}-Second Timer`
                : `⏱️ Start ${initialTimerSeconds}-Second Timer`}
            </Button>
            <p aria-live="polite" className="muted">
              {timerRunning
                ? 'Keep speaking…'
                : timerFinished
                  ? 'Time complete. ✅'
                  : `Press start, then speak for ${initialTimerSeconds} seconds.`}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const checkboxSymbol = response.completed ? '☑' : '☐';
  const skipDisabled = skipsRemaining <= 0 || response.completed || response.skipped;
  const completeLabel = response.completed
    ? 'Done ✅'
    : isMemory
      ? '✅ I said it'
      : 'Mark Done ✅';

  return (
    <section className="question-card">
      <div className="question-topline">
        <p className="question-topline-main">
          Section {question.sectionNumber} · Question {question.id} of {totalCount}
        </p>
      </div>

      <ProgressLine completed={completedCount} total={totalCount} />

      <div className="card question-main-card">
        <p className="question-checkline">
          <span aria-hidden="true">{checkboxSymbol}</span> {question.prompt}
        </p>

        {question.answerFrame ? (
          <div>
            <p className="label">Answer:</p>
            <p className="answer-frame">{question.answerFrame}</p>
          </div>
        ) : null}

        <div>
          <p className="label">Help / ਮਦਦ:</p>
          <p className="help-box help-box-bilingual">{question.helpText}</p>
        </div>

        {renderStudentAnswer()}

        {!isMemory ? (
          <label className="label" htmlFor={`${question.id}-review`}>
            My note <span className="label-optional">(optional / ਜੇ ਚਾਹੋ)</span>
            <textarea
              aria-label="My note"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="textarea textarea-note"
              id={`${question.id}-review`}
              onChange={(event) => updateResponse({ reviewNote: event.target.value })}
              placeholder="E.g., this one was hard / I want to try again."
              rows={3}
              spellCheck={false}
              value={response.reviewNote}
            />
          </label>
        ) : null}

        {response.skipped ? (
          <p className="status-pill skipped-pill">Skipped ⏭️ — you can come back to this</p>
        ) : null}

        <div className="question-actions-primary">
          <Button disabled={response.completed} onClick={onMarkComplete} variant="primary">
            {completeLabel}
          </Button>
        </div>

        {showSavedCue ? (
          <p className="saved-cue" role="status">✓ Saved!</p>
        ) : null}

        {response.completed ? (
          <button className="text-button undo-button" onClick={onPracticeAgain} type="button">
            ↩️ Undo (mark not done)
          </button>
        ) : null}

        <div className="question-actions-secondary">
          <Button
            disabled={skipDisabled}
            onClick={onSkip}
            variant="secondary"
          >
            {response.skipped
              ? '⏭️ Skipped'
              : skipsRemaining > 0
                ? `⏭️ Skip for now (${skipsRemaining} left)`
                : '⏭️ No skips left'}
          </Button>
          <Button
            disabled={!response.completed && !response.skipped}
            onClick={onNext}
            variant="secondary"
          >
            Next ➡️
          </Button>
        </div>

        {!response.completed && !response.skipped ? (
          <p className="muted next-hint" role="status">
            Mark Done ✅ or Skip ⏭️ to continue.
          </p>
        ) : null}

        <div className="question-actions-back">
          <Button onClick={onBack} variant="secondary">
            ⬅️ Back
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuestionScreen;
