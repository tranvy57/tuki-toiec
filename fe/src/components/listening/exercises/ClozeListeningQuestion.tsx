"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Headphones,
} from "lucide-react";
import { useItems } from "@/api/useItems";
import { AudioPlayer } from "@/components/toeic/test/Audio";
import { TTSPlayer } from "@/components/ui/voice-controller";

interface ClozeListeningProps {
  audioUrl: string;
  text: string;
  answers: string[];
  transcript: string;
  onComplete?: (userAnswers: string[], isCorrect: boolean) => void;
}

interface BlankInfo {
  id: number;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  width: string;
}

export default function ClozeListeningQuestion({
  audioUrl,
  text,
  answers,
  transcript,
  onComplete,
}: ClozeListeningProps) {
  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [replayCount, setReplayCount] = useState(0);
  const maxReplays = 3;
  console.log(audioUrl === "");

  const [blanks, setBlanks] = useState<BlankInfo[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  // Reset all state when question content changes
  useEffect(() => {
    setIsChecked(false);
    setShowTranscript(false);
    setAccuracy(0);
    setReplayCount(0);
    setCurrentTime(0);
    setIsPlaying(false);

    // Reset audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [text, answers, audioUrl]);

  useEffect(() => {
    const blankPattern = /_+/g;
    const blankMatches = Array.from(text.matchAll(blankPattern));

    const initialBlanks: BlankInfo[] = blankMatches.map((match, index) => {
      const correctAnswer = answers[index] || "";
      const charWidth = Math.max(correctAnswer.length, 3); // Minimum 3 chars
      const width = `calc(${charWidth} * 0.8em + 1.5em)`;

      return {
        id: index,
        correctAnswer,
        userAnswer: "",
        isCorrect: false,
        width,
      };
    });

    setBlanks(initialBlanks);
  }, [text, answers]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (replayCount < maxReplays) {
          await audioRef.current.play();
          if (audioRef.current.currentTime === 0) {
            setReplayCount((prev) => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  const handleReplay = () => {
    if (!audioRef.current || replayCount >= maxReplays) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      togglePlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleBlankChange = (blankId: number, value: string) => {
    if (isChecked) return;

    setBlanks((prev) =>
      prev.map((blank) => {
        if (blank.id === blankId) {
          // Limit input length based on correct answer length
          const maxLength = blank.correctAnswer.length;
          const limitedValue = value.slice(0, maxLength);
          return { ...blank, userAnswer: limitedValue };
        }
        return blank;
      })
    );
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;

    let correctCount = 0;
    const updatedBlanks = blanks.map((blank) => {
      const isCorrect =
        blank.userAnswer.trim().toLowerCase() ===
        blank.correctAnswer.toLowerCase();
      if (isCorrect) correctCount++;
      return { ...blank, isCorrect };
    });

    setBlanks(updatedBlanks);
    setIsChecked(true);

    const accuracyPercent =
      blanks.length > 0 ? (correctCount / blanks.length) * 100 : 0;
    setAccuracy(accuracyPercent);

    // Call completion callback
    const userAnswers = blanks.map((blank) => blank.userAnswer);
    const isAllCorrect = correctCount === blanks.length;
    onComplete?.(userAnswers, isAllCorrect);
  };

  const handleReset = () => {
    setBlanks((prev) =>
      prev.map((blank) => ({
        ...blank,
        userAnswer: "",
        isCorrect: false,
      }))
    );
    setIsChecked(false);
    setShowTranscript(false);
    setAccuracy(0);
  };

  // Render text with blanks
  const renderTextWithBlanks = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let blankIndex = 0;

    // regex tìm từng nhóm ____
    const blankPattern = /_+/g;
    let match;

    while ((match = blankPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="text-slate-800">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const blank = blanks[blankIndex];

      if (blank) {
        // Tính độ rộng ô input dựa trên số ký tự của từ đúng
        const charCount = blank.correctAnswer.length;
        const width = Math.max(60, charCount * 12 + 24); // mỗi ký tự ước lượng ~12px + padding

        parts.push(
          <span
            key={`blank-${blankIndex}`}
            className="inline-flex flex-col items-center mx-1"
          >
            <Input
              value={blank.userAnswer}
              onChange={(e) => handleBlankChange(blank.id, e.target.value)}
              disabled={isChecked}
              maxLength={blank.correctAnswer.length}
              style={{ width }}
              className={`
              text-center font-medium text-lg
              border-0 border-b-3 rounded-none
              bg-transparent hover:bg-slate-50/80 focus:bg-white px-3 py-2
              transition-all duration-300 shadow-none
              ${isChecked
                  ? blank.isCorrect
                    ? "border-emerald-400 bg-emerald-50/50 text-emerald-800 shadow-sm"
                    : "border-rose-400 bg-rose-50/50 text-rose-800 shadow-sm"
                  : "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }
            `}
              placeholder={"*".repeat(blank.correctAnswer.length)}
              title={`Cần điền ${blank.correctAnswer.length} ký tự`}
            />

            <AnimatePresence>
              {isChecked && !blank.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-green-600 font-medium mt-1"
                >
                  {blank.correctAnswer}
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
      blankIndex++;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-slate-800">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const allBlanksAnswered = blanks.every(
    (blank) => blank.userAnswer.trim().length > 0
  );
  const correctCount = blanks.filter((blank) => blank.isCorrect).length;
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-  gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
          >
            <Headphones className="h-3 w-3" />
            TOEIC Listening Cloze Practice
          </motion.div>
          {/* 
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-slate-900 mb-1"
          >
            Listen and Fill in the Blanks
          </motion.h1> */}

          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-600"
          >
            Listen carefully to the audio and complete the missing words
          </motion.p> */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full"> */}
            {/* <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  Audio Player
                  <Badge variant="outline" className="ml-auto text-xs">
                    Replays: {replayCount}/{maxReplays}
                  </Badge>
                </CardTitle>
              </CardHeader> */}
            {/* <CardContent className=""></CardContent>
            </Card> */}
            {audioUrl === "" ? (
              <TTSPlayer
                text={transcript}
              // autoSpeak
              // onTranscript={(text) => console.log("User said:", text)}
              />
            ) : (
              <AudioPlayer audioUrl={audioUrl} />
            )}
          </motion.div>

          {/* Question Text with Blanks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
              <CardContent className="">
                {/* <div className="text-center mb-4">
                  <h2 className="text-base font-semibold text-slate-800 mb-1">
                    Complete the sentence
                  </h2>
                  <p className="text-xs text-slate-600">
                    Type the missing words in the blanks below
                  </p>
                </div> */}

                <div className="bg-slate-50/50 rounded-xl p-4 border-2 border-slate-100">
                  <div className="text-lg leading-relaxed text-center font-medium flex flex-wrap items-center justify-center gap-1">
                    {renderTextWithBlanks()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mb-6"
        >
          <Button
            onClick={handleCheckAnswer}
            disabled={isChecked}
            size="default"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium shadow-lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check Answer
          </Button>

          <Button
            onClick={() => setShowTranscript(!showTranscript)}
            variant="outline"
            size="default"
            className="px-6 py-2"
          >
            {showTranscript ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showTranscript ? "Hide" : "Show"} Transcript
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="default"
            className="px-6 py-2"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </motion.div>

        {/* Results and Transcript Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results */}
          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  className={`shadow-lg border-2 ${accuracy >= 80
                    ? "border-green-200 bg-green-50/50"
                    : accuracy >= 50
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-red-200 bg-red-50/50"
                    }`}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${accuracy >= 80
                        ? "bg-green-100 text-green-800"
                        : accuracy >= 50
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {accuracy >= 80 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {accuracy >= 80
                        ? "Excellent!"
                        : accuracy >= 50
                          ? "Good Job!"
                          : "Keep Practicing!"}
                    </div>

                    <div className="flex justify-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-base text-green-600">
                          {correctCount}
                        </div>
                        <div className="text-slate-600 text-xs">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base text-red-500">
                          {blanks.length - correctCount}
                        </div>
                        <div className="text-slate-600 text-xs">Incorrect</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base text-blue-600">
                          {Math.round(accuracy)}%
                        </div>
                        <div className="text-slate-600 text-xs">Accuracy</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Card className="shadow-lg border-0 bg-blue-50/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                      <Volume2 className="h-4 w-4" />
                      Full Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
                      <p className="text-blue-900 text-sm leading-relaxed font-medium">
                        "{transcript}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .slider {
            background: linear-gradient(
              to right,
              #3b82f6 0%,
              #3b82f6 ${progressPercentage}%,
              #e2e8f0 ${progressPercentage}%,
              #e2e8f0 100%
            );
          }
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
}
