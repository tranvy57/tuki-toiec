import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { WeakVocabulary, QuizType } from "@/types/implements/vocabulary";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import FillBlankQuiz from "./FillBlankQuiz";
import AudioQuiz from "./AudioQuiz";

interface QuizSessionProps {
  currentWord: WeakVocabulary;
  currentQuizType: QuizType;
  allVocabularies: WeakVocabulary[];
  // Multiple choice props
  quizOptions: string[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  // Fill blank props
  quizAnswer: string;
  onAnswerChange: (answer: string) => void;
  // Common props
  isCompleted: boolean;
  onSubmit: () => void;
  onSkip: () => void;
}

export default function QuizSession({
  currentWord,
  currentQuizType,
  allVocabularies,
  quizOptions,
  selectedOption,
  onSelectOption,
  quizAnswer,
  onAnswerChange,
  isCompleted,
  onSubmit,
  onSkip,
}: QuizSessionProps) {
  const getQuizTypeLabel = (type: QuizType) => {
    switch (type) {
      case "multiple-choice":
        return "📝 Trắc nghiệm";
      case "fill-blank":
        return "✏️ Điền từ";
      case "audio":
        return "🎧 Nghe âm thanh";
      default:
        return "";
    }
  };

  const isAnswerProvided = () => {
    switch (currentQuizType) {
      case "multiple-choice":
        return !!selectedOption;
      case "fill-blank":
        return !!quizAnswer.trim();
      case "audio":
        return !!selectedOption;
      default:
        return false;
    }
  };

  const renderQuiz = () => {
    switch (currentQuizType) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuiz
            word={currentWord}
            options={quizOptions}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
            isCompleted={isCompleted}
          />
        );
      case "fill-blank":
        return (
          <FillBlankQuiz
            word={currentWord}
            answer={quizAnswer}
            onAnswerChange={onAnswerChange}
            isCompleted={isCompleted}
          />
        );
      case "audio":
        return (
          <AudioQuiz
            word={currentWord}
            allVocabularies={allVocabularies}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
            isCompleted={isCompleted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="text-center">
        <Badge className="mb-3">
          {getQuizTypeLabel(currentQuizType)}
        </Badge>
        <h3 className="text-lg font-semibold text-gray-700">
          Câu hỏi kiểm tra nhanh
        </h3>
      </div>

      {/* Quiz Content */}
      {renderQuiz()}

      {/* Submit Button */}
      {!isCompleted && (
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onSubmit}
            disabled={!isAnswerProvided()}
            className="bg-toeic-primary hover:bg-red-600"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Kiểm tra
          </Button>

          <Button
            variant="outline"
            onClick={onSkip}
            className="text-gray-600"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Bỏ qua
          </Button>
        </div>
      )}

      {/* Quiz Completed - Show Answer */}
      {isCompleted && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">
              Đáp án đúng: {currentWord.word}
            </h4>
            <div className="text-green-700 mb-2">
              <strong>[{currentWord.partOfSpeech}]</strong>{" "}
              {currentWord.meaning}
            </div>
            <div className="text-sm text-green-600">
              <div>
                <strong>Ví dụ:</strong> {currentWord.exampleEn}
              </div>
              <div>
                <strong>Dịch:</strong> {currentWord.exampleVn}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Tự động chuyển sang câu tiếp theo trong 2 giây...
            </p>
            <Button variant="outline" onClick={onSkip}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Tiếp tục ngay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

