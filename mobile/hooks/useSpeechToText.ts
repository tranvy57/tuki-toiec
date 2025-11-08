import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

interface UseSpeechToTextOptions {
  language?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
  text: string;
  isListening: boolean;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  clearText: () => void;
  isSupported: boolean;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn => {
  const {
    language = 'en-US', // Default to English, can be 'vi-VN' for Vietnamese
    onResult,
    onError,
  } = options;

  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is available
    console.log(Voice)
    Voice.isAvailable().then((available) => {
      setIsSupported(Boolean(available));
    });

    // Set up event listeners
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        const recognizedText = event.value[0];
        setText(recognizedText);
        onResult?.(recognizedText);
      }
    };

    Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        // Update with partial results for real-time feedback
        setText(event.value[0]);
      }
    };

    Voice.onSpeechError = (event: SpeechErrorEvent) => {
      const errorMessage = event.error?.message || 'Speech recognition error';
      setError(errorMessage);
      setIsListening(false);
      onError?.(errorMessage);
    };

    Voice.onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    // Cleanup on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onResult, onError]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setText('');
      await Voice.start(language);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start speech recognition';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [language, onError]);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop speech recognition';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  const clearText = useCallback(() => {
    setText('');
    setError(null);
  }, []);

  return {
    text,
    isListening,
    error,
    startListening,
    stopListening,
    clearText,
    isSupported,
  };
};
