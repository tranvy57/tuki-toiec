import { useCallback, useRef } from "react";

export interface AudioFeedbackOptions {
  enableSound?: boolean;
  enableVibration?: boolean;
  volume?: number;
}

export function useAudioFeedback(options: AudioFeedbackOptions = {}) {
  const { enableSound = true, enableVibration = true, volume = 0.3 } = options;

  const audioContextRef = useRef<AudioContext | null>(null);

  // Khởi tạo Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Tạo âm thanh từ frequency
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!enableSound) return;

      try {
        const audioContext = getAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn("Audio feedback error:", error);
      }
    },
    [enableSound, volume, getAudioContext]
  );

  // Vibration
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!enableVibration || !navigator.vibrate) return;

      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Vibration error:", error);
      }
    },
    [enableVibration]
  );

  // Âm thanh cho từ đúng
  const playCorrectSound = useCallback(() => {
    playTone(800, 0.1, "sine"); // Âm thanh cao, ngắn
  }, [playTone]);

  // Âm thanh cho từ sai
  const playErrorSound = useCallback(() => {
    playTone(300, 0.2, "sawtooth"); // Âm thanh thấp, dài hơn
    vibrate(100); // Rung nhẹ 100ms
  }, [playTone, vibrate]);

  // Âm thanh cho từ thiếu
  const playMissingSound = useCallback(() => {
    playTone(150, 0.3, "triangle"); // Âm thanh rất thấp
    vibrate([50, 50, 50]); // Rung 3 lần ngắn
  }, [playTone, vibrate]);

  // Âm thanh thành công
  const playSuccessSound = useCallback(() => {
    // Melody thành công: Do-Mi-Sol
    setTimeout(() => playTone(523, 0.15), 0); // C5
    setTimeout(() => playTone(659, 0.15), 150); // E5
    setTimeout(() => playTone(784, 0.3), 300); // G5
    vibrate([100, 50, 200]); // Rung pattern thành công
  }, [playTone, vibrate]);

  // Âm thanh cảnh báo
  const playWarningSound = useCallback(() => {
    playTone(400, 0.15, "square");
    vibrate(50);
  }, [playTone, vibrate]);

  return {
    playCorrectSound,
    playErrorSound,
    playMissingSound,
    playSuccessSound,
    playWarningSound,
    playTone,
    vibrate,
  };
}
