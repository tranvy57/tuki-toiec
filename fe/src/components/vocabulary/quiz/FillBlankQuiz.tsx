import { Input } from "@/components/ui/input";
import { WeakVocabulary } from "@/types/implements/vocabulary";

interface FillBlankQuizProps {
  word: any;
  answer: string;
  onAnswerChange: (answer: string) => void;
  isCompleted: boolean;
}

export default function FillBlankQuiz({
  word,
  answer,
  onAnswerChange,
  isCompleted,
}: FillBlankQuizProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">
        Điền từ còn thiếu vào câu sau: D
      </p>
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-center text-lg">{word?.content?.text}</p>
      </div>
      <Input
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Nhập từ..."
        className="text-center text-lg"
        disabled={isCompleted}
      />
      {isCompleted && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đáp án: <strong>{word.word}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
