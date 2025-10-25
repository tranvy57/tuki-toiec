"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Brain,
    Video,
    HelpCircle,
    Target,
    ArrowLeft,
    PlayCircle,
    Crown,
    FileText
} from "lucide-react";
import { Vocabulary } from "@/types/implements/vocabulary";
import { Item } from "@/types/implements/item";
import VocabularyLearningInterface from "./VocabularyLearningInterface";
import ItemBasedExercise from "./ItemBasedExercise";

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

export interface LessonContentData {
    id: string;
    type: "video" | "theory" | "strategy" | "vocabulary" | "quiz" | "explanation";
    content: string;
    order: number;
    isPremium: boolean;
    vocabularies?: Vocabulary[];
    lessonContentItems?: {
        item: Item;
        orderIndex: number;
    }[];
}

export interface LessonContentLearningInterfaceProps {
    contentData: LessonContentData;
    isPremiumUser?: boolean;
    onBack: () => void;
    onComplete?: (stats: any) => void;
}

// Content type icons
const LESSON_CONTENT_ICONS = {
    video: Video,
    theory: FileText,
    strategy: Target,
    vocabulary: BookOpen,
    quiz: HelpCircle,
    explanation: Brain,
};

export default function LessonContentLearningInterface({
    contentData,
    isPremiumUser = false,
    onBack,
    onComplete
}: LessonContentLearningInterfaceProps) {
    const [currentView, setCurrentView] = useState<"overview" | "learning">("overview");
    const [isLoading, setIsLoading] = useState(false);

    // Early return if no content data
    if (!contentData) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có nội dung</h3>
                    <p className="text-gray-600">Không tìm thấy nội dung bài học để hiển thị.</p>
                    <Button onClick={onBack} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    const ContentIcon = LESSON_CONTENT_ICONS[contentData.type] || FileText; const getContentTypeLabel = (type: string) => {
        const labels = {
            strategy: "Chiến lược",
            video: "Video",
            quiz: "Bài tập",
            explanation: "Giải thích",
            vocabulary: "Từ vựng",
            theory: "Lý thuyết",
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getContentTypeDescription = (type: string) => {
        const descriptions = {
            strategy: "Tìm hiểu các chiến lược và mẹo làm bài hiệu quả",
            video: "Xem video hướng dẫn chi tiết",
            quiz: "Thực hành với các bài tập và quiz",
            explanation: "Đọc giải thích và phân tích chi tiết",
            vocabulary: "Học và ôn luyện từ vựng",
            theory: "Nắm vững kiến thức lý thuyết cơ bản",
        };
        return descriptions[type as keyof typeof descriptions] || "Nội dung học tập";
    };

    // Check if content has interactive elements
    const hasVocabularies = contentData.vocabularies && contentData.vocabularies.length > 0;
    const hasItems = contentData.lessonContentItems && contentData.lessonContentItems.length > 0;

    // Determine if this is an interactive lesson
    const isInteractive = hasVocabularies || (hasItems && contentData.type === "quiz");

    // Get modality for items if available
    const itemModality = hasItems ? contentData.lessonContentItems?.[0]?.item?.modality || "general" : null;

    const startLearning = () => {
        setIsLoading(true);
        // Small delay to show loading state
        setTimeout(() => {
            setCurrentView("learning");
            setIsLoading(false);
        }, 300);
    };    // Premium content check
    const canAccess = !contentData.isPremium || isPremiumUser;

    if (currentView === "learning") {
        // Route to appropriate learning interface
        if (hasVocabularies) {
            return (
                <VocabularyLearningInterface
                    vocabularies={contentData.vocabularies || []}
                    isPremiumUser={isPremiumUser}
                    onBack={() => setCurrentView("overview")}
                    onComplete={onComplete}
                />
            );
        }

        if (hasItems && itemModality) {
            const items = contentData.lessonContentItems?.map(lci => lci.item) || [];
            return (
                <ItemBasedExercise
                    items={items}
                    modality={itemModality}
                    isPremiumUser={isPremiumUser}
                    onBack={() => setCurrentView("overview")}
                    onComplete={onComplete}
                />
            );
        }

        // Fallback for non-interactive content
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentView("overview")}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-8">
                        <div className="prose max-w-none">
                            <div className="text-center mb-6">
                                <ContentIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {getContentTypeLabel(contentData.type)}
                                </h2>
                            </div>

                            <div className="whitespace-pre-wrap text-slate-700">
                                {contentData.content}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Overview screen
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        <ContentIcon className="w-4 h-4 mr-1" />
                        {getContentTypeLabel(contentData.type)}
                    </Badge>

                    {contentData.isPremium && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                        </Badge>
                    )}
                </div>
            </div>

            {/* Title and description */}
            <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                        <ContentIcon className="w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-[#23085A] mb-4">
                    {getContentTypeLabel(contentData.type)}
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {getContentTypeDescription(contentData.type)}
                </p>
            </motion.div>

            {/* Content stats */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-slate-900">
                            {contentData.type === "vocabulary" ? "Từ vựng" : "Nội dung"}
                        </h3>
                        <p className="text-slate-600">
                            {contentData.type === "vocabulary" ?
                                `${contentData.vocabularies?.length || 0} từ` :
                                "Đã chuẩn bị"
                            }
                        </p>
                    </CardContent>
                </Card>

                {isInteractive && (
                    <>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold text-slate-900">Tương tác</h3>
                                <p className="text-slate-600">
                                    {hasVocabularies ? "Học từ vựng" : "Làm bài tập"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Target className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {hasItems ? contentData.lessonContentItems?.length :
                                        hasVocabularies ? contentData.vocabularies?.length : 0}
                                </h3>
                                <p className="text-slate-600">
                                    {hasItems ? "Bài tập" : "Từ vựng"}
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </motion.div>

            {/* Content preview and actions */}
            <motion.div variants={itemVariants}>
                {canAccess ? (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                                <PlayCircle className="w-6 h-6 text-blue-600" />
                                {isInteractive ? "Bắt đầu học tập" : "Xem nội dung"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Content preview */}
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-slate-600 line-clamp-3">
                                        {contentData.content.length > 200
                                            ? `${contentData.content.substring(0, 200)}...`
                                            : contentData.content
                                        }
                                    </p>
                                </div>

                                {/* Interactive elements preview */}
                                {hasVocabularies && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                        {contentData.vocabularies?.slice(0, 4).map((vocab, index) => (
                                            <div key={index} className="bg-blue-50 p-2 rounded text-center">
                                                <div className="font-medium text-blue-900 text-xs truncate">
                                                    {vocab.word}
                                                </div>
                                                <div className="text-blue-600 text-xs truncate">
                                                    {vocab.meaning}
                                                </div>
                                            </div>
                                        ))}
                                        {(contentData.vocabularies?.length || 0) > 4 && (
                                            <div className="bg-slate-100 p-2 rounded text-center">
                                                <div className="font-medium text-slate-600 text-xs">
                                                    +{(contentData.vocabularies?.length || 0) - 4} từ khác
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {hasItems && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <HelpCircle className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-900">
                                                Bài tập {itemModality}
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-600">
                                            {contentData.lessonContentItems?.length} bài tập đã được chuẩn bị
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={startLearning}
                                    size="lg"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium"
                                >
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    {isInteractive ? "Bắt đầu học tập" : "Xem nội dung"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    // Premium content locked
                    <Card className="mb-6">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Nội dung Premium
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Nâng cấp lên Premium để truy cập nội dung {getContentTypeLabel(contentData.type).toLowerCase()} này
                            </p>
                            <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                <p className="text-slate-500 text-sm italic blur-sm">
                                    {contentData.content.substring(0, 100)}...
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium"
                            >
                                <Crown className="w-5 h-5 mr-2" />
                                Nâng cấp Premium
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </motion.div>
    );

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <ContentIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải...</h3>
                    <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    // Fallback - should never reach here, but just in case
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
            </div>

            <Card>
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ContentIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nội dung không khả dụng
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Không thể hiển thị nội dung này. Vui lòng thử lại.
                    </p>
                    <Button onClick={onBack}>
                        Quay lại
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}