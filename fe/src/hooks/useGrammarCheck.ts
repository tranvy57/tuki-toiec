import { useState, useEffect, useCallback, useRef } from "react";
import { checkGrammarWithLanguageTool } from "@/lib/grammar-check";
import type {
  GrammarMatch,
  UseGrammarCheckReturn,
  GrammarCheckError,
} from "@/types/grammar";

/**
 * Custom hook for grammar checking with debouncing
 * Provides grammar checking functionality with loading states and error handling
 */
export function useGrammarCheck(debounceMs = 800): UseGrammarCheckReturn {
  const [matches, setMatches] = useState<GrammarMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkGrammar = useCallback(
    async (text: string) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Clear previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Reset error state
      setError(null);

      // Don't check empty or very short text
      if (!text || text.trim().length < 3) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Set loading state
      setLoading(true);

      // Debounce the API call
      timeoutRef.current = setTimeout(async () => {
        try {
          // Create new abort controller for this request
          abortControllerRef.current = new AbortController();

          console.log(
            "🔍 Starting grammar check for:",
            text.substring(0, 50) + "..."
          );

          const result = await checkGrammarWithLanguageTool({
            text: text.trim(),
            language: "en-US",
            enabledOnly: false,
            level: "default",
          });

          // Only update state if request wasn't aborted
          if (!abortControllerRef.current.signal.aborted) {
            setMatches(result.matches);
            setLoading(false);

            console.log("✅ Grammar check completed:", {
              matchesFound: result.matches.length,
              issues: result.matches.map((m) => ({
                type: m.rule.issueType,
                message: m.shortMessage || m.message,
                position: `${m.offset}-${m.offset + m.length}`,
              })),
            });
          }
        } catch (err) {
          // Only update error state if request wasn't aborted
          if (!abortControllerRef.current?.signal.aborted) {
            const errorMessage =
              err instanceof Error ? err.message : "Grammar check failed";
            console.error("❌ Grammar check failed:", err);
            setError(errorMessage);
            setLoading(false);
            setMatches([]);
          }
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  const clearResults = useCallback(() => {
    setMatches([]);
    setError(null);
    setLoading(false);

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    matches,
    loading,
    error,
    checkGrammar,
    clearResults,
  };
}

/**
 * Hook for simplified grammar checking (immediate, no debounce)
 */
export function useInstantGrammarCheck() {
  const [matches, setMatches] = useState<GrammarMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkGrammar = useCallback(async (text: string) => {
    if (!text || text.trim().length < 3) {
      setMatches([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await checkGrammarWithLanguageTool({
        text: text.trim(),
        language: "en-US",
      });

      setMatches(result.matches);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Grammar check failed";
      setError(errorMessage);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setMatches([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    matches,
    loading,
    error,
    checkGrammar,
    clearResults,
  };
}
