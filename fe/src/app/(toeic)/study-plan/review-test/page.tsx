"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";
import { IntroScreen } from "./components/IntroScreen";
import { TestScreen } from "./components/TestScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { ReviewTestStage, TestResults } from "./types";
import { SAMPLE_QUESTIONS, TOEIC_PARTS, BAND_SCORE_MAPPING, generateRecommendations } from "./constants";

interface ReviewTestPageProps {
  onComplete?: (results: TestResults) => void;
}

export default function ReviewTestPage({ onComplete }: ReviewTestPageProps) {
  const [stage, setStage] = useState<ReviewTestStage>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  // Timer effect
  useEffect(() => {
    if (stage === "test") {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  const handleStart = () => {
    setStage("test");
    setTimeElapsed(0);
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleAnswerForQuestion = (questionIndex: number, optionIndex: number) => {
    // Update answer for specific question
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));

    // If it's the current question, also update selectedOption
    if (questionIndex === currentQuestion) {
      setSelectedOption(optionIndex);
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    // Save current answer if exists
    if (selectedOption !== null) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));
    }

    // Navigate to selected question
    setCurrentQuestion(questionIndex);
    setSelectedOption(answers[questionIndex] ?? null);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));

      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(answers[currentQuestion + 1] ?? null);
      } else {
        calculateResults();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] ?? null);
    }
  };

  const handleSubmit = () => {
    // Save current answer if exists
    if (selectedOption !== null) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));
    }
    calculateResults();
  };

  const calculateResults = () => {
    const correctAnswers = SAMPLE_QUESTIONS.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const accuracy = Math.round((correctAnswers / SAMPLE_QUESTIONS.length) * 100);
    const scoreMapping = BAND_SCORE_MAPPING[correctAnswers] || BAND_SCORE_MAPPING[0];

    const results: TestResults = {
      totalQuestions: SAMPLE_QUESTIONS.length,
      correctAnswers,
      incorrectAnswers: SAMPLE_QUESTIONS.length - correctAnswers,
      accuracy,
      estimatedBand: scoreMapping.band,
      level: scoreMapping.level,
      timeSpent: timeElapsed,
      recommendations: generateRecommendations(correctAnswers),
      weakAreas: identifyWeakAreas(),
      strongAreas: identifyStrongAreas(),
    };

    setTestResults(results);
    setStage("results");
    onComplete?.(results);
  };

  const identifyWeakAreas = () => {
    const partResults = SAMPLE_QUESTIONS.map((q, index) => ({
      part: q.part,
      correct: answers[index] === q.correctAnswer
    }));

    const weakParts = TOEIC_PARTS.filter(part => {
      const partQuestions = partResults.filter(r => r.part === part.id);
      const correctCount = partQuestions.filter(r => r.correct).length;
      return partQuestions.length > 0 && correctCount / partQuestions.length < 0.7;
    });

    return weakParts.slice(0, 3);
  };

  const identifyStrongAreas = () => {
    const partResults = SAMPLE_QUESTIONS.map((q, index) => ({
      part: q.part,
      correct: answers[index] === q.correctAnswer
    }));

    const strongParts = TOEIC_PARTS.filter(part => {
      const partQuestions = partResults.filter(r => r.part === part.id);
      const correctCount = partQuestions.filter(r => r.correct).length;
      return partQuestions.length > 0 && correctCount / partQuestions.length >= 0.7;
    });

    return strongParts.slice(0, 3);
  };

  const handleRetake = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setTimeElapsed(0);
    setTestResults(null);
  };

  const handleCreateStudyPlan = () => {
    // Navigate to study plan creation or trigger callback
    console.log("Creating study plan with results:", testResults);
    // You can add navigation logic here
  };

  const currentQ = SAMPLE_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <IntroScreen onStart={handleStart} />
          )}

          {stage === "test" && (
            <TestScreen
              currentQuestion={currentQuestion}
              totalQuestions={SAMPLE_QUESTIONS.length}
              question={currentQ}
              questions={SAMPLE_QUESTIONS}
              selectedOption={selectedOption}
              selectedAnswers={answers}
              timeElapsed={timeElapsed}
              timeLimit={7200} // 2 hours
              onAnswer={handleAnswer}
              onAnswerForQuestion={handleAnswerForQuestion}
              onQuestionSelect={handleQuestionSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              canGoNext={selectedOption !== null}
              canGoPrevious={currentQuestion > 0}
            />
          )}

          {stage === "results" && testResults && (
            <ResultsScreen
              results={testResults}
              questions={SAMPLE_QUESTIONS}
              answers={answers}
              onRetake={handleRetake}
              onCreateStudyPlan={handleCreateStudyPlan}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}