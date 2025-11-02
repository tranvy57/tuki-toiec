"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check, X, Lightbulb, RotateCcw, ChevronLeft } from "lucide-react";
import { AudioPlayer } from "@/components/toeic/test/Audio";

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
        correct_keys?: string[];
        explanation?: string;
    };
}

interface ListeningMCQProps {
    lessonId: string;
    questions: MCQItem[];
    onFinish: (results: { correct: number; total: number; userAnswers: Record<string, string> }) => void;
    onBack: () => void;
}

export function ListeningMCQ({ lessonId, questions, onFinish, onBack }: ListeningMCQProps) {
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

    const handleFinishTest = () => {
        const calculateScore = () => {
            let correct = 0;
            questions.forEach(question => {
                const userAnswer = userAnswers[question.id];
                const correctAnswer = question.solutionJsonb?.correct_keys?.[0];
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
        <div className="">
            {/* Progress indicator */}
            <div className="mb-6 text-right">
                <span className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Audio Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Câu hỏi {currentQuestionIndex + 1}.</h3>
                    </div>

                    <div className="p-4 space-y-4">
                        {currentQuestion.promptJsonb?.audio_url && (
                            <AudioPlayer audioUrl={currentQuestion.promptJsonb.audio_url} />
                        )}

                        {/* Answer Options */}
                        <div className="space-y-2">
                            {currentQuestion.promptJsonb?.choices?.map((choice, index) => {
                                const isSelected = userAnswers[currentQuestion.id] === choice.answer_key;
                                const isCorrect = currentQuestion.solutionJsonb?.correct_keys?.includes(choice.answer_key);
                                const showAnswer = showAnswerForQuestion[currentQuestion.id];

                                return (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border transition-all ${showAnswer && isCorrect
                                                ? 'bg-green-50 border-green-300'
                                                : showAnswer && isSelected && !isCorrect
                                                    ? 'bg-red-50 border-red-300'
                                                    : isSelected
                                                        ? 'bg-blue-50 border-blue-300'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, choice.answer_key)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {showAnswer && isCorrect ? (
                                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : showAnswer && isSelected && !isCorrect ? (
                                                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                                        <X className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                                        }`}>
                                                        {choice.answer_key}
                                                    </div>
                                                )}
                                                <span className="text-gray-800">{choice.content}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Show Answer Section */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                                <Button
                                    onClick={() => toggleShowAnswer(currentQuestion.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                    {showAnswerForQuestion[currentQuestion.id] ? 'Ẩn Giải thích' : 'Hiện Giải thích'}
                                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAnswerForQuestion[currentQuestion.id] ? 'rotate-90' : ''
                                        }`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Transcript and Translation */}
                <div className="space-y-4">
                    {/* Explanation Section */}
                    {showAnswerForQuestion[currentQuestion.id] && (currentQuestion.solutionJsonb?.explanation || currentQuestion.promptJsonb?.explanation) && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                                    <Lightbulb className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-orange-900">Giải thích</h4>
                            </div>
                            <p
                                className="text-sm text-orange-700"
                                dangerouslySetInnerHTML={{
                                    __html: `<strong>Explanation:</strong> ${currentQuestion.promptJsonb?.explanation || currentQuestion.solutionJsonb?.explanation}`,
                                }}
                            />
                        </div>
                    )}

                    {/* Transcript and Translation */}
                    {showAnswerForQuestion[currentQuestion.id] && (currentQuestion.promptJsonb?.transcript || currentQuestion.promptJsonb?.translation) && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                                {currentQuestion.promptJsonb?.transcript && (
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Transcript:</h4>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.promptJsonb.transcript }} />
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.promptJsonb?.translation && (
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Bản dịch:</h4>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.promptJsonb.translation }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end mt-6">
                {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                        onClick={handleFinishTest}
                        disabled={Object.keys(userAnswers).length !== questions.length}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Finish Test
                    </Button>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        disabled={!userAnswers[currentQuestion?.id || '']}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next question
                    </Button>
                )}
            </div>
        </div>
    );
}
