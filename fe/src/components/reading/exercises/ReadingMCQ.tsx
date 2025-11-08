"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, X, Lightbulb, RotateCcw, ChevronLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MCQOption {
    content: string;
    answer_key: string;
}

interface ReadingMCQItem {
    id: string;
    title: string;
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
    topicId: string;
    questions: ReadingMCQItem[];
    onFinish: (results: { correct: number; total: number; userAnswers: Record<string, string> }) => void;
    onBack: () => void;
}

export function ReadingMCQComponent({ topicId, questions, onFinish, onBack }: ReadingMCQProps) {
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

    const userAnswer = userAnswers[currentQuestion.id];
    const showAnswer = showAnswerForQuestion[currentQuestion.id];
    const correctAnswer = currentQuestion.solutionJsonb?.correct_answer;

    return (
        <div className="">
            {/* Progress indicator */}
            <div className="mb-6 text-right">
                <span className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} / {questions.length}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {/* Question Header */}
                <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                        {currentQuestion.title || `Question ${currentQuestionIndex + 1}`}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                        Reading MCQ
                    </Badge>
                </div>

                {/* Passage */}
                {currentQuestion.promptJsonb.passage && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-gray-800 mb-2">Reading Passage:</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {currentQuestion.promptJsonb.passage}
                        </p>
                    </div>
                )}

                {/* Question Text */}
                {currentQuestion.promptJsonb.text && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Question:</h4>
                        <p className="text-gray-700">{currentQuestion.promptJsonb.text}</p>
                    </div>
                )}

                {/* Answer Choices */}
                {currentQuestion.promptJsonb.choices && (
                    <div className="space-y-3 mb-6">
                        {currentQuestion.promptJsonb.choices.map((choice, index) => {
                            const isSelected = userAnswer === choice.answer_key;
                            const isCorrect = choice.answer_key === correctAnswer;
                            const shouldShowCorrect = showAnswer && isCorrect;
                            const shouldShowWrong = showAnswer && isSelected && !isCorrect;

                            return (
                                <div
                                    key={choice.answer_key}
                                    className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${shouldShowCorrect ? 'bg-green-50 border-green-300' : ''}
                    ${shouldShowWrong ? 'bg-red-50 border-red-300' : ''}
                    ${isSelected && !showAnswer ? 'bg-blue-50 border-blue-300' : ''}
                    ${!isSelected && !shouldShowCorrect && !shouldShowWrong ? 'bg-white border-gray-200 hover:bg-gray-50' : ''}
                  `}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, choice.answer_key)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-sm">
                                                ({choice.answer_key.toUpperCase()})
                                            </span>
                                            <span className="text-gray-700">{choice.content}</span>
                                        </div>
                                        {shouldShowCorrect && <Check className="w-5 h-5 text-green-600" />}
                                        {shouldShowWrong && <X className="w-5 h-5 text-red-600" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Show Answer Button */}
                {userAnswer && (
                    <div className="mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleShowAnswer(currentQuestion.id)}
                            className="flex items-center gap-2"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </Button>
                    </div>
                )}

                {/* Explanation */}
                {showAnswer && currentQuestion.solutionJsonb.explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h5 className="font-semibold text-blue-800 mb-2">💡 Explanation:</h5>
                        <p className="text-blue-700 text-sm">{currentQuestion.solutionJsonb.explanation}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                        onClick={handleFinishTest}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                        Finish Test
                        <Check className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}