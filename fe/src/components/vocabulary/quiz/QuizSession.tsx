import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { WeakVocabulary, QuizType } from "@/types/implements/vocabulary";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import FillBlankQuiz from "./FillBlankQuiz";
import AudioQuiz from "./AudioQuiz";
import { useGetReviewVocabularies } from "@/api/useVocabulary";
import { useEffect, useState } from "react";

interface QuizSessionProps {
  currentWord: any;
  currentQuizType: QuizType;
  allVocabularies: any[];
  // Multiple choice props
  quizOptions: { key: string; value: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  // Fill blank props
  quizAnswer: string;
  onAnswerChange: (answer: string) => void;
  // Common props
  isCompleted: boolean;
  isLastReviewWord?: boolean;
  onSubmit: () => void;
  onSkip: () => void;
  onEndSession?: () => void;
}

export default function QuizSession({
  isLastReviewWord,
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
  onEndSession,
}: QuizSessionProps) {
  console.log("currentWord", currentWord);

  const getQuizTypeLabel = (type: QuizType) => {
    switch (type) {
      case "mcq":
        return "📝 Trắc nghiệm";
      case "cloze":
        return "✏️ Điền từ";
      case "pronunciation":
        return "🎧 Nghe âm thanh";
      default:
        return "";
    }
  };

  const isAnswerProvided = () => {
    switch (currentQuizType) {
      case "mcq":
        return !!selectedOption;
      case "cloze":
        return !!quizAnswer.trim();
      case "pronunciation":
        return !!quizAnswer.trim();
      default:
        return false;
    }
  };

  const renderQuiz = () => {
    switch (currentQuizType) {
      // case "mcq":
      //   return (
      //     <MultipleChoiceQuiz
      //       word={currentWord}
      //       options={quizOptions}
      //       selectedOption={selectedOption}
      //       onSelectOption={onSelectOption}
      //       isCompleted={isCompleted}
      //     />
      //   );
      case "cloze":
        return (
          <FillBlankQuiz
            word={currentWord}
            answer={quizAnswer}
            onAnswerChange={onAnswerChange}
            isCompleted={isCompleted}
          />
        );
      case "pronunciation":
        return (
          <AudioQuiz
            word={currentWord}
            answer={quizAnswer}
            onAnswerChange={onAnswerChange}
            isCompleted={isCompleted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 flex gap-4  flex justify-center rounded-md">
      {/* Quiz Header */}
      <div className=" space-y-4 min-w-150">
        <div className="text-center">
          <Badge className="mb-3">{getQuizTypeLabel(currentQuizType)}</Badge>
          {/* <h3 className="text-lg font-semibold text-gray-700">
          Câu hỏi kiểm tra nhanh
        </h3> */}
        </div>

        {/* Quiz Content */}
        {renderQuiz()}
        {!isCompleted && (
          <div className="flex gap-3 justify-center">
            <Button
              variant="default"
              onClick={onSubmit}
              disabled={!isAnswerProvided()}
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
      </div>

      {/* Submit Button */}

      {/* Quiz Completed - Show Answer */}
      {isCompleted && (
        <div className="space-y-4 text-left ">
          <div className="  rounded-lg  ">
            <h4 className="font-medium text-green-800 mb-2">
              Đáp án đúng: {currentWord?.content?.answer}
            </h4>
            <div className=" mb-2">
              <strong>{currentWord?.content?.partOfSpeech}</strong>{" "}
              {currentWord?.content?.meaning}
            </div>
            <div>{currentWord?.content?.pronunciation}</div>
            <div className="text-sm ">
              <div>
                <strong>Ví dụ:</strong> {currentWord?.content?.exampleEn}
              </div>
              <div>
                <strong>Dịch:</strong> {currentWord?.content?.exampleVn}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="default"
              onClick={isLastReviewWord ? onEndSession : onSkip}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {isLastReviewWord ? "Kết thúc" : "Tiếp tục"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
