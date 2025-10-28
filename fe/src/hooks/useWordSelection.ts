import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLookUp } from "@/api/useVocabulary";

export type Position = { x: number; y: number } | null;


/**
 * useWordSelection
 * - Listens for double-click to capture a selected word via window.getSelection().
 * - Returns the selected word, screen position for popup placement, clearSelection(),
 *   and a tiny cache API to store translations.
 *
 * Notes:
 * - This is a lightweight hook and doesn't depend on DOM refs; it uses global dblclick.
 * - It normalizes selection to the first token (word) and strips surrounding punctuation.
 */
export function useWordSelection() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // TanStack Query for vocab API
  const { data, isFetching, isLoading, refetch } = useLookUp(selectedWord || "");
  // Simple in-memory cache for translations: word -> meaning
  const cacheRef = useRef<Map<string, string>>(new Map());

  // Helper: normalize selection to single word (strip punctuation)
  const normalize = (s: string) => {
    const t = s.trim();
    if (!t) return "";
    // Keep unicode letters and hyphen/apostrophe
    const m = t.split(/\s+/)[0] || t;
    return m.replace(/^[^\p{L}0-9'-]+|[^\p{L}0-9'-]+$/gu, "");
  };

  useEffect(() => {
    const onDblClick = (e: MouseEvent) => {
      try {
        const sel = window.getSelection();
        if (!sel) return;
        const raw = sel.toString();
        if (!raw) return;
        const word = normalize(raw);
        if (!word) return;

        // Determine position from selection bounding rect
        let rect: DOMRect | null = null;
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          rect = range.getBoundingClientRect();
        }

        if (rect) {
          setPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY,
          });
        } else {
          setPosition({
            x: e.clientX + window.scrollX,
            y: e.clientY + window.scrollY,
          });
        }

        setSelectedWord(word);
        setPosition({ x: e.clientX, y: e.clientY });
        setIsPopupOpen(true);
        // Trigger API fetch
        refetch();
      } catch (err) {
        // ignore selection errors
        console.warn("useWordSelection dblclick error:", err);
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      // Escape to clear
      if (ev.key === "Escape") {
        clearSelection();
      }
    };

    document.addEventListener("dblclick", onDblClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("dblclick", onDblClick);
      document.removeEventListener("keydown", onKey);
    };
    // empty deps: attach once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedWord(null);
    setPosition(null);
    setIsPopupOpen(false);
    try {
      const sel = window.getSelection();
      sel?.removeAllRanges();
    } catch (e) {
      // ignore
    }
  }, []);

  const openPopup = useCallback(
    async (word: string, mouseX?: number, mouseY?: number) => {
      setSelectedWord(word);
      if (mouseX !== undefined && mouseY !== undefined) {
        setPosition({ x: mouseX, y: mouseY });
      }
      setIsPopupOpen(true);
      try {
        await refetch();
      } catch (e) {
        // ignore
      }
    },
    [data]
  );

  const getCached = (word: string) => cacheRef.current.get(word) ?? null;
  const setCached = (word: string, meaning: string) =>
    cacheRef.current.set(word, meaning);

  return {
    selectedWord,
    position,
    isPopupOpen,
    vocabData: data ?? null,
    isLoading: isFetching || isLoading,
    clearSelection,
    openPopup,
    // cache helpers for translations (legacy)
    getCached,
    setCached,
  } as const;
}

export default useWordSelection;
