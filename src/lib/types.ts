
export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-in-the-blank' | 'unknown';

export interface Question {
  id: number;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

export interface Quiz {
  questions: Question[];
}

export type UserAnswers = {
  [key: string]: string;
};

export type Lesson = {
  id: string;
  topic: string;
  explanation?: string;
  quiz?: string;
  createdAt: string;
  archived?: boolean;
};
