"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/libs";
import { Part, Question } from "@/types/implements/test";
import { useCurrentTest } from "@/hooks/useTest";
import Image from "next/image";
import { AudioPlayer } from "./Audio";

interface QuestionRendererProps {
  questions?: Question[]; // Optional prop for part questions
  answers: Record<number, string>;
  onAnswerChange: (questionId: number, value: string) => void;
  isTransitioning: boolean;
}

export function QuestionRenderer({
  questions, // New prop for part questions
  answers,
  onAnswerChange,
  isTransitioning,
}: QuestionRendererProps) {
  // Render question content based on part
  const { currentGroup, currentPart, currentGroupQuestion, fullTest } =
    useCurrentTest();

  // Use provided questions or fallback to current group questions

  const renderQuestionContent = (question: Question, group?: any) => {
    switch (currentPart?.partNumber) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg flex">
              {group?.imageUrl ? (
                <div className="relative w-full h-96">
                  <Image
                    src={group.imageUrl}
                    alt="Question Image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
            {fullTest?.mode === "practice" && question.explanation && (
              <p className="text-sm text-gray-600 italic">
                {question.explanation}
              </p>
            )}
          </div>
        );
      case 3:
      case 4:
        return (
          <div className="space-y-2">
            {/* Hiển thị nội dung câu hỏi */}
            {question.content && (
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {question.content}
              </p>
            )}
            {/* Hiển thị giải thích nếu đang ở chế độ practice */}
            {fullTest?.mode === "practice" && question.explanation && (
              <p className="text-sm text-gray-600 italic">
                {question.explanation}
              </p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-2">
            {/* Hiển thị nội dung câu hỏi */}
            {question.content && (
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {question.content}
              </p>
            )}
            {/* Hiển thị giải thích nếu đang ở chế độ practice */}
            {fullTest?.mode === "practice" && question.explanation && (
              <p className="text-sm text-gray-600 italic">
                {question.explanation}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            {fullTest?.mode === "practice" && question.explanation && (
              <p className="text-sm text-gray-600 italic">
                {question.explanation}
              </p>
            )}
            {fullTest?.mode === "practice" && group?.audioUrl && (
              <AudioPlayer audioUrl={group.audioUrl} />
            )}
          </div>
        );
    }
  };

  // Group questions by their groups for better display
  const groupQuestions = () => {
    if (!questions || !fullTest) {
      // Fallback to current group
      return currentGroup?.questions
        ? [{ group: currentGroup, questions: currentGroup.questions }]
        : [];
    }

    // Group questions by their actual groups from fullTest
    const questionGroups: { group: any; questions: Question[] }[] = [];
    const groupMap = new Map<string, { group: any; questions: Question[] }>();

    // Find current part
    const currentPartData = fullTest.parts.find(
      (p) => p.partNumber === currentPart?.partNumber
    );
    if (!currentPartData) return [];

    // Process each group in the current part
    currentPartData.groups.forEach((group) => {
      const groupQuestions = questions.filter((q) =>
        group.questions.some((gq) => gq.id === q.id)
      );

      if (groupQuestions.length > 0) {
        questionGroups.push({
          group: group,
          questions: groupQuestions.sort(
            (a, b) => a.numberLabel - b.numberLabel
          ),
        });
      }
    });

    return questionGroups;
  };

  const groupedQuestions = groupQuestions();
  if (!currentPart) return <div>Loading...</div>;

  // Check if this is a reading part (6-7) that needs passage layout
  const isReadingPart = currentPart.partNumber >= 6;

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      {groupedQuestions.map((groupData, groupIndex) => (
        <div key={groupData.group?.id || groupIndex} className="mb-12">
          {/* Reading parts (6-7) with passage layout */}
          {isReadingPart &&
          (groupData.group?.paragraphEn || groupData.group?.paragraphVn) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Passage */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {groupData.group.paragraphEn || groupData.group.paragraphVn}
                  </pre>
                </div>
              </div>

              {/* Right: Questions */}
              <div className="space-y-6">
                {groupData.questions.map((question) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-medium text-blue-600 min-w-[60px]">
                        {question.numberLabel}
                      </div>

                      <div className="flex-1 space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                          {question.content}
                        </p>

                        <RadioGroup
                          value={answers[question.numberLabel] || ""}
                          onValueChange={(value) =>
                            onAnswerChange(question.numberLabel, value)
                          }
                          className="space-y-2"
                        >
                          {question.answers.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-start space-x-3"
                            >
                              <RadioGroupItem
                                value={option.answerKey}
                                id={`${question.id}-${option.id}`}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={`${question.id}-${option.id}`}
                                className="cursor-pointer leading-relaxed flex-1"
                              >
                                {option.content}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard layout for other parts */
            <>
              {/* Group header with media content */}

              {/* Questions in standard layout */}
              {groupData.questions.map((question) => (
                <div
                  key={question.id}
                  className={cn("border-b border-gray-100 pb-8 mb-8")}
                >
                  <div className="flex items-start gap-6">
                    <div className="text-lg font-medium min-w-[60px] mt-1 text-blue-600">
                      {question.numberLabel}
                    </div>

                    <div className="flex-1 space-y-4">
                      {renderQuestionContent(question, groupData.group)}

                      {/* Answer options */}
                      <div className="space-y-1">
                        <RadioGroup
                          value={answers[question.numberLabel] || ""}
                          onValueChange={(value) =>
                            onAnswerChange(question.numberLabel, value)
                          }
                          className="space-y-3"
                        >
                          {question.answers.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-start space-x-3"
                            >
                              <RadioGroupItem
                                value={option.answerKey}
                                id={`${question.id}-${option.id}`}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={`${question.id}-${option.id}`}
                                className="cursor-pointer leading-relaxed flex-1"
                              >
                                {option.content}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
