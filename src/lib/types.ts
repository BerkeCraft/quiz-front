export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  answers: Answer[];
  questionText: string;
  correctAnswerIndex: number | null;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  userId: number;
  questions: Question[];
}
