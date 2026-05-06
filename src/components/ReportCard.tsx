import { Lesson, LessonProgress } from '../types/lessonTypes';
import { buildLessonReport } from '../utils/reportCard';

interface Props {
  lesson: Lesson;
  progress: LessonProgress;
  showHeader?: boolean;
}

const ReportCard = ({ lesson, progress, showHeader = true }: Props) => {
  const report = buildLessonReport(lesson, progress);
  const hasAnyScores = report.gradedCount > 0;

  return (
    <div className="report-card">
      {showHeader ? (
        <div>
          <h2 className="section-title">📊 Report Card</h2>
          <p className="punjabi muted">ਰਿਪੋਰਟ ਕਾਰਡ</p>
          <p className="muted">{lesson.title.en}</p>
        </div>
      ) : null}

      <div className="report-card-summary">
        <div className="report-card-grade-block">
          <p className="muted small">Overall Grade / ਕੁੱਲ ਗ੍ਰੇਡ</p>
          <p className="report-card-grade">
            {hasAnyScores ? report.overallGrade.letter : '—'}
          </p>
          <p>
            {hasAnyScores ? report.overallGrade.labelEn : 'No quizzes attempted yet'}
          </p>
          <p className="punjabi muted">
            {hasAnyScores ? report.overallGrade.labelPa : 'ਅਜੇ ਕੋਈ ਕੁਇਜ਼ ਨਹੀਂ ਕੀਤਾ'}
          </p>
        </div>
        <div className="report-card-stats">
          <p>
            <strong>Quiz score:</strong>{' '}
            {hasAnyScores
              ? `${report.totalFirstTry} / ${report.totalQuestions} (${report.overallPercent}%)`
              : '—'}
          </p>
          <p>
            <strong>Sections finished:</strong> {report.sectionsCompleted} /{' '}
            {report.sectionsTotal}
          </p>
          <p>
            <strong>Difficult words saved:</strong>{' '}
            {progress.difficultWords.length}
          </p>
        </div>
      </div>

      {hasAnyScores ? (
        <p className="report-card-message">
          {report.overallGrade.messageEn}
          <br />
          <span className="punjabi muted">{report.overallGrade.messagePa}</span>
        </p>
      ) : (
        <p className="muted">
          Finish the quiz sections to see your scores here. /{' '}
          <span className="punjabi">ਸਕੋਰ ਵੇਖਣ ਲਈ ਕੁਇਜ਼ ਪੂਰੇ ਕਰੋ।</span>
        </p>
      )}

      <div>
        <p className="label">Scores by domain / ਹਰ ਖੇਤਰ ਦੇ ਅੰਕ:</p>
        <table className="report-card-table">
          <caption className="sr-only">Section scores and grades for this test</caption>
          <thead>
            <tr>
              <th>Section</th>
              <th>Score</th>
              <th>%</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => {
              if (!row.graded) {
                return (
                  <tr key={row.sectionId} className="row-non-graded">
                    <td>
                      {row.titleEn}
                      <br />
                      <span className="punjabi muted">{row.titlePa}</span>
                    </td>
                    <td colSpan={3} className="muted">
                      {row.completed ? '✅ Completed' : '⭕ Not done'}
                    </td>
                  </tr>
                );
              }

              if (!row.score) {
                return (
                  <tr key={row.sectionId}>
                    <td>
                      {row.titleEn}
                      <br />
                      <span className="punjabi muted">{row.titlePa}</span>
                    </td>
                    <td colSpan={3} className="muted">
                      Not attempted yet
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={row.sectionId}>
                  <td>
                    {row.titleEn}
                    <br />
                    <span className="punjabi muted">{row.titlePa}</span>
                  </td>
                  <td>
                    {row.score.firstTry} / {row.score.total}
                  </td>
                  <td>{row.percent}%</td>
                  <td>
                    <span className={`grade-pill grade-${row.grade?.letter}`}>
                      {row.grade?.letter}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted small">
          Score = correct on the first try. / ਸਕੋਰ = ਪਹਿਲੀ ਕੋਸ਼ਿਸ਼ ਵਿੱਚ ਸਹੀ।
        </p>
      </div>

      <div className="report-card-legend">
        <p className="label small">Grade scale / ਗ੍ਰੇਡ ਪੈਮਾਨਾ:</p>
        <ul className="report-card-legend-list">
          <li>
            <span className="grade-pill grade-A">A</span> 90–100% Excellent / ਸ਼ਾਨਦਾਰ
          </li>
          <li>
            <span className="grade-pill grade-B">B</span> 75–89% Great / ਬਹੁਤ ਵਧੀਆ
          </li>
          <li>
            <span className="grade-pill grade-C">C</span> 60–74% Good / ਠੀਕ
          </li>
          <li>
            <span className="grade-pill grade-D">D</span> 40–59% Keep practicing
          </li>
          <li>
            <span className="grade-pill grade-E">E</span> 0–39% Needs more practice
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReportCard;
