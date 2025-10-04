"use client";

import { useCallback, useRef } from "react";

/**
 * Hook for Text-to-Speech playback
 * TODO: Replace with actual TTS API endpoint
 * Currently uses placeholder Audio API
 */
export function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((text: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // TODO: Replace with actual TTS endpoint
    // const url = `/api/tts?text=${encodeURIComponent(text)}`
    // For now, we'll just log the text
    console.log("[v0] TTS play:", text);

    // Placeholder: Create a silent audio element to simulate playback
    audioRef.current = new Audio();
    audioRef.current
      .play()
      .catch((err) => console.error("Audio play failed:", err));
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { play, stop };
}
