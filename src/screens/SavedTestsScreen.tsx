import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { DailyTestRecord } from '../types/appTypes';
import { getCompletedCount, getTotalCount } from '../utils/progressUtils';
import { formatDateLabel } from '../utils/dateUtils';

interface SavedTestsScreenProps {
  tests: DailyTestRecord[];
  onBack: () => void;
  onDeleteTest: (date: string) => void;
  onOpenTest: (date: string) => void;
}

const SavedTestsScreen = ({ tests, onBack, onDeleteTest, onOpenTest }: SavedTestsScreenProps) => {
  const totalCount = getTotalCount();

  const handleDelete = (date: string) => {
    const confirmed = window.confirm('Delete this saved test?');

    if (!confirmed) {
      return;
    }

    onDeleteTest(date);
  };

  return (
    <div className="screen-stack">
      <AppHeader title="My Saved Practice 📚" subtitle="ਸੇਵ ਕੀਤੇ ਟੈਸਟ ਵੇਖੋ" onBack={onBack} />

      {tests.length === 0 ? (
        <section className="card">
          <h2>No saved tests yet.</h2>
          <p>Finish a daily test and it will show up here. 💾</p>
        </section>
      ) : (
        tests.map((test) => (
          <section className="card" key={test.date}>
            <p><strong>Student name:</strong> {test.studentName || 'Not added'}</p>
            <p><strong>Date:</strong> {formatDateLabel(test.date)}</p>
            <p><strong>Done / ਪੂਰਾ ਕੀਤਾ:</strong> {getCompletedCount(test)} / {totalCount}</p>
            <p><strong>Start time:</strong> {test.startTime}</p>
            <p><strong>End time:</strong> {test.endTime || 'Not finished'}</p>
            <div className="footer-nav">
              <Button onClick={() => onOpenTest(test.date)} variant="primary">Open 📄</Button>
              <Button onClick={() => handleDelete(test.date)} variant="secondary">Delete 🗑️</Button>
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default SavedTestsScreen;