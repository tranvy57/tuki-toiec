import { ExerciseType } from "@/types/exercise";
import { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";


export const LISTENING_EXERCISE_TYPES = [
  {
    id: "a877e473-e165-4821-8bc8-31106e5ac080",
    name: "Nghe chọn đáp án đúng",
    slug: "multiple-choice",
    description: "Chọn câu trả lời phù hợp sau khi nghe đoạn hội thoại.",
    icon: "headphones",
    order: 1,
  },
  {
    id: "2196a22f-c523-4d3c-807a-c721be219426",
    name: "Nghe và điền khuyết",
    slug: "fill-in-blank",
    description: "Điền từ còn thiếu trong câu.",
    icon: "pencil",
    order: 2,
  },
  {
    id: "03597777-0664-4c0d-8450-4ff2bbcc0f25",
    name: "Nghe chọn đúng thứ tự",
    slug: "ordering",
    description: "Sắp xếp lại đoạn hội thoại theo trình tự đúng.",
    icon: "list-ordered",
    order: 3,
  },
  {
    id: "41fa7398-eceb-4c92-b199-22aeb7101875",
    name: "Nghe chọn hình ảnh",
    slug: "picture-select",
    description: "Chọn hình mô tả đúng nội dung bạn nghe.",
    icon: "image",
    order: 4,
  },
  {
    id: "f8924c85-5878-4dd5-b870-0718ffc6a363",
    name: "Phân biệt từ",
    slug: "word-discrimination",
    description: "Chọn đúng từ bạn nghe được (ship hay sheep?).",
    icon: "volume-2",
    order: 5,
  },
  {
    id: "c4c22792-1d30-4124-a7e7-6d9d6c20d8a9",
    name: "Chính tả nghe",
    slug: "dictation",
    description: "Gõ lại chính xác câu bạn nghe.",
    icon: "message-square",
    order: 6,
  },
];


interface ListeningOverviewProps {
  onSelectExercise: (exerciseType: ExerciseType) => void;
}

export default function ListeningOverview({
  onSelectExercise,
}: ListeningOverviewProps) {
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>(
    LISTENING_EXERCISE_TYPES
  );
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadExerciseTypes();
//   }, []);

//   async function loadExerciseTypes() {
//     try {
//       const { data, error } = await supabase
//         .from("exercise_types")
//         .select("*")
//         .order("order");

//       if (error) throw error;
//       setExerciseTypes(data || []);
//     } catch (error) {
//       console.error("Error loading exercise types:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

  const mockProgress: Record<string, number> = {
    "multiple-choice": 40,
    "fill-in-blank": 25,
    ordering: 60,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Luyện nghe TOEIC
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn dạng bài tập để rèn luyện kỹ năng nghe hiểu và nắm vững các
            dạng câu hỏi TOEIC thực tế.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded mb-4 w-full" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseTypes.map((exerciseType) => (
              <ExerciseCard
                key={exerciseType.id}
                exerciseType={exerciseType}
                progress={mockProgress[exerciseType.slug] || 0}
                onStart={() => onSelectExercise(exerciseType)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
