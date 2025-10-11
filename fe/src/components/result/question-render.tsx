"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/utils/libs";
import { Group, Question, SubmitQuestion } from "@/types/implements/test";
import Image from "next/image";
import { usePracticeTest } from "@/hooks";
import { AudioPlayer } from "../toeic/test/Audio";

interface QuestionRendererProps {
  question?: SubmitQuestion;
  group?: Group;
  mode?: "test" | "practice" | "review";
}

export function QuestionRenderer({
  question,
  group,
  mode = "test",
}: QuestionRendererProps) {
  const { currentGroup, currentPart, currentGroupQuestion, fullTest } =
    usePracticeTest();

  const activeQuestion = question;
  const activeGroup = group;
  if (!activeQuestion || !currentPart) return <div>Loading...</div>;

  const renderQuestionContent = (q: Question, g?: Group) => {
    switch (currentPart.partNumber) {
      case 3:
      case 4:
      case 5:
        return (
          <div className="space-y-2">
            {q.content && (
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {q.content}
              </p>
            )}
            {fullTest?.mode === "practice" && q.explanation && (
              <p className="text-sm text-gray-600 italic">{q.explanation}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            {fullTest?.mode === "practice" && q.explanation && (
              <p className="text-sm text-gray-600 italic">{q.explanation}</p>
            )}
            {mode !== "review" && g?.audioUrl && (
              <AudioPlayer audioUrl={g.audioUrl} />
            )}
          </div>
        );
    }
  };
  const selectedAnswerKey = activeQuestion.answers.find(
    (a) => a.id === activeQuestion.userAnswerId
  )?.answerKey;
  return (
    <div className={cn("transition-opacity duration-300")}>
      <div className="p-6 border-t first:border-none border-gray-300">
        {/* Audio cho group nếu có */}
        {mode === "review" &&
          currentPart.partNumber <= 4 &&
          activeGroup?.audioUrl && (
            <AudioPlayer audioUrl={activeGroup.audioUrl} />
          )}

        {/* Ảnh nếu có */}
        {activeGroup?.imageUrl && (
          <div className="relative h-44 w-full mb-6">
            <Image
              src={`/api/proxy-image?url=${encodeURIComponent(
                activeGroup.imageUrl
              )}`}
              alt="Question Image"
              fill
              className="object-contain object-left"
            />
          </div>
        )}

        {/* Nội dung câu hỏi */}
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            {renderQuestionContent(activeQuestion, activeGroup)}

            {/* Các lựa chọn */}
            <RadioGroup value={selectedAnswerKey || ""} className="space-y-2">
              {activeQuestion.answers.map((option) => {
                const isUserChosen = option.id === activeQuestion.userAnswerId;
                const isCorrect = option.isCorrect;

                return (
                  <label
                    key={option.id}
                    htmlFor={`${activeQuestion.id}-${option.id}`}
                    className={`
          flex items-start gap-3 p-2 rounded-md transition-colors border
          ${isCorrect ? "bg-green-50/70 border-green-300" : ""}
          ${isUserChosen && !isCorrect ? "bg-red-50/70 border-red-300" : ""}
          
        `}
                  >
                    <RadioGroupItem
                      value={option.answerKey}
                      id={`${activeQuestion.id}-${option.id}`}
                      className="mt-0.5"
                      disabled={true}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {option.content}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
