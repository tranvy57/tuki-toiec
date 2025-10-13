import { ExerciseType } from "@/types/exercise";
import {
  Headphones,
  Pencil,
  ListOrdered,
  Image,
  Volume2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface ExerciseCardProps {
  exerciseType: ExerciseType;
  progress?: number;
  onStart: () => void;
}

const iconMap: Record<string, any> = {
  headphones: Headphones,
  pencil: Pencil,
  "list-ordered": ListOrdered,
  image: Image,
  "volume-2": Volume2,
  "message-square": MessageSquare,
};

export default function ExerciseCard({
  exerciseType,
  progress = 0,
  onStart,
}: ExerciseCardProps) {
  const Icon = iconMap[exerciseType.icon] || Headphones;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl group-hover:from-pink-100 group-hover:to-rose-100 transition-colors">
            <Icon className="w-8 h-8 text-pink-500" />
          </div>
          {progress > 0 && (
            <div className="text-xs font-medium text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
              {progress}% hoàn thành
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {exerciseType.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
          {exerciseType.description}
        </p>

        {progress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/button"
        >
          Bắt đầu
          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
