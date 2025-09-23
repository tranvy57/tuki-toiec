"use client";

import { formatTime } from "@/utils/formatTime";
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
  }, [tickInterval]);

  return (
    <div className="text-2xl font-bold text-blue-600">
      {formatTime(timeLeft)}
    </div>
  );
}
