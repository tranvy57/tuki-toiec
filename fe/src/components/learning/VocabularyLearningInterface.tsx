"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Brain,
    Volume2,
    Star,
    Crown,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    XCircle,
    RotateCcw
} from "lucide-react";
import { WeakVocabulary, QuizType } from "@/types/implements/vocabulary";
import { Vocabulary } from "@/types/implements/vocabulary";
import {
    VocabularyCard,
    FlashcardSession,
    MultipleChoiceQuiz,
    FillBlankQuiz,
    AudioQuiz
} from "@/components/vocabulary";
import { useVocabularyReview } from "@/hooks/use-vocabulary";
import { playAudio, generateQuizOptions } from "@/utils/vocabularyUtils";

// Animation variants
const slideVariants = {
    enter: { opacity: 0, x: 50, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 },
};

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

// Extended Vocabulary interface to match API response
export interface VocabularyLearningInterfaceProps {
    vocabularies: Vocabulary[];
    isPremiumUser?: boolean;
    onBack?: () => void;
    onComplete?: (stats: LearningStats) => void;
}

interface LearningStats {
    totalWords: number;
    correct: number;
    incorrect: number;
    timeSpent: number;
    accuracy: number;
}

interface LearningSession {
    sessionType: "flashcard" | "quiz";
    currentIndex: number;
    totalItems: number;
    correctAnswers: number;
    incorrectAnswers: number;
    startTime: number;
    completedWords: Set<string>;
}

export default function VocabularyLearningInterface({
    vocabularies,
    isPremiumUser = false,
    onBack,
    onComplete
}: VocabularyLearningInterfaceProps) {
    const [currentView, setCurrentView] = useState<"overview" | "learning">("overview");
    const [session, setSession] = useState<LearningSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Early return if no vocabularies
    if (!vocabularies || vocabularies.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có từ vựng</h3>
                    <p className="text-gray-600 mb-4">Chưa có từ vựng nào để học trong bài này.</p>
                    {onBack && (
                        <Button onClick={onBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    )}
                </div>
            </div>
        );
    }
    const [currentQuizType, setCurrentQuizType] = useState<QuizType>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [quizAnswer, setQuizAnswer] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [quizOptions, setQuizOptions] = useState<string[]>([]);

    // Convert Vocabulary to WeakVocabulary format for compatibility
    const weakVocabularies: WeakVocabulary[] = vocabularies.map(vocab => ({
        id: vocab.id,
        word: vocab.word,
        meaning: vocab.meaning,
        pronunciation: vocab.pronunciation || "/pronunciation/",
        partOfSpeech: vocab.partOfSpeech || "noun",
        exampleEn: vocab.exampleEn || "",
        exampleVn: vocab.exampleVn || "",
        audioUrl: vocab.audioUrl || "",
        wrongCount: 0,
        correctCount: 0,
        weaknessLevel: 'critical',
        lastPracticedAt: new Date().toISOString(),
        isMarkedForReview: true,
        mistakeCount: 2,
        lastReviewDate: "2025-10-25T09:00:00Z",
    }));

    // Smart quiz type selection based on available data
    const getOptimalQuizType = (vocab: Vocabulary): QuizType => {
        const availableTypes: QuizType[] = [];

        // Always include multiple choice if we have meaning
        if (vocab.meaning && vocab.meaning.trim()) {
            availableTypes.push("multiple-choice");
        }

        // Include fill-blank if word is reasonable length
        if (vocab.word && vocab.word.length >= 2 && vocab.word.length <= 20) {
            availableTypes.push("fill-blank");
        }

        // Include audio quiz if we have audio URL or pronunciation
        if (vocab.audioUrl || (vocab.pronunciation && vocab.pronunciation !== "/pronunciation/")) {
            availableTypes.push("audio");
        }

        // Return random available type or default to multiple-choice
        if (availableTypes.length === 0) return "multiple-choice";
        return availableTypes[Math.floor(Math.random() * availableTypes.length)];
    };

    const currentWord = session ? weakVocabularies[session.currentIndex] : null;
    const progress = session ? ((session.currentIndex + 1) / session.totalItems) * 100 : 0;

    const startFlashcardSession = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setSession({
                sessionType: "flashcard",
                currentIndex: 0,
                totalItems: vocabularies.length,
                correctAnswers: 0,
                incorrectAnswers: 0,
                startTime: Date.now(),
                completedWords: new Set()
            });
            setCurrentView("learning");
            setShowAnswer(false);
            setIsLoading(false);
        }, 300);
    }, [vocabularies.length]);

    const startQuizSession = useCallback(() => {
        if (vocabularies.length === 0) return;

        setIsLoading(true);
        setTimeout(() => {
            // Use smart quiz type selection for the first vocabulary
            const optimalType = getOptimalQuizType(vocabularies[0]);

            setCurrentQuizType(optimalType);
            setSession({
                sessionType: "quiz",
                currentIndex: 0,
                totalItems: vocabularies.length,
                correctAnswers: 0,
                incorrectAnswers: 0,
                startTime: Date.now(),
                completedWords: new Set()
            });
            setCurrentView("learning");

            if (optimalType === "multiple-choice") {
                const options = generateQuizOptions(vocabularies[0].meaning, weakVocabularies);
                setQuizOptions(options);
            }

            setSelectedOption("");
            setQuizAnswer("");
            setIsAnswerCorrect(null);
            setIsLoading(false);
        }, 300);
    }, [vocabularies, weakVocabularies]);

    const handleFlashcardNext = useCallback(() => {
        if (!session) return;

        const newCompletedWords = new Set(session.completedWords);
        newCompletedWords.add(currentWord?.id || "");

        if (session.currentIndex < session.totalItems - 1) {
            setSession({
                ...session,
                currentIndex: session.currentIndex + 1,
                completedWords: newCompletedWords
            });
            setShowAnswer(false);
        } else {
            // Complete session
            completeSession();
        }
    }, [session, currentWord]);

    const handleQuizSubmit = useCallback(() => {
        if (!session || !currentWord || isAnswerCorrect !== null) return;

        let isCorrect = false;

        switch (currentQuizType) {
            case "multiple-choice":
                isCorrect = selectedOption === currentWord.meaning;
                break;
            case "fill-blank":
                isCorrect = quizAnswer.trim().toLowerCase() === currentWord.word.toLowerCase();
                break;
            case "audio":
                isCorrect = selectedOption === currentWord.word;
                break;
        }

        setIsAnswerCorrect(isCorrect);
        setSession({
            ...session,
            correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
            incorrectAnswers: session.incorrectAnswers + (isCorrect ? 0 : 1)
        });
    }, [session, currentWord, currentQuizType, selectedOption, quizAnswer, isAnswerCorrect]);

    const handleQuizNext = useCallback(() => {
        if (!session) return;

        const newCompletedWords = new Set(session.completedWords);
        newCompletedWords.add(currentWord?.id || "");

        if (session.currentIndex < session.totalItems - 1) {
            const nextIndex = session.currentIndex + 1;
            const nextVocab = vocabularies[nextIndex];
            const nextWord = weakVocabularies[nextIndex];

            // Use smart quiz type selection for next vocabulary
            const optimalType = getOptimalQuizType(nextVocab);

            setCurrentQuizType(optimalType);

            if (optimalType === "multiple-choice") {
                const options = generateQuizOptions(nextWord.meaning, weakVocabularies);
                setQuizOptions(options);
            }

            setSession({
                ...session,
                currentIndex: nextIndex,
                completedWords: newCompletedWords
            });

            setSelectedOption("");
            setQuizAnswer("");
            setIsAnswerCorrect(null);
        } else {
            completeSession();
        }
    }, [session, currentWord, vocabularies, weakVocabularies]);

    const completeSession = useCallback(() => {
        if (!session) return;

        const timeSpent = (Date.now() - session.startTime) / 1000;
        const accuracy = session.totalItems > 0
            ? (session.correctAnswers / session.totalItems) * 100
            : 0;

        const stats: LearningStats = {
            totalWords: session.totalItems,
            correct: session.correctAnswers,
            incorrect: session.incorrectAnswers,
            timeSpent,
            accuracy
        };

        onComplete?.(stats);
        setSession(null);
        setCurrentView("overview");
    }, [session, onComplete]);

    const resetSession = useCallback(() => {
        setSession(null);
        setCurrentView("overview");
        setShowAnswer(false);
        setSelectedOption("");
        setQuizAnswer("");
        setIsAnswerCorrect(null);
    }, []);

    // Overview screen
    if (currentView === "overview") {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto p-6 space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    {onBack && (
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    )}

                    <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Học từ vựng
                    </Badge>
                </div>

                {/* Title */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#23085A] mb-4">
                        Học từ vựng thông minh
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Nâng cao vốn từ vựng với phương pháp flashcard và quiz tương tác.
                        Hệ thống sẽ theo dõi tiến độ và điều chỉnh độ khó phù hợp.
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">{vocabularies.length}</h3>
                            <p className="text-slate-600">Từ vựng</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">
                                {vocabularies.filter(v => v.audioUrl || v.pronunciation !== "/pronunciation/").length}
                            </h3>
                            <p className="text-slate-600">Có âm thanh</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">
                                {new Set(vocabularies.map(v => v.partOfSpeech)).size}
                            </h3>
                            <p className="text-slate-600">Loại từ</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <Volume2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">AI</h3>
                            <p className="text-slate-600">Thông minh</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Vocabulary Preview */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Xem trước từ vựng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {vocabularies.slice(0, 8).map((vocab, index) => (
                                    <div key={vocab.id} className="bg-slate-50 p-3 rounded-lg">
                                        <div className="font-medium text-slate-900 text-sm truncate">
                                            {vocab.word}
                                        </div>
                                        <div className="text-blue-600 text-xs truncate">
                                            {vocab.meaning}
                                        </div>
                                        <div className="text-slate-500 text-xs">
                                            {vocab.partOfSpeech}
                                        </div>
                                    </div>
                                ))}
                                {vocabularies.length > 8 && (
                                    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="font-medium text-blue-900 text-sm">
                                                +{vocabularies.length - 8}
                                            </div>
                                            <div className="text-blue-600 text-xs">từ khác</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Learning Methods */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-slate-900">
                                        Flashcard
                                    </CardTitle>
                                    <p className="text-sm text-slate-600">Học và ghi nhớ từ vựng</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-4">
                                Học từ vựng với thẻ từ tương tác. Xem từ, nghĩa, phiên âm
                                và ví dụ. Phương pháp hiệu quả để ghi nhớ từ mới.
                            </p>
                            <div className="flex items-center text-sm text-slate-500 mb-4">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                Phù hợp cho việc ghi nhớ từ vựng
                            </div>
                            <Button
                                onClick={startFlashcardSession}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Bắt đầu Flashcard
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-slate-900">
                                        Quiz thông minh
                                    </CardTitle>
                                    <p className="text-sm text-slate-600">Kiểm tra kiến thức</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-4">
                                Kiểm tra kiến thức với trắc nghiệm, điền từ và nghe âm thanh.
                                AI tự động chọn dạng bài phù hợp dựa trên dữ liệu từ vựng.
                            </p>
                            <div className="flex items-center text-sm text-slate-500 mb-4">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                Kiểm tra và củng cố kiến thức
                            </div>
                            <Button
                                onClick={startQuizSession}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                Bắt đầu Quiz Thông Minh
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        );
    }

    // Learning session screen
    if (currentView === "learning" && session && currentWord) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto p-6"
            >
                {/* Header with progress */}
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={resetSession}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Thoát
                    </Button>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline">
                            {session.sessionType === "flashcard" ? "Flashcard" : "Quiz"}
                        </Badge>
                        <Badge variant="outline">
                            {session.currentIndex + 1} / {session.totalItems}
                        </Badge>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Tiến độ học tập</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Session stats */}
                {session.sessionType === "quiz" && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                                <div className="text-lg font-bold text-slate-900">{session.correctAnswers}</div>
                                <div className="text-sm text-slate-600">Đúng</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                                <div className="text-lg font-bold text-slate-900">{session.incorrectAnswers}</div>
                                <div className="text-sm text-slate-600">Sai</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <RotateCcw className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                <div className="text-lg font-bold text-slate-900">
                                    {session.correctAnswers + session.incorrectAnswers > 0
                                        ? Math.round((session.correctAnswers / (session.correctAnswers + session.incorrectAnswers)) * 100)
                                        : 0}%
                                </div>
                                <div className="text-sm text-slate-600">Độ chính xác</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Learning content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${session.sessionType}-${session.currentIndex}`}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Card className="mb-6">
                            <CardContent className="p-8">
                                {session.sessionType === "flashcard" ? (
                                    <FlashcardSession
                                        currentWord={currentWord}
                                        showAnswer={showAnswer}
                                        onShowAnswer={() => setShowAnswer(true)}
                                        onNext={handleFlashcardNext}
                                        isLastCard={session.currentIndex === session.totalItems - 1}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {/* Quiz type indicator */}
                                        <div className="text-center">
                                            <Badge variant="outline" className="mb-4">
                                                {currentQuizType === "multiple-choice" && "📝 Trắc nghiệm"}
                                                {currentQuizType === "fill-blank" && "✏️ Điền từ"}
                                                {currentQuizType === "audio" && "🎧 Nghe âm thanh"}
                                            </Badge>
                                        </div>

                                        {/* Quiz content */}
                                        {currentQuizType === "multiple-choice" && (
                                            <MultipleChoiceQuiz
                                                word={currentWord}
                                                options={quizOptions}
                                                selectedOption={selectedOption}
                                                onSelectOption={setSelectedOption}
                                                isCompleted={isAnswerCorrect !== null}
                                            />
                                        )}

                                        {currentQuizType === "fill-blank" && (
                                            <FillBlankQuiz
                                                word={currentWord}
                                                answer={quizAnswer}
                                                onAnswerChange={setQuizAnswer}
                                                isCompleted={isAnswerCorrect !== null}
                                            />
                                        )}

                                        {currentQuizType === "audio" && (
                                            <AudioQuiz
                                                word={currentWord}
                                                allVocabularies={weakVocabularies}
                                                selectedOption={selectedOption}
                                                onSelectOption={setSelectedOption}
                                                isCompleted={isAnswerCorrect !== null}
                                            />
                                        )}

                                        {/* Answer feedback */}
                                        {isAnswerCorrect !== null && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`p-4 rounded-lg border ${isAnswerCorrect
                                                    ? "bg-green-50 border-green-200 text-green-800"
                                                    : "bg-red-50 border-red-200 text-red-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    {isAnswerCorrect ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <span className="font-medium">
                                                        {isAnswerCorrect ? "Chính xác!" : "Chưa đúng!"}
                                                    </span>
                                                </div>
                                                {!isAnswerCorrect && (
                                                    <div className="text-sm">
                                                        <p>Đáp án đúng: <strong>
                                                            {currentQuizType === "audio" ? currentWord.word : currentWord.meaning}
                                                        </strong></p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Quiz actions */}
                                        <div className="flex gap-3">
                                            {isAnswerCorrect === null ? (
                                                <Button
                                                    onClick={handleQuizSubmit}
                                                    disabled={
                                                        (currentQuizType === "multiple-choice" && !selectedOption) ||
                                                        (currentQuizType === "fill-blank" && !quizAnswer.trim()) ||
                                                        (currentQuizType === "audio" && !selectedOption)
                                                    }
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Kiểm tra đáp án
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleQuizNext}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    {session.currentIndex === session.totalItems - 1 ? "Hoàn thành" : "Tiếp tục"}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đang chuẩn bị bài học...</h3>
                    <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    // Fallback state - should never reach here
    return (
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-gray-600 mb-4">Không thể tải nội dung học từ vựng.</p>
                {onBack && (
                    <Button onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                )}
            </div>
        </div>
    );
}