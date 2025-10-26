"use client";

import { formatTime } from "@/utils";
import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  tickInterval?: number; // mặc định 1s
}

export function CountdownTimer({
  initialSeconds,
  onExpire,
  tickInterval = 1000,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update timeLeft when initialSeconds changes
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [tickInterval, onExpire]);

  return (
    <span className={`font-mono font-medium text-blue-500`}>
      {formatTime(timeLeft)}
    </span>
  );
}
