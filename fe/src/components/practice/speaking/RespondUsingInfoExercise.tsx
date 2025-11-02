"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Volume2,
    Clock,
    ChevronDown,
    ChevronUp,
    Info,
    MessageSquare,
    Headphones,
    ChevronLeft,
    ChevronRight,
    Send,
    CheckCircle,
    Loader2,
    Mic,
    Square,
    Play,
    Pause,
    BookOpen,
    Circle,
    Star,
    AlertCircle,
    TrendingUp,
} from "lucide-react";
import { LessonItem } from "@/api/useLessons";
import { useEvaluateSpeakingAttempt } from "@/api/useSpeakingAttempt";
// Note: response shape may vary across evaluators; we render defensively.

interface RespondUsingInfoExerciseProps {
    exerciseData: {
        lessonId: string;
        items: LessonItem[];
        name: string;
        vietnameseName: string;
        duration: number;
        timeLimit: string;
    };
}

export default function RespondUsingInfoExercise({
    exerciseData,
}: RespondUsingInfoExerciseProps) {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);
    const [isSampleExpanded, setIsSampleExpanded] = useState(false);
    const [isBasicInfoPlaying, setIsBasicInfoPlaying] = useState(false);
    const [isSamplePlaying, setIsSamplePlaying] = useState(false);
    const [submittedAnswers, setSubmittedAnswers] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Store evaluation results per item. Use `any` to be resilient to API shape changes.
    const [evaluationResults, setEvaluationResults] = useState<{ [key: number]: any }>({});
    const [showEvaluation, setShowEvaluation] = useState<{ [key: number]: boolean }>({});

    // Recording states for each question individually
    const [recordingStates, setRecordingStates] = useState<{ [key: number]: 'idle' | 'recording' | 'stopped' }>({});
    const [recordings, setRecordings] = useState<{ [key: number]: Blob | null }>({});
    const [isPlayingRecording, setIsPlayingRecording] = useState<{ [key: number]: boolean }>({});

    // Refs for each question
    const mediaRecorderRefs = useRef<{ [key: number]: MediaRecorder | null }>({});
    const basicInfoAudioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
    const sampleAudioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
    const recordingAudioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

    const { items } = exerciseData;
    const currentItem = items[currentItemIndex];

    // Current evaluation (normalized to handle both {data: {...}} and direct {...})
    const currentEvalRaw = evaluationResults[currentItemIndex];
    const currentEval = (currentEvalRaw && currentEvalRaw.data) ? currentEvalRaw.data : currentEvalRaw;
    const overallValue = typeof currentEval?.overall === 'number' ? currentEval.overall : undefined;
    const overallMax = overallValue !== undefined && overallValue <= 10 ? 10 : 100;

    // API hook for evaluation
    const evaluateSpeakingMutation = useEvaluateSpeakingAttempt();

    // Helper function to strip HTML tags
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    // Get current question's states
    const currentRecordingState = recordingStates[currentItemIndex] || 'idle';
    const currentRecording = recordings[currentItemIndex];
    const isCurrentRecordingPlaying = isPlayingRecording[currentItemIndex] || false;
    const isCurrentAnswerSubmitted = submittedAnswers.has(currentItem.id);

    // Audio controls
    const playBasicInfoAudio = () => {
        const audio = basicInfoAudioRefs.current[currentItemIndex];
        if (audio) {
            if (isBasicInfoPlaying) {
                audio.pause();
                setIsBasicInfoPlaying(false);
            } else {
                audio.play();
                setIsBasicInfoPlaying(true);
            }
        }
    };

    const playSampleAudio = () => {
        const audio = sampleAudioRefs.current[currentItemIndex];
        if (audio) {
            if (isSamplePlaying) {
                audio.pause();
                setIsSamplePlaying(false);
            } else {
                audio.play();
                setIsSamplePlaying(true);
            }
        }
    };

    // Recording controls for current question
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setRecordings(prev => ({
                    ...prev,
                    [currentItemIndex]: blob
                }));
                setRecordingStates(prev => ({
                    ...prev,
                    [currentItemIndex]: 'stopped'
                }));

                // Clean up stream
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRefs.current[currentItemIndex] = mediaRecorder;
            mediaRecorder.start();

            setRecordingStates(prev => ({
                ...prev,
                [currentItemIndex]: 'recording'
            }));
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        const mediaRecorder = mediaRecorderRefs.current[currentItemIndex];
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    };

    const playRecording = () => {
        const recording = recordings[currentItemIndex];
        if (recording) {
            const audio = recordingAudioRefs.current[currentItemIndex];
            if (audio) {
                if (isCurrentRecordingPlaying) {
                    audio.pause();
                } else {
                    const url = URL.createObjectURL(recording);
                    audio.src = url;
                    audio.play();
                    setIsPlayingRecording(prev => ({
                        ...prev,
                        [currentItemIndex]: true
                    }));
                }
            }
        }
    };

    // Submit answer for current question
    const handleSubmitAnswer = async () => {
        if (!currentRecording || isCurrentAnswerSubmitted) return;

        setIsSubmitting(true);
        try {
            // Create the question text from current item
            const questionText = `${currentItem.promptJsonb?.question_text || ''}. 
            Context: ${currentItem.promptJsonb?.content ? stripHtmlTags(currentItem.promptJsonb.content) : ''}`;

            // Call evaluation API
            const evaluationResult = await evaluateSpeakingMutation.mutateAsync({
                audio: currentRecording,
                question: questionText,
                type: "respond using info",
                context: currentItem.promptJsonb?.content ? stripHtmlTags(currentItem.promptJsonb.content) : '',
            });

            // Store evaluation result
            setEvaluationResults(prev => ({
                ...prev,
                [currentItemIndex]: evaluationResult
            }));

            // Show evaluation result
            setShowEvaluation(prev => ({
                ...prev,
                [currentItemIndex]: true
            }));

            // Mark as submitted
            setSubmittedAnswers(prev => new Set([...prev, currentItem.id]));

            // Auto advance to next question after showing result for 3 seconds
            if (currentItemIndex < items.length - 1) {
                setTimeout(() => {
                    setCurrentItemIndex(currentItemIndex + 1);
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Có lỗi xảy ra khi đánh giá câu trả lời. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
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

    // Handle clicking on progress item
    const handleProgressItemClick = (idx: number) => {
        setCurrentItemIndex(idx);
        // Show evaluation if this question was submitted
        if (submittedAnswers.has(items[idx].id) && evaluationResults[idx]) {
            setShowEvaluation(prev => ({
                ...prev,
                [idx]: true
            }));
        }
    };

    // Cleanup on unmount or item change
    useEffect(() => {
        return () => {
            // Clean up all media recorders
            Object.values(mediaRecorderRefs.current).forEach(recorder => {
                if (recorder && recorder.state === 'recording') {
                    recorder.stop();
                }
            });
        };
    }, []);

    // Reset audio playing states when changing questions
    useEffect(() => {
        setIsBasicInfoPlaying(false);
        setIsSamplePlaying(false);
        setIsPlayingRecording(prev => ({
            ...prev,
            [currentItemIndex]: false
        }));
    }, [currentItemIndex]);

    // Auto-hide evaluation after 10 seconds unless user interacts with it
    useEffect(() => {
        if (showEvaluation[currentItemIndex]) {
            const timer = setTimeout(() => {
                setShowEvaluation(prev => ({
                    ...prev,
                    [currentItemIndex]: false
                }));
            }, 10000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [showEvaluation[currentItemIndex], currentItemIndex]);

    return (
        <div className="flex flex-col max-h-[calc(100vh-150px)] bg-gray-50">
            {/* Navigation Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">


                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
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
                                    : submittedAnswers.has(items[idx].id)
                                        ? 'bg-green-500'
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
            </div>

            {/* Main Content - 2 Columns */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Information & Questions */}
                <div className="w-1/2 flex flex-col bg-white overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Instructions */}

                        <div className="">
                            <div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-orange-600" />
                                    <div className="text-lg">
                                        Câu hỏi #{currentItem.promptJsonb?.question_number || ""}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* Basic Info Audio */}
                                {currentItem.promptJsonb?.basic_info && (
                                    <div className="mb-4 p-3 bg-white rounded-lg border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Thông tin bổ sung:
                                            </span>
                                            {currentItem.promptJsonb?.basic_info_audio && (
                                                <Button
                                                    onClick={playBasicInfoAudio}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8"
                                                >
                                                    <Headphones className={`w-4 h-4 mr-1 ${isBasicInfoPlaying ? 'text-blue-600' : ''}`} />
                                                    {isBasicInfoPlaying ? "Đang phát" : "Nghe"}
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            {stripHtmlTags(currentItem.promptJsonb.basic_info)}
                                        </p>
                                    </div>
                                )}

                                {/* Main Question */}
                                <div className="p-4 bg-white rounded-lg border-l-4 border-orange-400">
                                    <p className="text-lg text-gray-800 font-medium">
                                        {currentItem.promptJsonb?.question_text || "Không có câu hỏi"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Information Content */}
                        <div className="border-gray-200 flex-1">
                            <div
                                className="cursor-pointer"
                                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <CardTitle className="text-lg">Thông tin cần đọc</CardTitle>
                                    </div>
                                    {isInfoExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <AnimatePresence>
                                {isInfoExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="pt-0">
                                            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: currentItem.promptJsonb?.content || "Không có thông tin"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Question Section */}

                        {/* Sample Answer (if available) */}
                        {currentItem.solutionJsonb?.audio_url && (
                            <Card className="border-green-200">
                                <CardHeader
                                    className="cursor-pointer"
                                    onClick={() => setIsSampleExpanded(!isSampleExpanded)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="w-5 h-5 text-green-600" />
                                            <CardTitle className="text-lg text-green-800">Bài mẫu tham khảo</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playSampleAudio();
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                            >
                                                <Volume2 className={`w-4 h-4 mr-1 ${isSamplePlaying ? 'text-green-600' : ''}`} />
                                                {isSamplePlaying ? "Đang phát" : "Nghe"}
                                            </Button>
                                            {isSampleExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <AnimatePresence>
                                    {isSampleExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <CardContent className="pt-0">
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <p className="text-green-800 text-sm">
                                                        {currentItem.solutionJsonb?.sample_answer || "Bấm nút nghe để tham khảo cách trả lời mẫu"}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Right Column - Recording & Controls */}
                <div className="w-1/2 flex flex-col bg-gray-25 overflow-hidden border-l border-gray-200">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Recording Section */}
                        <Card className="border-2 border-dashed border-gray-300">
                            <CardContent className="`">
                                <div className="text-center">
                                    <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Ghi âm câu trả lời
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Nhấn nút bên dưới để bắt đầu ghi âm câu trả lời của bạn
                                    </p>

                                    <div className="space-y-4">
                                        {/* Recording Controls */}
                                        <div className="flex justify-center">
                                            {currentRecordingState === 'idle' && (
                                                <Button
                                                    onClick={startRecording}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                                                    size="lg"
                                                >
                                                    <Mic className="w-5 h-5 mr-3" />
                                                    Bắt đầu ghi âm
                                                </Button>
                                            )}

                                            {currentRecordingState === 'recording' && (
                                                <Button
                                                    onClick={stopRecording}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg"
                                                    size="lg"
                                                >
                                                    <Square className="w-5 h-5 mr-3" />
                                                    Dừng ghi âm
                                                </Button>
                                            )}
                                        </div>

                                        {/* Recording Status */}
                                        {currentRecordingState === 'recording' && (
                                            <div className="flex items-center justify-center gap-3 text-red-600">
                                                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                                                <span className="text-lg font-medium">Đang ghi âm...</span>
                                            </div>
                                        )}

                                        {/* Playback Controls */}
                                        {currentRecordingState === 'stopped' && currentRecording && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span className="text-lg font-medium">Đã ghi âm thành công!</span>
                                                </div>

                                                <Button
                                                    onClick={playRecording}
                                                    variant="outline"
                                                    className="w-full py-3 text-lg border-2"
                                                >
                                                    {isCurrentRecordingPlaying ? (
                                                        <>
                                                            <Pause className="w-5 h-5 mr-3" />
                                                            Tạm dừng phát lại
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="w-5 h-5 mr-3" />
                                                            Nghe lại bản ghi
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Question Metadata & Submit */}
                        <Card className="border-orange-200">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Question Info */}
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="border-orange-300 text-orange-700 px-3 py-1">
                                            {currentItem.difficulty}
                                        </Badge>
                                        <span className="text-sm text-orange-700">
                                            Band điểm mục tiêu: {currentItem.bandHint}
                                        </span>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        onClick={handleSubmitAnswer}
                                        disabled={isCurrentAnswerSubmitted || isSubmitting || !currentRecording}
                                        className={`w-full py-3 text-lg ${isCurrentAnswerSubmitted
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-orange-600 hover:bg-orange-700'
                                            } text-white`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                Đang đánh giá...
                                            </>
                                        ) : isCurrentAnswerSubmitted ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-3" />
                                                Đã nộp bài thành công
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-3" />
                                                Nộp câu trả lời
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evaluation Results */}
                        {showEvaluation[currentItemIndex] && evaluationResults[currentItemIndex] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                                <CardTitle className="text-lg text-blue-800">
                                                    Kết quả đánh giá
                                                </CardTitle>
                                            </div>
                                            <Button
                                                onClick={() => setShowEvaluation(prev => ({
                                                    ...prev,
                                                    [currentItemIndex]: false
                                                }))}
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Overall Score */}
                                        <div className="text-center p-4 bg-white rounded-lg border">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Star className="w-6 h-6 text-yellow-500" />
                                                <span className="text-2xl font-bold text-gray-800">
                                                    {overallValue !== undefined ? (
                                                        <>
                                                            {overallValue}
                                                            {overallMax ? `/` + overallMax : null}
                                                        </>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Điểm tổng thể</p>
                                        </div>

                                        {/* Audio playback (server-stored) */}
                                        {currentEval?.audioUrl && (
                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-sm font-medium text-gray-700 mb-2">Bản ghi đã lưu</div>
                                                <audio controls src={currentEval.audioUrl} className="w-full" />
                                            </div>
                                        )}

                                        {/* Transcript */}
                                        {currentEval?.transcript && (
                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-sm font-medium text-gray-700 mb-1">Transcript</div>
                                                <p className="text-sm text-gray-800 leading-relaxed">{currentEval.transcript}</p>
                                            </div>
                                        )}

                                        {/* Detailed Scores */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <div className="text-lg font-semibold text-blue-600">
                                                    {currentEval?.pronunciation ?? "-"}
                                                </div>
                                                <div className="text-xs text-gray-600">Phát âm</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <div className="text-lg font-semibold text-green-600">
                                                    {currentEval?.fluency ?? "-"}
                                                </div>
                                                <div className="text-xs text-gray-600">Trôi chảy</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <div className="text-lg font-semibold text-purple-600">
                                                    {currentEval?.grammar ?? "-"}
                                                </div>
                                                <div className="text-xs text-gray-600">Ngữ pháp</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <div className="text-lg font-semibold text-orange-600">
                                                    {currentEval?.vocabulary ?? "-"}
                                                </div>
                                                <div className="text-xs text-gray-600">Từ vựng</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center col-span-2">
                                                <div className="text-lg font-semibold text-rose-600">
                                                    {currentEval?.task ?? "-"}
                                                </div>
                                                <div className="text-xs text-gray-600">Hoàn thành nhiệm vụ</div>
                                            </div>
                                        </div>

                                        {/* Detailed Feedback */}
                                        {currentEval?.feedback && (
                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <h4 className="font-medium text-gray-800">Phản hồi chi tiết:</h4>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {currentEval.feedback}
                                                </p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => setShowEvaluation(prev => ({
                                                    ...prev,
                                                    [currentItemIndex]: false
                                                }))}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Đóng
                                            </Button>
                                            {currentItemIndex < items.length - 1 && (
                                                <Button
                                                    onClick={() => {
                                                        setShowEvaluation(prev => ({
                                                            ...prev,
                                                            [currentItemIndex]: false
                                                        }));
                                                        setCurrentItemIndex(currentItemIndex + 1);
                                                    }}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    Câu tiếp theo
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Progress Summary */}
                        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 mt-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-green-600" />
                                        <CardTitle className="text-lg text-green-800">
                                            Tiến độ bài học
                                        </CardTitle>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">
                                        {submittedAnswers.size}/{items.length} câu đã hoàn thành
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2">
                                    {items.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${idx === currentItemIndex
                                                ? 'border-green-500 bg-green-100 shadow-md'
                                                : submittedAnswers.has(item.id)
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            onClick={() => handleProgressItemClick(idx)}
                                        >
                                            <div className="flex items-center justify-center mb-1">
                                                {submittedAnswers.has(item.id) ? (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        {evaluationResults[idx] && (
                                                            <span className="text-xs font-bold text-blue-600">
                                                                {(evaluationResults[idx]?.data?.overall ?? evaluationResults[idx]?.overall) ?? "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : idx === currentItemIndex ? (
                                                    <Clock className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <p className="text-xs font-medium">
                                                Câu {idx + 1}
                                            </p>
                                            {evaluationResults[idx] && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <div className="flex justify-center">
                                                        <Star className="w-3 h-3 text-yellow-500" />
                                                    </div>
                                                    <div className="text-xs text-blue-600 font-medium">
                                                        Click để xem
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Hidden Audio Elements */}
            {items.map((item, index) => (
                <div key={`audio-${item.id}`}>
                    {/* Basic Info Audio */}
                    {item.promptJsonb?.basic_info_audio && (
                        <audio
                            ref={(el) => {
                                basicInfoAudioRefs.current[index] = el;
                            }}
                            src={item.promptJsonb.basic_info_audio}
                            onEnded={() => {
                                if (index === currentItemIndex) {
                                    setIsBasicInfoPlaying(false);
                                }
                            }}
                            preload="metadata"
                        />
                    )}

                    {/* Sample Audio */}
                    {item.solutionJsonb?.audio_url && (
                        <audio
                            ref={(el) => {
                                sampleAudioRefs.current[index] = el;
                            }}
                            src={item.solutionJsonb.audio_url}
                            onEnded={() => {
                                if (index === currentItemIndex) {
                                    setIsSamplePlaying(false);
                                }
                            }}
                            preload="metadata"
                        />
                    )}

                    {/* Recording Playback Audio */}
                    <audio
                        ref={(el) => {
                            recordingAudioRefs.current[index] = el;
                        }}
                        onEnded={() => {
                            if (index === currentItemIndex) {
                                setIsPlayingRecording(prev => ({
                                    ...prev,
                                    [index]: false
                                }));
                            }
                        }}
                        preload="metadata"
                    />
                </div>
            ))}
        </div>
    );
}