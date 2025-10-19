import { useState } from "react";
import { type QuizQuestion, type Lesson } from "../types";
import axios from "axios";
import Quiz from "./Quiz";
import { marked } from "marked";

type LessonDetailProps = {
  lesson: Lesson;
  onBack: () => void;
};

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, onBack }) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  // This function takes the Markdown string and converts it to HTML
  const getMarkdownText = () => {
    const rawMarkup = marked.parse(lesson.content);
    return { __html: rawMarkup };
  };

  // The quiz generation logic remains the same
  const generateQuiz = () => {
    setIsLoading(true);
    setQuizError("");
    setQuizQuestions(null);
    axios
      .post("https://english-quiz-generator-api.vercel.app/api/generate-quiz", {
        lessonContent: lesson.content,
      })
      .then((response) => {
        setQuizQuestions(response.data.data);
      })
      .catch((err) => {
        setQuizError("Failed to generate quiz.");
        console.error("Error generating quiz:", err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 mb-6 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Lessons
      </button>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">{lesson.title}</h2>

      <div
        className="prose prose-indigo max-w-none text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={getMarkdownText()}
      />

      <div className="text-center mt-10 border-t pt-8 border-slate-200">
        <h3 className="text-xl font-bold text-slate-700">
          Ready to test your knowledge?
        </h3>
        <button
          onClick={generateQuiz}
          disabled={isLoading}
          className="mt-4 cursor-pointer bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
        >
          {isLoading ? "Generating AI Quiz..." : "Generate AI Quiz"}
        </button>
      </div>

      {quizError && (
        <p className="text-center text-red-500 mt-4">{quizError}</p>
      )}
      {quizQuestions && <Quiz questions={quizQuestions} />}
    </div>
  );
};

export default LessonDetail;
