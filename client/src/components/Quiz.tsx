import type { QuizQuestion } from "../types";

type QuizProps = {
  questions: QuizQuestion[];
};
import { useState } from "react";

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (option: string) =>
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });

  const handleNext = () =>
    currentQuestionIndex < questions.length - 1
      ? setCurrentQuestionIndex(currentQuestionIndex + 1)
      : setShowResults(true);

  const calculateScore = () =>
    questions.reduce(
      (score, q, index) =>
        selectedAnswers[index] === q.correctAnswer ? score + 1 : score,
      0
    );

  if (showResults) {
    const score = calculateScore();
    const scorePercentage = (score / questions.length) * 100;
    return (
      <div className="mt-8 p-6 bg-slate-100 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-slate-800">
          Quiz Complete!
        </h3>
        <p
          className={`text-center text-5xl font-bold my-4 ${
            scorePercentage >= 70 ? "text-green-500" : "text-red-500"
          }`}
        >
          {score} / {questions.length}
        </p>
        {questions.map((q, index) => (
          <div key={index} className="border-b border-slate-200 py-4">
            <p className="font-semibold text-slate-700">
              {index + 1}. {q.question}
            </p>
            <p
              className={`text-sm ${
                selectedAnswers[index] === q.correctAnswer
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              Your answer: {selectedAnswers[index] || "Not answered"}
            </p>
            <p className="text-sm text-green-500">
              Correct answer: {q.correctAnswer}
            </p>
          </div>
        ))}
      </div>
    );
  }
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200">
      <p className="text-sm font-semibold text-slate-500">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <h3 className="text-xl font-bold text-slate-800 my-3">
        {currentQuestion.question}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full cursor-pointer p-4 rounded-lg text-left transition-all duration-200 border-2 text-slate-700 ${
              selectedAnswers[currentQuestionIndex] === option
                ? "bg-indigo-500 border-indigo-500 text-white font-semibold"
                : "bg-white hover:bg-indigo-50 hover:border-indigo-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="text-right mt-6">
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="bg-slate-800 cursor-pointer text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
        </button>
      </div>
    </div>
  );
};
export default Quiz;
