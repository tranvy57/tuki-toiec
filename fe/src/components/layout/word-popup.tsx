"use client";

import React, { useEffect, useRef, useState } from "react";

// Position type compatible with useWordSelection's returned position
type Pos = { x: number; y: number } | null;

// Props for the WordPopup
interface WordPopupProps {
    word: string;
    position: Pos;
    onClose: () => void;
    getCached?: (word: string) => string | null;
    setCached?: (word: string, meaning: string) => void;
}

/**
 * Mock API: Replace these with real fetch calls when integrating.
 * Example replacement:
 *   const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ word }) });
 *   const json = await res.json();
 *   return json.meaning;
 */
export const mockTranslate = async (word: string) => {
    const dict: Record<string, string> = {
        happy: "vui vẻ",
        study: "học",
        listen: "nghe",
        speak: "nói",
        practice: "luyện tập",
    };
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            const lower = word.toLowerCase();
            resolve(dict[lower] ?? `Nghĩa tạm cho "${word}"`);
        }, 500);
    });
};

export const mockSaveWord = async (word: string, meaning: string) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("Saved word:", { word, meaning });
            // demo: replace with fetch('/api/user-vocabularies', { method:'POST', body: JSON.stringify(...) })
            alert(`Saved \"${word}\" — ${meaning}`);
            resolve();
        }, 300);
    });
};

export const WordPopup: React.FC<WordPopupProps> = ({ word, position, onClose, getCached, setCached }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [meaning, setMeaning] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [visible, setVisible] = useState(false);

    // clamp popup to viewport
    const computeStyle = (): React.CSSProperties => {
        if (!position) return { left: 0, top: 0 };
        const margin = 8;
        let left = position.x + 6;
        let top = position.y + 6;
        // basic clamp
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxWidth = Math.min(360, vw - 16);
        if (left + maxWidth + margin > vw) left = vw - maxWidth - margin;
        if (top + 160 + margin > vh) top = Math.max(margin, position.y - 140);
        return { left, top, maxWidth } as React.CSSProperties;
    };

    useEffect(() => {
        // Show popup immediately and load translation asynchronously to reduce perceived delay
        let mounted = true;

        const cached = getCached?.(word) ?? null;
        if (cached) {
            setMeaning(cached);
            setLoading(false);
            // show immediately
            requestAnimationFrame(() => setVisible(true));
            return () => {
                mounted = false;
            };
        }

        // no cache -> show popup quickly with loading state
        setMeaning(null);
        setLoading(true);
        // show popup immediately to reduce perceived delay
        requestAnimationFrame(() => setVisible(true));

        (async () => {
            const m = await mockTranslate(word);
            if (!mounted) return;
            setLoading(false);
            setMeaning(m);
            setCached?.(word, m);
        })();

        return () => {
            mounted = false;
        };
    }, [word, getCached, setCached]);

    useEffect(() => {
        const onDown = (ev: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            if (ev.target instanceof Node && !el.contains(ev.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [onClose]);

    // Esc handling (also cleared by hook but good to have local handler)
    useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const pronounce = () => {
        try {
            const msg = new SpeechSynthesisUtterance(word);
            msg.lang = "en-US";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(msg);
        } catch (e) {
            console.warn("speechSynthesis not available", e);
        }
    };

    const save = async () => {
        setSaving(true);
        await mockSaveWord(word, meaning ?? "");
        setSaving(false);
        onClose();
    };

    if (!position) return null;

    return (
        <div
            ref={ref}
            style={computeStyle()}
            className={`fixed z-50 bg-white text-gray-800 rounded-lg shadow-lg p-4 border border-gray-100 transform transition-all duration-150 ease-out ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
            role="dialog"
            aria-label={`Definition of ${word}`}>
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-lg">{word}</h4>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="text-gray-400 hover:text-gray-600">✖</button>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        {loading ? (
                            <div className="italic text-sm text-gray-400">Đang tra nghĩa...</div>
                        ) : (
                            <div>{meaning}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <button
                    onClick={pronounce}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">
                    🔊 Phát âm
                </button>

                <button
                    onClick={save}
                    disabled={saving}
                    className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60">
                    {saving ? "Đang lưu…" : "💾 Lưu từ"}
                </button>

                <button
                    onClick={onClose}
                    className="ml-auto text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-50">
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default WordPopup;
