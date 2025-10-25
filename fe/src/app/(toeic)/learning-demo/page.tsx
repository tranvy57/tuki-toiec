"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Target } from "lucide-react";
import { LessonContentLearningInterface } from "@/components/learning";
import { mockLessonContentsWithLearning } from "@/data/mockLearningContent";

export default function LearningSystemDemo() {
    const [selectedContentIndex, setSelectedContentIndex] = useState<number | null>(null);

    const selectedContent = selectedContentIndex !== null ? mockLessonContentsWithLearning[selectedContentIndex] : null;

    if (selectedContent) {
        return (
            <LessonContentLearningInterface
                contentData={selectedContent}
                isPremiumUser={true} // Set to true for demo
                onBack={() => setSelectedContentIndex(null)}
                onComplete={(stats) => {
                    console.log("Learning completed:", stats);
                    setSelectedContentIndex(null);
                }}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#23085A] mb-4">
                    Demo Hệ thống học tập Tuki
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Trải nghiệm hệ thống học từ vựng và bài tập tương tác với AI
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockLessonContentsWithLearning.map((content, index) => {
                    const hasVocabularies = content.vocabularies && content.vocabularies.length > 0;
                    const hasItems = content.lessonContentItems && content.lessonContentItems.length > 0;

                    const getIcon = () => {
                        switch (content.type) {
                            case "vocabulary": return BookOpen;
                            case "quiz": return Brain;
                            default: return Target;
                        }
                    };

                    const Icon = getIcon();

                    return (
                        <Card
                            key={content.id}
                            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            onClick={() => setSelectedContentIndex(index)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">
                                            {content.type === "vocabulary" ? "Từ vựng" :
                                                content.type === "quiz" ? "Bài tập" : "Nội dung"}
                                        </CardTitle>
                                        {content.isPremium && (
                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                Premium
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                    {content.content}
                                </p>

                                {hasVocabularies && (
                                    <div className="mb-3">
                                        <Badge variant="outline" className="text-xs">
                                            {content.vocabularies.length} từ vựng
                                        </Badge>
                                    </div>
                                )}

                                {hasItems && (
                                    <div className="mb-3">
                                        <Badge variant="outline" className="text-xs">
                                            {content.lessonContentItems.length} bài tập
                                        </Badge>
                                    </div>
                                )}

                                <Button
                                    size="sm"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {hasVocabularies ? "Học từ vựng" :
                                        hasItems ? "Làm bài tập" : "Xem nội dung"}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Tính năng của hệ thống học tập
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-medium text-slate-900 mb-1">Học từ vựng</h4>
                        <p className="text-sm text-slate-600">
                            Flashcard và quiz tương tác với nhiều dạng bài tập
                        </p>
                    </div>
                    <div className="text-center">
                        <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium text-slate-900 mb-1">Bài tập đa dạng</h4>
                        <p className="text-sm text-slate-600">
                            Dictation, multiple choice, listening với nhiều modality
                        </p>
                    </div>
                    <div className="text-center">
                        <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-medium text-slate-900 mb-1">Theo dõi tiến độ</h4>
                        <p className="text-sm text-slate-600">
                            Thống kê chi tiết và phản hồi ngay lập tức
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}