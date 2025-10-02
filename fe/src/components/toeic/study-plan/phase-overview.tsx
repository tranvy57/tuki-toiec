"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Lock, PlayCircle, TrendingUp, Sparkles, Crown } from "lucide-react"

interface PhaseOverviewProps {
  testResults: any
  onUpgradeClick: () => void
}

// Mock data for phases and modules
const learningPhases = [
  {
    id: 1,
    title: "Foundation",
    description: "Essential TOEIC basics",
    modules: [
      {
        id: 1,
        title: "TOEIC Test Structure",
        duration: "15 min",
        lessons: [
          { id: 1, title: "Understanding the Format", type: "foundation", status: "in-progress" },
          { id: 2, title: "Scoring System", type: "foundation", status: "locked" },
          { id: 3, title: "Time Management Tips", type: "practice", status: "locked" },
        ],
      },
      {
        id: 2,
        title: "Basic Vocabulary",
        duration: "30 min",
        lessons: [
          { id: 4, title: "Common Business Terms", type: "theory", status: "locked" },
          { id: 5, title: "Workplace Vocabulary", type: "theory", status: "locked" },
          { id: 6, title: "Practice Exercises", type: "practice", status: "locked" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Listening Skills",
    description: "Parts 1-4 mastery",
    modules: [
      {
        id: 3,
        title: "Part 1: Photographs",
        duration: "45 min",
        lessons: [
          { id: 7, title: "Photo Description Strategies", type: "theory", status: "skipped" },
          { id: 8, title: "Common Vocabulary", type: "theory", status: "skipped" },
          { id: 9, title: "Practice Questions", type: "practice", status: "in-progress" },
          { id: 10, title: "Advanced Techniques", type: "theory", status: "locked" },
        ],
      },
      {
        id: 4,
        title: "Part 2: Question-Response",
        duration: "50 min",
        lessons: [
          { id: 11, title: "Question Types", type: "theory", status: "skipped" },
          { id: 12, title: "Response Patterns", type: "theory", status: "locked" },
          { id: 13, title: "Practice Drills", type: "practice", status: "locked" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Reading Skills",
    description: "Parts 5-7 mastery",
    modules: [
      {
        id: 5,
        title: "Part 5: Incomplete Sentences",
        duration: "40 min",
        lessons: [
          { id: 14, title: "Grammar Rules", type: "theory", status: "locked" },
          { id: 15, title: "Vocabulary in Context", type: "theory", status: "locked" },
          { id: 16, title: "Practice Questions", type: "practice", status: "locked" },
        ],
      },
      {
        id: 6,
        title: "Part 7: Reading Comprehension",
        duration: "60 min",
        lessons: [
          { id: 17, title: "Skimming Techniques", type: "theory", status: "skipped" },
          { id: 18, title: "Detail Questions", type: "theory", status: "locked" },
          { id: 19, title: "Inference Questions", type: "theory", status: "locked" },
          { id: 20, title: "Practice Passages", type: "practice", status: "locked" },
        ],
      },
    ],
  },
]

export function PhaseOverview({ testResults, onUpgradeClick }: PhaseOverviewProps) {
  const totalLessons = learningPhases.reduce(
    (acc, phase) => acc + phase.modules.reduce((sum, module) => sum + module.lessons.length, 0),
    0,
  )

  const skippedLessons = learningPhases.reduce(
    (acc, phase) =>
      acc + phase.modules.reduce((sum, module) => sum + module.lessons.filter((l) => l.status === "skipped").length, 0),
    0,
  )

  const percentSaved = Math.round((skippedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
            <TrendingUp className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-500">
              Personalized Plan Ready
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Your Learning Path
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your review test, we've customized your journey to focus on
            what you need most.
          </p>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass border-white/10 p-6 sm:p-8">
            <div className="spotlight">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-pink-500/10 p-4 ring-1 ring-pink-500/20">
                    <CheckCircle2 className="h-8 w-8 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {percentSaved}% Faster
                    </div>
                    <div className="text-muted-foreground">
                      You shortened your plan via Review Test
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-500">
                      {skippedLessons}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lessons Skipped
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {totalLessons - skippedLessons}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Free vs Pro Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="mb-8"
        >
          <Card className="glass border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-pink-500" />
                <div>
                  <div className="font-semibold">Upgrade to Pro</div>
                  <div className="text-sm text-muted-foreground">
                    Unlock theory lessons, tips & videos, detailed reports
                  </div>
                </div>
              </div>
              <Button
                onClick={onUpgradeClick}
                className="rounded-xl bg-pink-500 hover:bg-pink-600 whitespace-nowrap"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                View Pro Benefits
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Learning Phases */}
        <div className="space-y-6">
          {learningPhases.map((phase, phaseIndex) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 + phaseIndex * 0.08 }}
            >
              <Card className="glass border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{phase.title}</h2>
                      <p className="text-muted-foreground">
                        {phase.description}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {phase.modules.length} modules
                    </Badge>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {phase.modules.map((module) => {
                    const skipped = module.lessons.filter(
                      (l) => l.status === "skipped"
                    ).length;
                    const remaining = module.lessons.filter(
                      (l) => l.status !== "skipped"
                    ).length;
                    const progressValue =
                      (skipped / module.lessons.length) * 100;

                    return (
                      <div key={module.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">
                              {module.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{module.duration}</span>
                              <span>•</span>
                              <span>
                                {skipped} Skipped • {remaining} Remaining
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                          >
                            Go to Module
                          </Button>
                        </div>

                        <Progress value={progressValue} className="h-2 mb-4" />

                        <div className="grid gap-2">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`
                                flex items-center justify-between p-3 rounded-xl border transition-all
                                ${
                                  lesson.status === "locked" &&
                                  lesson.type === "theory"
                                    ? "border-white/10 bg-white/5 opacity-60"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                {lesson.status === "skipped" && (
                                  <div className="rounded-full bg-green-500/10 p-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  </div>
                                )}
                                {lesson.status === "in-progress" && (
                                  <div className="rounded-full bg-pink-500/10 p-1.5">
                                    <PlayCircle className="h-4 w-4 text-pink-500" />
                                  </div>
                                )}
                                {lesson.status === "locked" && (
                                  <div className="rounded-full bg-white/10 p-1.5">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}

                                <div>
                                  <div className="font-medium">
                                    {lesson.title}
                                  </div>
                                  {lesson.status === "locked" &&
                                    lesson.type === "theory" && (
                                      <div className="text-xs text-muted-foreground mt-0.5">
                                        Pro only - Theory content
                                      </div>
                                    )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {lesson.status === "skipped" && (
                                  <Badge
                                    variant="secondary"
                                    className="rounded-full text-xs bg-green-500/10 text-green-500"
                                  >
                                    Skipped (Verified)
                                  </Badge>
                                )}
                                {lesson.status === "in-progress" && (
                                  <Badge
                                    variant="secondary"
                                    className="rounded-full text-xs bg-pink-500/10 text-pink-500"
                                  >
                                    In Progress
                                  </Badge>
                                )}
                                {lesson.type === "foundation" && (
                                  <Badge
                                    variant="outline"
                                    className="rounded-full text-xs border-white/20"
                                  >
                                    Foundation
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button className="rounded-xl bg-pink-500 hover:bg-pink-600 px-8 py-6 text-lg font-semibold">
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Learning Today
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
