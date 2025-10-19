export type Lesson = {
  id: number;
  title: string;
  content: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};
