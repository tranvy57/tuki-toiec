"use client";

import React, { useEffect, useRef, useState } from "react";

// Position type compatible with useWordSelection's returned position
type Pos = { x: number; y: number } | null;

// Vocab type
type Vocab = {
    id?: string;
    word: string;
    meaning?: string;
    pronunciation?: string;
    partOfSpeech?: string;
    exampleEn?: string;
    exampleVn?: string;
    audioUrl?: string;
    type?: string;
    isPhrase?: boolean;
};

// Props for the WordPopup
interface WordPopupProps {
    isOpen: boolean;
    data?: Vocab | null;
    isLoading?: boolean;
    position?: Pos;
    onClose: () => void;
}

/**
 * Mock API: Replace these with real fetch calls when integrating.
 * Example replacement:
 *   const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ word }) });
 *   const json = await res.json();
 *   return json.meaning;
 */

export const WordPopup: React.FC<WordPopupProps> = ({ isOpen, data, isLoading, position, onClose }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    // Position popup relative to cursor with smart placement
    const computeStyle = (): React.CSSProperties => {
        if (!position) {
            return { display: 'none' };
        }

        const margin = 12;
        const popupWidth = 320; // approximate width
        const popupHeight = 200; // approximate height

        let left = position.x;
        let top = position.y;

        // Check if cursor is in bottom third of viewport
        const isInBottomThird = position.y > (window.innerHeight * 2 / 3);

        if (isInBottomThird) {
            // Show above cursor
            top = position.y - popupHeight - margin;
        } else {
            // Show below cursor
            top = position.y + margin;
        }

        // Clamp horizontally to viewport
        const maxLeft = window.innerWidth - popupWidth - margin;
        left = Math.max(margin, Math.min(left, maxLeft));

        // Clamp vertically to viewport
        top = Math.max(margin, Math.min(top, window.innerHeight - popupHeight - margin));

        return {
            position: 'fixed' as const,
            left: `${left}px`,
            top: `${top}px`,
            zIndex: 50,
        };
    };

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);

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
        if (!data?.audioUrl) return;
        try {
            const audio = new Audio(data.audioUrl);
            audio.play().catch(() => { });
        } catch (e) {
            console.warn("Audio playback not available", e);
        }
    };

    if (!isOpen) return null;

    const meaningLines = (data?.meaning || "").split(";").map(s => s.trim()).filter(Boolean);

    return (
        <div
            ref={ref}
            style={computeStyle()}
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl p-6 transition-opacity duration-200 ease-out max-w-sm w-full md:max-w-md ${visible ? "opacity-100" : "opacity-0"}`}
            role="tooltip"
            aria-label={data?.word ?? "Vocabulary"}>

            <button onClick={onClose} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">✕</button>

            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{data?.word ?? (isLoading ? '...' : '')}</h2>
                        {data?.pronunciation && <span className="text-gray-500 italic">{data.pronunciation}</span>}
                        {data?.audioUrl && (
                            <button onClick={pronounce} className="ml-auto text-sm px-2 py-1 bg-gray-100 rounded">▶</button>
                        )}
                    </div>

                    {data?.partOfSpeech && (
                        <div className="mt-1 text-indigo-600 text-sm uppercase">{data.partOfSpeech}</div>
                    )}

                    <div className="mt-2 leading-relaxed text-gray-800">
                        {isLoading && <div className="text-sm text-gray-400">Đang tải...</div>}
                        {!isLoading && meaningLines.length === 0 && <div className="text-sm text-gray-500">Không có dữ liệu nghĩa.</div>}

                        {!isLoading && meaningLines.map((line, i) => (
                            <div key={i} className="mt-2">{line}</div>
                        ))}
                    </div>

                    {(data?.exampleEn || data?.exampleVn) && (
                        <div className="mt-4 text-sm italic text-gray-600">
                            <div className="flex items-start gap-2">
                                <span>💬</span>
                                <div>
                                    {data?.exampleEn && <div className="mb-1">{data.exampleEn}</div>}
                                    {data?.exampleVn && <div className="text-gray-500">{data.exampleVn}</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WordPopup;
