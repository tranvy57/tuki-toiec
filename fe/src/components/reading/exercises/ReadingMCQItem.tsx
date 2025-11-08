"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check, X, Lightbulb, RotateCcw, ChevronLeft, BookOpen } from "lucide-react";

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

interface ReadingMCQProps {
    lessonId: string;
    questions: ReadingMCQItem[];
    onFinish: (results: { correct: number; total: number; userAnswers: Record<string, string> }) => void;
    onBack: () => void;
}

export function ReadingMCQItem({ lessonId, questions, onFinish, onBack }: ReadingMCQProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [showAnswerForQuestion, setShowAnswerForQuestion] = useState<Record<string, boolean>>({});

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const toggleShowAnswer = (questionId: string) => {
        setShowAnswerForQuestion(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFinishTest = () => {
        const calculateScore = () => {
            let correct = 0;
            questions.forEach(question => {
                const userAnswer = userAnswers[question.id];
                const correctAnswer = question.solutionJsonb?.correct_answer;
                if (userAnswer === correctAnswer) {
                    correct++;
                }
            });
            return { correct, total: questions.length };
        };

        const results = calculateScore();
        onFinish({ ...results, userAnswers });
    };

    if (!currentQuestion) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No questions available</p>
                <Button onClick={onBack} variant="outline" className="mt-4">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-6 text-right">
                <span className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} / {questions.length}
                </span>
                <Progress
                    value={(currentQuestionIndex + 1) / questions.length * 100}
                    className="mt-2"
                />
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
                {/* Reading Passage */}
                {currentQuestion.promptJsonb?.passage && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-800">Đoạn văn:</h3>
                        </div>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                {currentQuestion.promptJsonb.passage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Question */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {currentQuestion.promptJsonb?.text || "Question"}
                    </h3>

                    {/* Multiple Choice Options */}
                    {currentQuestion.promptJsonb?.choices && (
                        <div className="space-y-3">
                            {currentQuestion.promptJsonb.choices.map((choice, index) => {
                                const isSelected = userAnswers[currentQuestion.id] === choice.answer_key;
                                const isCorrect = choice.answer_key === currentQuestion.solutionJsonb?.correct_answer;
                                const showingAnswer = showAnswerForQuestion[currentQuestion.id];

                                return (
                                    <div
                                        key={choice.answer_key}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                                ? showingAnswer
                                                    ? isCorrect
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-red-50 border-red-200"
                                                    : "bg-blue-50 border-blue-200"
                                                : showingAnswer && isCorrect
                                                    ? "bg-green-50 border-green-200"
                                                    : "hover:bg-gray-50 border-gray-200"
                                            }`}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, choice.answer_key)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-gray-600">
                                                    ({choice.answer_key})
                                                </span>
                                                <span className="text-gray-800">{choice.content}</span>
                                            </div>

                                            {showingAnswer && (
                                                <div className="flex items-center gap-2">
                                                    {isCorrect && <Check className="w-4 h-4 text-green-600" />}
                                                    {isSelected && !isCorrect && <X className="w-4 h-4 text-red-600" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Explanation (shown when answer is revealed) */}
                {showAnswerForQuestion[currentQuestion.id] && currentQuestion.solutionJsonb?.explanation && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Giải thích:</span>
                        </div>
                        <p className="text-blue-700">{currentQuestion.solutionJsonb.explanation}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => toggleShowAnswer(currentQuestion.id)}
                            className="flex items-center gap-2"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showAnswerForQuestion[currentQuestion.id] ? 'Ẩn đáp án' : 'Xem đáp án'}
                        </Button>

                        {currentQuestionIndex > 0 && (
                            <Button
                                variant="outline"
                                onClick={handlePreviousQuestion}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Câu trước
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {currentQuestionIndex < questions.length - 1 ? (
                            <Button
                                onClick={handleNextQuestion}
                                className="flex items-center gap-2"
                            >
                                Câu tiếp theo
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinishTest}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            >
                                Hoàn thành bài thi
                                <Check className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}