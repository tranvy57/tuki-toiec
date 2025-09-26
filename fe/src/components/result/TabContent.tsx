import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Lightbulb, BookOpen } from "lucide-react";

interface QuestionResult {
  questionNumber: number;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
}

interface TestPart {
  partNumber: number;
  questions: QuestionResult[];
}

interface TabContentProps {
  parts: TestPart[];
}

export function TabContent({ parts }: TabContentProps) {
  const [activeTab, setActiveTab] = useState<"answers" | "details" | "retry">(
    "answers"
  );

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 flex items-center mt-8 ">
        <BookOpen className="w-5 h-5 mr-2 text-primary" />
        Detail
      </h2>
      <Card className="mb-8 border-2">
        <CardHeader className="pb-2">
          <div className="flex space-x-1 border-b">
            <button
              onClick={() => setActiveTab("answers")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "answers"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Đáp án
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Xem chi tiết đáp án
            </button>
            <button
              onClick={() => setActiveTab("retry")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "retry"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Làm lại các câu sai
            </button>
          </div>

          {activeTab === "retry" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <span className="font-medium">Chú ý:</span> Khi làm lại các câu
                sai, điểm trung bình của bạn sẽ{" "}
                <span className="font-bold">KHÔNG BỊ ẢNH HƯỞNG</span>.
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {activeTab === "details" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <span className="font-medium">Tips:</span> Khi xem chi tiết
                  đáp án, bạn có thể tạo và lưu highlight từ vựng, keywords và
                  tạo note để học và tra cứu khi có nhu cầu ôn lại để thấy trong
                  tương lai.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {parts.slice(0, 2).map((part) => (
              <div key={part.partNumber}>
                <h3 className="font-semibold text-lg mb-4">
                  Part {part.partNumber}
                </h3>

                {part.questions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {part.questions.map((question) => (
                      <div
                        key={question.questionNumber}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {question.questionNumber}
                          </div>
                          <div className="text-sm">
                            {question.isSkipped ? (
                              <span className="text-muted-foreground italic">
                                chưa trả lời
                              </span>
                            ) : (
                              <span
                                className={
                                  question.isCorrect
                                    ? "text-foreground"
                                    : "text-foreground"
                                }
                              >
                                {question.userAnswer}:{" "}
                                <span className="italic text-muted-foreground">
                                  chưa trả lời
                                </span>
                                {!question.isCorrect && (
                                  <X className="inline w-4 h-4 text-red-500 ml-1" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="text-primary text-sm hover:underline">
                          [Chi tiết]
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      Detailed question breakdown not available for this part
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
