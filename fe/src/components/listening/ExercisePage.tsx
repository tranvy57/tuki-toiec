import { Exercise, ExerciseType } from "@/types/exercise";
import { useState, useEffect } from "react";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import Ordering from "./exercises/Ordering";
import PictureSelect from "./exercises/PictureSelect";
import WordDiscrimination from "./exercises/WordDiscrimination";
import Dictation from "./exercises/Dictation";
import ExerciseTemplate from "./ExerciseTemplate";


interface ExercisePageProps {
  exerciseType: ExerciseType;
  onBack: () => void;
}

export default function ExercisePage({
  exerciseType,
  onBack,
}: ExercisePageProps) {
  const [exercises, setExercises] = useState<Exercise[]>(getMockExercises(exerciseType.slug));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  function getMockExercises(slug: string): Exercise[] {
    const mockData: Record<string, any> = {
      "multiple-choice": [
        {
          id: "1",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            text: "What is the main topic of the conversation?",
            options: [
              "A business meeting",
              "A job interview",
              "A travel plan",
              "A restaurant reservation",
            ],
          },
          correct_answer: { answer: "A business meeting" },
          transcript: "Sample transcript...",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      "fill-in-blank": [
        {
          id: "2",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            sentence: "The meeting will start at ___ in the ___ room.",
            blanks: [2],
          },
          correct_answer: { answers: ["9 AM", "conference"] },
          transcript: "Sample transcript...",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      ordering: [
        {
          id: "3",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            sentences: [
              "Then, we will discuss the budget.",
              "First, let me introduce the team.",
              "Finally, we will set the timeline.",
              "After that, we will review the project plan.",
            ],
          },
          correct_answer: { order: [1, 3, 0, 2] },
          transcript: "Sample transcript...",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      "picture-select": [
        {
          id: "4",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            text: "Which picture best describes what you heard?",
            images: [
              "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
              "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=400",
              "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400",
              "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
            ],
          },
          correct_answer: { image: 0 },
          transcript: "Sample transcript...",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      "word-discrimination": [
        {
          id: "5",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            text: "Which word do you hear?",
            wordA: "ship",
            wordB: "sheep",
          },
          correct_answer: { word: "ship" },
          transcript: "Sample transcript...",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      dictation: [
        {
          id: "6",
          type_id: exerciseType.id,
          audio_url: "",
          question: {
            text: "Type the sentence you hear:",
          },
          correct_answer: { sentence: "The conference will begin at nine AM." },
          transcript: "The conference will begin at nine AM.",
          vocabulary: [],
          difficulty: "medium",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ],
    };

    return mockData[slug] || [];
  }

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = (answer: any) => {
    console.log("Submitted answer:", answer);
  };

  const handleAnswer = (answer: any) => {
    console.log("Answer changed:", answer);
  };

  const renderExerciseContent = () => {
    if (!exercises[currentIndex]) return null;

    const currentExercise = exercises[currentIndex];

    switch (exerciseType.slug) {
      case "multiple-choice":
        return (
          <MultipleChoice
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      case "fill-in-blank":
        return (
          <FillInBlank
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      case "ordering":
        return (
          <Ordering
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      case "picture-select":
        return (
          <PictureSelect
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      case "word-discrimination":
        return (
          <WordDiscrimination
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      case "dictation":
        return (
          <Dictation
            question={currentExercise.question}
            onAnswer={handleAnswer}
          />
        );
      default:
        return <div>Exercise type not supported</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Chưa có bài tập nào</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExerciseTemplate
      exerciseType={exerciseType}
      exercises={exercises}
      currentIndex={currentIndex}
      onBack={onBack}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
    >
      {renderExerciseContent()}
    </ExerciseTemplate>
  );
}
