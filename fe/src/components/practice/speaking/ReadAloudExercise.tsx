"use client";

import { FileText, Clock } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ReadAloudExerciseProps {
    exerciseData: any;
}

export default function ReadAloudExercise({ exerciseData }: ReadAloudExerciseProps) {
    return (
        <div className="rounded-sm p-4">
            <div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    {exerciseData.title}
                </div>
            </div>
            <div className="space-y-4">
                {/* Directions */}
                {/* Question Text */}
                {exerciseData.promptJsonb?.question_text && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {exerciseData.promptJsonb.question_text}
                        </p>
                    </div>
                )}

                {/* Time Information */}
                {(exerciseData.promptJsonb?.preparation_time || exerciseData.promptJsonb?.speaking_time) && (
                    <div className="flex gap-4">
                        {exerciseData.promptJsonb.preparation_time && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Chuẩn bị: {exerciseData.promptJsonb.preparation_time}s
                            </Badge>
                        )}
                        {exerciseData.promptJsonb.speaking_time && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Nói: {exerciseData.promptJsonb.speaking_time}s
                            </Badge>
                        )}
                    </div>
                )}

                {/* Image content (if available) */}
                {exerciseData.promptJsonb?.image_url && (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={exerciseData.promptJsonb.image_url}
                            alt="Exercise image"
                            fill
                            className="object-contain"
                        />
                    </div>
                )}

                {/* Reading Paragraph Section */}
                {exerciseData.promptJsonb.content && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <FileText className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="font-medium text-blue-900">Read the following paragraph aloud:</h4>
                        </div>

                        <div className="bg-white border border-blue-100 rounded-lg p-6">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    📖 Đọc to đoạn văn sau
                                </div>
                            </div>
                            <div className="prose prose-lg max-w-none text-center">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-dashed border-blue-200">
                                    {exerciseData.promptJsonb.content.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                                        <p key={index} className="text-gray-900 leading-relaxed mb-4 last:mb-0 text-lg font-medium tracking-wide">
                                            {paragraph.trim()}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm text-blue-600 italic">
                                    💡 Hãy đọc rõ ràng và từ tốn để hệ thống có thể đánh giá chính xác
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* No content fallback */}
                {!exerciseData.promptJsonb.content && !exerciseData.promptJsonb?.image_url && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No content available for this exercise</p>
                    </div>
                )}

                {/* Sample Audio if available */}
                {/* {exerciseData.solutionJsonb?.audio_url && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h4 className="font-medium text-green-800 mb-2">Âm thanh mẫu:</h4>
                            <audio controls src={exerciseData.solutionJsonb.audio_url} className="w-full">
                                Trình duyệt của bạn không hỗ trợ phát audio.
                            </audio>
                        </div>
                    )} */}
            </div>
        </div>
    );
}