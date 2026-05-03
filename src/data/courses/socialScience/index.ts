import { Course } from '../../../types/lessonTypes';
import { lesson1 } from './lesson1';
import { lesson2 } from './lesson2';
import { lesson3 } from './lesson3';

export const socialScienceCourse: Course = {
  id: 'class-8-social-science',
  title: { en: 'Class 8 Social Science', pa: 'ਜਮਾਤ 8 ਸੋਸ਼ਲ ਸਾਇੰਸ' },
  subtitle: { en: 'Punjabi-English Support', pa: 'ਪੰਜਾਬੀ-ਅੰਗਰੇਜ਼ੀ ਸਹਾਇਤਾ' },
  lessons: [lesson1, lesson2, lesson3],
};
