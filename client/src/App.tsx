import axios from "axios";
import { useEffect, useState } from "react";
import type { Lesson } from "./types";
import Header from "./components/Header";
import LessonDetail from "./components/LessonDetail";
import LessonList from "./components/LessonList";

const App: React.FC<{}> = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch lessons from the API
    axios
      .get(`${import.meta.env.VITE_API_URL}/lessons`)
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch lessons from API:", error);
        setError("Could not connect to the server.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSelectLesson = (lesson: Lesson) => setSelectedLesson(lesson);
  const handleBackToList = () => setSelectedLesson(null);

  return (
    <div className="min-h-screen container mx-auto p-4 sm:p-6 md:p-8">
      <Header />
      {error && (
        <div className="text-center bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {selectedLesson ? (
        <LessonDetail lesson={selectedLesson} onBack={handleBackToList} />
      ) : (
        <LessonList
          lessons={lessons}
          onSelect={handleSelectLesson}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default App;
