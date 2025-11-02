"use client";

import { useParams, useRouter } from "next/navigation";
import { useLessonsByModality } from "@/api/useLessons";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, RotateCcw, ChevronLeft, ChevronRight, Volume2, Check, X, Eye, EyeOff, Lightbulb, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MCQItem } from "@/components/listening/exercises/MCQItemDemo";
import ClozeListeningQuestion from "@/components/listening/exercises/ClozeListeningQuestion";
import DictationDemo from "@/components/listening/exercises/DictationDemo";

interface MCQOption {
    content: string;
    answer_key: string;
}

interface MCQOption {
    content: string;
    answer_key: string;
}

interface MCQItem {
    id: string;
    title: string;
    promptJsonb: {
        text?: string;
        choices?: MCQOption[];
        audio_url?: string;
        transcript?: string;
        translation?: string;
        explanation?: string;
    };
    solutionJsonb: {
        correct_answer?: string;
        explanation?: string;
    };
}

interface ClozeItem {
    id: string;
    title: string;
    promptJsonb: {
        text?: string;
        audio_url?: string;
        blank_ratio?: number;
    };
    solutionJsonb: {
        answers?: string[];
        transcript?: string;
    };
}

interface DictationItem {
    id: string;
    modality: string;
    title: string;
    difficulty: string;
    bandHint: number;
    promptJsonb: {
        title?: string;
        segments?: Array<{
            end: number;
            text: string;
            start: number;
        }>;
        audio_url?: string;
        source_url?: string;
        instructions?: string;
    };
    solutionJsonb: {
        sentences?: string[];
        correct_answers?: Array<{
            text: string;
            segment_index: number;
        }>;
        full_transcript?: string;
    };
}

export default function MCQTestPage() {
    const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
    const router = useRouter();

    const [showResults, setShowResults] = useState(false);
    const [testResults, setTestResults] = useState<{ correct: number; total: number; userAnswers: Record<string, string> } | null>(null);

    const {
        data: lessons,
        isLoading,
        isError,
        error
    } = useLessonsByModality({
        modality: slug,
        skillType: "listening"
    });

    console.log(lessons)

    // Find the current lesson and its items
    const currentLesson = lessons?.find(lesson =>
        lesson.lessonId === lessonId
    );

    const questions = currentLesson?.items || [];

    const handleTestFinish = (results: { correct: number; total: number; userAnswers: Record<string, string> }) => {
        setTestResults(results);
        setShowResults(true);
    };

    const resetTest = () => {
        setShowResults(false);
        setTestResults(null);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Listening", href: "/practice/listening" },
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-lg text-gray-600">Loading MCQ test...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !currentLesson) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Listening", href: "/practice/listening" },
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test not found</h3>
                        <p className="text-gray-600 mb-4">
                            The requested MCQ test could not be found.
                        </p>
                        <Button
                            onClick={() => router.push(`/practice/listening/${slug}`)}
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

    if (showResults && testResults) {
        const { correct, total, userAnswers } = testResults;
        const percentage = Math.round((correct / total) * 100);

        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Listening", href: "/practice/listening" },
                        { label: getExerciseName(slug), href: `/practice/listening/${slug}` },
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
                                    onClick={() => router.push(`/practice/listening/${slug}`)}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back to Lessons
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Answers</h3>
                        {slug === "mcq" && questions.map((question, index) => {
                            const mcqQuestion = question as MCQItem;
                            const userAnswer = userAnswers[question.id];
                            const correctAnswer = mcqQuestion.solutionJsonb?.correct_answer;
                            const isCorrect = userAnswer === correctAnswer;

                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-2xl p-6 shadow-lg border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'
                                        } backdrop-blur-sm`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xl font-semibold text-gray-900">Question {index + 1}</h4>
                                        {isCorrect ? (
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
                                        <p className="text-lg text-gray-800 leading-relaxed">{mcqQuestion.promptJsonb?.text}</p>

                                        <div className="grid gap-3">
                                            {mcqQuestion.promptJsonb?.choices?.map((choice, choiceIndex) => {
                                                const isUserChoice = userAnswer === choice.answer_key;
                                                const isCorrectChoice = correctAnswer === choice.answer_key;

                                                return (
                                                    <div
                                                        key={choiceIndex}
                                                        className={`p-4 rounded-xl border-2 ${isCorrectChoice
                                                            ? 'bg-green-100 border-green-300 shadow-md'
                                                            : isUserChoice
                                                                ? 'bg-red-100 border-red-300 shadow-md'
                                                                : 'bg-white border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isCorrectChoice
                                                                    ? 'bg-green-500 text-white'
                                                                    : isUserChoice
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-gray-300 text-gray-700'
                                                                    }`}>
                                                                    {choice.answer_key}
                                                                </span>
                                                                <span className="font-medium text-gray-800">{choice.content}</span>
                                                            </div>
                                                            {isCorrectChoice && <Check className="w-5 h-5 text-green-500" />}
                                                            {isUserChoice && !isCorrectChoice && <X className="w-5 h-5 text-red-500" />}
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
                                    </div>
                                </div>
                            );
                        })}

                        {slug === "cloze" && questions.map((question, index) => {
                            const clozeQuestion = question as ClozeItem;
                            const userAnswerString = userAnswers[question.id];
                            let userAnswerArray: string[] = [];
                            try {
                                userAnswerArray = userAnswerString ? JSON.parse(userAnswerString) : [];
                            } catch {
                                userAnswerArray = [];
                            }
                            const correctAnswers = clozeQuestion.solutionJsonb?.answers || [];
                            const isCorrect = JSON.stringify(userAnswerArray.map(a => a.toLowerCase().trim())) ===
                                JSON.stringify(correctAnswers.map(a => a.toLowerCase().trim()));

                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-2xl p-6 shadow-lg border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'
                                        } backdrop-blur-sm`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xl font-semibold text-gray-900">Question {index + 1}</h4>
                                        {isCorrect ? (
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
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-2">Your answers vs Correct answers:</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="font-medium text-gray-700 mb-2">Your Answers:</h5>
                                                    <div className="space-y-1">
                                                        {userAnswerArray.map((answer, i) => (
                                                            <div key={i} className="text-sm p-2 bg-white rounded border">
                                                                {i + 1}. {answer || '(empty)'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-gray-700 mb-2">Correct Answers:</h5>
                                                    <div className="space-y-1">
                                                        {correctAnswers.map((answer, i) => (
                                                            <div key={i} className="text-sm p-2 bg-green-50 rounded border border-green-200">
                                                                {i + 1}. {answer}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {clozeQuestion.solutionJsonb?.transcript && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Lightbulb className="w-4 h-4 text-blue-600" />
                                                    <span className="font-semibold text-blue-900">Full Transcript</span>
                                                </div>
                                                <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                                                    {clozeQuestion.solutionJsonb.transcript}
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

    return (
        <div className="container mx-auto px-6 py-4">
            <PracticeBreadcrumb
                items={[
                    { label: "Listening", href: "/practice/listening" },
                    { label: getExerciseName(slug), href: `/practice/listening/${slug}` },
                    { label: slug === "mcq" ? "MCQ Test" : slug === "cloze" ? "Cloze Test" : "Dictation Test" }
                ]}
            />
            {
                slug === "mcq" && (
                    <MCQItem
                        lessonId={lessonId}
                        questions={questions as MCQItem[]}
                        onFinish={handleTestFinish}
                        onBack={() => router.push(`/practice/listening/${slug}`)}
                    />
                )
            }

            {
                slug === "cloze" && (
                    <ClozeListeningQuestion
                        lessonId={lessonId}
                        questions={questions as ClozeItem[]}
                        onFinish={handleTestFinish}
                        onBack={() => router.push(`/practice/listening/${slug}`)}
                    />
                )
            }

            {
                slug === "dictation" && (
                    <DictationDemo
                        items={questions as DictationItem[]}
                        onAnswerSubmit={(id: string, answer: any, score: number) => {
                            console.log("Answer submitted:", { id, answer, score });
                        }}
                    />
                )
            }

        </div>
    );
}