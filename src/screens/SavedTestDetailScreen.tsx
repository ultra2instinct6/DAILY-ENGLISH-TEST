import { useMemo, useState } from 'react';
import AppHeader from '../components/AppHeader';
import { DailyTestRecord } from '../types/appTypes';
import { formatDateLabel, formatTimeStamp } from '../utils/dateUtils';
import { getCompletedCount, getTotalCount } from '../utils/progressUtils';
import { questions, sections } from '../data/questions';
import Button from '../components/Button';

type FilterMode = 'all' | 'completed' | 'not-completed' | 'skipped';

interface SavedTestDetailScreenProps {
  onBackHome: () => void;
  test: DailyTestRecord;
  onBack: () => void;
}

const SavedTestDetailScreen = ({ test, onBack, onBackHome }: SavedTestDetailScreenProps) => {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const totalCount = getTotalCount();
  const completedCount = getCompletedCount(test);

  const filteredSections = useMemo(() => {
    return sections
      .map((section) => {
        const sectionQuestions = questions.filter(
          (question) => `${question.sectionNumber}` === section.id,
        ).filter((question) => {
          const response = test.responses[question.id];

          if (filterMode === 'completed') {
            return Boolean(response?.completed);
          }

          if (filterMode === 'not-completed') {
            return !response?.completed && !response?.skipped;
          }

          if (filterMode === 'skipped') {
            return Boolean(response?.skipped);
          }

          return true;
        });

        return {
          section,
          questions: sectionQuestions,
        };
      })
      .filter((item) => item.questions.length > 0);
  }, [filterMode, test.responses]);

  return (
    <div className="screen-stack">
      <AppHeader
        title="My Test Results"
        subtitle="ਸੇਵ ਕੀਤਾ ਟੈਸਟ"
        onBack={onBack}
      />

      <section className="card">
        <p><strong>Student name:</strong> {test.studentName || 'Not added'}</p>
        <p><strong>Date:</strong> {formatDateLabel(test.date)}</p>
        <p><strong>Start time:</strong> {test.startTime}</p>
        <p><strong>End time:</strong> {test.endTime || 'In progress'}</p>
        <p><strong>Done / ਪੂਰਾ ਕੀਤਾ:</strong> {completedCount} / {totalCount}</p>
        <div className="divider" />
      </section>

      <section className="card">
        <h2 className="section-title">How did I do today? 📝</h2>
        <p><strong>I was good at</strong></p>
        <p className="answer-box">{test.dailyReview.didWell || 'Not added'}</p>
        <p><strong>I need more practice with</strong></p>
        <p className="answer-box">{test.dailyReview.needsPractice || 'Not added'}</p>
        <p><strong>Tomorrow I will practice</strong></p>
        <p className="answer-box">{test.dailyReview.tomorrowPractice || 'Not added'}</p>
      </section>

      <section className="card">
        <h2 className="section-title">Show me</h2>
        <div className="filter-pills">
          <Button onClick={() => setFilterMode('all')} variant={filterMode === 'all' ? 'primary' : 'secondary'}>All 📋</Button>
          <Button onClick={() => setFilterMode('completed')} variant={filterMode === 'completed' ? 'primary' : 'secondary'}>Done ✅</Button>
          <Button onClick={() => setFilterMode('not-completed')} variant={filterMode === 'not-completed' ? 'primary' : 'secondary'}>Not Done ⭕</Button>
          <Button onClick={() => setFilterMode('skipped')} variant={filterMode === 'skipped' ? 'primary' : 'secondary'}>Skipped ⏭️</Button>
        </div>
      </section>

      {filteredSections.map(({ section, questions: sectionQuestions }) => {
        return (
          <section className="card" key={section.id}>
            <h2 className="section-title">{section.titleEn}</h2>
            <p className="punjabi muted">{section.titlePa}</p>

            {sectionQuestions.map((question) => {
              const response = test.responses[question.id];
              const filledAnswers = response?.studentAnswers?.filter((value) => value && value.trim().length > 0) ?? [];
              const answerText = filledAnswers.length
                ? filledAnswers.join(', ')
                : response?.studentAnswer?.trim() || 'No saved answer';
              const statusLabel = response?.skipped
                ? 'Skipped ⏭️'
                : response?.completed
                  ? 'Done ✅'
                  : 'Not done ⭕';

              return (
                <article className="card" key={question.id}>
                  <p><strong>Question number:</strong> {question.id}</p>
                  <p><strong>Prompt:</strong> {question.prompt}</p>
                  <p><strong>Punjabi help:</strong> {question.helpText}</p>
                  {question.answerFrame ? <p><strong>Answer frame:</strong> {question.answerFrame}</p> : null}
                  <p><strong>Student answer(s):</strong> {answerText}</p>
                  <p><strong>Review note:</strong> {response?.reviewNote || 'No review note'}</p>
                  <p><strong>Status:</strong> <span className="status-pill">{statusLabel}</span></p>
                  <p><strong>Completed time:</strong> {response?.completedAt ? formatTimeStamp(response.completedAt) : '—'}</p>
                </article>
              );
            })}
          </section>
        );
      })}

      <div className="footer-nav">
        <Button onClick={onBack} variant="secondary">Back to Saved 📚</Button>
        <Button onClick={onBackHome} variant="secondary">Back Home 🏠</Button>
      </div>
    </div>
  );
};

export default SavedTestDetailScreen;