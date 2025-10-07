"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Gauge } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AudioPlayerProps {
  audioUrl: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const {
    audioRef,
    isPlaying,
    duration,
    position,
    volume,
    speed,
    togglePlay,
    onSeek,
    onVolumeChange,
    onSpeedChange,
    formatTime,
  } = useAudioPlayer(audioUrl);


  return (
    <div className="p-4">
      {/* Play / Seek bar */}
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
            value={[position]}
            max={duration || 1}
            step={0.1}
            onValueChange={onSeek}
            className="[&>[role=slider]]:bg-rose-500 [&>[role=slider]]:border-rose-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
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
                {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((val) => (
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

      {/* Volume + Speed */}

      {/* Hidden audio */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
