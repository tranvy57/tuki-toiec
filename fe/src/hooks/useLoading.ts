"use client";

import { useState, useCallback } from "react";

interface UseLoadingOptions {
  initialLoading?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseLoadingReturn {
  isLoading: boolean;
  error: Error | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
  executeAsync: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const { initialLoading = false, onSuccess, onError } = options;

  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(
    (err: Error | null) => {
      setError(err);
      setIsLoading(false);
      if (err && onError) {
        onError(err);
      }
    },
    [onError]
  );

  const executeAsync = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        startLoading();
        const result = await asyncFn();
        stopLoading();
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        handleError(error);
        return null;
      }
    },
    [startLoading, stopLoading, handleError, onSuccess]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: handleError,
    executeAsync,
    reset,
  };
}

// Hook for handling multiple loading states
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, Error | null>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
    if (loading) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  }, []);

  const setError = useCallback((key: string, error: Error | null) => {
    setErrors((prev) => ({ ...prev, [key]: error }));
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const executeAsync = useCallback(
    async <T>(key: string, asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        setLoading(key, true);
        const result = await asyncFn();
        setLoading(key, false);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(key, error);
        return null;
      }
    },
    [setLoading, setError]
  );

  const reset = useCallback((key?: string) => {
    if (key) {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
      setErrors((prev) => ({ ...prev, [key]: null }));
    } else {
      setLoadingStates({});
      setErrors({});
    }
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const hasAnyError = Object.values(errors).some(Boolean);

  return {
    loadingStates,
    errors,
    isAnyLoading,
    hasAnyError,
    setLoading,
    setError,
    executeAsync,
    reset,
    isLoading: (key: string) => loadingStates[key] || false,
    getError: (key: string) => errors[key] || null,
  };
}

// Hook for handling retry logic
export function useRetry(maxRetries: number = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      if (retryCount >= maxRetries) {
        throw new Error(`Max retry attempts (${maxRetries}) exceeded`);
      }

      try {
        setIsRetrying(true);
        const result = await asyncFn();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        setRetryCount((prev) => prev + 1);
        setIsRetrying(false);
        throw error;
      }
    },
    [retryCount, maxRetries]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const canRetry = retryCount < maxRetries;

  return {
    retry,
    retryCount,
    isRetrying,
    canRetry,
    maxRetries,
    reset,
  };
}
