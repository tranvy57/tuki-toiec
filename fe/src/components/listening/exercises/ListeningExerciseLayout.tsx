"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Volume2,
  Repeat,
  SkipForward,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Lightbulb,
} from "lucide-react";
import { ReactNode } from "react";
import { AudioPlayer } from "@/components/toeic/test/Audio";

interface ListeningExerciseLayoutProps {
  // Layout props
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  onBack: () => void;

  // Audio props
  audioUrl?: string;
  onAudioPlay?: () => void;
  onAudioPause?: () => void;

  // Progress and feedback
  progress: number;
  streakCount?: number;
  feedback?: {
    type: "correct" | "incorrect" | "partial";
    message: string;
    explanation?: string;
  };

  // Children content
  children: ReactNode;

  // Action buttons
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
      variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    };
    secondary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      icon?: ReactNode;
    };
  };

  // Exercise state
  isCompleted?: boolean;
  showHint?: boolean;
  onToggleHint?: () => void;
}

export default function ListeningExerciseLayout({
  title,
  currentQuestion,
  totalQuestions,
  onBack,
  audioUrl,
  onAudioPlay,
  onAudioPause,
  progress,
  streakCount = 0,
  feedback,
  children,
  actions,
  isCompleted = false,
  showHint = false,
  onToggleHint,
}: ListeningExerciseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4 py-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex items-center gap-3">
            {streakCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <Star className="h-4 w-4" />
                {streakCount} streak
              </motion.div>
            )}

            <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
              {currentQuestion} / {totalQuestions}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <span className="text-sm text-slate-600 font-medium">
              {Math.round(progress)}% hoàn thành
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="shadow-sm border-slate-200/60 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Audio</span>
                </div>
              </CardHeader>
              <CardContent>
                <AudioPlayer
                  audioUrl={audioUrl}
                  
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div layout className="mb-8">
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">{children}</CardContent>
          </Card>
        </motion.div>

        {/* Feedback Section */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="mb-6"
            >
              <Card
                className={`shadow-lg border-2 ${
                  feedback.type === "correct"
                    ? "border-green-200 bg-green-50/80"
                    : feedback.type === "incorrect"
                    ? "border-red-200 bg-red-50/80"
                    : "border-amber-200 bg-amber-50/80"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        feedback.type === "correct"
                          ? "bg-green-100 text-green-600"
                          : feedback.type === "incorrect"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {feedback.type === "correct" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : feedback.type === "incorrect" ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <Trophy className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-medium mb-1 ${
                          feedback.type === "correct"
                            ? "text-green-800"
                            : feedback.type === "incorrect"
                            ? "text-red-800"
                            : "text-amber-800"
                        }`}
                      >
                        {feedback.message}
                      </p>

                      {feedback.explanation && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {feedback.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {onToggleHint && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleHint}
                className="bg-white/70 backdrop-blur-sm border-slate-200"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHint ? "Ẩn gợi ý" : "Gợi ý"}
              </Button>
            )}

            {actions?.secondary && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.secondary.onClick}
                disabled={actions.secondary.disabled}
                className="bg-white/70 backdrop-blur-sm border-slate-200"
              >
                {actions.secondary.icon}
                {actions.secondary.label}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {audioUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAudioPlay}
                className="bg-white/70 backdrop-blur-sm border-slate-200"
              >
                <Repeat className="h-4 w-4 mr-2" />
                Phát lại
              </Button>
            )}

            {actions?.primary && (
              <Button
                variant={actions.primary.variant || "default"}
                onClick={actions.primary.onClick}
                disabled={actions.primary.disabled}
                className={`px-6 ${
                  actions.primary.variant === "default"
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    : ""
                }`}
              >
                {actions.primary.loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <SkipForward className="h-4 w-4 mr-2" />
                )}
                {actions.primary.label}
              </Button>
            )}
          </div>
        </div>

        {/* Completion Celebration */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="mx-4 max-w-md w-full shadow-2xl bg-white">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Trophy className="h-8 w-8 text-green-600" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Chúc mừng! 🎉
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Bạn đã hoàn thành bài tập này xuất sắc!
                  </p>

                  <Button onClick={onBack} className="w-full">
                    Tiếp tục học tập
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
