"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Volume2,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  Play,
  FastForward,
  Mic,
  Edit3,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Spline from "@splinetool/react-spline";
import { AudioPlayer } from "@/components/toeic/test/Audio";
import { Item } from "@/types/implements/item";

interface DictationExerciseProps {
  item: Item;
  onNext?: () => void;
  onBack?: () => void;
  progress?: {
    current: number;
    total: number;
  };
}

interface WordComparison {
  word: string;
  isCorrect: boolean;
  userWord?: string;
}

export default function DictationExercise({
  item,
  onNext,
  onBack,
  progress,
}: DictationExerciseProps) {
  
  // Early return if no item data
  if (!item) {
    return (
      <div className="bg-white h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài tập</h3>
          <p className="text-gray-600 mb-4">Dữ liệu bài tập chưa được tải.</p>
          {onBack && (
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          )}
        </div>
      </div>
    );
  }

  const [userInput, setUserInput] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [wordComparison, setWordComparison] = useState<WordComparison[]>([]);
  const [score, setScore] = useState<number>(0);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(
    new Set()
  );
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set());
  const [segmentScores, setSegmentScores] = useState<{ [key: number]: number }>(
    {}
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [segmentEnded, setSegmentEnded] = useState(false);
  const [replayTrigger, setReplayTrigger] = useState(0);


  useEffect(() => {
    setUserInput("");
    setShowTranscript(false);
    setIsChecked(false);
    setWordComparison([]);
    setScore(0);
    setCurrentSegment(0);
    setCompletedSegments(new Set());
    setRevealedWords(new Set());
    setSegmentScores({});
    setIsPlaying(false);
    setPlaybackSpeed(1);
    setSegmentEnded(false);
    setReplayTrigger(0);
  }, [item.id]);

  // Get current sentence/segment data
  const getCurrentSegmentData = () => {
    const sentences = item?.solutionJsonb?.sentences || [];
    const currentSentence = sentences[currentSegment] || "";
    const words = currentSentence.trim() ? currentSentence.split(" ").filter((word: string) => word.length > 0) : [];
    return { currentSentence, words, totalSegments: sentences.length };
  };

  const { currentSentence, words, totalSegments } = getCurrentSegmentData();

  // Handle segment selection from transcript
  const handleSegmentSelect = (segmentIndex: number) => {
    // Save current progress if there's input
    if (userInput.trim() && currentSegment !== segmentIndex) {
      handleSaveProgress();
    }

    setCurrentSegment(segmentIndex);
    setUserInput(""); // Clear input for new segment
    setIsChecked(false);
    setWordComparison([]);
    setScore(0);
    setSegmentEnded(false); // Reset segment ended state

    // Audio will automatically sync to new segment's start/end time via props
    setIsPlaying(false); // Reset playing state when switching segments
  };

  // Handle saving progress for current segment
  const handleSaveProgress = () => {
    if (!userInput.trim()) return;

    const comparison = compareWords(userInput, currentSentence);
    const calculatedScore = calculateScore(comparison);

    setWordComparison(comparison);
    setScore(calculatedScore);
    setIsChecked(true);

    // Save to completed segments
    setCompletedSegments((prev) => new Set(prev).add(currentSegment));
    setSegmentScores((prev) => ({
      ...prev,
      [currentSegment]: calculatedScore,
    }));
  };

  // Handle next segment
  const handleNextSegment = () => {
    handleSaveProgress();

    if (currentSegment < totalSegments - 1) {
      setCurrentSegment(currentSegment + 1);
      setUserInput("");
      setIsChecked(false);
      setWordComparison([]);
      setScore(0);
      setIsPlaying(false); // Reset playing state for new segment
    } else {
      // All segments completed
      if (typeof onNext === 'function') {
        onNext();
      }
    }
  };

  // Handle word reveal
  const handleRevealWord = (wordIndex: number) => {
    const wordKey = `${currentSegment}-${wordIndex}`;
    setRevealedWords((prev) => new Set(prev).add(wordKey));

    // Auto-fill the word in input
    const wordsInSentence = currentSentence.split(" ");
    const revealedWord = wordsInSentence[wordIndex];
    if (revealedWord) {
      const currentWords = userInput.split(" ");
      currentWords[wordIndex] = revealedWord;
      setUserInput(currentWords.join(" ").trim());
    }
  };

  // Handle reveal all words
  const handleRevealAllWords = () => {
    words.forEach((_: any, index: number) => {
      const wordKey = `${currentSegment}-${index}`;
      setRevealedWords((prev) => new Set(prev).add(wordKey));
    });
    setUserInput(currentSentence);
    handleSaveProgress();
  };

  // Calculate overall progress
  const overallProgress = Math.round(
    (completedSegments.size / totalSegments) * 100
  );

  // Handle when segment audio ends
  const handleSegmentEnded = () => {
    setIsPlaying(false);
    setSegmentEnded(true);

    // Auto advance after a short delay to allow user to hear the end
    if (currentSegment < totalSegments - 1) {
      setTimeout(() => {
        setSegmentEnded(false);
        // Don't auto advance, let user decide
      }, 1000);
    }
  };

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  const compareWords = (
    userText: string,
    correctText: string
  ): WordComparison[] => {
    const userWords = normalizeText(userText)
      .split(" ")
      .filter((word) => word.length > 0);
    const correctWords = normalizeText(correctText)
      .split(" ")
      .filter((word) => word.length > 0);

    const comparison: WordComparison[] = [];
    const maxLength = Math.max(userWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || "";
      const correctWord = correctWords[i] || "";

      comparison.push({
        word: correctWord || userWord,
        isCorrect: userWord === correctWord && correctWord !== "",
        userWord: userWord !== correctWord ? userWord : undefined,
      });
    }

    return comparison;
  };

  const calculateScore = (comparison: WordComparison[]): number => {
    const correctWords = comparison.filter((item) => item.isCorrect).length;
    const totalWords = comparison.filter((item) => item.word).length;
    return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  };

  const getScoreMessage = (
    score: number
  ): { message: string; color: string; icon: React.ReactNode } => {
    if (score >= 90) {
      return {
        message: "Excellent! Outstanding accuracy!",
        color: "text-emerald-600",
        icon: <Award className="w-5 h-5 text-emerald-600" />,
      };
    } else if (score >= 75) {
      return {
        message: "Good job! Well done!",
        color: "text-blue-600",
        icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      };
    } else if (score >= 60) {
      return {
        message: "Not bad, but room for improvement.",
        color: "text-yellow-600",
        icon: <Target className="w-5 h-5 text-yellow-600" />,
      };
    } else {
      return {
        message: "Keep practicing! You'll get better.",
        color: "text-orange-600",
        icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      };
    }
  };

  const handleCheckAnswer = () => {
    handleSaveProgress();
  };

  const handleToggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const scoreMessage = getScoreMessage(score);
  
  // Determine button label and icon based on overall progress
  const hasMoreItems = progress && progress.current < progress.total;
  const buttonLabel = hasMoreItems ? "BÀI TẬP TIẾP THEO" : "HOÀN THÀNH BÀI TẬP";

  return (
    <div className=" bg-white max-h-[calc(100vh-72px)]">
      <div className="grid grid-cols-12 h-[calc(100vh-72px)]">
        {/* Left Panel - Audio Player + Info */}
        <div className="col-span-4 bg-white p-6 flex flex-col border-r border-[#E6E6E6]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-gray-600 font-medium">Video</h2>
              {progress && (
              <Badge variant="secondary" className="bg-[#F4F0FF] text-[#7E57C2]">
                Bài {progress.current}/{progress.total}
              </Badge>
              )}
          </div>

          {/* Back Button */}
          {onBack && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-[#23085A] hover:bg-[#F4F0FF] hover:text-[#34116D]"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại
              </Button>
            </div>
          )}

          {/* Audio Player */}
          <div className="bg-[#FAFAFA] rounded-xl p-4 mb-6">
            <AudioPlayer
              audioUrl={item.promptJsonb?.audio_url || ""}
              startTime={item.promptJsonb?.segments?.[currentSegment]?.start}
              endTime={item.promptJsonb?.segments?.[currentSegment]?.end}
              onEndedSegment={handleSegmentEnded}
              replayTrigger={replayTrigger}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Button
                className="bg-[#EDE7F6] text-[#23085A] hover:bg-[#D1C4E9] rounded-xl font-medium w-full"
                onClick={() => {
                  // Reset input and replay current segment immediately
                  setUserInput("");
                  setSegmentEnded(false);
                  setReplayTrigger((prev) => prev + 1); // Trigger AudioPlayer to replay
                }}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Phát lại đoạn
              </Button>
            </div>

            {/* Continue to next segment button - show when segment ended */}
            {segmentEnded && currentSegment < totalSegments - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="text-center text-sm text-[#7E57C2] font-medium">
                  Đoạn {currentSegment + 1} đã kết thúc
                </div>
                <Button
                  className="w-full bg-[#7E57C2] hover:bg-[#6A4CAE] text-white rounded-xl font-medium"
                  onClick={() => handleSegmentSelect(currentSegment + 1)}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Nghe tiếp đoạn {currentSegment + 2}
                </Button>
              </motion.div>
            )}

            {/* Navigation to next segment (always available) */}
            {!segmentEnded && currentSegment < totalSegments - 1 && (
              <Button
                variant="outline"
                className="w-full border-[#7E57C2] text-[#7E57C2] hover:bg-[#F4F0FF] rounded-xl font-medium"
                onClick={() => handleSegmentSelect(currentSegment + 1)}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Chuyển đoạn {currentSegment + 2}
              </Button>
            )}

            {/* Segment Info */}
            {item.promptJsonb?.segments?.[currentSegment] && (
              <div className="text-center text-xs text-gray-500">
                <p>
                  Đoạn {currentSegment + 1}:{" "}
                  {item.promptJsonb.segments[currentSegment].start?.toFixed(1)}s -{" "}
                  {item.promptJsonb.segments[currentSegment].end?.toFixed(1)}s
                </p>
              </div>
            )}
          </div>

          {/* ADDED PER USER REQUEST: Persistent Completion Button */}
           {completedSegments.size === totalSegments && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
               <Button
                onClick={() => onNext && onNext()}
                className={`w-full rounded-xl font-bold shadow-lg py-4 text-base animate-pulse 
                     ${hasMoreItems ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-green-600 hover:bg-green-700 shadow-green-200"}
                `}
              >
                {hasMoreItems ? <ArrowRight className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {buttonLabel}
              </Button>
            </motion.div>
          )}


          {/* Tuki Mascot */}
          <div className="rounded-full bg-gradient-to-tr from-pink-100 to-purple-100 p-[2px] shadow-sm w-full h-full overflow-hidden mt-6">
            <Spline scene="https://prod.spline.design/D6rvoprmxCW4MNMi/scene.splinecode" className="h-[373px] w-[354px]" />
          </div>

          {/* Exercise Info */}
          <div className="mt-auto pt-6">
            <h3 className="text-[#23085A] font-semibold text-lg mb-2 text-center">
              {item.promptJsonb?.title || "Listening Practice"}
            </h3>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              {item.promptJsonb?.instructions ||
                "Luyện tập kỹ năng nghe và chép chính tả"}
            </p>
          </div>
        </div>

        {/* Middle Panel - Dictation Area */}
        <div className="col-span-4 bg-white p-6 flex flex-col border-r border-[#E6E6E6]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-semibold text-[#23085A] text-lg mb-3">
              Chép chính tả
            </h2>

            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUserInput("");
                  setIsPlaying(false);
                }}
                className="w-8 h-8 p-0 rounded-full hover:bg-[#F4F0FF] border border-[#E6E6E6]"
                title="Làm mới input"
              >
                <RefreshCcw className="w-4 h-4 text-[#6B7280]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 p-0 rounded-full hover:bg-[#F4F0FF] border border-[#E6E6E6]"
                title="Phát/Dừng đoạn hiện tại"
              >
                <Play className="w-4 h-4 text-[#6B7280]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Skip to next segment if available
                  if (currentSegment < totalSegments - 1) {
                    handleSegmentSelect(currentSegment + 1);
                  }
                }}
                disabled={currentSegment >= totalSegments - 1}
                className="w-8 h-8 p-0 rounded-full hover:bg-[#F4F0FF] border border-[#E6E6E6] disabled:opacity-50"
                title="Chuyển đoạn tiếp theo"
              >
                <FastForward className="w-4 h-4 text-[#6B7280]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPlaybackSpeed(
                    playbackSpeed === 1
                      ? 0.75
                      : playbackSpeed === 0.75
                        ? 0.5
                        : 1
                  )
                }
                className="px-3 py-1 rounded-full hover:bg-[#F4F0FF] border border-[#E6E6E6] text-xs"
                title="Thay đổi tốc độ phát"
              >
                {playbackSpeed}x
              </Button>
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <div className="relative">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Gõ câu trả lời của bạn ở đây..."
                className="min-h-[120px] resize-none border-[#E0E0E0] rounded-lg p-4 pr-12 focus:border-[#23085A] focus:ring-1 focus:ring-[#23085A]"
                disabled={isChecked}
              />
              <Mic className="absolute top-4 right-4 w-5 h-5 text-[#9E9E9E]" />
            </div>
          </div>

          {/* Word Grid - Current Segment Words */}
          <div className="flex-1 mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Câu {currentSegment + 1}/{totalSegments}:
              </p>
              <div className="flex flex-wrap gap-2">
                {words.map((word: string, index: number) => {
                  const wordKey = `${currentSegment}-${index}`;
                  const isRevealed = revealedWords.has(wordKey);
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        onClick={() => handleRevealWord(index)}
                        disabled={isRevealed}
                        className={`min-w-[60px] px-3 py-2 rounded-lg border text-sm transition-colors ${isRevealed
                          ? "bg-[#FDECEA] text-[#D32F2F] border-[#F9C0C0] cursor-not-allowed"
                          : "bg-white hover:bg-[#F4F0FF] text-[#9E9E9E] border-[#E0E0E0]"
                          }`}
                      >
                        {isRevealed
                          ? word
                          : "★".repeat(Math.min(word.length, 5))}
                      </button>
                      <button
                        onClick={() => handleRevealWord(index)}
                        disabled={isRevealed}
                        className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${isRevealed
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "hover:bg-[#F4F0FF] text-[#9E9E9E]"
                          }`}
                        title="Hiện từ này"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRevealAllWords}
              disabled={isChecked}
              className="w-full bg-[#FDECEA] text-[#D32F2F] border border-[#F9C0C0] hover:bg-[#FFEBEE] rounded-lg"
              variant="outline"
            >
              Hiện tất cả từ
            </Button>

            {!isChecked ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!userInput.trim()}
                className="w-full bg-[#7E57C2] hover:bg-[#6A4CAE] text-white rounded-lg font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Kiểm tra
              </Button>
            ) : (
              <Button
                onClick={handleNextSegment}
                className="w-full bg-[#23085A] hover:bg-[#34116D] text-white rounded-lg font-medium"
              >
                {currentSegment < totalSegments - 1
                  ? "Tiếp theo"
                  : buttonLabel === "HOÀN THÀNH BÀI TẬP" ? "Hoàn thành" : "Bài tiếp theo"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Các từ được tiết lộ sẽ bị tính là lỗi và ảnh hưởng đến điểm số của
            bạn.
          </p>
        </div>

        {/* Right Panel - Transcript */}
        <div className="col-span-4 bg-[#FAFAFA] p-6 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#23085A] text-lg mb-3">
              Bản chép
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tiến độ bài luyện</span>
                <span className="text-sm font-medium text-[#23085A]">
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-[#E6E6E6] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#7E57C2] to-[#23085A] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>
                  {completedSegments.size}/{totalSegments} câu hoàn thành
                </span>
                <span>
                  Điểm TB:{" "}
                  {Object.keys(segmentScores).length > 0
                    ? Math.round(
                      Object.values(segmentScores).reduce(
                        (a, b) => a + b,
                        0
                      ) / Object.values(segmentScores).length
                    )
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Sentence List */}
          <div className="flex-1 space-y-2 mb-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {item?.solutionJsonb?.sentences && Array.isArray(item.solutionJsonb.sentences)
              ? item.solutionJsonb.sentences.map((sentence: string, index: number) => {
                if (!sentence) return null;

                const isCompleted = completedSegments.has(index);
                const isCurrent = currentSegment === index;
                const segmentScore = segmentScores[index];

                return (
                  <motion.div
                    key={index}
                    className={`rounded-lg border p-3 transition-all duration-200 hover:shadow-sm cursor-pointer ${isCurrent
                      ? "bg-[#F0EBFF] border-[#7E57C2] ring-1 ring-[#7E57C2]"
                      : isCompleted
                        ? "bg-[#E8F5E8] border-[#4CAF50]"
                        : "bg-white border-[#E6E6E6] hover:border-[#D1C4E9]"
                      }`}
                    onClick={() => handleSegmentSelect(index)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${isCurrent ? "text-[#7E57C2]" : "text-[#23085A]"
                            }`}
                        >
                          #{index + 1}
                        </span>
                        {isCompleted && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-[#E8F5E8] text-[#2E7D32] border-[#4CAF50]"
                          >
                            {segmentScore}%
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-[#F0EBFF] text-[#7E57C2] border-[#7E57C2]"
                          >
                            Hiện tại
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSegmentSelect(index);
                          }}
                          className="w-6 h-6 p-0 hover:bg-[#F4F0FF]"
                          title="Chỉnh sửa câu này"
                        >
                          <Edit3 className="w-4 h-4 text-[#6B7280]" />
                        </Button>
                        {!isCompleted && index !== currentSegment && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0 hover:bg-[#F4F0FF]"
                            title="Chưa hoàn thành"
                          >
                            <AlertTriangle className="w-4 h-4 text-[#FF9800]" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">
                      {showTranscript || isCompleted
                        ? sentence
                        : sentence.replace(/\w/g, "★")}
                    </p>
                  </motion.div>
                );
              })
              : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-[#FF9800]" />
                    <p className="text-sm">Không có câu để luyện tập</p>
                    <p className="text-xs text-gray-400 mt-1">Vui lòng kiểm tra dữ liệu bài tập</p>
                  </div>
                </div>
              )}
          </div>

          {/* Current Answer Display */}
          {isChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border-2 border-[#7E57C2] shadow-sm mb-4"
            >
              <h4 className="font-medium text-[#23085A] mb-2">
                Đáp án câu {currentSegment + 1}:
              </h4>
              <p className="text-sm text-[#1A1A1A] mb-3 leading-relaxed">
                {currentSentence}
              </p>

              {/* Word by word comparison */}
              {wordComparison.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">So sánh từng từ:</p>
                  <div className="flex flex-wrap gap-1">
                    {wordComparison.map((item, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs ${item.isCorrect
                          ? "bg-[#E6F4EA] text-[#2E7D32] border border-[#81C784]"
                          : "bg-[#FDECEA] text-[#D32F2F] border border-[#F9C0C0]"
                          }`}
                        title={
                          item.userWord
                            ? `Bạn nhập: "${item.userWord}"`
                            : undefined
                        }
                      >
                        {item.word}
                      </span>
                    ))}
                  </div>
                </div>

              )}

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${scoreMessage.color}`}>
                  Điểm: {score}%
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${score >= 80
                      ? "bg-[#E6F4EA] text-[#2E7D32] border-[#81C784]"
                      : score >= 60
                        ? "bg-[#FFF3E0] text-[#F57C00] border-[#FFB74D]"
                        : "bg-[#FDECEA] text-[#D32F2F] border-[#F9C0C0]"
                      }`}
                  >
                    {score >= 80
                      ? "Tốt"
                      : score >= 60
                        ? "Khá"
                        : "Cần cố gắng"}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Toggle Transcript Button */}
          <div className="mt-auto">
            <Button
              variant="ghost"
              onClick={handleToggleTranscript}
              className="w-full text-gray-500 hover:text-[#23085A] hover:bg-[#F4F0FF]"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Ẩn bản chép
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Hiện bản chép
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
