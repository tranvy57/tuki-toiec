"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Mic,
    MicOff,
    RotateCcw,
    Loader2,
    AlertTriangle,
    Sparkles,
    Clock,
    CheckCircle,
    Eye,
    EyeOff,
    Volume2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEvaluateSpeakingAttempt } from "@/api/useSpeakingAttempt";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface SpeakingExerciseBaseProps {
    exerciseData: any;
    children: ReactNode;
}

export default function SpeakingExerciseBase({
    exerciseData,
    children
}: SpeakingExerciseBaseProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [apiResult, setApiResult] = useState<any | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(1);
    const [showTranscript, setShowTranscript] = useState(false);

    // Speech recognition states
    const [expectedText, setExpectedText] = useState("");
    const [isReadAloudExercise, setIsReadAloudExercise] = useState(false);
    const [isExpressOpinionExercise, setIsExpressOpinionExercise] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState(""); // Lưu transcript cuối cùng
    const [processedWords, setProcessedWords] = useState<Set<number>>(new Set());

    const recordingIntervalRef = useRef<NodeJS.Timeout>(undefined);
    const timerIntervalRef = useRef<NodeJS.Timeout>(undefined);
    const audioLevelIntervalRef = useRef<NodeJS.Timeout>(undefined);

    // Audio feedback hook
    const {
        playCorrectSound,
        playErrorSound,
        playMissingSound,
        playSuccessSound,
        playWarningSound
    } = useAudioFeedback({
        enableSound: true,
        enableVibration: true,
        volume: 0.2
    });

    const {
        transcript: realtimeTranscript,
        listening: speechListening,
        isSupported: speechRecognitionSupported,
        isAnalyzing,
        currentAnalysis,
        startListening: startSpeechRecognition,
        stopListening: stopSpeechRecognition,
        reset: resetSpeechRecognition,
        getFinalAnalysis
    } = useSpeechRecognition({
        expectedText: isReadAloudExercise ? expectedText : "",
        language: 'en-US',
        continuous: true,
        interimResults: true,
        onRealTimeAnalysis: (analysis) => {

            if (analysis && isRecording && isReadAloudExercise) {
                const wordsSpoken = analysis.error_segments.filter(seg =>
                    seg.status === 'correct' || seg.status === 'mispronounced'
                ).length;

                const newlyProcessedWords = new Set<number>();
                analysis.error_segments.forEach((segment, index) => {
                    if ((segment.status === 'correct' || segment.status === 'mispronounced') &&
                        !processedWords.has(segment.position || index)) {
                        newlyProcessedWords.add(segment.position || index);

                        // Phát âm thanh cho từ mới
                        if (segment.status === 'correct') {
                            playCorrectSound();
                        } else if (segment.status === 'mispronounced') {
                            playErrorSound();
                        }
                    }
                });

                setProcessedWords(prev => new Set([...prev, ...newlyProcessedWords]));

                const expectedWords = expectedText.toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .split(' ')
                    .filter(word => word.length > 0);

                if (wordsSpoken > 0 && wordsSpoken < expectedWords.length) {
                    const missingAtCurrentPos = analysis.error_segments.find(seg =>
                        seg.position === wordsSpoken - 1 && seg.status === 'missing'
                    );

                    if (missingAtCurrentPos && !processedWords.has(missingAtCurrentPos.position || 0)) {
                        playMissingSound();
                        setProcessedWords(prev => new Set([...prev, missingAtCurrentPos.position || 0]));
                    }
                }

                const currentErrorCount = analysis.error_segments.filter(seg => seg.status !== 'correct').length;
            }
        }
    });


    const { mutate, data, isPending, isError, reset } = useEvaluateSpeakingAttempt();

    // Initialize expected text and exercise type
    useEffect(() => {
        // Check exercise types
        const isReadAloud = exerciseData.type === 'read_aloud';
        const isExpressOpinion = exerciseData.type === 'express_opinion';
        console.log(isReadAloud)

        setIsReadAloudExercise(isReadAloud);
        setIsExpressOpinionExercise(isExpressOpinion);

        // Set expected text only for read_aloud exercises
        if (isReadAloud && exerciseData.promptJsonb?.content) {
            setExpectedText(exerciseData.promptJsonb.content);
        }
    }, [exerciseData]);

    useEffect(() => {
        if (data && !apiResult) {
            setApiResult(data.data);
            
            setTimeout(() => {
                const resultSection = document.querySelector("[data-result-section]");
                if (resultSection) {
                    resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 300);
        }
    }, [data, apiResult]);


    useEffect(() => {
        return () => {
            console.log("Component unmounting - cleaning up...");

            // Stop speech recognition
            if (isReadAloudExercise || isExpressOpinionExercise) {
                try {
                    stopSpeechRecognition();
                    resetSpeechRecognition();
                } catch (error) {
                    console.warn("Error during cleanup speech recognition:", error);
                }
            }

            // Clear all intervals
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            if (audioLevelIntervalRef.current) {
                clearInterval(audioLevelIntervalRef.current);
            }

            // Stop media recorder and streams
            try {
                if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
                    mediaRecorder.current.stop();
                }
                if (mediaStream.current) {
                    mediaStream.current.getTracks().forEach((track) => track.stop());
                }
            } catch (error) {
                console.warn("Error during cleanup media recorder:", error);
            }
        };
    }, [isReadAloudExercise, isExpressOpinionExercise, stopSpeechRecognition, resetSpeechRecognition]);

    // const formatTime = (seconds: number) => {
    //     const mins = Math.floor(seconds / 60);
    //     const secs = seconds % 60;
    //     return `${mins}:${secs.toString().padStart(2, "0")}`;
    // };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            mediaStream.current = stream;
            mediaRecorder.current = mr;

            const chunks: BlobPart[] = [];
            mr.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            mr.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                setIsProcessing(false);
            };

            mr.start();
            setIsRecording(true);
            setAudioLevel(0);

            if ((isReadAloudExercise || isExpressOpinionExercise) && speechRecognitionSupported) {
                resetSpeechRecognition();
                setFinalTranscript(""); // Reset final transcript
                startSpeechRecognition();
            }

            // timers
            

            audioLevelIntervalRef.current = setInterval(() => {
                setAudioLevel(Math.random() * 100);
            }, 100);
            console.log("check 2 - Recording started with speech recognition:", isReadAloudExercise);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        setAudioLevel(0);

        clearInterval(recordingIntervalRef.current);
        clearInterval(audioLevelIntervalRef.current);

        // Stop speech recognition and save final transcript
        if (isReadAloudExercise || isExpressOpinionExercise) {
            try {
                if (realtimeTranscript) {
                    setFinalTranscript(realtimeTranscript);
                }

                if (isReadAloudExercise) {
                    const finalAnalysis = getFinalAnalysis();

                    if (finalAnalysis && finalAnalysis.score !== undefined) {
                        setApiResult({
                            ...finalAnalysis,
                            type: 'speech_recognition_result',
                            transcript: realtimeTranscript || finalTranscript,
                            feedback: `Kết quả phân tích phát âm: Độ chính xác ${Math.round(finalAnalysis.accuracy * 100)}%. ${finalAnalysis.words_correct}/${finalAnalysis.words_total} từ được phát âm đúng.`
                        });
                    }
                }

                stopSpeechRecognition();

                if (isReadAloudExercise) {
                    setTimeout(() => {
                        resetSpeechRecognition();
                    }, 500); 
                }
            } catch (error) {
                console.error("❌ Error stopping speech recognition:", error);
            }
        }

        const recorder = mediaRecorder.current;
        const stream = mediaStream.current;

        if (recorder && recorder.state !== "inactive") {
            try {
                recorder.stop();
            } catch (err) {
                console.warn("MediaRecorder stop error:", err);
            }
        }

        try {
            stream?.getTracks().forEach((t) => t.stop());
        } catch (e) {
            console.warn("Error stopping tracks:", e);
        }

        mediaRecorder.current = null;
        mediaStream.current = null;
    };

    const submitRecording = () => {
        if (!audioBlob) {
            alert("Bạn chưa ghi âm.");
            return;
        }

        // Clear previous results
        setApiResult(null);

        // Get the question/prompt based on data structure
        const question = exerciseData.prompt ||
            exerciseData.promptJsonb?.question_text ||
            exerciseData.title ||
            "Speaking exercise";

        // Submit using the hook
        mutate({ audio: audioBlob, question: question });
    };

    const handleReset = () => {
        setIsRecording(false);
        setIsProcessing(false);
        setShowTranscript(false);
        setApiResult(null);
        reset();
        setAudioBlob(null);
        setAudioUrl(null);

        // Reset speech recognition
        if (isReadAloudExercise || isExpressOpinionExercise) {
            console.log("Resetting speech recognition...");
            try {
                // First stop listening
                stopSpeechRecognition();

                // Reset after a small delay
                setTimeout(() => {
                    resetSpeechRecognition();
                }, 100);

                // Reset states
                if (isReadAloudExercise) {
                    setProcessedWords(new Set());
                }

                // Reset final transcript for both types
                setFinalTranscript("");
            } catch (error) {
                console.warn("Error resetting speech recognition:", error);
            }
        }

        // Clear all intervals
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = undefined;
        }
        if (audioLevelIntervalRef.current) {
            clearInterval(audioLevelIntervalRef.current);
            audioLevelIntervalRef.current = undefined;
        }
    };

    const handleNextExercise = () => {
        setCurrentExercise((prev) => prev + 1);
        handleReset();
    };

    return (
        <div className="max-h-[calc(100vh-175px)]  bg-white flex flex-col">

            {/* Main Content - 2 Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Instructions & Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 overflow-y-auto p-4"
                >
                    <div className="space-y-4 h-full">
                        {/* Exercise specific content */}
                        {children}
                    </div>
                </motion.div>

                {/* Right Column - Recording Interface & Results */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-1/2  overflow-y-auto p-4 border-l bg-white/30"
                >
                    <div className="space-y-4  overflow-y-auto">
                        {/* Recording Interface */}
                        <div className="">
                            <div className="pb-2">
                                <div className="text-lg font-semibold flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-blue-500" />
                                    Ghi âm & Nộp bài
                                </div>
                            </div>
                            <div className="space-y-4 h-full">
                                {/* Recording Interface */}
                                <div className="">


                                    <div className="space-y-5">
                                        {/* Record / Stop button */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                {isRecording && (
                                                    <div className="absolute -inset-2 pointer-events-none">
                                                        <motion.div
                                                            className="w-full h-full rounded-full border-2 border-red-300"
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{
                                                                duration: 0.5,
                                                                repeat: Number.POSITIVE_INFINITY,
                                                            }}
                                                            style={{ opacity: Math.min(1, audioLevel / 80) }}
                                                        />
                                                    </div>
                                                )}

                                                <motion.button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300
              ${isRecording
                                                            ? "bg-red-500 border-red-300 hover:bg-red-600"
                                                            : "bg-blue-500 border-blue-300 hover:bg-blue-600"
                                                        }
              ${isProcessing
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "hover:scale-105"
                                                        }`}
                                                    animate={isRecording ? { scale: [1, 1.08, 1] } : {}}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
                                                    }}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    ) : isRecording ? (
                                                        <MicOff className="w-8 h-8 text-white" />
                                                    ) : (
                                                        <Mic className="w-8 h-8 text-white" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Compact state line */}

                                    </div>

                                    {/* Action row: Nộp bài + Ghi lại */}
                                    <div className="flex items-center justify-center gap-4 mt-5">
                                        <Button
                                            onClick={submitRecording}
                                            className=" hover:to-violet-600"
                                            disabled={!audioBlob || isPending}
                                        >
                                            {isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang
                                                    gửi
                                                </>
                                            ) : (
                                                "Nộp bài"
                                            )}
                                        </Button>

                                        <Button onClick={handleReset} variant="outline">
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Ghi lại
                                        </Button>
                                    </div>

                                    {audioUrl && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-700 font-medium">
                                                    Nghe lại bản ghi
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {audioBlob
                                                        ? `${(audioBlob.size / 1024).toFixed(1)} KB`
                                                        : ""}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <audio controls src={audioUrl} className="w-full" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {isError && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="border-red-200 bg-red-50">
                                            <div className="py-3">
                                                <div className="text-sm text-red-700 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Gửi bài không thành công. Vui lòng thử lại.
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Real-time Speech Recognition Feedback */}
                            <AnimatePresence>
                                {(isReadAloudExercise || isExpressOpinionExercise) && speechRecognitionSupported && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4"
                                    >
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Volume2 className="w-5 h-5 text-blue-600" />
                                                <h4 className="font-semibold text-blue-900">
                                                    {isReadAloudExercise ? "Real-time Pronunciation Check" : "Voice Recognition"}
                                                </h4>
                                                {isRecording && speechListening && (
                                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        Listening...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Current position indicator */}
                                            {/* {isRecording && speechListening && (
                                                <div className="mb-3">
                                                    <div className="text-sm text-gray-600 mb-2">Tiến độ đọc:</div>
                                                    <div className="bg-white rounded-lg p-3 border">
                                                        <div className="flex flex-wrap gap-1">
                                                            {expectedText.toLowerCase()
                                                                .replace(/[^\w\s]/g, '')
                                                                .split(' ')
                                                                .filter(word => word.length > 0)
                                                                .map((word, index) => {
                                                                    const isCurrentWord = index === currentWordPosition;
                                                                    const isProcessed = processedWords.has(index);
                                                                    const segmentData = currentAnalysis?.error_segments.find(seg => seg.position === index);

                                                                    let bgColor = 'bg-gray-100 text-gray-600'; // Chưa đọc
                                                                    let icon = '';

                                                                    if (isProcessed && segmentData) {
                                                                        if (segmentData.status === 'correct') {
                                                                            bgColor = 'bg-green-100 text-green-800 border-green-200';
                                                                            icon = '✅';
                                                                        } else if (segmentData.status === 'mispronounced') {
                                                                            bgColor = 'bg-orange-100 text-orange-800 border-orange-200';
                                                                            icon = '⚠️';
                                                                        } else if (segmentData.status === 'missing') {
                                                                            bgColor = 'bg-red-100 text-red-800 border-red-200';
                                                                            icon = '❌';
                                                                        }
                                                                    } else if (isCurrentWord) {
                                                                        bgColor = 'bg-blue-200 text-blue-900 border-blue-300 animate-pulse';
                                                                        icon = '🔊';
                                                                    }

                                                                    return (
                                                                        <span
                                                                            key={`word-${index}`}
                                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all duration-200 ${bgColor}`}
                                                                        >
                                                                            {icon && <span>{icon}</span>}
                                                                            {word}
                                                                        </span>
                                                                    );
                                                                })}
                                                        </div>
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            Đã đọc: {processedWords.size}/{expectedText.split(' ').length} từ
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* Real-time transcript */}
                                            {(realtimeTranscript || finalTranscript) && (
                                                <div className="mb-3">
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        {isRecording ? "Bạn đang nói:" : "Transcript cuối cùng:"}
                                                    </div>
                                                    <div className={`bg-white rounded-lg p-3 border text-sm ${isRecording ? 'italic text-blue-800' : 'text-gray-800'}`}>
                                                        "{isRecording ? realtimeTranscript : (finalTranscript || realtimeTranscript)}"
                                                    </div>
                                                </div>
                                            )}

                                            {(currentAnalysis && expectedText && isReadAloudExercise) && (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="text-center p-2 bg-white rounded border">
                                                            <div className="text-lg font-bold text-blue-600">
                                                                {currentAnalysis.score}
                                                            </div>
                                                            <div className="text-xs text-gray-600">Score</div>
                                                        </div>
                                                        <div className="text-center p-2 bg-white rounded border">
                                                            <div className="text-lg font-bold text-green-600">
                                                                {Math.round(currentAnalysis.accuracy * 100)}%
                                                            </div>
                                                            <div className="text-xs text-gray-600">Accuracy</div>
                                                        </div>
                                                        <div className="text-center p-2 bg-white rounded border">
                                                            <div className="text-lg font-bold text-purple-600">
                                                                {currentAnalysis.words_correct}/{currentAnalysis.words_total}
                                                            </div>
                                                            <div className="text-xs text-gray-600">Words</div>
                                                        </div>
                                                    </div>

                                                    {/* Word-by-word analysis */}
                                                    {currentAnalysis.error_segments && currentAnalysis.error_segments.length > 0 && (
                                                        <div className="bg-white rounded-lg p-3 border">
                                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                                📝 Phân tích từng từ:
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {currentAnalysis.error_segments.map((segment, index) => {
                                                                    const getWordStyle = () => {
                                                                        switch (segment.status) {
                                                                            case 'correct':
                                                                                return 'bg-green-100 text-green-800 border-green-200';
                                                                            case 'mispronounced':
                                                                                return 'bg-orange-100 text-orange-800 border-orange-200';
                                                                            case 'missing':
                                                                                return 'bg-red-100 text-red-800 border-red-200 line-through';
                                                                            case 'extra':
                                                                                return 'bg-blue-100 text-blue-800 border-blue-200';
                                                                            default:
                                                                                return 'bg-gray-100 text-gray-600 border-gray-200';
                                                                        }
                                                                    };

                                                                    const getIcon = () => {
                                                                        switch (segment.status) {
                                                                            case 'correct':
                                                                                return '✅';
                                                                            case 'mispronounced':
                                                                                return '⚠️';
                                                                            case 'missing':
                                                                                return '❌';
                                                                            case 'extra':
                                                                                return '➕';
                                                                            default:
                                                                                return '❓';
                                                                        }
                                                                    };

                                                                    return (
                                                                        <span
                                                                            key={`${segment.word}-${index}`}
                                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${getWordStyle()}`}
                                                                            title={segment.suggestion || `${segment.status} - Similarity: ${(segment.similarity || 0).toFixed(2)}`}
                                                                        >
                                                                            <span className="text-xs">{getIcon()}</span>
                                                                            {segment.word}
                                                                            {segment.similarity && segment.similarity < 1 && segment.status !== 'missing' && (
                                                                                <span className="text-xs opacity-70">
                                                                                    ({Math.round(segment.similarity * 100)}%)
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Quick feedback */}
                                                    {(currentAnalysis.words_missing > 0 || currentAnalysis.words_extra > 0) && (
                                                        <div className="flex gap-2 text-sm">
                                                            {currentAnalysis.words_missing > 0 && (
                                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                                                                    ❌ {currentAnalysis.words_missing} từ thiếu
                                                                </span>
                                                            )}
                                                            {currentAnalysis.words_extra > 0 && (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                                    ➕ {currentAnalysis.words_extra} từ thừa
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Detailed error list */}
                                                    {/* {currentAnalysis.error_segments && (
                                                        <div className="space-y-2">
                                                            {currentAnalysis.error_segments
                                                                .filter(seg => seg.status !== 'correct')
                                                                .map((segment, index) => (
                                                                    <div key={`error-${index}`} className="bg-white border rounded-lg p-2 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${segment.status === 'mispronounced' ? 'bg-orange-100 text-orange-800' :
                                                                                    segment.status === 'missing' ? 'bg-red-100 text-red-800' :
                                                                                        segment.status === 'extra' ? 'bg-blue-100 text-blue-800' :
                                                                                            'bg-gray-100 text-gray-800'
                                                                                }`}>
                                                                                {segment.status === 'mispronounced' ? '⚠️ Phát âm sai' :
                                                                                    segment.status === 'missing' ? '❌ Thiếu từ' :
                                                                                        segment.status === 'extra' ? '➕ Từ thừa' : 'Lỗi khác'}
                                                                            </span>
                                                                            <span className="font-medium">"{segment.word}"</span>
                                                                            {segment.similarity && segment.similarity < 1 && (
                                                                                <span className="text-gray-500 text-xs">
                                                                                    ({Math.round(segment.similarity * 100)}% đúng)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {segment.suggestion && (
                                                                            <div className="mt-1 text-xs text-gray-600 ml-2">
                                                                                💡 {segment.suggestion}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )} */}

                                                    {/* Progress bar */}
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${currentAnalysis.score >= 80 ? 'bg-green-500' :
                                                                currentAnalysis.score >= 60 ? 'bg-blue-500' :
                                                                    currentAnalysis.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${currentAnalysis.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {!isRecording && !realtimeTranscript && !finalTranscript && (
                                                <div className="text-center text-gray-500 text-sm py-4">
                                                    {isExpressOpinionExercise
                                                        ? "Bắt đầu ghi âm để thấy voice recognition"
                                                        : "Start recording to see real-time feedback"
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Results Section */}
                        <AnimatePresence>
                            {apiResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    data-result-section
                                >
                                    <div className=" shadow-sm">
                                        <div>
                                            <div className="text-lg font-semibold flex items-center gap-2 text-blue-900 mb-2">
                                                <Sparkles className="w-5 h-5 " />
                                                {apiResult.type === 'speech_recognition_result'
                                                    ? "Kết quả phân tích phát âm (Real-time)"
                                                    : "Kết quả đánh giá từ AI"
                                                }
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {/* Scores Grid for speech recognition results */}
                                            {apiResult.type === 'speech_recognition_result' ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                                        <div className="text-xl font-bold text-blue-600">
                                                            {apiResult.score || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">Điểm số</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {Math.round((apiResult.accuracy || 0) * 100)}%
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">Độ chính xác</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                                        <div className="text-xl font-bold text-purple-600">
                                                            {apiResult.words_correct || 0}/{apiResult.words_total || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">Từ đúng</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                                        <div className="text-xl font-bold text-orange-600">
                                                            {apiResult.words_missing || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">Từ thiếu</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Regular API scores grid */
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(apiResult).map(([key, value]) => {
                                                        if (
                                                            key === "feedback" ||
                                                            key === "transcript" ||
                                                            key === "audioUrl" ||
                                                            key === "id" ||
                                                            key === "type"
                                                        )
                                                            return null;
                                                        const scoreLabels: { [key: string]: string } = {
                                                            accuracy: "Chính xác",
                                                            pronunciation: "Phát âm",
                                                            fluency: "Lưu loát",
                                                            grammar: "Ngữ pháp",
                                                            vocabulary: "Từ vựng",
                                                            overall: "Tổng thể",
                                                            task: "Nhiệm vụ",
                                                        };
                                                        const label = scoreLabels[key] || key;
                                                        const colors = [
                                                            "text-blue-600",
                                                            "text-green-600",
                                                            "text-purple-600",
                                                            "text-pink-600",
                                                            "text-orange-600",
                                                        ];
                                                        return (
                                                            <div
                                                                key={key}
                                                                className="text-center p-3 bg-white rounded-lg shadow-sm border"
                                                            >
                                                                <div
                                                                    className={`text-xl font-bold ${colors[
                                                                        Math.floor(Math.random() * colors.length)
                                                                    ]
                                                                        }`}
                                                                >
                                                                    {String(value)}
                                                                </div>
                                                                <div className="text-xs text-gray-600 mt-1">
                                                                    {label}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Detailed word analysis for speech recognition results */}
                                            {apiResult.type === 'speech_recognition_result' && apiResult.error_segments && (
                                                <div className="bg-white rounded-lg p-4 border shadow-sm">
                                                    <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-blue-500" />
                                                        Phân tích chi tiết từng từ:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {apiResult.error_segments.map((segment, index) => {
                                                            const getWordStyle = () => {
                                                                switch (segment.status) {
                                                                    case 'correct':
                                                                        return 'bg-green-100 text-green-800 border-green-200';
                                                                    case 'mispronounced':
                                                                        return 'bg-orange-100 text-orange-800 border-orange-200';
                                                                    case 'missing':
                                                                        return 'bg-red-100 text-red-800 border-red-200 line-through';
                                                                    case 'extra':
                                                                        return 'bg-blue-100 text-blue-800 border-blue-200';
                                                                    default:
                                                                        return 'bg-gray-100 text-gray-600 border-gray-200';
                                                                }
                                                            };

                                                            const getIcon = () => {
                                                                switch (segment.status) {
                                                                    case 'correct':
                                                                        return '✅';
                                                                    case 'mispronounced':
                                                                        return '⚠️';
                                                                    case 'missing':
                                                                        return '❌';
                                                                    case 'extra':
                                                                        return '➕';
                                                                    default:
                                                                        return '❓';
                                                                }
                                                            };

                                                            return (
                                                                <span
                                                                    key={`final-${segment.word}-${index}`}
                                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${getWordStyle()}`}
                                                                    title={segment.suggestion || `${segment.status} - Similarity: ${(segment.similarity || 0).toFixed(2)}`}
                                                                >
                                                                    <span className="text-xs">{getIcon()}</span>
                                                                    {segment.word}
                                                                    {segment.similarity && segment.similarity < 1 && segment.status !== 'missing' && (
                                                                        <span className="text-xs opacity-70">
                                                                            ({Math.round(segment.similarity * 100)}%)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Summary statistics */}
                                                    <div className="mt-3 flex gap-2 text-sm">
                                                        {apiResult.words_missing > 0 && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                                                                ❌ {apiResult.words_missing} từ thiếu
                                                            </span>
                                                        )}
                                                        {apiResult.words_extra > 0 && (
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                                ➕ {apiResult.words_extra} từ thừa
                                                            </span>
                                                        )}
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                                            ✅ {apiResult.words_correct} từ đúng
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback */}
                                            {apiResult?.feedback && (
                                                <div className="bg-white rounded-lg p-4 border shadow-sm">
                                                    <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4 text-blue-500" />
                                                        Nhận xét chi tiết:
                                                    </h4>
                                                    <p className="text-gray-700 leading-relaxed text-sm">
                                                        {apiResult.feedback}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Transcript */}
                                            {apiResult?.transcript && (
                                                <div className="bg-white rounded-lg p-4 border shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            Bản ghi (AI):
                                                        </h4>
                                                        <Button
                                                            onClick={() => setShowTranscript(!showTranscript)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        >
                                                            {showTranscript ? (
                                                                <EyeOff className="w-4 h-4 mr-1" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 mr-1" />
                                                            )}
                                                            {showTranscript ? "Ẩn" : "Hiện"}
                                                        </Button>
                                                    </div>
                                                    <AnimatePresence>
                                                        {showTranscript && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <p className="text-gray-800 italic text-sm">
                                                                    "{apiResult.transcript}"
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}