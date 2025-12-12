"use client";

import React from "react";
import Link from "next/link";
import { useGetAttemptHistory, useStartTestPractice } from "@/api";
import { usePracticeTest } from "@/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { log } from "util";

export default function HistoryPage() {
  const { data, isLoading, isError } = useGetAttemptHistory();
  const startTestMutation = useStartTestPractice();

  const router = useRouter();
  const {
    setFullTest,
    setAttemptId,
    setCurrentPart,
    setCurrentGroup,
    setAnswer,
  } = usePracticeTest();

  // normalize possible shapes: data.data, data.items, or direct array
  const attempts = React.useMemo(() => {
    if (!data) return [];
    return data.data?.data ?? [];
  }, [data]);

  async function handleContinue(attempt) {
    // 1. Attempt ID
    setAttemptId(attempt.id);

    console.log("attempt", attempt);

    // 2. Load fullTest from API (normalize possible shapes)
    // const raw = await startTestMutation.mutateAsync({
    //   testId: attempt.test?.id,
    // });
    // Normalize response that may either be the payload itself or an object with a `data` key.
    // Use `in` type guard to avoid TS error when `data` isn't a property.
    // const fullTestPayload = raw && ("data" in raw ? (raw as any).data : raw);
    setFullTest(attempt);

    // 3. Restore answers
    // support nested shape: parts -> groups -> questions -> userAnswer.answer.answerKey
    if (Array.isArray(attempt?.parts) && attempt?.parts?.length > 0) {
      console.log("runthis", attempt?.parts);

      attempt?.parts?.forEach((part: any) => {
        console.log("part", part);

        part.groups?.forEach((group: any) => {
          group.questions?.forEach((q: any) => {
            const answerKey =
              q?.userAnswer?.answer?.answerKey ??
              q?.userAnswer?.answerKey ??
              q?.userAnswer?.answer?.content ??
              null;
            if (answerKey) {
              setAnswer(q.id, String(answerKey));
            }
          });
        });
      });
    } else if (attempt.selectedAnswers) {
      // fallback: old mapping shape { questionId: "A" }
      // Object.entries(attempt.selectedAnswers).forEach(([qId, key]) => {
      //   const answerKey = typeof key === "string" ? key : String(key);
      //   setAnswer(qId, answerKey);
      // });
    }

    // // 4. Restore Test State (nếu có)
    // if (attempt.currentPartNumber) {
    //   setCurrentPart(attempt.currentPartNumber);
    // }
    // if (attempt.currentGroupId) {
    //   setCurrentGroup(attempt.currentGroupId);
    // }

    // 5. Redirect vào lại trang đang làm
    router.push(`/tests/${attempt?.test?.id}/start`);
  }

  async function handleReview(attempt) {
    // Ensure store has attempt context for read-only review mode
    setAttemptId(attempt.id);
    setFullTest({ ...attempt, mode: "review" });

    if (Array.isArray(attempt?.parts) && attempt?.parts?.length > 0) {
      attempt?.parts?.forEach((part: any) => {
        part.groups?.forEach((group: any) => {
          group.questions?.forEach((q: any) => {
            const answerKey =
              q?.userAnswer?.answer?.answerKey ??
              q?.userAnswer?.answerKey ??
              q?.userAnswer?.answer?.content ??
              null;
            if (answerKey) {
              setAnswer(q.id, String(answerKey));
            }
          });
        });
      });
    }

    router.push(
      `/tests/${attempt?.test?.id}/start?attemptId=${attempt.id}&mode=review`
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p>Đang tải lịch sử...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">Không tải được lịch sử.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">

        {attempts.length === 0 ? (
          <div className="rounded-lg bg-white shadow p-6 text-center text-gray-600">
            Chưa có lịch sử làm bài.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Bài thi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Ngày
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Chế độ
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Điểm
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Đúng
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {attempts.map((a: any, idx: number) => {
                  const id = a.attemptId ?? a.id ?? a._id ?? "";
                  const testTitle =
                    a.test?.title ?? a.title ?? a.testTitle ?? "TOEIC";
                  const createdAt =
                    a.createdAt ?? a.startedAt ?? a.created_at ?? a.startedAt;
                  const date = createdAt
                    ? new Date(createdAt).toLocaleString()
                    : "-";
                  const mode = (
                    a.mode ??
                    a.attemptMode ??
                    "practice"
                  ).toString();
                  const score = a.score ?? a.result?.score ?? "-";
                  const correct = a.correctCount ?? a.correct ?? "-";
                  const total = a.totalQuestions ?? a.total ?? "-";
                  const duration = a.duration
                    ? `${Math.floor(a.duration / 60)}m ${a.duration % 60}s`
                    : a.timeSpent
                    ? `${Math.floor(a.timeSpent / 60)}m ${a.timeSpent % 60}s`
                    : "-";

                  return (
                    <tr key={id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {testTitle}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mode}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-800 font-medium">
                        {a.listeningScore + a.readingScore}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">
                        {correct}/{total}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">
                        {a.status}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {a.status === "in_progress" && (
                            <Button
                              onClick={() => {
                                console.log("aaa", a);
                                handleContinue(a);
                              }}
                              className="px-3 py-1.5 rounded"
                            >
                              Tiếp tục
                            </Button>
                          )}
                          {a.status !== "in_progress" && (
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleReview(a);
                              }}
                              className="px-3 py-1.5 text-sm bg-primary text-white rounded"
                            >
                              Xem kết quả
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
