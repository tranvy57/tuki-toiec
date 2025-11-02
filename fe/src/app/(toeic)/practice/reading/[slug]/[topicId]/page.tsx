"use client";

import { useParams, useRouter } from "next/navigation";
import { useLessonsByModality } from "@/api/useLessons";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, RotateCcw, ChevronLeft, ChevronRight, Check, X, Lightbulb, BookOpen, Clock, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ReadingTestPage() {
    const { slug, topicId } = useParams<{ slug: string; topicId: string }>();
    const router = useRouter();

    const [showResults, setShowResults] = useState(false);
    const [testResults, setTestResults] = useState<{ correct: number; total: number; userAnswers: Record<string, string> } | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [timeElapsed, setTimeElapsed] = useState(0);

    const {
        data: lessons,
        isLoading,
        isError,
        error
    } = useLessonsByModality({
        modality: slug,
        skillType: "reading"
    });

    // Find the current lesson and its items
    const currentLesson = lessons?.find(lesson =>
        lesson.items.some(item => item.id === topicId)
    );

    const questions = currentLesson?.items || [];

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFinishTest = () => {
        let correct = 0;
        questions.forEach(question => {
            const mcqQuestion = question as ReadingMCQItem;
            if (userAnswers[question.id] === mcqQuestion.solutionJsonb?.correct_answer) {
                correct++;
            }
        });

        const results = {
            correct,
            total: questions.length,
            userAnswers
        };

        setTestResults(results);
        setShowResults(true);
    };

    const resetTest = () => {
        setShowResults(false);
        setTestResults(null);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeElapsed(0);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Reading", href: "/practice/reading" },
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-lg text-gray-600">Loading Reading test...</span>
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
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test not found</h3>
                        <p className="text-gray-600 mb-4">
                            The requested reading test could not be found.
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

    if (showResults && testResults) {
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

                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Answers</h3>
                        {questions.map((question, index) => {
                            const mcqQuestion = question as ReadingMCQItem;
                            const userAnswer = testResults.userAnswers[question.id];
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

    const currentQuestion = questions[currentQuestionIndex] as ReadingMCQItem;
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    return (
        <div className="container mx-auto px-6 py-4">
            <PracticeBreadcrumb
                items={[
                    { label: "Reading", href: "/practice/reading" },
                    { label: getExerciseName(slug), href: `/practice/reading/${slug}` },
                    { label: "Reading Test" }
                ]}
            />

            <div className="max-w-6xl mx-auto">
                {/* Header with progress and timer */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {getExerciseName(slug)} Test
                            </h1>
                            <Badge className="bg-blue-100 text-blue-800">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(timeElapsed)}</span>
                            </div>

                            <Badge variant={currentQuestion?.difficulty === 'easy' ? 'default' :
                                currentQuestion?.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                                {currentQuestion?.difficulty || 'Unknown'}
                            </Badge>
                        </div>
                    </div>

                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question content */}
                {currentQuestion && (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid lg:grid-cols-2 gap-6"
                    >
                        {/* Left: Passage */}
                        {currentQuestion.promptJsonb?.passage && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Reading Passage</h2>
                                </div>

                                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                    {currentQuestion.promptJsonb.passage}
                                </div>
                            </div>
                        )}

                        {/* Right: Question and choices */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    {currentQuestion.promptJsonb?.text}
                                </h2>

                                <div className="space-y-3">
                                    {currentQuestion.promptJsonb?.choices?.map((choice, index) => (
                                        <motion.div
                                            key={choice.answer_key}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <button
                                                onClick={() => handleAnswer(currentQuestion.id, choice.answer_key)}
                                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${userAnswers[currentQuestion.id] === choice.answer_key
                                                        ? 'bg-blue-50 border-blue-300 shadow-md'
                                                        : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${userAnswers[currentQuestion.id] === choice.answer_key
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-300 text-gray-700'
                                                        }`}>
                                                        {choice.answer_key}
                                                    </span>
                                                    <span className="font-medium text-gray-800">{choice.content}</span>
                                                </div>
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                <div className="text-sm text-gray-600">
                                    {Object.keys(userAnswers).length} / {questions.length} answered
                                </div>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button
                                        onClick={handleFinishTest}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={Object.keys(userAnswers).length === 0}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Finish Test
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}