"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Headphones,
    MessageSquare,
    Edit,
    Volume2,
    PlayCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Target,
    BookOpen,
    Clock
} from "lucide-react";
import { Item } from "@/types/implements/item";
// Changed: Use the new dedicated component for Study Plan
import DictationExercise from "@/components/toeic/detail-plan/DictationExercise";

// Animation variants
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

const slideVariants = {
    enter: { opacity: 0, x: 50, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 },
};

export interface ItemBasedExerciseProps {
    items: Item[];
    modality: string;
    isPremiumUser?: boolean;
    onBack?: () => void;
    onComplete?: (stats: ExerciseStats) => void;
}

interface ExerciseStats {
    totalItems: number;
    correct: number;
    incorrect: number;
    timeSpent: number;
    accuracy: number;
    modalityType: string;
}

interface ExerciseSession {
    currentIndex: number;
    totalItems: number;
    correctAnswers: number;
    incorrectAnswers: number;
    startTime: number;
    completedItems: Set<string>;
    modality: string;
}

// Modality configuration
const MODALITY_CONFIG = {
    dictation: {
        name: "Dictation",
        description: "Nghe và viết lại những gì bạn nghe được",
        icon: MessageSquare,
        color: "red" as const,
        component: DictationExercise, 
    },
    "multiple-choice": {
        name: "Multiple Choice",
        description: "Chọn đáp án đúng từ các lựa chọn",
        icon: Target,
        color: "blue" as const,
        component: null,
    },
    listening: {
        name: "Listening Comprehension",
        description: "Nghe hiểu và trả lời câu hỏi",
        icon: Headphones,
        color: "green" as const,
        component: null,
    },
    "fill-blank": {
        name: "Fill in the Blanks",
        description: "Điền từ còn thiếu vào chỗ trống",
        icon: Edit,
        color: "purple" as const,
        component: null, // Will implement custom component
    },
    "audio-comprehension": {
        name: "Audio Comprehension",
        description: "Nghe và hiểu nội dung audio",
        icon: Volume2,
        color: "orange" as const,
        component: null,
    },
    reading: {
        name: "Reading Comprehension",
        description: "Đọc hiểu và trả lời câu hỏi",
        icon: BookOpen,
        color: "indigo" as const,
        component: null,
    },
};

export default function ItemBasedExercise({
    items,
    modality,
    isPremiumUser = false,
    onBack,
    onComplete
}: ItemBasedExerciseProps) {
    const [currentView, setCurrentView] = useState<"overview" | "exercise">("overview");
    const [session, setSession] = useState<ExerciseSession | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Early return if no items
    if (!items || items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài tập</h3>
                    <p className="text-gray-600 mb-4">Chưa có bài tập nào để luyện tập trong phần này.</p>
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

    const modalityConfig = MODALITY_CONFIG[modality as keyof typeof MODALITY_CONFIG] || {
        name: modality,
        description: `Bài tập ${modality}`,
        icon: Target,
        color: "indigo" as const,
        component: null,
    };

    const progress = session ? ((session.currentIndex + 1) / session.totalItems) * 100 : 0;
    const currentItem = session ? items[session.currentIndex] : null;

    const startExercise = useCallback(() => {
        if (items.length === 0) return;

        setIsLoading(true);
        setTimeout(() => {
            setSession({
                currentIndex: 0,
                totalItems: items.length,
                correctAnswers: 0,
                incorrectAnswers: 0,
                startTime: Date.now(),
                completedItems: new Set(),
                modality
            });
            setCurrentView("exercise");

            // For dictation and similar exercises that need item selection
            if (modality === "dictation" || modality === "listening") {
                setSelectedItem(items[0]);
            }
            setIsLoading(false);
        }, 300);
    }, [items, modality]);

    const handleItemComplete = useCallback((isCorrect: boolean) => {
        if (!session) return;

        const newCompletedItems = new Set(session.completedItems);
        newCompletedItems.add(currentItem?.id || "");

        const newSession = {
            ...session,
            correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
            incorrectAnswers: session.incorrectAnswers + (isCorrect ? 0 : 1),
            completedItems: newCompletedItems
        };

        if (session.currentIndex < session.totalItems - 1) {
            const nextIndex = session.currentIndex + 1;
            newSession.currentIndex = nextIndex;
            setSession(newSession);
            setSelectedItem(items[nextIndex]);
        } else {
            completeExercise(newSession);
        }
    }, [session, currentItem, items]);

    const handleNext = useCallback(() => {
        if (!session) return;

        const newCompletedItems = new Set(session.completedItems);
        newCompletedItems.add(currentItem?.id || "");

        if (session.currentIndex < session.totalItems - 1) {
            const nextIndex = session.currentIndex + 1;
            setSession({
                ...session,
                currentIndex: nextIndex,
                completedItems: newCompletedItems
            });
            setSelectedItem(items[nextIndex]);
        } else {
            completeExercise({
                ...session,
                completedItems: newCompletedItems
            });
        }
    }, [session, currentItem, items]);

    const completeExercise = useCallback((finalSession: ExerciseSession) => {
        const timeSpent = (Date.now() - finalSession.startTime) / 1000;
        const accuracy = finalSession.totalItems > 0
            ? (finalSession.correctAnswers / finalSession.totalItems) * 100
            : 0;

        const stats: ExerciseStats = {
            totalItems: finalSession.totalItems,
            correct: finalSession.correctAnswers,
            incorrect: finalSession.incorrectAnswers,
            timeSpent,
            accuracy,
            modalityType: modality
        };

        onComplete?.(stats);
        setSession(null);
        setCurrentView("overview");
        setSelectedItem(null);
    }, [modality, onComplete]);

    const resetExercise = useCallback(() => {
        setSession(null);
        setCurrentView("overview");
        setSelectedItem(null);
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
                        <modalityConfig.icon className="w-4 h-4 mr-1" />
                        {modalityConfig.name}
                    </Badge>
                </div>

                {/* Title and description */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              bg-${modalityConfig.color}-100 text-${modalityConfig.color}-600
            `}>
                            <modalityConfig.icon className="w-10 h-10" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-[#23085A] mb-4">
                        {modalityConfig.name}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {modalityConfig.description}
                    </p>
                </motion.div>

                {/* Exercise stats */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">{items.length}</h3>
                            <p className="text-slate-600">Bài tập</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <Clock className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">
                                {Math.ceil(items.length * 2)}
                            </h3>
                            <p className="text-slate-600">Phút dự kiến</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <RotateCcw className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-slate-900">Tự động</h3>
                            <p className="text-slate-600">Độ khó điều chỉnh</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Exercise preview */}
                <motion.div variants={itemVariants}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                                <PlayCircle className="w-6 h-6 text-blue-600" />
                                Sẵn sàng bắt đầu?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    Bạn sẽ được thực hiện {items.length} bài tập {modalityConfig.name.toLowerCase()}.
                                    Hệ thống sẽ theo dõi tiến độ và cung cấp phản hồi ngay lập tức.
                                </p>
                                <Button
                                    onClick={startExercise}
                                    size="lg"
                                    className="w-full font-medium bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    Bắt đầu luyện tập
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        );
    }

    // Exercise screen
    if (currentView === "exercise" && session) {
        // For dictation exercises - Use the new DictationExercise component
        if (modality === "dictation" && selectedItem) {
            return (
                <DictationExercise
                    item={selectedItem}
                    onBack={resetExercise}
                    onNext={handleNext}
                    progress={{
                        current: session.currentIndex + 1,
                        total: session.totalItems
                    }}
                />
            );
        }

        // For other modalities, show generic exercise interface
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
                        onClick={resetExercise}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Thoát
                    </Button>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline">
                            <modalityConfig.icon className="w-4 h-4 mr-1" />
                            {modalityConfig.name}
                        </Badge>
                        <Badge variant="outline">
                            {session.currentIndex + 1} / {session.totalItems}
                        </Badge>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Tiến độ bài tập</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Session stats */}
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

                {/* Exercise content */}
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                <modalityConfig.icon className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Bài tập {modalityConfig.name}
                            </h3>
                            {currentItem && (
                                <div className="space-y-2">
                                    <p className="text-slate-600">
                                        Đề bài: {currentItem.promptJsonb?.title || "Không có tiêu đề"}
                                    </p>
                                    {currentItem.promptJsonb?.instructions && (
                                        <p className="text-sm text-slate-500">
                                            {currentItem.promptJsonb.instructions}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Placeholder for specific exercise implementation */}
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <p className="text-slate-500 italic">
                                    Giao diện bài tập cho {modalityConfig.name} sẽ được triển khai ở đây
                                </p>
                                <Button
                                    onClick={() => handleItemComplete(Math.random() > 0.5)}
                                    className="mt-4"
                                >
                                    Mô phỏng hoàn thành bài tập
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <modalityConfig.icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đang chuẩn bị bài tập...</h3>
                    <p className="text-gray-600">Đang tải {modalityConfig.name.toLowerCase()}</p>
                </div>
            </div>
        );
    }

    // Fallback state
    return (
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <modalityConfig.icon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-gray-600 mb-4">Không thể tải bài tập {modalityConfig.name.toLowerCase()}.</p>
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