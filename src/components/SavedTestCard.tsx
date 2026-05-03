import { DailyTestRecord } from '../types/appTypes';
import { formatDateLabel } from '../utils/dateUtils';
import Button from './Button';

interface SavedTestCardProps {
  test: DailyTestRecord;
  completedCount: number;
  totalCount: number;
  onOpen: () => void;
  onDelete: () => void;
}

const SavedTestCard = ({ test, completedCount, totalCount, onOpen, onDelete }: SavedTestCardProps) => {
  return (
    <article className="card saved-card">
      <div className="saved-meta">
        <div>
          <p className="eyebrow">{test.status === 'completed' ? 'Completed Test' : 'Unfinished Test'}</p>
          <h3>{formatDateLabel(test.date)}</h3>
        </div>
        <span className="status-pill">{completedCount}/{totalCount}</span>
      </div>
      <p>
        {test.studentName || 'Unnamed student'}
        {test.studentClass ? ` • ${test.studentClass}` : ''}
      </p>
      <div className="footer-nav">
        <Button fullWidth onClick={onOpen} variant="secondary">
          View Saved Answers
        </Button>
        <Button fullWidth onClick={onDelete} variant="secondary">
          Delete
        </Button>
      </div>
    </article>
  );
};

export default SavedTestCard;