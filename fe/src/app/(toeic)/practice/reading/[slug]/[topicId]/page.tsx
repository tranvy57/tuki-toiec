"use client";

import { useParams, useRouter } from "next/navigation";
import { useLessonsByModality } from "@/api/useLessons";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, BookOpen, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
        lesson.lessonId === topicId
    );

    const questions = currentLesson?.items || [];
    console.log(questions)


    // Timer effect
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTimeElapsed(prev => prev + 1);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

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

        // Save results to sessionStorage
        sessionStorage.setItem(`reading-results-${topicId}`, JSON.stringify(results));

        // Navigate to results page
        router.push(`/practice/reading/${slug}/${topicId}/results`);
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



    const currentQuestion = questions[currentQuestionIndex] as ReadingMCQItem;
    console.log("aaaa", currentQuestion)
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
                    </motion.div>
                )}
            </div>
        </div>
    );
}