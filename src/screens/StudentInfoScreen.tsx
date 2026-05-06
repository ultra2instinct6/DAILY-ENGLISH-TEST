import { FormEvent, useState } from 'react';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { StudentProfile } from '../types/appTypes';

const STUDENT_INFO_DRAFT_KEY = 'dailyEnglishSelfTest.studentInfoDraft';

const emptyProfile: StudentProfile = {
  firstName: '',
  lastName: '',
  height: '',
  weight: '',
  skinColor: '',
  hairColor: '',
  eyeColor: '',
  nationality: '',
};

const splitInitialName = (fullName: string): Partial<StudentProfile> => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return {};
  }
  const parts = trimmed.split(/\s+/);
  const firstName = parts.shift() ?? '';
  const lastName = parts.join(' ');
  return { firstName, lastName };
};

const readDraft = (): Partial<StudentProfile> => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STUDENT_INFO_DRAFT_KEY);
    if (!raw) {
      return {};
    }
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw) as Partial<StudentProfile>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    }
    // Legacy: a plain name string saved by the previous version.
    return splitInitialName(raw);
  } catch {
    return {};
  }
};

const saveDraft = (profile: StudentProfile) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STUDENT_INFO_DRAFT_KEY, JSON.stringify(profile));
  } catch {
    return;
  }
};

const clearDraft = () => {
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
  initialProfile?: StudentProfile;
  initialDate: string;
  initialStartTime: string;
  onBack: () => void;
  onStart: (
    studentName: string,
    date: string,
    startTime: string,
    profile: StudentProfile,
  ) => void;
}

const StudentInfoScreen = ({
  initialName,
  initialProfile,
  initialDate,
  initialStartTime,
  onBack,
  onStart,
}: StudentInfoScreenProps) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const draft = readDraft();
    const fromName = splitInitialName(initialName);
    return {
      ...emptyProfile,
      ...draft,
      ...(initialProfile ?? {}),
      firstName:
        initialProfile?.firstName || draft.firstName || fromName.firstName || '',
      lastName:
        initialProfile?.lastName || draft.lastName || fromName.lastName || '',
    };
  });
  const [date] = useState(initialDate);
  const [startTime] = useState(initialStartTime);

  const updateField = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setProfile((current) => {
      const next = { ...current, [key]: value };
      saveDraft(next);
      return next;
    });
  };

  const trimmedProfile: StudentProfile = {
    firstName: profile.firstName.trim(),
    lastName: profile.lastName.trim(),
    height: profile.height.trim(),
    weight: profile.weight.trim(),
    skinColor: profile.skinColor.trim(),
    hairColor: profile.hairColor.trim(),
    eyeColor: profile.eyeColor.trim(),
    nationality: profile.nationality.trim(),
  };
  const canSubmit = (Object.keys(trimmedProfile) as (keyof StudentProfile)[]).every(
    (key) => trimmedProfile[key].length > 0,
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    const fullName = `${trimmedProfile.firstName} ${trimmedProfile.lastName}`.trim();
    clearDraft();
    onStart(fullName, date, startTime, trimmedProfile);
  };

  return (
    <div className="screen-stack">
      <AppHeader
        title="Tell me about yourself 👋"
        subtitle="ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ"
        onBack={onBack}
      />

      <form className="card form-stack" onSubmit={handleSubmit}>
        <p>
          Fill in all your details to start. ਸਾਰੀ ਜਾਣਕਾਰੀ ਭਰੋ ਅਤੇ ਸ਼ੁਰੂ ਕਰੋ।
        </p>

        <label className="label" htmlFor="firstName">
          First name / ਪਹਿਲਾ ਨਾਮ
        </label>
        <input
          id="firstName"
          className="input"
          value={profile.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          placeholder="e.g. Simran"
        />

        <label className="label" htmlFor="lastName">
          Last name / ਉਪਨਾਮ
        </label>
        <input
          id="lastName"
          className="input"
          value={profile.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          placeholder="e.g. Kaur"
        />

        <label className="label" htmlFor="height">
          Height / ਕੱਦ
        </label>
        <input
          id="height"
          className="input"
          value={profile.height}
          onChange={(event) => updateField('height', event.target.value)}
          placeholder="e.g. 5 ft 4 in / 163 cm"
        />

        <label className="label" htmlFor="weight">
          Weight / ਭਾਰ
        </label>
        <input
          id="weight"
          className="input"
          value={profile.weight}
          onChange={(event) => updateField('weight', event.target.value)}
          placeholder="e.g. 55 kg"
        />

        <label className="label" htmlFor="skinColor">
          Skin color / ਚਮੜੀ ਦਾ ਰੰਗ
        </label>
        <input
          id="skinColor"
          className="input"
          value={profile.skinColor}
          onChange={(event) => updateField('skinColor', event.target.value)}
          placeholder="e.g. Fair, Wheatish, Brown"
        />

        <label className="label" htmlFor="hairColor">
          Hair color / ਵਾਲਾਂ ਦਾ ਰੰਗ
        </label>
        <input
          id="hairColor"
          className="input"
          value={profile.hairColor}
          onChange={(event) => updateField('hairColor', event.target.value)}
          placeholder="e.g. Black, Brown"
        />

        <label className="label" htmlFor="eyeColor">
          Eye color / ਅੱਖਾਂ ਦਾ ਰੰਗ
        </label>
        <input
          id="eyeColor"
          className="input"
          value={profile.eyeColor}
          onChange={(event) => updateField('eyeColor', event.target.value)}
          placeholder="e.g. Brown, Black"
        />

        <label className="label" htmlFor="nationality">
          Nationality / ਰਾਸ਼ਟਰੀਅਤਾ
        </label>
        <input
          id="nationality"
          className="input"
          value={profile.nationality}
          onChange={(event) => updateField('nationality', event.target.value)}
          placeholder="e.g. Indian"
        />

        <label className="label" htmlFor="date">
          Date / ਤਾਰੀਖ
        </label>
        <input id="date" className="input" readOnly value={date} />

        <label className="label" htmlFor="startTime">
          Start Time / ਸ਼ੁਰੂ ਸਮਾਂ
        </label>
        <input id="startTime" className="input" readOnly value={startTime} />

        <Button fullWidth type="submit" variant="primary" disabled={!canSubmit}>
          Start 🚀
        </Button>
      </form>
    </div>
  );
};

export default StudentInfoScreen;
