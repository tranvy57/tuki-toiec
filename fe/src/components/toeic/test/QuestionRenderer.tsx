"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/libs";
import { Group, Part, Question } from "@/types/implements/test";
import Image from "next/image";
import { AudioPlayer } from "./Audio";
import { usePracticeTest } from "@/hooks";

interface QuestionRendererProps {
  questions?: Question[]; // Optional prop for part questions
  answers: Record<number, string>;
  onAnswerChange: (questionId: number, value: string) => void;
  isTransitioning: boolean;
  mode?: "test" | "practice" | "review"; // Add mode prop
}

export function QuestionRenderer({
  questions, // New prop for part questions
  answers,
  onAnswerChange,
  isTransitioning,
  mode = "test", // Default to test mode
}: QuestionRendererProps) {
  // Render question content based on part
  const { currentGroup, currentPart, currentGroupQuestion, fullTest } =
    usePracticeTest();

  // Use provided questions or fallback to current group questions

  const renderQuestionContent = (question: Question, group?: any) => {
    switch (currentPart?.partNumber) {
      case 1:
      // return (
      //   <div className="space-y-4">
      //     <div className="bg-gray-100 rounded-lg flex">
      //       {group?.imageUrl ? (
      //         <div className="relative w-full h-96">
      //           <Image
      //             src={group.imageUrl}
      //             alt="Question Image"
      //             fill
      //             className="object-contain rounded-lg"
      //           />
      //         </div>
      //       ) : (
      //         <span className="text-gray-500">No image available</span>
      //       )}
      //     </div>
      //     {fullTest?.mode === "practice" && question.explanation && (
      //       <p className="text-sm text-gray-600 italic">
      //         {question.explanation}
      //       </p>
      //     )}
      //   </div>
      // );
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
            {/* Only show audio here if NOT in review mode (review mode shows group audio separately) */}
            {fullTest?.mode === "practice" &&
              mode !== "review" &&
              group?.audioUrl && <AudioPlayer audioUrl={group.audioUrl} />}
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
    const questionGroups: { group: Group; questions: Question[] }[] = [];
    const groupMap = new Map<string, { group: Group; questions: Question[] }>();

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

  // Check if this is a listening part (1-4) that needs audio in review mode
  const isListeningPart = currentPart && currentPart.partNumber <= 4;
  const shouldShowGroupAudio = mode === "review" && isListeningPart;

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      {groupedQuestions.map((groupData, groupIndex) => (
        <div
          key={groupData.group?.id || groupIndex}
          className="border-t first:border-none border-gray-300 p-6"
        >
          {/* Group Audio for Review Mode (Listening Parts Only) */}
          {shouldShowGroupAudio && groupData.group?.audioUrl && (
            <AudioPlayer audioUrl={groupData.group.audioUrl} />
          )}

          {/* Reading parts (6-7) with passage layout */}
          {isReadingPart &&
          (groupData.group?.paragraphEn || groupData.group?.paragraphVn) ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Passage */}
              <div className="space-y-4 col-span-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="max-h-[750px] overflow-auto rounded-md">
                    <div
                      className="[&_table]:border-collapse [&_table]:border [&_table]:border-slate-300
          [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:font-semibold
          [&_td]:border [&_td]:border-slate-300 [&_td]:p-2
          [&_table]:rounded-md [&_table]:shadow-sm [&_table]:w-full
          dark:[&_th]:bg-slate-800 dark:[&_td]:border-slate-700 dark:[&_th]:border-slate-700
          text-gray-800 dark:text-gray-100 text-sm font-sans leading-relaxed
          w-full overflow-x-auto"
                      dangerouslySetInnerHTML={{
                        __html: groupData.group?.paragraphEn || "",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Questions */}
              <div className="space-y-6">
                {groupData.questions.map((question) => {
                  return (
                    <div
                      key={question.id}
                      className="rounded-xl p-5 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Question number with circle */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-base">
                          {question.numberLabel}
                        </div>

                        {/* Question content */}
                        <div className="flex-1 space-y-4">
                          <p className="text-base font-medium text-gray-800 leading-relaxed">
                            {question.content}
                          </p>

                          {/* Answer options */}
                          <RadioGroup
                            value={answers[question.numberLabel] || ""}
                            onValueChange={(value) =>
                              onAnswerChange(question.numberLabel, value)
                            }
                            className="space-y-2"
                          >
                            {question.answers.map((option) => {
                              // const isChosen = userAnswer === option.answerKey;
                              // const isRight =
                              //   option.answerKey === correctAnswer;
                              const isChosen = false;
                              const isRight = false;

                              return (
                                <label
                                  key={option.id}
                                  htmlFor={`${question.id}-${option.id}`}
                                  className={cn(
                                    "flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors border border-transparent",
                                    isChosen
                                      ? isRight
                                        ? "bg-green-50 border-green-300"
                                        : "bg-red-50 border-red-300"
                                      : "hover:bg-blue-50/40 hover:border-blue-200"
                                  )}
                                >
                                  <RadioGroupItem
                                    value={option.answerKey}
                                    id={`${question.id}-${option.id}`}
                                    className="mt-0.5"
                                  />
                                  <span className="text-gray-700 text-sm leading-relaxed">
                                    {option.content}
                                  </span>
                                </label>
                              );
                            })}
                          </RadioGroup>

                          {/* Correct answer */}
                          {/* {correctAnswer && (
                            <div className="text-green-600 text-sm font-medium mt-2">
                              Đáp án đúng: {correctAnswer}
                            </div>
                          )} */}

                          {/* Explanation toggle */}
                          {/* {question.explanation && (
                            <details className="mt-2 text-sm text-gray-600">
                              <summary className="cursor-pointer select-none text-blue-600 hover:underline">
                                Giải thích chi tiết đáp án
                              </summary>
                              <div className="mt-2 bg-slate-50 rounded-lg p-3 border border-slate-100 text-gray-700 leading-relaxed">
                                {question.explanation}
                              </div>
                            </details>
                          )} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Standard layout for other parts */
            <>
              {/* Danh sách câu hỏi thuộc group */}
              <div>
                <div className="space-y-4">
                  {groupData?.group.imageUrl ? (
                    <div className="relative h-96 w-full flex justify-start items-start">
                      <Image
                        src={`/api/proxy-image?url=${encodeURIComponent(
                          groupData.group.imageUrl
                        )}`}
                        alt="Question Image"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500"></span>
                  )}
                </div>
                {groupData.questions.map((question) => (
                  <div key={question.id} className="mt-8 pb-6">
                    <div className="flex items-start ">
                      <div className="text-lg font-semibold min-w-[32px] mt-1 text-blue-600 -translate-y-1.5">
                        {question.numberLabel}
                      </div>

                      <div className="flex-1 space-y-4">
                        {renderQuestionContent(question, groupData.group)}

                        {/* Answer options */}
                        <RadioGroup
                          value={answers[question.numberLabel] || ""}
                          onValueChange={(value) =>
                            onAnswerChange(question.numberLabel, value)
                          }
                          className=""
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
                              <label
                                htmlFor={`${question.id}-${option.id}`}
                                className="cursor-pointer leading-relaxed flex-1"
                              >
                                {option.content}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
