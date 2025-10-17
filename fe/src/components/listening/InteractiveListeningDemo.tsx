"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Eye,
  Headphones,
  MessageSquare,
  Play,
  Volume2
} from "lucide-react";
import { useState } from "react";
import MultipleChoiceListening from "./exercises/MultipleChoiceListening";
// import ClozeListening from "./exercises/ClozeListening";
import ClozeDemoPage from "./exercises/ClozeDemoPage";
import DictationListening from "./exercises/DictationListening";
import WordDiscrimination from "./exercises/WordDiscriminationNew";

// Mock data for different question types
const mockMCQQuestions = [
  {
    id: "mcq-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    questionText: "What is the main topic of the conversation?",
    options: [
      { id: "a", text: "Planning a business meeting", isCorrect: true },
      { id: "b", text: "Discussing vacation plans", isCorrect: false },
      { id: "c", text: "Ordering food at a restaurant", isCorrect: false },
      { id: "d", text: "Talking about the weather", isCorrect: false },
    ],
    explanation:
      "The speakers are discussing the details of an upcoming business meeting, including the agenda and participants.",
    transcript:
      "A: We need to schedule the quarterly review meeting. B: Yes, let's make sure all department heads can attend.",
  },
];

const mockClozeQuestions = [
  {
    id: "cloze-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    text: "The meeting will start at {{time}} in the {{room}} room, and we expect about {{number}} people to attend.",
    blanks: [
      {
        id: "time",
        position: 0,
        correctAnswer: "9 AM",
        alternatives: ["9:00", "nine"],
      },
      {
        id: "room",
        position: 1,
        correctAnswer: "conference",
        alternatives: ["meeting"],
      },
      {
        id: "number",
        position: 2,
        correctAnswer: "twenty",
        alternatives: ["20"],
      },
    ],
    fullTranscript:
      "The meeting will start at 9 AM in the conference room, and we expect about twenty people to attend.",
    hint: "Listen for specific times, room names, and numbers.",
  },
];

const mockOrderingQuestions = [
  {
    id: "ordering-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    instructions:
      "Listen to the conversation and arrange the steps in the correct order:",
    sentences: [
      {
        id: "s1",
        text: "First, we'll review the quarterly reports",
        correctPosition: 0,
      },
      {
        id: "s2",
        text: "Then, we'll discuss the new marketing strategy",
        correctPosition: 1,
      },
      {
        id: "s3",
        text: "After that, we'll address budget concerns",
        correctPosition: 2,
      },
      {
        id: "s4",
        text: "Finally, we'll set goals for next quarter",
        correctPosition: 3,
      },
    ],
    explanation:
      "The conversation follows a logical progression from reviewing past performance to planning future goals.",
  },
];

const mockWordDiscriminationQuestions = [
  {
    id: "word-1",
    instructions: "Listen carefully and choose the word you hear:",
    targetWord: "ship",
    options: [
      {
        id: "w1",
        word: "ship",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        phonetic: "/ʃɪp/",
        isCorrect: true,
      },
      {
        id: "w2",
        word: "sheep",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        phonetic: "/ʃiːp/",
        isCorrect: false,
      },
    ],
    explanation:
      "Pay attention to the vowel sound: /ɪ/ in 'ship' vs /iː/ in 'sheep'",
  },
];

const mockDictationQuestions = [
  {
    id: "dictation-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    correctText: "The quick brown fox jumps over the lazy dog.",
    instructions: "Listen carefully and type exactly what you hear:",
    hint: "This sentence contains all letters of the alphabet.",
    maxReplays: 3,
    allowSlowPlayback: true,
  },
];

const exerciseTypes = [
  {
    id: "mcq",
    name: "Multiple Choice",
    description: "Listen and choose the best answer",
    icon: Headphones,
    color: "blue" as const,
    component: MultipleChoiceListening,
    questions: mockMCQQuestions,
    type: "mcq" as const,
  },
//   {
//     id: "cloze",
//     name: "Fill in the Blanks",
//     description: "Listen and complete the missing words",
//     icon: Edit,
//     color: "green" as const,
//     component: ClozeListening,
//     questions: mockClozeQuestions,
//     type: "cloze" as const,
//   },
  // {
  //   id: "ordering",
  //   name: "Sentence Ordering",
  //   description: "Arrange sentences in the correct order",
  //   icon: List,
  //   color: "purple" as const,
  //   component: OrderingListening,
  //   questions: mockOrderingQuestions,
  //   type: "ordering" as const,
  // },
  // {
  //   id: "discrimination",
  //   name: "Word Discrimination",
  //   description: "Distinguish between similar sounds",
  //   icon: Volume2,
  //   color: "orange" as const,
  //   component: WordDiscrimination,
  //   questions: mockWordDiscriminationQuestions,
  //   type: "discrimination" as const,
  // },
  {
    id: "dictation",
    name: "Dictation",
    description: "Listen and type what you hear",
    icon: MessageSquare,
    color: "red" as const,
    component: DictationListening,
    questions: mockDictationQuestions,
    type: "dictation" as const,
  },
  {
    id: "cloze-enhanced",
    name: "Enhanced Cloze Exercise",
    description: "Advanced fill-in-the-blank",
    icon: Edit,
    color: "purple" as const,
    component: ClozeDemoPage,
    questions: [],
    type: "cloze-enhanced" as const,
  },
];

interface InteractiveListeningDemoProps {
  onBack: () => void;
}

export default function InteractiveListeningDemo({
  onBack,
}: InteractiveListeningDemoProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const selectedExerciseData = exerciseTypes.find(
    (ex) => ex.id === selectedExercise
  );

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setCurrentQuestionIndex(0);
  };

  const handleBackToSelection = () => {
    setSelectedExercise(null);
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    if (
      selectedExerciseData &&
      currentQuestionIndex < selectedExerciseData.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Exercise completed, go back to selection
      handleBackToSelection();
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    console.log("Answer submitted:", { questionId, answer });
    // Here you would normally save the answer
  };

  if (selectedExercise && selectedExerciseData) {
    const ExerciseComponent = selectedExerciseData.component;

    // Type-safe rendering based on exercise type
    switch (selectedExerciseData.type) {
      case "mcq":
        return (
          <ExerciseComponent
            questions={selectedExerciseData.questions as any}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onBack={handleBackToSelection}
            totalQuestions={selectedExerciseData.questions.length}
            streakCount={3}
          />
        );
      // case "cloze":
      //   return (
      //     <ExerciseComponent
      //       questions={selectedExerciseData.questions as any}
      //       currentQuestionIndex={currentQuestionIndex}
      //       onAnswer={handleAnswer}
      //       onNext={handleNextQuestion}
      //       onBack={handleBackToSelection}
      //       totalQuestions={selectedExerciseData.questions.length}
      //       streakCount={3}
      //     />
        // );
      // po
      // case "discrimination":
      //   return (
      //     <ExerciseComponent
      //       questions={selectedExerciseData.questions as any}
      //       currentQuestionIndex={currentQuestionIndex}
      //       onAnswer={handleAnswer}
      //       onNext={handleNextQuestion}
      //       onBack={handleBackToSelection}
      //       totalQuestions={selectedExerciseData.questions.length}
      //       streakCount={3}
      //     />
      //   );
      case "dictation":
        return (
          <ExerciseComponent
            questions={selectedExerciseData.questions as any}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onBack={handleBackToSelection}
            totalQuestions={selectedExerciseData.questions.length}
            streakCount={3}
          />
        );
      case "cloze-enhanced":
        return <ClozeDemoPage onBack={handleBackToSelection} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>

          <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
            Interactive Demo
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            TOEIC Listening Practice
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Experience modern, interactive listening exercises with instant
            feedback and adaptive UI
          </motion.p>
        </div>

        {/* Exercise Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseTypes.map((exercise, index) => {
            const IconComponent = exercise.icon;

            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white/80 backdrop-blur-sm"
                  onClick={() => handleSelectExercise(exercise.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${
                          exercise.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        
                        ${
                          exercise.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : ""
                        }
                        
                        ${
                          exercise.color === "red"
                            ? "bg-red-100 text-red-600"
                            : ""
                        }
                        group-hover:scale-110 transition-transform duration-300
                      `}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardTitle className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {exercise.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {exercise.questions.length} question
                        {exercise.questions.length > 1 ? "s" : ""}
                      </Badge>

                      <div className="flex items-center text-xs text-slate-500">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Audio included
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Interactive Audio
              </h3>
              <p className="text-slate-600 text-sm">
                Advanced audio controls with replay limits and speed adjustment
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Instant Feedback
              </h3>
              <p className="text-slate-600 text-sm">
                Real-time corrections with detailed explanations
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Adaptive UI</h3>
              <p className="text-slate-600 text-sm">
                Each exercise type has optimized interactions and animations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
