import { Question, QuestionResponse } from '../../types/appTypes';

export interface ActivityProps {
  question: Question;
  response: QuestionResponse;
  updateResponse: (partial: Partial<QuestionResponse>) => void;
}
