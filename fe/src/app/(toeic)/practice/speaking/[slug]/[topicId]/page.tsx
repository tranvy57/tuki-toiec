"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Eye,
  EyeOff,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEvaluateSpeakingAttempt } from "@/api/useSpeakingAttempt";
import { AudioPlayer } from "@/components/toeic/test/Audio";

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
        "Where was the company picnic held?(A) In April.(B) Refreshments will be provided.(C) At a park next to a lake.",
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
      "The company will introduce a new training program for employees next month. This program aims to enhance their professional skills and improve workplace efficiency.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    duration: 15,
    timeLimit: "15 giây",
    audio_url:
      "https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_7.mp3",
    target_transcript:
      "Where was the company picnic held?(A) In April.(B) Refreshments will be provided.(C) At a park next to a lake.",
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
    // },
    // "describe-picture": {
    //   id: "3",
    //   name: "Describe a Picture",
    //   vietnameseName: "Mô tả hình ảnh",
    //   title: "Mô tả hình ảnh trong 30 giây",
    //   prompt: "Nhìn vào hình ảnh và mô tả chi tiết những gì bạn nhìn thấy.",
    //   difficulty: "Medium",
    //   difficultyColor: "bg-yellow-100 text-yellow-800",
    //   duration: 30,
    //   timeLimit: "30 giây",
    //   image_url: "/images/airport_waiting.jpg",
    //   instructions: [
    //     "Quan sát kỹ tất cả chi tiết trong hình",
    //     "Mô tả người, vật, hành động rõ ràng",
    //     "Sử dụng từ vựng phong phú và chính xác",
    //     "Tổ chức ý tưởng logic và mạch lạc",
    //   ],
    // sample_feedback: {
    //   grammar_score: 89,
    //   vocabulary_score: 76,
    //   fluency_score: 84,
    //   pronunciation_score: 82,
    //   feedback:
    //     "Good pronunciation and fluency. Try adding more descriptive vocabulary like 'busy', 'crowded', or specific clothing details.",
    // },
  },
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
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<any | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showAudioTranscript, setShowAudioTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recordingIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const timerIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout>(undefined);

  const slug = params.slug as string;
  const exerciseData = mockExerciseData[slug as keyof typeof mockExerciseData];
  const { mutate, data, isPending, isError, reset } =
    useEvaluateSpeakingAttempt();

  useEffect(() => {
    if (data && !apiResult) {
      setApiResult(data.data);
      setUserTranscript((data as any)?.transcript || "");
      // Auto scroll to result after a short delay
      setTimeout(() => {
        const resultSection = document.querySelector("[data-result-section]");
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [data, apiResult]);

  // useEffect(() => {
  //   // Start general timer
  //   timerIntervalRef.current = setInterval(() => {
  //     setTimeElapsed((prev) => prev + 1);
  //   }, 1000);

  //   return () => {
  //     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  //     if (recordingIntervalRef.current)
  //       clearInterval(recordingIntervalRef.current);
  //     if (audioLevelIntervalRef.current)
  //       clearInterval(audioLevelIntervalRef.current);
  //   };
  // }, []);

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
    console.log("check 1");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaStream.current = stream;
      mediaRecorder.current = mr;

      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
        setHasRecorded(true);
      };

      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioLevel(0);

      // timers
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= exerciseData.duration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      audioLevelIntervalRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      console.log("chec 2");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  console.log(isRecording);
  console.log(isProcessing);

  const stopRecording = () => {
    setIsRecording(false);
    setAudioLevel(0);

    clearInterval(recordingIntervalRef.current);
    clearInterval(audioLevelIntervalRef.current);

    const recorder = mediaRecorder.current;
    const stream = mediaStream.current;
    console.log("check");

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (err) {
        console.warn("MediaRecorder stop error:", err);
      }
    }

    try {
      stream?.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.warn("Error stopping tracks:", e);
    }

    mediaRecorder.current = null;
    mediaStream.current = null;
  };

  const handlePlayRecorded = () => {
    if (!audioUrl || !audioBlob) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };
  console.log(audioBlob);

  const submitRecording = () => {
    if (!audioBlob) {
      alert("Bạn chưa ghi âm.");
      return;
    }

    // Clear previous results
    setApiResult(null);

    // Submit using the hook
    mutate({ audio: audioBlob, question: exerciseData.prompt });
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
    // Scroll to the result section smoothly
    const resultSection = document.querySelector("[data-result-section]");
    if (resultSection) {
      resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleReset = () => {
    setShowFeedback(false);
    setIsRecording(false);
    setRecordingTime(0);
    setUserTranscript("");
    setHasRecorded(false);
    setIsProcessing(false);
    setShowFeedback(false);
    setShowTranscript(false);
    setShowAudioTranscript(false);
    setApiResult(null);
    reset();
    setAudioBlob(null);
    setAudioUrl(null);
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
        <div className="p-6 text-center">
          <p className="text-gray-600">Không tìm thấy bài tập này.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div className="flex gap-6">
              <h1 className="text-2xl font-bold text-[#23085A]">
                {exerciseData.name}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                {/* <Badge
                  className={
                    subTopic?.level === "Easy"
                      ? "bg-green-100 text-green-800"
                      : subTopic?.level === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {subTopic?.level}
                </Badge> */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">
              Tiến độ: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side - Instructions & Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 lg:col-span-2"
          >
            {/* Prompt div */}
            <div className="bg-white rounded-sm p-4">
              <div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  {exerciseData.title}
                </div>
              </div>
              <div className="space-y-4">
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
                        onClick={() =>
                          setShowAudioTranscript(!showAudioTranscript)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                      >
                        {showAudioTranscript ? (
                          <EyeOff className="w-4 h-4 mr-1" />
                        ) : (
                          <Eye className="w-4 h-4 mr-1" />
                        )}
                        {showAudioTranscript
                          ? "Ẩn transcript"
                          : "Xem transcript"}
                      </Button>
                    </div>

                    <div className="mb-4 w-full">
                      <AudioPlayer
                        audioUrl={
                          "https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_7.mp3"
                        }
                      />
                    </div>

                    {/* Audio Transcript */}
                    <AnimatePresence>
                      {showAudioTranscript && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/80 rounded-lg p-4 border border-green-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <h5 className="font-medium text-green-800">
                              Transcript:
                            </h5>
                          </div>
                          <p className="text-gray-800 italic text-sm leading-relaxed">
                            "
                            {(exerciseData as any).prompt ||
                              "Where was the company picnic held?(A) In April.(B) Refreshments will be provided.(C) At a park next to a lake."}
                            "
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mock waveform */}
                    {/* <div className="flex items-center justify-center space-x-1 h-12 bg-white/60 rounded-lg p-2">
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
                    </div> */}
                  </div>
                )}

                {/* Text content for read aloud */}
                {slug === "read-aloud" && (
                  <div className=" rounded-sm p-2">
                    <p className="text-lg leading-relaxed text-gray-800 ">
                      {exerciseData.prompt}
                    </p>
                  </div>
                )}

                {/* General instruction */}
                {/* <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {exerciseData.prompt}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Recorded audio player (visible after recording) */}

            {/* Instructions */}
            {/* Right Side - Recording Interface (compact) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="  bg-white rounded-sm p-4">
                <div className="pb-2">
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <Mic className="w-5 h-5 text-pink-500" />
                    Ghi âm & Nộp bài
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Record / Stop button */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      {isRecording && (
                        <div className="absolute -inset-2 pointer-events-none">
                          <motion.div
                            className="w-full h-full rounded-full border-2 border-pink-300"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                            style={{ opacity: Math.min(1, audioLevel / 80) }}
                          />
                        </div>
                      )}

                      <motion.button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300
              ${
                isRecording
                  ? "bg-red-500 border-red-300 hover:bg-red-600"
                  : "bg-pink-500 border-pink-300 hover:bg-pink-600"
              }
              ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
                        animate={isRecording ? { scale: [1, 1.08, 1] } : {}}
                        transition={{
                          duration: 1,
                          repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : isRecording ? (
                          <MicOff className="w-8 h-8 text-white" />
                        ) : (
                          <Mic className="w-8 h-8 text-white" />
                        )}
                      </motion.button>
                    </div>

                    {/* Compact state line */}
                    <div className="text-center text-sm">
                      {isProcessing ? (
                        <p className="text-blue-600 font-medium">
                          Đang xử lý âm thanh…
                        </p>
                      ) : isRecording ? (
                        <p className="text-red-600 font-medium">
                          Đang ghi âm… {recordingTime}/{exerciseData.duration}s
                        </p>
                      ) : hasRecorded ? (
                        <p className="text-green-700">Đã ghi âm xong</p>
                      ) : (
                        <p className="text-gray-600">Nhấn để bắt đầu ghi âm</p>
                      )}
                    </div>
                  </div>

                  {/* Action row: Nộp bài + Ghi lại (chỉ 2 nút) */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={submitRecording}
                      className=" hover:to-violet-600"
                      disabled={!audioBlob || isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang
                          gửi
                        </>
                      ) : (
                        "Nộp bài"
                      )}
                    </Button>

                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Ghi lại
                    </Button>
                  </div>
                  {audioUrl && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 font-medium">
                          Nghe lại bản ghi
                        </div>
                        <div className="text-xs text-gray-500">
                          {audioBlob
                            ? `${(audioBlob.size / 1024).toFixed(1)} KB`
                            : ""}
                        </div>
                      </div>

                      <div className="mt-3">
                        <audio controls src={audioUrl} className="w-full" />
                      </div>
                    </>
                  )}

                  {/* Link mở modal kết quả nếu có (nhỏ gọn) */}
                </div>
              </div>

              {/* Error (nhỏ gọn) */}
              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="border-red-200 bg-red-50">
                      <div className="py-3">
                        <div className="text-sm text-red-700 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Gửi bài không thành công. Vui lòng thử lại.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Right Side - Recording Interface */}

          <AnimatePresence>
            {apiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                data-result-section
              >
                <div className="bg-white rounded-sm p-4">
                  <div>
                    <div className="text-lg font-semibold flex items-center gap-2 text-blue-900 mb-2">
                      <Sparkles className="w-5 h-5 " />
                      Kết quả đánh giá từ AI
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Scores Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(apiResult).map(([key, value]) => {
                        if (
                          key === "feedback" ||
                          key === "transcript" ||
                          key === "audioUrl" ||
                          key === "id"
                        )
                          return null;
                        const scoreLabels: { [key: string]: string } = {
                          accuracy: "Chính xác",
                          pronunciation: "Phát âm",
                          fluency: "Lưu loát",
                          grammar: "Ngữ pháp",
                          vocabulary: "Từ vựng",
                          overall: "Tổng thể",
                          task: "Nhiệm vụ",
                        };
                        const label = scoreLabels[key] || key;
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
                            className="text-center p-4 bg-white rounded-lg shadow-sm border"
                          >
                            <div
                              className={`text-2xl font-bold ${
                                colors[
                                  Math.floor(Math.random() * colors.length)
                                ]
                              }`}
                            >
                              {String(value)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    {apiResult?.feedback && (
                      <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-blue-500" />
                          Nhận xét chi tiết:
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {apiResult.feedback}
                        </p>
                      </div>
                    )}

                    {/* Transcript */}
                    {apiResult?.transcript && (
                      <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Bản ghi (AI):
                          </h4>
                          <Button
                            onClick={() => setShowTranscript(!showTranscript)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            {showTranscript ? (
                              <EyeOff className="w-4 h-4 mr-1" />
                            ) : (
                              <Eye className="w-4 h-4 mr-1" />
                            )}
                            {showTranscript ? "Ẩn" : "Hiện"}
                          </Button>
                        </div>
                        <AnimatePresence>
                          {showTranscript && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="text-gray-800 italic text-sm">
                                "{apiResult.transcript}"
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
