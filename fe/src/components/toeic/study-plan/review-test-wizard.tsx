"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Headphones,
  MessageSquare,
  FileText,
} from "lucide-react"

interface ReviewTestWizardProps {
  targetBand: string
  onComplete: (results: any) => void
}

// Sample questions across 7 TOEIC parts
const sampleQuestions = [
  // Part 1: Photographs
  {
    id: 1,
    part: 1,
    partName: "Photographs",
    type: "multiple-choice",
    question: "What is happening in the image?",
    options: ["A person is reading", "A person is writing", "A person is speaking", "A person is listening"],
    icon: "image",
  },
  {
    id: 2,
    part: 1,
    partName: "Photographs",
    type: "multiple-choice",
    question: "Where is this taking place?",
    options: ["In an office", "In a park", "In a restaurant", "In a library"],
    icon: "image",
  },

  // Part 2: Question-Response
  {
    id: 3,
    part: 2,
    partName: "Question-Response",
    type: "multiple-choice",
    question: "When does the meeting start?",
    options: ["At 9 AM", "At 10 AM", "Tomorrow", "In the conference room"],
    icon: "headphones",
  },
  {
    id: 4,
    part: 2,
    partName: "Question-Response",
    type: "multiple-choice",
    question: "Who is in charge of the project?",
    options: ["Sarah is", "Next week", "In the office", "By email"],
    icon: "headphones",
  },

  // Part 3: Conversations
  {
    id: 5,
    part: 3,
    partName: "Conversations",
    type: "multiple-choice",
    question: "What are the speakers discussing?",
    options: ["A business proposal", "A vacation plan", "A training session", "A product launch"],
    icon: "message",
  },
  {
    id: 6,
    part: 3,
    partName: "Conversations",
    type: "multiple-choice",
    question: "What will the woman do next?",
    options: ["Call a client", "Send an email", "Attend a meeting", "Review a document"],
    icon: "message",
  },

  // Part 4: Talks
  {
    id: 7,
    part: 4,
    partName: "Talks",
    type: "multiple-choice",
    question: "What is the purpose of the announcement?",
    options: [
      "To inform about a schedule change",
      "To introduce a new policy",
      "To celebrate an achievement",
      "To request feedback",
    ],
    icon: "headphones",
  },

  // Part 5: Incomplete Sentences
  {
    id: 8,
    part: 5,
    partName: "Incomplete Sentences",
    type: "multiple-choice",
    question: "The report must be submitted _____ Friday.",
    options: ["by", "on", "at", "in"],
    icon: "file",
  },
  {
    id: 9,
    part: 5,
    partName: "Incomplete Sentences",
    type: "multiple-choice",
    question: "She is _____ qualified for the position.",
    options: ["high", "highly", "height", "higher"],
    icon: "file",
  },

  // Part 6: Text Completion
  {
    id: 10,
    part: 6,
    partName: "Text Completion",
    type: "multiple-choice",
    question: "Choose the best word to complete the passage.",
    options: ["However", "Therefore", "Moreover", "Meanwhile"],
    icon: "book",
  },

  // Part 7: Reading Comprehension
  {
    id: 11,
    part: 7,
    partName: "Reading Comprehension",
    type: "multiple-choice",
    question: "What is the main purpose of the email?",
    options: ["To request information", "To confirm an appointment", "To express gratitude", "To make a complaint"],
    icon: "book",
  },
  {
    id: 12,
    part: 7,
    partName: "Reading Comprehension",
    type: "multiple-choice",
    question: "According to the passage, what is true?",
    options: [
      "The deadline is next week",
      "The project is completed",
      "The team needs more resources",
      "The client is satisfied",
    ],
    icon: "book",
  },
]

const partIcons = {
  image: BookOpen,
  headphones: Headphones,
  message: MessageSquare,
  file: FileText,
  book: BookOpen,
}

export function ReviewTestWizard({ targetBand, onComplete }: ReviewTestWizardProps) {
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeElapsed, setTimeElapsed] = useState(0)

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [sampleQuestions[currentQuestion].id]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate results by part
    const resultsByPart = sampleQuestions.reduce(
      (acc, q) => {
        if (!acc[q.part]) {
          acc[q.part] = { total: 0, answered: 0, partName: q.partName }
        }
        acc[q.part].total++
        if (answers[q.id]) {
          acc[q.part].answered++
        }
        return acc
      },
      {} as Record<number, { total: number; answered: number; partName: string }>,
    )

    const totalAnswered = Object.keys(answers).length
    const accuracy = (totalAnswered / sampleQuestions.length) * 100
    const skippedLessons = Math.floor(accuracy / 10) // Rough calculation

    const results = {
      totalQuestions: sampleQuestions.length,
      totalAnswered,
      accuracy: Math.round(accuracy),
      skippedLessons,
      timeElapsed,
      byPart: resultsByPart,
    }

    setStage("results")
    setTimeout(() => onComplete(results), 2000)
  }

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl"
        >
          <Card className="glass border-white/10 p-8 sm:p-12">
            <div className="spotlight">
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl bg-pink-500/10 p-4 ring-1 ring-pink-500/20">
                  <CheckCircle2 className="h-10 w-10 text-pink-500" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                Review Test
              </h1>

              <p className="text-lg text-center text-muted-foreground mb-8">
                Take a quick assessment to personalize your learning path
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">10-15 minutes</div>
                    <div className="text-sm text-muted-foreground">
                      Complete at your own pace
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <BookOpen className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">
                      12 questions across 7 parts
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Covers all TOEIC sections
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">
                      Skip lessons you already know
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your results help personalize your plan
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStage("test")}
                className="w-full rounded-xl bg-pink-500 py-6 text-base font-semibold hover:bg-pink-600"
              >
                Start Test
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (stage === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md text-center"
        >
          <div className="rounded-2xl bg-pink-500/10 p-6 ring-1 ring-pink-500/20 inline-block mb-6">
            <CheckCircle2 className="h-16 w-16 text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
          <p className="text-lg text-muted-foreground">
            Analyzing your results and personalizing your learning path...
          </p>
        </motion.div>
      </div>
    )
  }

  const question = sampleQuestions[currentQuestion]
  const IconComponent = partIcons[question.icon as keyof typeof partIcons]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-pink-500/10 p-2 ring-1 ring-pink-500/20">
                <IconComponent className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Part {question.part}</div>
                <div className="font-semibold">{question.partName}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass border-white/10 p-6 sm:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">{question.question}</h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`
                      w-full text-left p-4 rounded-xl border-2 transition-all
                      ${
                        answers[question.id] === option
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${answers[question.id] === option ? "border-pink-500 bg-pink-500" : "border-white/30"}
                      `}
                      >
                        {answers[question.id] === option && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          {currentQuestion === sampleQuestions.length - 1 ? (
            <Button onClick={handleSubmit} className="rounded-xl bg-pink-500 hover:bg-pink-600">
              Submit Test
              <CheckCircle2 className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="rounded-xl bg-pink-500 hover:bg-pink-600">
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
