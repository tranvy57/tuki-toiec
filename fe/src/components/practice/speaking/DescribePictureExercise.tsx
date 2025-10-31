"use client";

import { useState } from "react";
import { FileText, Camera, Clock, Info, Volume2, Eye, EyeOff, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface DescribePictureExerciseProps {
    exerciseData: any;
}

export default function DescribePictureExercise({ exerciseData }: DescribePictureExerciseProps) {
    const [showSampleText, setShowSampleText] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const promptData = exerciseData.promptJsonb || {};
    const solutionData = exerciseData.solutionJsonb || {};

    const preparationTime = promptData.preparation_time || 45;
    const speakingTime = promptData.speaking_time || 30;
    const imageUrl = promptData.image_url;
    const directions = promptData.directions || "Describe a picture";
    const questionText = promptData.question_text || "";
    const sampleText = solutionData.sample_text || "";
    const sampleAudioUrl = solutionData.audio_url;

    const playAudio = () => {
        if (sampleAudioUrl) {
            const audio = new Audio(sampleAudioUrl);
            audio.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            <Camera className="w-6 h-6 text-blue-500" />
                            {exerciseData.title}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                Độ khó: {exerciseData.difficulty === 'medium' ? 'Trung bình' : exerciseData.difficulty}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Band: {exerciseData.bandHint}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">Chuẩn bị: {preparationTime}s</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">Nói: {speakingTime}s</span>
                        </div>
                    </div>
                </div>

                {/* Directions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Hướng dẫn</h3>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        {questionText}
                    </p>
                </div>
            </div>

            {/* Image Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{directions}</h3>
                </div>

                <div className="relative">
                    {imageUrl && !imageError ? (
                        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            <img
                                src={imageUrl}
                                alt="Describe this picture"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoaded(false);
                                }}
                            />
                            {imageLoaded && (
                                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                    📸 Mô tả hình ảnh này
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                            <Camera className="w-16 h-16 mb-4 text-gray-400" />
                            <span className="text-lg font-medium text-gray-500 mb-2">
                                {imageError ? "Không thể tải hình ảnh" : "Đang tải hình ảnh..."}
                            </span>
                            {imageError && (
                                <span className="text-sm text-gray-400">Vui lòng thử lại sau</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Preparation Tips */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Gợi ý chuẩn bị:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Quan sát tổng thể hình ảnh và các chi tiết chính</li>
                        <li>• Mô tả người, vật, hoạt động và bối cảnh</li>
                        <li>• Sử dụng thì hiện tại tiếp diễn (present continuous)</li>
                        <li>• Nói rõ ràng và có logic từ tổng thể đến chi tiết</li>
                    </ul>
                </div>
            </div>

            {/* Sample Answer Section */}
            {sampleText && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Câu trả lời mẫu</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {sampleAudioUrl && (
                                <Button
                                    onClick={playAudio}
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                >
                                    <PlayCircle className="w-4 h-4 mr-1" />
                                    Nghe audio mẫu
                                </Button>
                            )}
                            <Button
                                onClick={() => setShowSampleText(!showSampleText)}
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                            >
                                {showSampleText ? (
                                    <EyeOff className="w-4 h-4 mr-1" />
                                ) : (
                                    <Eye className="w-4 h-4 mr-1" />
                                )}
                                {showSampleText ? "Ẩn" : "Xem"} text mẫu
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showSampleText && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-800 leading-relaxed whitespace-pre-line">
                                        {sampleText}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Instructions for Recording */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Sẵn sàng ghi âm?</h3>
                </div>
                <div className="text-blue-800 space-y-2">
                    <p className="font-medium">Quy trình thực hiện:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-2">1️⃣</div>
                            <div className="font-medium text-blue-900">Chuẩn bị</div>
                            <div className="text-sm text-blue-700">{preparationTime} giây</div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-2">2️⃣</div>
                            <div className="font-medium text-blue-900">Ghi âm</div>
                            <div className="text-sm text-blue-700">{speakingTime} giây</div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-2">3️⃣</div>
                            <div className="font-medium text-blue-900">Nộp bài</div>
                            <div className="text-sm text-blue-700">Đánh giá AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}