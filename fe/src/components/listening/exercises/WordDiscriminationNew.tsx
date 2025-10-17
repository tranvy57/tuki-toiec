"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Headphones,
} from "lucide-react";
import ListeningExerciseLayout from "./ListeningExerciseLayout";

interface WordOption {
  id: string;
  word: string;
  audioUrl: string;
  phonetic: string;
  isCorrect: boolean;
}

interface WordDiscriminationQuestion {
  id: string;
  instructions: string;
  targetWord: string;
  options: WordOption[];
  explanation: string;
}

interface WordDiscriminationProps {
  questions: WordDiscriminationQuestion[];
  currentQuestionIndex: number;
  onAnswer: (questionId: string, answer: any) => void;
  onNext: () => void;
  onBack: () => void;
  totalQuestions: number;
  streakCount?: number;
}

export default function WordDiscrimination({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onBack,
  totalQuestions,
  streakCount = 0,
}: WordDiscriminationProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingOption, setPlayingOption] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setShowFeedback(false);
    setPlayingOption(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }, [currentQuestionIndex, currentAudio]);

  const playAudio = async (audioUrl: string, optionId: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setPlayingOption(optionId);

      audio.onended = () => {
        setPlayingOption(null);
      };

      audio.onerror = () => {
        setPlayingOption(null);
        console.error("Audio failed to load");
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingOption(null);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;

    setSelectedOption(optionId);
    setShowFeedback(true);

    // Submit answer
    const selectedOptionData = currentQuestion.options.find(
      (opt) => opt.id === optionId
    );
    onAnswer(currentQuestion.id, {
      selectedOptionId: optionId,
      isCorrect: selectedOptionData?.isCorrect || false,
      word: selectedOptionData?.word,
    });
  };

  const handleNextQuestion = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    onNext();
  };

  const isCorrect = selectedOption
    ? currentQuestion.options.find((opt) => opt.id === selectedOption)
        ?.isCorrect
    : false;

  const correctOption = currentQuestion.options.find((opt) => opt.isCorrect);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            No questions available
          </h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ListeningExerciseLayout
      title="Word Discrimination"
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={totalQuestions}
      onBack={onBack}
      progress={(currentQuestionIndex / totalQuestions) * 100}
      streakCount={streakCount}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Question Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge variant="outline" className="mb-4">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {currentQuestion.instructions}
          </h2>
          <p className="text-slate-600">
            Click on each option to hear the pronunciation, then select the word
            you think is correct.
          </p>
        </motion.div>

        {/* Word Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`
                  cursor-pointer transition-all duration-300 border-2
                  ${
                    selectedOption === option.id
                      ? showFeedback
                        ? option.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }
                  ${showFeedback ? "cursor-default" : "hover:shadow-lg"}
                `}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-8 text-center">
                  {/* Audio Play Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="mb-6 rounded-full h-16 w-16"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(option.audioUrl, option.id);
                    }}
                    disabled={playingOption === option.id}
                  >
                    {playingOption === option.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Volume2 className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>

                  {/* Word Display */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-slate-800">
                      {option.word}
                    </h3>
                    <p className="text-lg text-slate-500 font-mono">
                      {option.phonetic}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedOption === option.id && showFeedback && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`
                          mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                          ${
                            option.isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {option.isCorrect ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Correct!
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Incorrect
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feedback Section */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className={`border-2 ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${
                      isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isCorrect && (
                      <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">
                          The correct answer is:{" "}
                          <strong>{correctOption?.word}</strong>{" "}
                          {correctOption?.phonetic}
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        💡 Explanation:
                      </h4>
                      <p className="text-blue-700">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    {/* Replay Audio Button */}
                    {correctOption && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          playAudio(correctOption.audioUrl, correctOption.id)
                        }
                        className="w-full"
                      >
                        <Headphones className="h-4 w-4 mr-2" />
                        Listen to Correct Pronunciation Again
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="px-8 py-3"
              >
                {currentQuestionIndex === totalQuestions - 1 ? (
                  "Finish Exercise"
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ListeningExerciseLayout>
  );
}
