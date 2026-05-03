import { Course } from '../../types/lessonTypes';

const lesson1: Course['lessons'][number] = {
  id: 'sst-lesson-001',
  title: {
    en: 'What is Social Science?',
    pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਕੀ ਹੈ?',
  },
  unit: 'Starter Lessons',
  level: 'Beginner',
  estimatedMinutes: '25-35',
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: { en: 'Welcome', pa: 'ਜੀ ਆਇਆਂ ਨੂੰ' },
      body: {
        en: 'Welcome! Today you will learn what Social Science means. Take your time. Read out loud when you can.',
        pa: 'ਅੱਜ ਤੁਸੀਂ ਸਿੱਖੋਗੇ ਕਿ ਸੋਸ਼ਲ ਸਾਇੰਸ ਕੀ ਹੁੰਦੀ ਹੈ। ਆਰਾਮ ਨਾਲ ਪੜ੍ਹੋ। ਜਦੋਂ ਹੋ ਸਕੇ ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਪੜ੍ਹੋ।',
      },
      goals: [
        { en: 'Understand what Social Science means.', pa: 'ਸਮਝੋ ਕਿ ਸੋਸ਼ਲ ਸਾਇੰਸ ਕੀ ਹੈ।' },
        { en: 'Learn the three parts: Geography, History, Civics.', pa: 'ਤਿੰਨ ਹਿੱਸੇ ਸਿੱਖੋ: ਭੂਗੋਲ, ਇਤਿਹਾਸ, ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ।' },
        { en: 'Practice important new words.', pa: 'ਨਵੇਂ ਸ਼ਬਦਾਂ ਦੀ ਅਭਿਆਸ ਕਰੋ।' },
        { en: 'Read a short passage.', pa: 'ਇੱਕ ਛੋਟਾ ਪੈਰਾ ਪੜ੍ਹੋ।' },
        { en: 'Answer simple questions out loud.', pa: 'ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।' },
      ],
    },
    {
      id: 'flashcards',
      type: 'flashcards',
      title: { en: 'Key Words', pa: 'ਮੁੱਖ ਸ਼ਬਦ' },
      cards: [
        { term: 'Social Science', definition: { en: 'The study of people and society.', pa: 'ਲੋਕਾਂ ਅਤੇ ਸਮਾਜ ਦਾ ਅਧਿਐਨ।' } },
        { term: 'Geography', definition: { en: 'The study of the Earth, places, and the people who live there.', pa: 'ਧਰਤੀ, ਥਾਂਵਾਂ ਅਤੇ ਉੱਥੇ ਰਹਿੰਦੇ ਲੋਕਾਂ ਦਾ ਅਧਿਐਨ।' } },
        { term: 'History', definition: { en: 'The study of what happened in the past.', pa: 'ਪਿਛਲੇ ਸਮੇਂ ਵਿੱਚ ਹੋਈਆਂ ਘਟਨਾਵਾਂ ਦਾ ਅਧਿਐਨ।' } },
        { term: 'Civics', definition: { en: 'The study of how people live together in a country and follow rules.', pa: 'ਇਹ ਅਧਿਐਨ ਕਿ ਲੋਕ ਦੇਸ਼ ਵਿੱਚ ਮਿਲ-ਜੁਲ ਕੇ ਕਿਵੇਂ ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ।' } },
        { term: 'Resources', definition: { en: 'Things from nature or made by people that we use, like water, trees, and tools.', pa: 'ਉਹ ਚੀਜ਼ਾਂ ਜੋ ਅਸੀਂ ਵਰਤਦੇ ਹਾਂ — ਜਿਵੇਂ ਪਾਣੀ, ਰੁੱਖ, ਔਜ਼ਾਰ।' } },
        { term: 'Conservation', definition: { en: 'Taking care of resources so they last a long time.', pa: 'ਚੀਜ਼ਾਂ ਦੀ ਸੰਭਾਲ ਕਰਨੀ ਤਾਂ ਜੋ ਉਹ ਲੰਬਾ ਸਮਾਂ ਚੱਲਣ।' } },
        { term: 'Constitution', definition: { en: 'The most important set of rules for a country.', pa: 'ਦੇਸ਼ ਦੇ ਸਭ ਤੋਂ ਮੁੱਖ ਨਿਯਮ।' } },
        { term: 'Law', definition: { en: 'A rule made by the government that everyone must follow.', pa: 'ਸਰਕਾਰ ਵੱਲੋਂ ਬਣਾਇਆ ਨਿਯਮ ਜੋ ਹਰ ਕਿਸੇ ਨੂੰ ਮੰਨਣਾ ਪੈਂਦਾ ਹੈ।' } },
        { term: 'Secularism', definition: { en: 'When a country treats all religions equally.', pa: 'ਜਦੋਂ ਦੇਸ਼ ਸਾਰੇ ਧਰਮਾਂ ਨੂੰ ਬਰਾਬਰ ਮੰਨਦਾ ਹੈ।' } },
        { term: 'Rights', definition: { en: 'Things every person is allowed to have or do.', pa: 'ਉਹ ਚੀਜ਼ਾਂ ਜੋ ਹਰ ਵਿਅਕਤੀ ਨੂੰ ਮਿਲਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।' } },
        { term: 'Parliament', definition: { en: 'The group of people who make the laws of a country.', pa: 'ਉਹ ਲੋਕਾਂ ਦਾ ਸਮੂਹ ਜੋ ਦੇਸ਼ ਦੇ ਨਿਯਮ ਬਣਾਉਂਦਾ ਹੈ।' } },
        { term: 'Judiciary', definition: { en: 'The courts and judges who decide if laws were followed.', pa: 'ਅਦਾਲਤਾਂ ਅਤੇ ਜੱਜ ਜੋ ਫੈਸਲਾ ਕਰਦੇ ਹਨ ਕਿ ਨਿਯਮ ਮੰਨੇ ਗਏ ਜਾਂ ਨਹੀਂ।' } },
        { term: 'Disaster Management', definition: { en: 'A plan to keep people safe during big events like floods or earthquakes.', pa: 'ਹੜ੍ਹ ਜਾਂ ਭੂਚਾਲ ਵਰਗੀਆਂ ਘਟਨਾਵਾਂ ਵਿੱਚ ਲੋਕਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਦੀ ਯੋਜਨਾ।' } },
        { term: 'Independence', definition: { en: 'Being free to make your own choices, like a country being free.', pa: 'ਆਪਣੇ ਫੈਸਲੇ ਆਪ ਲੈਣ ਦੀ ਆਜ਼ਾਦੀ — ਜਿਵੇਂ ਦੇਸ਼ ਦੀ ਆਜ਼ਾਦੀ।' } },
      ],
    },
    {
      id: 'reading',
      type: 'reading',
      title: { en: 'Short Reading', pa: 'ਛੋਟਾ ਪਾਠ' },
      passage: {
        en:
          'Social Science is the study of people. It helps us understand how people live, where they live, and how they lived in the past. Social Science has three main parts. Geography is about the Earth and places. History is about the past. Civics is about how people live together and follow rules. When we learn Social Science, we learn about ourselves and our world.',
        pa:
          'ਸੋਸ਼ਲ ਸਾਇੰਸ ਲੋਕਾਂ ਦਾ ਅਧਿਐਨ ਹੈ। ਇਹ ਸਾਨੂੰ ਸਮਝਾਉਂਦੀ ਹੈ ਕਿ ਲੋਕ ਕਿਵੇਂ ਰਹਿੰਦੇ ਹਨ, ਕਿੱਥੇ ਰਹਿੰਦੇ ਹਨ, ਅਤੇ ਪਿਛਲੇ ਸਮੇਂ ਵਿੱਚ ਕਿਵੇਂ ਰਹਿੰਦੇ ਸਨ। ਇਸ ਦੇ ਤਿੰਨ ਮੁੱਖ ਹਿੱਸੇ ਹਨ। ਭੂਗੋਲ ਧਰਤੀ ਅਤੇ ਥਾਂਵਾਂ ਬਾਰੇ ਹੈ। ਇਤਿਹਾਸ ਪਿਛਲੇ ਸਮੇਂ ਬਾਰੇ ਹੈ। ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ ਇਸ ਬਾਰੇ ਹੈ ਕਿ ਲੋਕ ਮਿਲ-ਜੁਲ ਕੇ ਕਿਵੇਂ ਰਹਿੰਦੇ ਹਨ। ਸੋਸ਼ਲ ਸਾਇੰਸ ਪੜ੍ਹਨ ਨਾਲ ਅਸੀਂ ਆਪਣੇ ਆਪ ਅਤੇ ਆਪਣੀ ਦੁਨੀਆ ਬਾਰੇ ਸਿੱਖਦੇ ਹਾਂ।',
      },
    },
    {
      id: 'mcq',
      type: 'mcq',
      title: { en: 'Multiple Choice', pa: 'ਬਹੁ-ਚੋਣ ਸਵਾਲ' },
      retryMessage: {
        en: 'Try again. Read the sentence one more time.',
        pa: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਵਾਕ ਫਿਰ ਪੜ੍ਹੋ।',
      },
      questions: [
        {
          id: 'mcq-1',
          question: { en: 'Social Science is the study of...', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਕਿਸ ਦਾ ਅਧਿਐਨ ਹੈ?' },
          options: ['Plants', 'People and society', 'Stars', 'Numbers'],
          correctIndex: 1,
        },
        {
          id: 'mcq-2',
          question: { en: 'How many main parts does Social Science have?', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਦੇ ਕਿੰਨੇ ਮੁੱਖ ਹਿੱਸੇ ਹਨ?' },
          options: ['Two', 'Three', 'Four', 'Five'],
          correctIndex: 1,
        },
        {
          id: 'mcq-3',
          question: { en: 'Geography is about...', pa: 'ਭੂਗੋਲ ਕਿਸ ਬਾਰੇ ਹੈ?' },
          options: ['The past', 'The Earth and places', 'Numbers', 'Music'],
          correctIndex: 1,
        },
        {
          id: 'mcq-4',
          question: { en: 'History is about...', pa: 'ਇਤਿਹਾਸ ਕਿਸ ਬਾਰੇ ਹੈ?' },
          options: ['The future', 'Animals', 'The past', 'The weather'],
          correctIndex: 2,
        },
        {
          id: 'mcq-5',
          question: { en: 'Civics is about...', pa: 'ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ ਕਿਸ ਬਾਰੇ ਹੈ?' },
          options: ['Living together and following rules', 'Cooking', 'Painting', 'Sports'],
          correctIndex: 0,
        },
        {
          id: 'mcq-6',
          question: { en: 'A rule made by the government is called a...', pa: 'ਸਰਕਾਰ ਦੁਆਰਾ ਬਣਾਇਆ ਨਿਯਮ ਕੀ ਕਹਾਉਂਦਾ ਹੈ?' },
          options: ['Game', 'Law', 'Song', 'Story'],
          correctIndex: 1,
        },
        {
          id: 'mcq-7',
          question: { en: 'Conservation means...', pa: 'ਸੰਭਾਲ ਦਾ ਮਤਲਬ ਕੀ ਹੈ?' },
          options: ['Wasting things', 'Taking care of resources', 'Buying things', 'Hiding things'],
          correctIndex: 1,
        },
        {
          id: 'mcq-8',
          question: { en: 'The most important set of rules for a country is the...', pa: 'ਦੇਸ਼ ਦੇ ਸਭ ਤੋਂ ਮੁੱਖ ਨਿਯਮਾਂ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?' },
          options: ['Constitution', 'Newspaper', 'Map', 'Calendar'],
          correctIndex: 0,
        },
        {
          id: 'mcq-9',
          question: { en: 'Parliament is the group that...', pa: 'ਪਾਰਲੀਮੈਂਟ ਉਹ ਸਮੂਹ ਹੈ ਜੋ...' },
          options: ['Builds houses', 'Makes laws', 'Sells food', 'Drives buses'],
          correctIndex: 1,
        },
        {
          id: 'mcq-10',
          question: { en: 'Independence means being...', pa: 'ਆਜ਼ਾਦੀ ਦਾ ਮਤਲਬ ਹੈ...' },
          options: ['Free', 'Tired', 'Late', 'Hungry'],
          correctIndex: 0,
        },
      ],
    },
    {
      id: 'trueFalse',
      type: 'trueFalse',
      title: { en: 'True or False', pa: 'ਸਹੀ ਜਾਂ ਗਲਤ' },
      items: [
        { id: 'tf-1', statement: { en: 'Social Science is the study of people.', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਲੋਕਾਂ ਦਾ ਅਧਿਐਨ ਹੈ।' }, answer: true },
        { id: 'tf-2', statement: { en: 'History is about the future.', pa: 'ਇਤਿਹਾਸ ਭਵਿੱਖ ਬਾਰੇ ਹੈ।' }, answer: false },
        { id: 'tf-3', statement: { en: 'Geography studies the Earth.', pa: 'ਭੂਗੋਲ ਧਰਤੀ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।' }, answer: true },
        { id: 'tf-4', statement: { en: 'A law is something we can ignore.', pa: 'ਕਾਨੂੰਨ ਨੂੰ ਅਸੀਂ ਅਣਡਿੱਠ ਕਰ ਸਕਦੇ ਹਾਂ।' }, answer: false },
        { id: 'tf-5', statement: { en: 'Civics teaches us how to live together.', pa: 'ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ ਸਾਨੂੰ ਮਿਲ-ਜੁਲ ਕੇ ਰਹਿਣਾ ਸਿਖਾਉਂਦਾ ਹੈ।' }, answer: true },
        { id: 'tf-6', statement: { en: 'Water is a resource.', pa: 'ਪਾਣੀ ਇੱਕ ਸਰੋਤ ਹੈ।' }, answer: true },
      ],
    },
    {
      id: 'matching',
      type: 'matching',
      title: { en: 'Matching', pa: 'ਮਿਲਾਨ' },
      pairs: [
        { id: 'm-1', term: 'Geography', meaning: { en: 'Study of the Earth and places', pa: 'ਧਰਤੀ ਅਤੇ ਥਾਂਵਾਂ ਦਾ ਅਧਿਐਨ' } },
        { id: 'm-2', term: 'History', meaning: { en: 'Study of the past', pa: 'ਪਿਛਲੇ ਸਮੇਂ ਦਾ ਅਧਿਐਨ' } },
        { id: 'm-3', term: 'Civics', meaning: { en: 'How people live together and follow rules', pa: 'ਲੋਕ ਮਿਲ-ਜੁਲ ਕੇ ਕਿਵੇਂ ਰਹਿੰਦੇ ਹਨ' } },
        { id: 'm-4', term: 'Constitution', meaning: { en: 'The main rules of a country', pa: 'ਦੇਸ਼ ਦੇ ਮੁੱਖ ਨਿਯਮ' } },
        { id: 'm-5', term: 'Parliament', meaning: { en: 'The group that makes laws', pa: 'ਉਹ ਸਮੂਹ ਜੋ ਕਾਨੂੰਨ ਬਣਾਉਂਦਾ ਹੈ' } },
        { id: 'm-6', term: 'Independence', meaning: { en: 'Being free', pa: 'ਆਜ਼ਾਦ ਹੋਣਾ' } },
      ],
    },
    {
      id: 'fillBlanks',
      type: 'fillBlanks',
      title: { en: 'Fill in the Blanks', pa: 'ਖਾਲੀ ਥਾਂ ਭਰੋ' },
      wordBank: ['Geography', 'History', 'Civics', 'Constitution', 'Parliament', 'Independence'],
      items: [
        {
          id: 'fb-1',
          before: { en: '____________________ is the study of the Earth.', pa: '____________________ ਧਰਤੀ ਦਾ ਅਧਿਐਨ ਹੈ।' },
          after: { en: '', pa: '' },
          answer: 'Geography',
        },
        {
          id: 'fb-2',
          before: { en: '____________________ tells us about the past.', pa: '____________________ ਸਾਨੂੰ ਪਿਛਲੇ ਸਮੇਂ ਬਾਰੇ ਦੱਸਦੀ ਹੈ।' },
          after: { en: '', pa: '' },
          answer: 'History',
        },
        {
          id: 'fb-3',
          before: { en: '____________________ helps us live together as a society.', pa: '____________________ ਸਾਨੂੰ ਸਮਾਜ ਵਿੱਚ ਮਿਲ-ਜੁਲ ਕੇ ਰਹਿਣਾ ਸਿਖਾਉਂਦੀ ਹੈ।' },
          after: { en: '', pa: '' },
          answer: 'Civics',
        },
        {
          id: 'fb-4',
          before: { en: 'The ____________________ has the most important rules of our country.', pa: '____________________ ਵਿੱਚ ਦੇਸ਼ ਦੇ ਸਭ ਤੋਂ ਮੁੱਖ ਨਿਯਮ ਹਨ।' },
          after: { en: '', pa: '' },
          answer: 'Constitution',
        },
        {
          id: 'fb-5',
          before: { en: '____________________ makes the laws of our country.', pa: '____________________ ਸਾਡੇ ਦੇਸ਼ ਦੇ ਕਾਨੂੰਨ ਬਣਾਉਂਦੀ ਹੈ।' },
          after: { en: '', pa: '' },
          answer: 'Parliament',
        },
        {
          id: 'fb-6',
          before: { en: '____________________ means being free.', pa: '____________________ ਦਾ ਮਤਲਬ ਆਜ਼ਾਦ ਹੋਣਾ ਹੈ।' },
          after: { en: '', pa: '' },
          answer: 'Independence',
        },
      ],
    },
    {
      id: 'speaking',
      type: 'speaking',
      title: { en: 'Speaking Practice', pa: 'ਬੋਲਣ ਦੀ ਅਭਿਆਸ' },
      items: [
        {
          id: 'sp-1',
          question: { en: 'What is Social Science?', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਕੀ ਹੈ?' },
          frame: { en: 'Social Science is the study of ______.', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ______ ਦਾ ਅਧਿਐਨ ਹੈ।' },
        },
        {
          id: 'sp-2',
          question: { en: 'What are the three parts of Social Science?', pa: 'ਸੋਸ਼ਲ ਸਾਇੰਸ ਦੇ ਤਿੰਨ ਹਿੱਸੇ ਕੀ ਹਨ?' },
          frame: { en: 'The three parts are ______, ______, and ______.', pa: 'ਤਿੰਨ ਹਿੱਸੇ ______, ______, ਅਤੇ ______ ਹਨ।' },
        },
        {
          id: 'sp-3',
          question: { en: 'What is Geography?', pa: 'ਭੂਗੋਲ ਕੀ ਹੈ?' },
          frame: { en: 'Geography is the study of ______.', pa: 'ਭੂਗੋਲ ______ ਦਾ ਅਧਿਐਨ ਹੈ।' },
        },
        {
          id: 'sp-4',
          question: { en: 'What is History?', pa: 'ਇਤਿਹਾਸ ਕੀ ਹੈ?' },
          frame: { en: 'History is the study of ______.', pa: 'ਇਤਿਹਾਸ ______ ਦਾ ਅਧਿਐਨ ਹੈ।' },
        },
        {
          id: 'sp-5',
          question: { en: 'What is Civics?', pa: 'ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ ਕੀ ਹੈ?' },
          frame: { en: 'Civics is about ______.', pa: 'ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ ______ ਬਾਰੇ ਹੈ।' },
        },
      ],
    },
    {
      id: 'funActivity',
      type: 'funActivity',
      title: { en: 'Fun Activity', pa: 'ਮਜ਼ੇਦਾਰ ਕੰਮ' },
      instruction: {
        en: 'Teach one new word to your parent or a friend. Tell them what it means in your own words.',
        pa: 'ਆਪਣੇ ਮਾਤਾ-ਪਿਤਾ ਜਾਂ ਦੋਸਤ ਨੂੰ ਇੱਕ ਨਵਾਂ ਸ਼ਬਦ ਸਿਖਾਓ। ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਉਸ ਦਾ ਮਤਲਬ ਦੱਸੋ।',
      },
    },
    {
      id: 'reviewChecklist',
      type: 'reviewChecklist',
      title: { en: 'Review Checklist', pa: 'ਸਮੀਖਿਆ ਚੈੱਕਲਿਸਟ' },
    },
  ],
};

export const socialScienceCourse: Course = {
  id: 'class-8-social-science',
  title: { en: 'Class 8 Social Science', pa: 'ਜਮਾਤ 8 ਸੋਸ਼ਲ ਸਾਇੰਸ' },
  subtitle: { en: 'Punjabi-English Support', pa: 'ਪੰਜਾਬੀ-ਅੰਗਰੇਜ਼ੀ ਸਹਾਇਤਾ' },
  lessons: [lesson1],
};
