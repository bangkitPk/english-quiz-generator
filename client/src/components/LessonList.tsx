import type { Lesson } from "../types";

type LessonListProps = {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
  isLoading: boolean;
};

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  onSelect,
  isLoading,
}) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-slate-700">Choose a Lesson</h2>
    {isLoading && (
      <p className="text-slate-500">Loading lessons from the server...</p>
    )}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-slate-200 group"
          onClick={() => onSelect(lesson)}
        >
          <h3 className="text-xl font-bold text-indigo-600 group-hover:text-indigo-700">
            {lesson.title}
          </h3>
          <p className="text-slate-500 mt-2 text-sm">
            Click to read and start the quiz.
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default LessonList;
