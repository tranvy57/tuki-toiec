"use client";

import React from "react";
import Link from "next/link";
import { useGetAttemptHistory } from "@/api";

export default function HistoryPage() {
  const { data, isLoading, isError } = useGetAttemptHistory();

  // normalize possible shapes: data.data, data.items, or direct array
  const attempts = React.useMemo(() => {
    if (!data) return [];
    return data.data?.data ?? [];
  }, [data]);

  console.log("attempts:", attempts);

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
        <h2 className="text-2xl font-semibold mb-6">Lịch sử làm bài</h2>

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
                    Thời gian
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
                        {score}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">
                        {correct}/{total}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">
                        {duration}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/history/${id}`}
                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            Xem
                          </Link>
                          <Link
                            href={`/tests/${
                              a.testId ?? a.test?.id ?? ""
                            }/review?attemptId=${id}`}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-primary text-white rounded"
                          >
                            Xem kết quả
                          </Link>
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
