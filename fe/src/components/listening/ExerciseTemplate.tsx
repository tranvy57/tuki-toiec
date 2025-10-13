import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import { Exercise, ExerciseType } from "@/types/exercise";


interface ExerciseTemplateProps {
  exerciseType: ExerciseType;
  exercises: Exercise[];
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (answer: any) => void;
  children: React.ReactNode;
}

export default function ExerciseTemplate({
  exerciseType,
  exercises,
  currentIndex,
  onBack,
  onNext,
  onPrevious,
  onSubmit,
  children,
}: ExerciseTemplateProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = (answer: any) => {
    setShowResult(true);
    onSubmit(answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-sm font-medium text-gray-600">
                Câu {currentIndex + 1}/{exercises.length}
              </div>
              <div className="text-sm font-medium text-gray-600">
                ⏱️ {formatTime(timeElapsed)}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePlayAudio}
                className="bg-white hover:bg-gray-50 rounded-full p-4 shadow-md transition-all hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-pink-500" />
                ) : (
                  <Play className="w-8 h-8 text-pink-500" />
                )}
              </button>

              <button
                onClick={handlePlayAudio}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Phát lại audio
              </button>
            </div>
          </div>

          <div className="mb-8">{children}</div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Câu trước
            </button>

            <button
              onClick={() => handleSubmit({})}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Kiểm tra
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex === exercises.length - 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Câu tiếp theo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
