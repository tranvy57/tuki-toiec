"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MessageCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    Info,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Users,
    Lightbulb,
    CheckCircle2,
} from "lucide-react";
import { LessonItem } from "@/api/useLessons";

interface ExpressOpinionExerciseProps {
    exerciseData: {
        lessonId: string;
        items: LessonItem[];
        name: string;
        vietnameseName: string;
        duration: number;
        timeLimit: string;
    };
}

export default function ExpressOpinionExercise({
    exerciseData,
}: ExpressOpinionExerciseProps) {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isSampleExpanded, setIsSampleExpanded] = useState(false);
    const [isSamplePlaying, setIsSamplePlaying] = useState(false);
    const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

    const { items } = exerciseData;
    const currentItem = items[currentItemIndex];

    // Helper function to strip HTML tags
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    // Audio controls for sample
    const playSampleAudio = () => {
        if (sampleAudioRef.current) {
            if (isSamplePlaying) {
                sampleAudioRef.current.pause();
                setIsSamplePlaying(false);
            } else {
                sampleAudioRef.current.play();
                setIsSamplePlaying(true);
            }
        }
    };



    // Navigation handlers
    const handlePrevious = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(currentItemIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentItemIndex < items.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Express Opinion
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Bày tỏ quan điểm cá nhân • {items.length} câu hỏi
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="px-3 py-1">
                        Câu {currentItemIndex + 1}/{items.length}
                    </Badge>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={handlePrevious}
                    disabled={currentItemIndex === 0}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Câu trước
                </Button>

                <div className="flex items-center gap-2">
                    {items.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${idx === currentItemIndex
                                    ? 'bg-blue-600 scale-125'
                                    : 'bg-gray-300'
                                }`}
                            onClick={() => setCurrentItemIndex(idx)}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleNext}
                    disabled={currentItemIndex === items.length - 1}
                    variant="outline"
                    size="sm"
                >
                    Câu tiếp
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Instructions */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-lg text-purple-800">
                            Hướng dẫn bài tập
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-purple-700 mb-3">
                        {currentItem.promptJsonb?.directions || "Bày tỏ quan điểm cá nhân của bạn về chủ đề được đưa ra. Hãy đưa ra lý do và ví dụ để hỗ trợ cho quan điểm của bạn."}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-purple-600">
                                {currentItem.promptJsonb?.speaking_time || 60} giây
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-purple-600">
                                Nêu quan điểm cá nhân
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Topic & Question Section */}
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-orange-600" />
                        <CardTitle className="text-lg text-orange-800">
                            Chủ đề thảo luận
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Main Topic/Question */}
                    <div className="p-4 bg-white rounded-lg border-l-4 border-orange-400">
                        <div className="flex items-start gap-3">
                            <Users className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                            <div className="text-gray-800 leading-relaxed">
                                {stripHtmlTags(currentItem.promptJsonb?.content || "")}
                            </div>
                        </div>
                    </div>

                    {/* Tips for answering */}
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-700">
                                <strong>Gợi ý:</strong> Bắt đầu với quan điểm rõ ràng, đưa ra 2-3 lý lẽ chính,
                                sử dụng ví dụ cụ thể để minh họa, và kết thúc bằng cách tóm tắt quan điểm của bạn.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sample Answer (if available) */}
            {currentItem.solutionJsonb?.audio_url && (
                <Card className="border-green-200">
                    <CardHeader
                        className="cursor-pointer"
                        onClick={() => setIsSampleExpanded(!isSampleExpanded)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-lg text-green-800">
                                    Câu trả lời mẫu
                                </CardTitle>
                            </div>
                            {isSampleExpanded ? (
                                <ChevronUp className="w-5 h-5 text-green-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-green-600" />
                            )}
                        </div>
                    </CardHeader>
                    <AnimatePresence>
                        {isSampleExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <CardContent>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={playSampleAudio}
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            {isSamplePlaying ? (
                                                <Pause className="w-4 h-4 mr-2" />
                                            ) : (
                                                <Play className="w-4 h-4 mr-2" />
                                            )}
                                            {isSamplePlaying ? "Dừng" : "Nghe"} câu trả lời mẫu
                                        </Button>

                                        {currentItem.solutionJsonb?.sample_answer && (
                                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                <p className="text-sm text-green-800 font-medium mb-2">
                                                    Nội dung mẫu:
                                                </p>
                                                <p className="text-green-700 text-sm leading-relaxed">
                                                    {stripHtmlTags(currentItem.solutionJsonb.sample_answer)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            )}

            {/* Hidden Audio Element for Sample */}
            {currentItem.solutionJsonb?.audio_url && (
                <audio
                    ref={sampleAudioRef}
                    src={currentItem.solutionJsonb.audio_url}
                    onEnded={() => setIsSamplePlaying(false)}
                    preload="metadata"
                />
            )}
        </div>
    );
}