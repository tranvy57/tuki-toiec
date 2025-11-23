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

    // Configure voice settings for teacher-like speech
    utterance.rate = 0.75; // Slower for clear pronunciation
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 0.9; // Clear volume

    // Try to find the best English teacher voice
    const voices = synthRef.current.getVoices();

    // Priority order for voice selection (teacher-like voices)
    const preferredVoices = [
      // Google voices (usually clearest)
      "Google US English",
      "Google UK English Female",
      "Google UK English Male",

      // Microsoft voices
      "Microsoft Zira Desktop - English (United States)",
      "Microsoft David Desktop - English (United States)",
      "Microsoft Hazel Desktop - English (Great Britain)",

      // Apple voices (if on Safari)
      "Samantha",
      "Victoria",
      "Alex",

      // Fallback to any female English voice
      "Female",
      "en-US",
    ];

    let selectedVoice: SpeechSynthesisVoice | null = null;

    for (const preferredName of preferredVoices) {
      const foundVoice = voices.find(
        (voice) =>
          voice.name.includes(preferredName) ||
          ((voice.lang.includes("en-US") || voice.lang.includes("en-GB")) &&
            voice.name.toLowerCase().includes(preferredName.toLowerCase()))
      );
      if (foundVoice) {
        selectedVoice = foundVoice;
        break;
      }
    }

    // If no preferred voice found, use any English voice
    if (!selectedVoice) {
      const englishVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") && !voice.name.includes("Google Deutsch")
      );
      if (englishVoice) {
        selectedVoice = englishVoice;
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(
        `[TTS] Using voice: ${selectedVoice.name} (${selectedVoice.lang})`
      );
    } else {
      console.log("[TTS] Using default voice");
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
