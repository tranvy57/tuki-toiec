"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

/**
 * Hook for Text-to-Speech playback
 * Uses Web Speech API for text-to-speech functionality
 */
export function useTTS() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      setIsReady(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const play = useCallback((text: string, options?: TTSOptions) => {
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

    // Configure voice settings using options or defaults
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 1;

    // Voice selection logic
    if (options?.voice) {
      utterance.voice = options.voice;
      console.log(`[TTS] Using selected voice: ${options.voice.name}`);
    } else {
      // Fallback/Default selection logic
      const availableVoices = synthRef.current.getVoices();

      // Try to find a good English voice if no specific voice is provided
      const bestVoice = availableVoices.find(v =>
        (v.name.includes("Google US English") ||
          v.name.includes("Samantha") ||
          v.name.includes("Microsoft Zira")) &&
        v.lang.startsWith("en")
      ) || availableVoices.find(v => v.lang.startsWith("en"));

      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`[TTS] Using default best match: ${bestVoice.name}`);
      }
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

  return { play, stop, isPlaying, voices, isReady };
}
