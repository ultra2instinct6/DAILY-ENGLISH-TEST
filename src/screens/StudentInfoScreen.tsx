import { FormEvent, useState } from 'react';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

const STUDENT_INFO_DRAFT_KEY = 'dailyEnglishSelfTest.studentInfoDraft';

const getDraftStudentName = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(STUDENT_INFO_DRAFT_KEY) ?? '';
  } catch {
    return '';
  }
};

const saveDraftStudentName = (value: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STUDENT_INFO_DRAFT_KEY, value);
  } catch {
    return;
  }
};

const clearDraftStudentName = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(STUDENT_INFO_DRAFT_KEY);
  } catch {
    return;
  }
};

interface StudentInfoScreenProps {
  initialName: string;
  initialDate: string;
  initialStartTime: string;
  onBack: () => void;
  onStart: (studentName: string, date: string, startTime: string) => void;
}

const StudentInfoScreen = ({
  initialName,
  initialDate,
  initialStartTime,
  onBack,
  onStart,
}: StudentInfoScreenProps) => {
  const [studentName, setStudentName] = useState(() => initialName || getDraftStudentName());
  const [date] = useState(initialDate);
  const [startTime] = useState(initialStartTime);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      return;
    }
    clearDraftStudentName();
    onStart(trimmedName, date, startTime);
  };

  return (
    <div className="screen-stack">
      <AppHeader
        title="Who are you? 👋"
        subtitle="ਆਪਣਾ ਨਾਮ ਲਿਖੋ"
        onBack={onBack}
      />

      <form className="card form-stack" onSubmit={handleSubmit}>
        <p>Type your name to start. ਆਪਣਾ ਨਾਮ ਲਿਖ ਕੇ ਸ਼ੁਰੂ ਕਰੋ।</p>
        <label className="label" htmlFor="studentName">
          Name / ਨਾਮ
        </label>
        <input
          id="studentName"
          className="input"
          value={studentName}
          onChange={(event) => {
            const nextValue = event.target.value;
            setStudentName(nextValue);
            saveDraftStudentName(nextValue);
          }}
          placeholder="Type your name"
        />

        <label className="label" htmlFor="date">
          Date / ਤਾਰੀਖ
        </label>
        <input
          id="date"
          className="input"
          readOnly
          value={date}
        />

        <label className="label" htmlFor="startTime">
          Start Time / ਸ਼ੁਰੂ ਸਮਾਂ
        </label>
        <input
          id="startTime"
          className="input"
          readOnly
          value={startTime}
        />

        <Button fullWidth type="submit" variant="primary" disabled={studentName.trim().length === 0}>
          Start 🚀
        </Button>
      </form>
    </div>
  );
};

export default StudentInfoScreen;