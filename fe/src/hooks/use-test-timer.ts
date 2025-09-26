import { useState, useEffect, useCallback } from "react";
import { formatTime } from "@/utils";

interface UseTestTimerProps {
  initialTime?: number; // in seconds
  autoStart?: boolean;
  onTimeUp?: () => void;
}

/**
 * Hook for managing test timer functionality
 */
export function useTestTimer({ 
  initialTime = 7200, // 2 hours default for TOEIC
  autoStart = false,
  onTimeUp 
}: UseTestTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(autoStart);
    setIsPaused(false);
  }, [initialTime, autoStart]);

  const addTime = useCallback((seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, isPaused, timeLeft, onTimeUp]);

  const formattedTime = formatTime(timeLeft);
  const percentage = (timeLeft / initialTime) * 100;
  const isTimeRunningOut = timeLeft <= 300; // Last 5 minutes
  const isOvertime = timeLeft <= 0;

  return {
    // Time state
    timeLeft,
    formattedTime,
    percentage,
    isTimeRunningOut,
    isOvertime,
    
    // Timer state
    isRunning,
    isPaused,
    
    // Timer controls
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
  };
}
