import { useState, useEffect } from "react";

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
}

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 300, leading = false } = options;
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hasCalledLeading, setHasCalledLeading] = useState(false);

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Leading edge call
    if (leading && !hasCalledLeading) {
      setHasCalledLeading(true);
      callback(...args);
      return;
    }

    // Trailing edge call
    const newTimer = setTimeout(() => {
      callback(...args);
      setHasCalledLeading(false);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}
