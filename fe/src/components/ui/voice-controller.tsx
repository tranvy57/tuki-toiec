"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Gauge } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TTSPlayerProps {
  text: string;
  lang?: string;
}

export function TTSPlayer({ text, lang = "en-US" }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const totalChars = text.length;

  const formatTime = (p: number) => `${Math.round(p)}%`;

  const startSpeaking = (startChar = 0) => {
    if (!("speechSynthesis" in window)) return;
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text.slice(startChar));
    utterance.lang = lang;
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = volume;

    utterance.onboundary = (event) => {
      if (event.charIndex) {
        const ratio = Math.min((event.charIndex / totalChars) * 100, 100);
        setProgress(ratio);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
    } else {
      const currentChar = Math.floor((progress / 100) * totalChars);
      startSpeaking(currentChar);
    }
  };

  const onSeek = (val: number[]) => {
    const percent = val[0];
    setProgress(percent);
    if (isPlaying) {
      const newChar = Math.floor((percent / 100) * totalChars);
      startSpeaking(newChar);
    }
  };

  const onSpeedChange = (val: number[]) => {
    const newSpeed = val[0];
    setSpeed(newSpeed);
    if (isPlaying) {
      const currentChar = Math.floor((progress / 100) * totalChars);
      startSpeaking(currentChar);
    }
  };

  const onVolumeChange = (val: number[]) => {
    const v = val[0];
    setVolume(v);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        {/* Play / Pause button */}
        <Button
          variant="default"
          size="icon"
          onClick={togglePlay}
          className="rounded-full h-10 w-10 bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Seek bar */}
        <div className="flex flex-1 flex-col">
          <Slider
            value={[progress]}
            max={100}
            step={0.5}
            onValueChange={onSeek}
            className="[&>[role=slider]]:bg-rose-500 [&>[role=slider]]:border-rose-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>{formatTime(progress)}</span>
            <span>100%</span>
          </div>
        </div>

        {/* Volume + Speed controls */}
        <div className="flex items-center -translate-y-3 mt-3 px-2 text-sm text-slate-600">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-600"
              onClick={() => onVolumeChange([volume === 0 ? 1 : 0])}
            >
              {volume > 0 ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            <Slider
              value={[volume]}
              max={1}
              step={0.05}
              onValueChange={onVolumeChange}
              className="w-20 [&>[role=slider]]:bg-rose-400"
            />
          </div>

          {/* Speed */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-600 hover:bg-slate-100"
              >
                <Gauge className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-36 p-3 shadow-lg"
              align="end"
              sideOffset={6}
            >
              <h4 className="text-sm font-medium mb-2 text-slate-700">Speed</h4>
              <RadioGroup
                value={String(speed)}
                onValueChange={(val) => onSpeedChange([parseFloat(val)])}
                className="space-y-1"
              >
                {["0.75", "1", "1.25", "1.5", "2"].map((val) => (
                  <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={val} id={`speed-${val}`} />
                    <Label
                      htmlFor={`speed-${val}`}
                      className="text-sm cursor-pointer text-slate-700"
                    >
                      {val === "1" ? "Normal" : `${val}x`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </PopoverContent>
          </Popover>

          <span className="text-xs text-slate-500">{speed.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  );
}
