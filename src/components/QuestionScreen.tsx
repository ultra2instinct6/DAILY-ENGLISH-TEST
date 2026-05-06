import { useEffect, useRef, useState } from 'react';
import { Question, QuestionResponse } from '../types/appTypes';
import Button from './Button';
import ProgressLine from './ProgressLine';
import AddressFieldsActivity from './questionActivities/AddressFieldsActivity';
import PhoneContactsActivity from './questionActivities/PhoneContactsActivity';
import MoodLikertActivity from './questionActivities/MoodLikertActivity';
import WeatherThreeDayActivity from './questionActivities/WeatherThreeDayActivity';
import ScenariosActivity from './questionActivities/ScenariosActivity';
import VocabMatchActivity from './questionActivities/VocabMatchActivity';
import YesNoChecklistActivity from './questionActivities/YesNoChecklistActivity';
import PhrasesReviewActivity from './questionActivities/PhrasesReviewActivity';
import MultiSayStepsActivity from './questionActivities/MultiSayStepsActivity';
import ClockQuizActivity from './questionActivities/ClockQuizActivity';
import CompoundSentencesActivity from './questionActivities/CompoundSentencesActivity';
import ColorMemoryGameActivity from './questionActivities/ColorMemoryGameActivity';
import ColorTapGameActivity from './questionActivities/ColorTapGameActivity';
import FoodLikertActivity from './questionActivities/FoodLikertActivity';
import InventoryLikertActivity from './questionActivities/InventoryLikertActivity';
import ActionWordsPlusSummaryActivity from './questionActivities/ActionWordsPlusSummaryActivity';
import PeopleJobsEducationActivity from './questionActivities/PeopleJobsEducationActivity';
import SchoolDayBlocksActivity from './questionActivities/SchoolDayBlocksActivity';
import FoodYesNoChecklistActivity from './questionActivities/FoodYesNoChecklistActivity';
import SeeRoomListActivity from './questionActivities/SeeRoomListActivity';
import MultiPromptTimerActivity from './questionActivities/MultiPromptTimerActivity';
import BilingualSpeakingTimerActivity from './questionActivities/BilingualSpeakingTimerActivity';
import MultiSentenceActivity from './questionActivities/MultiSentenceActivity';
import SignaturePracticeActivity from './questionActivities/SignaturePracticeActivity';
import FingerWrittenAnswersActivity from './questionActivities/FingerWrittenAnswersActivity';
import WordCounter from './questionActivities/WordCounter';
import { canMarkComplete } from './questionActivities/canMarkComplete';

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
      case 'question_answer': {
        const min = question.requiredWords ?? 0;
        return (
          <label className="label" htmlFor={`${question.id}-answer`}>
            Your answer{min ? ` (at least ${min} words)` : ''}
            <input
              aria-label="Student answer"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="input"
              id={`${question.id}-answer`}
              onChange={(event) => updateResponse({ studentAnswer: event.target.value })}
              placeholder="Write a clear, full sentence…"
              spellCheck={false}
              type="text"
              value={response.studentAnswer}
            />
            {min > 0 ? <WordCounter text={response.studentAnswer} min={min} /> : null}
          </label>
        );
      }
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
      case 'address_fields':
        return <AddressFieldsActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'phone_contacts':
        return <PhoneContactsActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'mood_likert':
        return <MoodLikertActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'weather_three_day':
        return <WeatherThreeDayActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'scenarios':
        return <ScenariosActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'vocab_match':
        return <VocabMatchActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'yesno_checklist':
        return <YesNoChecklistActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'phrases_review':
        return <PhrasesReviewActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'multi_say_steps':
        return <MultiSayStepsActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'clock_quiz':
        return <ClockQuizActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'compound_sentences':
        return <CompoundSentencesActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'color_memory_game':
        return <ColorMemoryGameActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'color_tap_game':
        return <ColorTapGameActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'food_likert':
        return <FoodLikertActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'inventory_likert':
        return <InventoryLikertActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'action_words_plus_summary':
        return <ActionWordsPlusSummaryActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'people_jobs_education':
        return <PeopleJobsEducationActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'school_day_blocks':
        return <SchoolDayBlocksActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'food_yesno_50':
        return <FoodYesNoChecklistActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'see_room_list':
        return <SeeRoomListActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'multi_prompt_timer':
        return <MultiPromptTimerActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'bilingual_speaking_timer':
        return <BilingualSpeakingTimerActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'multi_sentence':
        return <MultiSentenceActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'signature_practice':
        return <SignaturePracticeActivity question={question} response={response} updateResponse={updateResponse} />;
      case 'finger_written_answers':
        return <FingerWrittenAnswersActivity question={question} response={response} updateResponse={updateResponse} />;
      default:
        return null;
    }
  };

  const checkboxSymbol = response.completed ? '☑' : '☐';
  const skipDisabled = skipsRemaining <= 0 || response.completed || response.skipped;
  const gating = canMarkComplete(question, response);
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
        <div className="question-prompt-block">
          {question.promptPa ? (
            <p className="question-prompt-pa punjabi">
              <span aria-hidden="true">{checkboxSymbol}</span> {question.promptPa}
            </p>
          ) : null}
          <p className="question-prompt-en">
            {question.promptPa ? null : (
              <span aria-hidden="true">{checkboxSymbol} </span>
            )}
            {question.prompt}
          </p>
        </div>

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
          <Button disabled={response.completed || !gating.allowed} onClick={onMarkComplete} variant="primary">
            {completeLabel}
          </Button>
        </div>

        {!response.completed && !gating.allowed && gating.reason ? (
          <p className="muted gating-hint" role="status">
            🔒 {gating.reason}
          </p>
        ) : null}

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
