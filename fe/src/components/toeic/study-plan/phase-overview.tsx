"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  TrendingUp,
  Sparkles,
  Crown,
  BookOpen,
  Target,
} from "lucide-react";
import { RippleButton } from "@/components/ui/ripple-button";
import { useRouter } from "next/navigation";
import { StudyPlan } from "@/api/usePlan";

interface PhaseOverviewProps {
  testResults: any;
  onUpgradeClick: () => void;
  studyPlan?: StudyPlan;
  latestCourse?: StudyPlan;
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
          {
            id: 1,
            title: "Understanding the Format",
            type: "foundation",
            status: "in-progress",
          },
          {
            id: 2,
            title: "Scoring System",
            type: "foundation",
            status: "locked",
          },
          {
            id: 3,
            title: "Time Management Tips",
            type: "practice",
            status: "locked",
          },
        ],
      },
      {
        id: 2,
        title: "Basic Vocabulary",
        duration: "30 min",
        lessons: [
          {
            id: 4,
            title: "Common Business Terms",
            type: "theory",
            status: "locked",
          },
          {
            id: 5,
            title: "Workplace Vocabulary",
            type: "theory",
            status: "locked",
          },
          {
            id: 6,
            title: "Practice Exercises",
            type: "practice",
            status: "locked",
          },
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
          {
            id: 7,
            title: "Photo Description Strategies",
            type: "theory",
            status: "skipped",
          },
          {
            id: 8,
            title: "Common Vocabulary",
            type: "theory",
            status: "skipped",
          },
          {
            id: 9,
            title: "Practice Questions",
            type: "practice",
            status: "in-progress",
          },
          {
            id: 10,
            title: "Advanced Techniques",
            type: "theory",
            status: "locked",
          },
        ],
      },
      {
        id: 4,
        title: "Part 2: Question-Response",
        duration: "50 min",
        lessons: [
          {
            id: 11,
            title: "Question Types",
            type: "theory",
            status: "skipped",
          },
          {
            id: 12,
            title: "Response Patterns",
            type: "theory",
            status: "locked",
          },
          {
            id: 13,
            title: "Practice Drills",
            type: "practice",
            status: "locked",
          },
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
          {
            id: 15,
            title: "Vocabulary in Context",
            type: "theory",
            status: "locked",
          },
          {
            id: 16,
            title: "Practice Questions",
            type: "practice",
            status: "locked",
          },
        ],
      },
      {
        id: 6,
        title: "Part 7: Reading Comprehension",
        duration: "60 min",
        lessons: [
          {
            id: 17,
            title: "Skimming Techniques",
            type: "theory",
            status: "skipped",
          },
          {
            id: 18,
            title: "Detail Questions",
            type: "theory",
            status: "locked",
          },
          {
            id: 19,
            title: "Inference Questions",
            type: "theory",
            status: "locked",
          },
          {
            id: 20,
            title: "Practice Passages",
            type: "practice",
            status: "locked",
          },
        ],
      },
    ],
  },
];

export function PhaseOverview({
  testResults,
  onUpgradeClick,
  studyPlan,
  latestCourse,
}: PhaseOverviewProps) {
  const router = useRouter();

  // Use real data if available, fallback to mock data
  const phases = studyPlan?.phases || latestCourse?.phases || learningPhases;
  const courseName =
    studyPlan?.title || latestCourse?.title || "TOEIC Study Plan";
  const targetBand = studyPlan?.band || latestCourse?.band || 750;

  const totalLessons = phases.reduce((acc: number, phase: any) => {
    if (phase.phaseLessons) {
      // Real API data structure
      return acc + phase.phaseLessons.length;
    } else if (phase.modules) {
      // Mock data structure
      return (
        acc +
        phase.modules.reduce(
          (sum: number, module: any) => sum + module.lessons.length,
          0
        )
      );
    }
    return acc;
  }, 0);

  // Calculate progress based on real data if available
  const skippedLessons = phases.reduce((acc: number, phase: any) => {
    if (phase.phaseLessons) {
      // Real API data - count completed lessons
      return (
        acc +
        phase.phaseLessons.filter(
          (pl: any) => pl.lesson?.status === "completed"
        ).length
      );
    } else if (phase.modules) {
      // Mock data structure
      return (
        acc +
        phase.modules.reduce(
          (sum: number, module: any) =>
            sum +
            module.lessons.filter((l: any) => l.status === "skipped").length,
          0
        )
      );
    }
    return acc;
  }, 0);

  const percentSaved =
    totalLessons > 0 ? Math.round((skippedLessons / totalLessons) * 100) : 0;

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
              {studyPlan ? "Your Active Plan" : "Personalized Plan Ready"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{courseName}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {studyPlan
              ? `Continue your ${targetBand}-point TOEIC preparation journey.`
              : "Based on your review test, we've customized your journey to focus on what you need most."}
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
          {phases.map((phase: any, phaseIndex: number) => (
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
                        {phase.description ||
                          `Phase ${
                            phase.order || phaseIndex + 1
                          } of your learning journey`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {phase.phaseLessons?.length || phase.modules?.length || 0}
                      {phase.phaseLessons ? " lessons" : " modules"}
                    </Badge>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {/* Render API data structure (phaseLessons) or fallback to mock data (modules) */}
                  {phase.phaseLessons
                    ? // Real API data structure
                      phase.phaseLessons.map((phaseLesson: any) => {
                        const lesson = phaseLesson.lesson;
                        const contents = lesson.contents || [];
                        const completedContents = contents.filter(
                          (c: any) => c.status === "completed"
                        ).length;
                        const progressValue =
                          contents.length > 0
                            ? (completedContents / contents.length) * 100
                            : 0;

                        return (
                          <div key={phaseLesson.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">
                                  {lesson.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{lesson.level}</span>
                                  <span>•</span>
                                  <span>
                                    {completedContents} Completed •{" "}
                                    {contents.length - completedContents}{" "}
                                    Remaining
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {lesson.description}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                onClick={() =>
                                  router.push(`/study-plan/${lesson.id}`)
                                }
                              >
                                Start Lesson
                              </Button>
                            </div>

                            <Progress
                              value={progressValue}
                              className="h-2 mb-4"
                            />

                            <div className="grid gap-2">
                              {contents.slice(0, 3).map((content: any) => (
                                <div
                                  key={content.id}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                                >
                                  <div className="flex-shrink-0">
                                    {content.type === "video" && (
                                      <PlayCircle className="h-4 w-4 text-blue-500" />
                                    )}
                                    {content.type === "quiz" && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                    {content.type === "vocabulary" && (
                                      <BookOpen className="h-4 w-4 text-purple-500" />
                                    )}
                                    {content.type === "strategy" && (
                                      <Target className="h-4 w-4 text-orange-500" />
                                    )}
                                    {content.type === "explanation" && (
                                      <Sparkles className="h-4 w-4 text-pink-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium capitalize">
                                      {content.type}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {content.isPremium && (
                                        <Crown className="inline h-3 w-3 text-yellow-500 mr-1" />
                                      )}
                                      Order: {content.order}
                                    </div>
                                  </div>
                                  <div className="text-xs">
                                    {content.status === "completed" ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              ))}
                              {contents.length > 3 && (
                                <div className="text-center text-sm text-muted-foreground">
                                  +{contents.length - 3} more contents
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : // Fallback to mock data structure
                      phase.modules?.map((module: any) => {
                        const skipped = module.lessons.filter(
                          (l: any) => l.status === "skipped"
                        ).length;
                        const remaining = module.lessons.filter(
                          (l: any) => l.status !== "skipped"
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

                            <Progress
                              value={progressValue}
                              className="h-2 mb-4"
                            />

                            <div className="grid gap-2">
                              {module.lessons.map((lesson: any) => (
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
          className="mt-8 text-center w-full justify-center flex"
        >
          <RippleButton
            rippleColor="bg-pink-500/30"
            className=" rounded-xl bg-primary hover:bg-primary-2 px-4 py-2 text-lg font-semibold"
            onClick={() => {
              // Start learning action
              router.push("/study-plan/123456");
            }}
          >
            <div className="flex items-center">
              <PlayCircle className="mr-2 h-5 w-5" color="white" />
              <p className="text-white">Start Learning Today</p>
            </div>
          </RippleButton>
        </motion.div>
      </div>
    </div>
  );
}
