"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Play, Pause, Download } from "lucide-react";
import { toast } from "sonner";
import { SpeechRecognition } from "@/types";

interface SpeakingRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  onRecordingComplete: (audioBlob: Blob) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

export default function SpeakingRecorder({
  onTranscriptChange,
  onRecordingComplete,
  isListening = false,
  onListeningChange
}: SpeakingRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        onTranscriptChange(fullTranscript);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Speech recognition error. Please try again.");
        stopListening();
      };

      rec.onend = () => {
        if (isListening) {
          // Restart recognition if it should still be listening
          rec.start();
        }
      };

      recognitionRef.current = rec;
    }
  }, [isListening, onTranscriptChange]);

  // Audio level monitoring
  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average);
      
      if (isRecording) {
        requestAnimationFrame(monitorAudioLevel);
      }
    }
  };

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for level monitoring
      if (typeof window !== "undefined") {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);
        
        monitorAudioLevel();
      }

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording and speech recognition
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      onListeningChange?.(true);
      toast.success("Recording started!");
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setAudioLevel(0);
    onListeningChange?.(false);
    toast.success("Recording stopped!");
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = `speaking-practice-${Date.now()}.wav`;
      link.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopListening : startListening}
            className={`flex-1 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop ({formatTime(recordingTime)})
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>
        </div>

        {/* Audio Level Indicator */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Audio Level</span>
              <span>{Math.round(audioLevel)}/255</span>
            </div>
            <Progress value={(audioLevel / 255) * 100} className="h-2" />
            
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-8 rounded-full transition-colors ${
                      audioLevel > (i + 1) * 40 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Live Transcript:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {/* Playback Controls */}
        {audioUrl && (
          <div className="flex gap-2 pt-2 border-t">
            <Button onClick={playRecording} variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            <Button onClick={downloadRecording} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className="text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording in progress...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

