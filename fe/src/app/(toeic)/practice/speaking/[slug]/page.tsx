"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  FileText,
  Target,
  Headphones,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Mock data cho từng loại bài tập nói
const mockExerciseData = {
  "read-aloud": {
    id: "1",
    name: "Read Aloud",
    vietnameseName: "Đọc đoạn văn",
    title: "Đọc to đoạn văn sau",
    prompt:
      "The company will introduce a new training program for employees next month. This program aims to enhance their professional skills and improve workplace efficiency.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    duration: 20,
    timeLimit: "20 giây",
    instructions: [
      "Đọc to và rõ ràng đoạn văn hiển thị",
      "Chú ý phát âm từng từ chính xác",
      "Giữ nhịp độ đọc tự nhiên và mạch lạc",
      "Dừng nghỉ phù hợp tại dấu câu",
    ],
    sample_result: {
      user_transcript:
        "The company introduce a new training program for employees next month. This program aims to enhance their professional skills and improve workplace efficiency.",
      target_transcript:
        "The company will introduce a new training program for employees next month. This program aims to enhance their professional skills and improve workplace efficiency.",
      accuracy_score: 85,
      pronunciation_score: 78,
      fluency_score: 82,
      feedback:
        "You missed 'will'. Focus on verb forms and linking sounds between words.",
    },
  },
  "repeat-sentence": {
    id: "2",
    name: "Repeat Sentence",
    vietnameseName: "Nhắc lại câu",
    title: "Nghe và nhắc lại câu sau",
    prompt:
      "Bạn sẽ nghe một câu. Hãy nhắc lại chính xác những gì bạn vừa nghe.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    duration: 15,
    timeLimit: "15 giây",
    audio_url: "/audio/sample1.mp3",
    target_transcript:
      "The project has been completed ahead of schedule and under budget.",
    instructions: [
      "Nghe kỹ câu được phát",
      "Nhắc lại chính xác từng từ",
      "Giữ nguyên ngữ điệu và nhấn âm",
      "Không thêm bớt từ nào",
    ],
    sample_result: {
      user_transcript:
        "The project been completed ahead schedule and under budget.",
      target_transcript:
        "The project has been completed ahead of schedule and under budget.",
      accuracy_score: 83,
      pronunciation_score: 85,
      fluency_score: 79,
      feedback:
        "You missed 'has' and 'of'. Try slowing down a little to catch all words.",
    },
  },
  "describe-picture": {
    id: "3",
    name: "Describe a Picture",
    vietnameseName: "Mô tả hình ảnh",
    title: "Mô tả hình ảnh trong 30 giây",
    prompt: "Nhìn vào hình ảnh và mô tả chi tiết những gì bạn nhìn thấy.",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    duration: 30,
    timeLimit: "30 giây",
    image_url: "/images/airport_waiting.jpg",
    instructions: [
      "Quan sát kỹ tất cả chi tiết trong hình",
      "Mô tả người, vật, hành động rõ ràng",
      "Sử dụng từ vựng phong phú và chính xác",
      "Tổ chức ý tưởng logic và mạch lạc",
    ],
    sample_feedback: {
      grammar_score: 89,
      vocabulary_score: 76,
      fluency_score: 84,
      pronunciation_score: 82,
      feedback:
        "Good pronunciation and fluency. Try adding more descriptive vocabulary like 'busy', 'crowded', or specific clothing details.",
    },
  },
};

// Mock AI feedback responses
const generateMockFeedback = (exerciseType: string, userText: string) => {
  const feedbacks = {
    "read-aloud": {
      accuracy_score: Math.floor(Math.random() * 20) + 80,
      pronunciation_score: Math.floor(Math.random() * 25) + 75,
      fluency_score: Math.floor(Math.random() * 20) + 80,
      feedback:
        "Good reading flow. Pay attention to word stress and natural pausing at punctuation marks.",
    },
    "repeat-sentence": {
      accuracy_score: Math.floor(Math.random() * 25) + 75,
      pronunciation_score: Math.floor(Math.random() * 20) + 80,
      fluency_score: Math.floor(Math.random() * 25) + 75,
      feedback:
        "Nice rhythm and pace. Focus on capturing all function words like 'the', 'has', 'been'.",
    },
    "describe-picture": {
      grammar_score: Math.floor(Math.random() * 15) + 85,
      vocabulary_score: Math.floor(Math.random() * 25) + 70,
      fluency_score: Math.floor(Math.random() * 20) + 80,
      pronunciation_score: Math.floor(Math.random() * 20) + 80,
      feedback:
        "Creative description with good sentence variety. Try using more specific adjectives and prepositions.",
    },
  };

  return (
    feedbacks[exerciseType as keyof typeof feedbacks] || feedbacks["read-aloud"]
  );
};

export default function SpeakingExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [progress, setProgress] = useState(0);

  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const audioLevelIntervalRef = useRef<NodeJS.Timeout>();

  const slug = params.slug as string;
  const exerciseData = mockExerciseData[slug as keyof typeof mockExerciseData];

  useEffect(() => {
    // Start general timer
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordingIntervalRef.current)
        clearInterval(recordingIntervalRef.current);
      if (audioLevelIntervalRef.current)
        clearInterval(audioLevelIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Calculate progress based on current exercise
    setProgress((currentExercise / 10) * 100);
  }, [currentExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      // Mock microphone access
      setIsRecording(true);
      setRecordingTime(0);
      setAudioLevel(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= exerciseData.duration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Mock audio level animation
      audioLevelIntervalRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAudioLevel(0);
    setIsProcessing(true);

    if (recordingIntervalRef.current)
      clearInterval(recordingIntervalRef.current);
    if (audioLevelIntervalRef.current)
      clearInterval(audioLevelIntervalRef.current);

    // Mock processing time
    setTimeout(() => {
      // Generate mock transcript and feedback
      const mockTexts = [
        "The company introduce a new training program for employees next month.",
        "The project been completed ahead schedule and under budget.",
        "In this picture I can see people waiting in what looks like an airport terminal.",
      ];

      setUserTranscript(
        mockTexts[Math.floor(Math.random() * mockTexts.length)]
      );
      setIsProcessing(false);
      setHasRecorded(true);
    }, 2000);
  };

  const handlePlayAudio = () => {
    if (slug === "repeat-sentence") {
      setIsPlaying(true);
      // Mock audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setUserTranscript("");
    setHasRecorded(false);
    setIsProcessing(false);
    setShowFeedback(false);
    if (recordingIntervalRef.current)
      clearInterval(recordingIntervalRef.current);
    if (audioLevelIntervalRef.current)
      clearInterval(audioLevelIntervalRef.current);
  };

  const handleNextExercise = () => {
    setCurrentExercise((prev) => prev + 1);
    handleReset();
  };

  if (!exerciseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-gray-600">Không tìm thấy bài tập này.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {exerciseData.vietnameseName}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge className={exerciseData.difficultyColor}>
                  {exerciseData.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Target className="w-4 h-4" />
                  <span>Bài {currentExercise}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right hidden md:block">
            <div className="text-sm text-gray-600 mb-1">
              Tiến độ: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Instructions & Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Prompt Card */}
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  {exerciseData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image for picture description */}
                {slug === "describe-picture" && (
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText className="w-16 h-16 mb-4" />
                      <span className="text-lg font-medium">Hình ảnh mẫu</span>
                      <span className="text-sm">Airport Waiting Area</span>
                    </div>
                  </div>
                )}

                {/* Audio player for repeat sentence */}
                {slug === "repeat-sentence" && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Headphones className="w-6 h-6 text-green-600" />
                        <span className="font-medium text-green-800">
                          Âm thanh mẫu
                        </span>
                      </div>
                      <Button
                        onClick={handlePlayAudio}
                        disabled={isPlaying}
                        variant="outline"
                        size="sm"
                        className="border-green-300 hover:bg-green-100"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Đang phát
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Nghe
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Mock waveform */}
                    <div className="flex items-center justify-center space-x-1 h-12 bg-white/60 rounded-lg p-2">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-green-400 rounded-full transition-all duration-300 ${
                            isPlaying ? "animate-pulse" : ""
                          }`}
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Text content for read aloud */}
                {slug === "read-aloud" && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                    <p className="text-lg leading-relaxed text-gray-800 font-medium">
                      {exerciseData.prompt}
                    </p>
                  </div>
                )}

                {/* General instruction */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {exerciseData.prompt}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Hướng dẫn thực hiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {exerciseData.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Recording Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Recording Card */}
            <Card className="border-2 border-pink-100 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pink-500" />
                  Ghi âm câu trả lời
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Button */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <motion.button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500 border-red-300 hover:bg-red-600"
                          : "bg-pink-500 border-pink-300 hover:bg-pink-600"
                      } ${
                        isProcessing
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                      transition={{
                        duration: 1,
                        repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : isRecording ? (
                        <MicOff className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </motion.button>

                    {/* Audio level visualization */}
                    {isRecording && (
                      <div className="absolute -inset-2">
                        <motion.div
                          className="w-full h-full rounded-full border-2 border-pink-300"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          style={{ opacity: audioLevel / 100 }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    {isProcessing ? (
                      <p className="text-blue-600 font-medium">
                        Đang xử lý âm thanh...
                      </p>
                    ) : isRecording ? (
                      <>
                        <p className="text-red-600 font-medium">
                          Đang ghi âm...
                        </p>
                        <p className="text-sm text-gray-500">
                          {recordingTime}/{exerciseData.duration}s
                        </p>
                      </>
                    ) : hasRecorded ? (
                      <p className="text-green-600 font-medium">
                        Hoàn thành ghi âm!
                      </p>
                    ) : (
                      <p className="text-gray-600">Nhấn để bắt đầu ghi âm</p>
                    )}
                  </div>
                </div>

                {/* Recording Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tiến độ ghi âm</span>
                    <span>
                      {Math.round(
                        (recordingTime / exerciseData.duration) * 100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(recordingTime / exerciseData.duration) * 100}
                    className="h-3"
                  />
                </div>

                {/* Time limit info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Thời gian tối đa: {exerciseData.timeLimit}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {hasRecorded && (
                    <Button
                      onClick={handleViewFeedback}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Xem đánh giá AI
                    </Button>
                  )}

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ghi lại
                  </Button>

                  {hasRecorded && (
                    <Button
                      onClick={handleNextExercise}
                      variant="outline"
                      className="w-full border-green-200 hover:bg-green-50"
                    >
                      Bài tiếp theo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transcript Display */}
            <AnimatePresence>
              {userTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Bản ghi âm của bạn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{userTranscript}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* AI Feedback Modal */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-6 h-6 text-pink-500" />
                Đánh giá từ AI
              </DialogTitle>
              <DialogDescription>
                Phản hồi chi tiết về khả năng nói của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(generateMockFeedback(slug, userTranscript)).map(
                  ([key, value]) => {
                    if (key === "feedback") return null;
                    const scoreLabels: { [key: string]: string } = {
                      accuracy_score: "Chính xác",
                      pronunciation_score: "Phát âm",
                      fluency_score: "Lưu loát",
                      grammar_score: "Ngữ pháp",
                      vocabulary_score: "Từ vựng",
                    };
                    const colors = [
                      "text-blue-600",
                      "text-green-600",
                      "text-purple-600",
                      "text-pink-600",
                      "text-orange-600",
                    ];
                    return (
                      <div
                        key={key}
                        className="text-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`text-3xl font-bold ${
                            colors[Math.floor(Math.random() * colors.length)]
                          }`}
                        >
                          {value}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {scoreLabels[key]}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Detailed Feedback */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Nhận xét chi tiết:
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {generateMockFeedback(slug, userTranscript).feedback}
                </p>
              </div>

              {/* Target vs User comparison for read-aloud and repeat-sentence */}
              {(slug === "read-aloud" || slug === "repeat-sentence") && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    So sánh văn bản:
                  </h4>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">
                      Văn bản gốc:
                    </h5>
                    <p className="text-gray-800 leading-relaxed">
                      {exerciseData.sample_result?.target_transcript ||
                        exerciseData.prompt}
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-red-600 mb-2">
                      Bản ghi của bạn:
                    </h5>
                    <p className="text-gray-800 leading-relaxed">
                      {userTranscript}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setShowFeedback(false);
                    handleNextExercise();
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Bài tiếp theo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
