"use client";

import { useCallback, useRef } from "react";

/**
 * Hook for Text-to-Speech playback
 * Uses Web Speech API for text-to-speech functionality
 */
export function useTTS() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  if (typeof window !== "undefined" && !synthRef.current) {
    synthRef.current = window.speechSynthesis;
  }

  const play = useCallback((text: string) => {
    // Stop any currently playing speech
    if (synthRef.current && currentUtteranceRef.current) {
      synthRef.current.cancel();
    }

    if (!synthRef.current) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    // Configure voice settings
    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a female voice if available
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.includes("Female") ||
        voice.name.includes("Samantha") ||
        voice.name.includes("Victoria") ||
        voice.name.includes("Google US English")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      console.log("[TTS] Started playing:", text.substring(0, 50) + "...");
    };

    utterance.onend = () => {
      console.log("[TTS] Finished playing");
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error("[TTS] Error:", event.error);
      currentUtteranceRef.current = null;
    };

    // Start speaking
    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      currentUtteranceRef.current = null;
      console.log("[TTS] Stopped");
    }
  }, []);

  const isPlaying = useCallback(() => {
    return synthRef.current?.speaking || false;
  }, []);

  return { play, stop, isPlaying };
}
