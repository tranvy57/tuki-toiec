"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLessonsByModality } from "@/api/useLessons";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, RotateCcw, ChevronLeft, Check, X, Eye, Lightbulb, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface MCQOption {
    content: string;
    answer_key: string;
}

interface ReadingMCQItem {
    id: string;
    title: string;
    modality: string;
    difficulty: string;
    bandHint: number;
    promptJsonb: {
        text?: string;
        choices?: MCQOption[];
        passage?: string;
        question_type?: string;
        instructions?: string;
    };
    solutionJsonb: {
        correct_answer?: string;
        explanation?: string;
        translation?: string;
    };
}

export default function ReadingResultsPage() {
    const { slug, topicId } = useParams<{ slug: string; topicId: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get results from URL params
    const [testResults, setTestResults] = useState<{
        correct: number;
        total: number;
        userAnswers: Record<string, string>;
    } | null>(null);

    const {
        data: lessons,
        isLoading,
        isError,
    } = useLessonsByModality({
        modality: slug,
        skillType: "reading"
    });

    const currentLesson = lessons?.find(lesson => lesson.lessonId === topicId);
    const questions = currentLesson?.items || [];

    useEffect(() => {
        // Get test results from URL search params or sessionStorage
        const resultsData = sessionStorage.getItem(`reading-results-${topicId}`);
        if (resultsData) {
            try {
                const parsedResults = JSON.parse(resultsData);
                setTestResults(parsedResults);
            } catch (error) {
                console.error("Error parsing results:", error);
                router.push(`/practice/reading/${slug}/${topicId}`);
            }
        } else {
            // No results found, redirect back to test
            router.push(`/practice/reading/${slug}/${topicId}`);
        }
    }, [topicId, router, slug]);

    const resetTest = () => {
        sessionStorage.removeItem(`reading-results-${topicId}`);
        router.push(`/practice/reading/${slug}/${topicId}`);
    };

    if (isLoading || !testResults) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Reading", href: "/practice/reading" },
                        { label: getExerciseName(slug), href: `/practice/reading/${slug}` },
                        { label: "Results" }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-lg text-gray-600">Loading results...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !currentLesson || questions.length === 0) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Reading", href: "/practice/reading" },
                        { label: getExerciseName(slug), href: `/practice/reading/${slug}` },
                        { label: "Results" }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Results not found</h3>
                        <p className="text-gray-600 mb-4">
                            The test results could not be found.
                        </p>
                        <Button
                            onClick={() => router.push(`/practice/reading/${slug}`)}
                            variant="outline"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to lessons
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const { correct, total, userAnswers } = testResults;
    const percentage = Math.round((correct / total) * 100);

    return (
        <div className="container mx-auto px-6 py-4">
            <PracticeBreadcrumb
                items={[
                    { label: "Reading", href: "/practice/reading" },
                    { label: getExerciseName(slug), href: `/practice/reading/${slug}` },
                    { label: "Results" }
                ]}
            />

            <div className="">
                {/* Results Header */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-8 mb-8 shadow-xl border border-indigo-200">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Test Results</h2>
                        <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {percentage}%
                        </div>
                        <div className="text-xl text-gray-700">
                            You got <span className="font-semibold text-indigo-600">{correct}</span> out of{' '}
                            <span className="font-semibold text-indigo-600">{total}</span> questions correct
                        </div>
                        <Progress value={percentage} className="w-full max-w-md mx-auto h-3 bg-gray-200" />

                        <div className="flex gap-4 justify-center mt-8">
                            <Button
                                onClick={resetTest}
                                variant="outline"
                                className="px-6 py-3 rounded-xl border-2 border-gray-400 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Retake Test
                            </Button>
                            <Button
                                onClick={() => router.push(`/practice/reading/${slug}`)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to Lessons
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Review Answers */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900">Review Answers</h3>
                        {Object.keys(userAnswers).length < questions.length && (
                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                                <Eye className="w-4 h-4 inline mr-1" />
                                {questions.length - Object.keys(userAnswers).length} câu chưa trả lời
                            </div>
                        )}
                    </div>

                    {questions.map((question, index) => {
                        const mcqQuestion = question as ReadingMCQItem;
                        const userAnswer = userAnswers[question.id];
                        const correctAnswer = mcqQuestion.solutionJsonb?.correct_answer;
                        const hasAnswer = userAnswer !== undefined && userAnswer !== "";
                        const isCorrect = hasAnswer && userAnswer === correctAnswer;

                        // Determine border and background color based on answer status
                        let borderColorClass = 'border-l-gray-400 bg-gray-50/50'; // Default for unanswered
                        if (hasAnswer) {
                            borderColorClass = isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50';
                        }

                        return (
                            <div
                                key={question.id}
                                className={`rounded-2xl p-6 shadow-lg border-l-4 ${borderColorClass} backdrop-blur-sm`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-semibold text-gray-900">Question {index + 1}</h4>
                                    {!hasAnswer ? (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Eye className="w-6 h-6" />
                                            <span className="font-medium">Chưa trả lời</span>
                                        </div>
                                    ) : isCorrect ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check className="w-6 h-6" />
                                            <span className="font-medium">Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <X className="w-6 h-6" />
                                            <span className="font-medium">Incorrect</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {/* Reading passage if exists */}
                                    {mcqQuestion.promptJsonb?.passage && (
                                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-blue-900">Reading Passage</span>
                                            </div>
                                            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                                {mcqQuestion.promptJsonb.passage}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-lg text-gray-800 leading-relaxed font-medium">{mcqQuestion.promptJsonb?.text}</p>

                                    <div className="grid gap-3">
                                        {mcqQuestion.promptJsonb?.choices?.map((choice, choiceIndex) => {
                                            const isUserChoice = hasAnswer && userAnswer === choice.answer_key;
                                            const isCorrectChoice = correctAnswer === choice.answer_key;

                                            // Choice styling based on answer status
                                            let choiceClass = 'bg-white border-gray-200'; // Default
                                            let answerKeyClass = 'bg-gray-300 text-gray-700'; // Default

                                            if (isCorrectChoice) {
                                                // Always highlight correct answer
                                                choiceClass = 'bg-green-100 border-green-300 shadow-md';
                                                answerKeyClass = 'bg-green-500 text-white';
                                            } else if (isUserChoice && hasAnswer) {
                                                // Only highlight user's wrong choice if they answered
                                                choiceClass = 'bg-red-100 border-red-300 shadow-md';
                                                answerKeyClass = 'bg-red-500 text-white';
                                            }

                                            return (
                                                <div
                                                    key={choiceIndex}
                                                    className={`p-4 rounded-xl border-2 ${choiceClass}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${answerKeyClass}`}>
                                                                {choice.answer_key}
                                                            </span>
                                                            <span className="font-medium text-gray-800">{choice.content}</span>
                                                        </div>
                                                        {isCorrectChoice && <Check className="w-5 h-5 text-green-500" />}
                                                        {isUserChoice && hasAnswer && !isCorrectChoice && <X className="w-5 h-5 text-red-500" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {mcqQuestion.solutionJsonb?.explanation && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Lightbulb className="w-4 h-4 text-blue-600" />
                                                <span className="font-semibold text-blue-900">Explanation</span>
                                            </div>
                                            <p className="text-blue-800 leading-relaxed">
                                                {mcqQuestion.solutionJsonb.explanation}
                                            </p>
                                        </div>
                                    )}

                                    {mcqQuestion.solutionJsonb?.translation && (
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold text-green-900">Translation</span>
                                            </div>
                                            <p className="text-green-800 leading-relaxed">
                                                {mcqQuestion.solutionJsonb.translation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}