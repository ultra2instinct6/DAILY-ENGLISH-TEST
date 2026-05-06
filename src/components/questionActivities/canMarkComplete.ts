import { Question, QuestionResponse } from '../../types/appTypes';
import { countWords } from '../../utils/wordCount';

export interface GatingResult {
  allowed: boolean;
  reason?: string;
}

const ok: GatingResult = { allowed: true };
const block = (reason: string): GatingResult => ({ allowed: false, reason });

export const canMarkComplete = (
  question: Question,
  response: QuestionResponse,
): GatingResult => {
  const answers = response.studentAnswers ?? [];

  switch (question.type) {
    case 'compound_sentences': {
      const min = question.wordCountMin ?? 6;
      // 3 rows × 3 slots: clauseA, conjunction, clauseB → indices [0,1,2,3,4,5,6,7,8]
      for (let row = 0; row < 3; row++) {
        const a = answers[row * 3] ?? '';
        const conj = answers[row * 3 + 1] ?? '';
        const b = answers[row * 3 + 2] ?? '';
        if (!conj) return block(`Row ${row + 1}: choose a connector word.`);
        const words = countWords(`${a} ${b}`);
        if (words < min) return block(`Row ${row + 1}: write at least ${min} words (you have ${words}).`);
      }
      return ok;
    }
    case 'color_memory_game': {
      const target = question.colorMemoryConfig?.winRounds ?? 5;
      const reached = Number(answers[0] ?? 0);
      if (reached < target) return block(`Reach round ${target} in the color game to advance.`);
      return ok;
    }
    case 'color_tap_game': {
      const target = question.colorTapConfig?.winStreak ?? 8;
      const reached = Number(answers[0] ?? 0);
      if (reached < target) return block(`Get ${target} colors in a row to advance (best: ${reached}).`);
      return ok;
    }
    case 'food_likert': {
      const items = question.vegetableLikert ?? [];
      for (let i = 0; i < items.length; i++) {
        if (!answers[i]) return block(`Rate "${items[i].en}" 1–10.`);
      }
      const favorite = answers[items.length] ?? '';
      if (!favorite.trim()) return block('Write your favorite food.');
      return ok;
    }
    case 'inventory_likert': {
      const items = question.inventoryLikert ?? [];
      for (let i = 0; i < items.length; i++) {
        if (!answers[i]) return block(`Pick an amount for "${items[i].en}".`);
      }
      return ok;
    }
    case 'action_words_plus_summary': {
      for (let i = 0; i < 5; i++) {
        if (!(answers[i] ?? '').trim()) return block(`Fill verb #${i + 1}.`);
      }
      const min = question.summaryWordMin ?? 8;
      const summary = answers[5] ?? '';
      const words = countWords(summary);
      if (words < min) return block(`Write a sentence about your day with at least ${min} words (you have ${words}).`);
      return ok;
    }
    case 'people_jobs_education': {
      // 5 jobs × 2 slots: name, education
      for (let i = 0; i < 5; i++) {
        const name = answers[i * 2] ?? '';
        const edu = answers[i * 2 + 1] ?? '';
        if (!name.trim()) return block(`Name person/job #${i + 1}.`);
        if (!edu) return block(`Pick an education level for person/job #${i + 1}.`);
      }
      return ok;
    }
    case 'school_day_blocks': {
      const blocks = question.timeBlocks ?? [];
      for (let i = 0; i < blocks.length; i++) {
        const min = blocks[i].wordMin;
        const text = answers[i] ?? '';
        const words = countWords(text);
        if (words < min) return block(`"${blocks[i].labelEn}" needs at least ${min} words (you have ${words}).`);
      }
      return ok;
    }
    case 'food_yesno_50': {
      const items = question.foodChecklist ?? [];
      for (let i = 0; i < items.length; i++) {
        const v = answers[i];
        if (v !== 'Yes' && v !== 'No') return block(`Answer Yes or No for all items (${i + 1} of ${items.length} done so far is missing).`);
      }
      return ok;
    }
    case 'see_room_list': {
      const total = question.seeListCount ?? 10;
      for (let i = 0; i < total; i++) {
        if (!(answers[i] ?? '').trim()) return block(`List all ${total} things you see (item #${i + 1} is empty).`);
      }
      return ok;
    }
    case 'multi_prompt_timer': {
      const prompts = question.multiTimerPrompts ?? [];
      for (let i = 0; i < prompts.length; i++) {
        if (answers[i] !== 'done') return block(`Run the timer for prompt #${i + 1}.`);
      }
      if (question.feedbackLikert) {
        for (let i = 0; i < prompts.length; i++) {
          if (!(answers[prompts.length + i] ?? '').trim()) return block(`Pick "How did I do?" for prompt #${i + 1}.`);
        }
      }
      return ok;
    }
    case 'bilingual_speaking_timer': {
      // answers: [punjabiDone, englishDone, feedback]
      if (answers[0] !== 'done') return block('Finish the 30-second Punjabi timer.');
      if (answers[1] !== 'done') return block('Finish the 60-second English timer.');
      if (question.feedbackLikert && !(answers[2] ?? '').trim()) return block('Pick "Did I do well?" feedback.');
      return ok;
    }
    case 'phone_contacts': {
      const contacts = question.phoneContacts ?? [];
      for (let i = 0; i < contacts.length; i++) {
        const c: any = contacts[i];
        const required = c.required !== false && !c.section;
        if (!required) continue;
        const raw = (answers[i] ?? '').replace(/\D/g, '');
        if (!raw) return block(`Enter ${c.labelEn}'s phone number.`);
        if (raw.length < 10) return block(`${c.labelEn}'s phone number needs at least 10 digits (you have ${raw.length}).`);
      }
      return ok;
    }
    case 'signature_practice': {
      const target = question.signatureCount ?? 10;
      const signed = answers.filter((s) => typeof s === 'string' && s.startsWith('data:')).length;
      if (signed < target) return block(`Write your full name ${target} times (${signed}/${target} done).`);
      return ok;
    }
    case 'finger_written_answers': {
      const prompts = question.fingerPrompts ?? [];
      for (let i = 0; i < prompts.length; i++) {
        const v = answers[i];
        if (typeof v !== 'string' || !v.startsWith('data:')) {
          return block(`Write your answer to: "${prompts[i].questionEn}"`);
        }
      }
      return ok;
    }
    case 'multi_sentence': {
      const parts = question.multiSentenceParts ?? [];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const value = (answers[i] ?? '').trim();
        if (!value) return block(`Answer: ${part.questionEn}`);
        if (part.inputType === 'date_dmy') {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
            return block(`"${part.questionEn}" — use DD/MM/YYYY format.`);
          }
          continue;
        }
        const min = part.requiredWords ?? question.requiredWords ?? 0;
        if (min > 0) {
          const words = countWords(value);
          if (words < min) {
            return block(`"${part.questionEn}" needs at least ${min} words (you have ${words}).`);
          }
        }
      }
      return ok;
    }
    // sentence/question_answer: require non-empty; enforce question-level requiredWords if set
    case 'sentence':
    case 'question_answer': {
      const text = response.studentAnswer ?? '';
      if (!text.trim()) return block('Write your answer to continue.');
      const min = question.requiredWords ?? 0;
      if (min > 0) {
        const words = countWords(text);
        if (words < min) return block(`Write at least ${min} words (you have ${words}).`);
      }
      return ok;
    }
    case 'three_sentence': {
      const labels = question.inputLabels ?? ['', '', ''];
      const min = question.requiredWords ?? 0;
      for (let i = 0; i < 3; i++) {
        const text = (answers[i] ?? '').trim();
        const label = labels[i] ? `"${labels[i]}"` : `sentence #${i + 1}`;
        if (!text) return block(`Finish ${label}.`);
        if (min > 0) {
          const words = countWords(text);
          if (words < min) return block(`${label} needs at least ${min} words (you have ${words}).`);
        }
      }
      return ok;
    }
    case 'word_list': {
      const labels = question.inputLabels ?? [];
      const total = labels.length || 5;
      for (let i = 0; i < total; i++) {
        const text = (answers[i] ?? '').trim();
        if (!text) return block(`Fill word #${i + 1} to continue.`);
      }
      return ok;
    }
    default:
      return ok;
  }
};
