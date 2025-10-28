"use client";

import { Vocabulary } from "@/types/implements/vocabulary";
import { useMarkUserVocab } from "@/api/useVocabulary";
import { Volume2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Position type compatible with useWordSelection's returned position
type Pos = { x: number; y: number } | null;

interface WordPopupProps {
    isOpen: boolean;
    data?: Vocabulary | null;
    isLoading?: boolean;
    position?: Pos;
    onClose: () => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({ isOpen, data, isLoading, position, onClose }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [localMarkedState, setLocalMarkedState] = useState<boolean>(false);

    const markUserVocabMutation = useMarkUserVocab();

    // Sync local state with data when data changes
    useEffect(() => {
        if (data) {
            setLocalMarkedState(data.isMarked || false);
        }
    }, [data]);


    // Position popup relative to cursor with smart placement
    const computeStyle = (): React.CSSProperties => {
        if (!position) {
            return { display: 'none' };
        }

        const margin = 12;
        const popupWidth = 280; // compact width
        const popupHeight = 180; // compact height

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

    const handleSaveToggle = async () => {
        if (markUserVocabMutation.isPending || !data?.id) return;

        try {
            const newStatus = !localMarkedState;

            // Optimistically update UI
            setLocalMarkedState(newStatus);

            // Call API
            const result = await markUserVocabMutation.mutateAsync({
                id: data.id,
                status: newStatus
            });

            // Show success message
            if (newStatus) {
                toast.success(`Đã thêm "${data.word}" vào sổ từ của bạn`);
            } else {
                toast.success(`Đã xoá "${data.word}" khỏi sổ từ vựng`);
            }

            // Update with actual result if needed
            if (result && typeof result.isMarked === 'boolean') {
                setLocalMarkedState(result.isMarked);
            }

        } catch (error) {
            // Revert optimistic update on error
            setLocalMarkedState(!localMarkedState);
            console.error('Mark/unmark vocabulary error:', error);
            toast.error(`Có lỗi xảy ra, vui lòng thử lại`);
        }
    };

    if (!isOpen) return null;

    const meaningLines = (data?.meaning || "").split(";").map(s => s.trim()).filter(Boolean);

    return (
        <>
            <div
                ref={ref}
                style={computeStyle()}
                className={`fixed z-50 rounded-2xl shadow-2xl p-4 transition-all duration-300 ease-out max-w-xs w-full ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    } ${localMarkedState ? "bg-pink-50 border border-pink-200" : "bg-white border border-gray-200"
                    }`}
                role="tooltip"
                aria-label={data?.word ?? "Vocabulary"}>

                {/* Close button */}
                <button onClick={onClose} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 text-sm">✕</button>

                {/* Save heart button */}
                <button
                    onClick={handleSaveToggle}
                    disabled={markUserVocabMutation.isPending}
                    className={`absolute right-8 top-2 transition-all duration-200 transform hover:scale-110 ${markUserVocabMutation.isPending ? "opacity-50" : ""
                        } ${localMarkedState ? "text-pink-500" : "text-gray-300 hover:text-pink-400"
                        }`}>
                    {localMarkedState ? "💜" : "🤍"}
                </button>

                <div className="pr-12">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">{data?.word ?? (isLoading ? '...' : '')}</h3>
                        {data?.audioUrl && (
                            <button
                                onClick={pronounce}
                                className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Phát âm"
                            >
                                <Volume2 className="w-4 h-4 text-gray-700" />
                            </button>
                        )}
                    </div>
                    {data?.pronunciation && <span className="text-gray-500 italic text-sm mb-1">{data.pronunciation}</span>}

                    {data?.partOfSpeech && (
                        <div className="text-indigo-600 text-xs uppercase mb-1">{data.partOfSpeech}</div>
                    )}

                    <div className="text-sm leading-relaxed text-gray-700">
                        {isLoading && <div className="text-gray-400 italic">Đang tải...</div>}
                        {!isLoading && meaningLines.length === 0 && <div className="text-gray-500">Không có dữ liệu nghĩa.</div>}

                        {!isLoading && meaningLines.slice(0, 2).map((line, i) => (
                            <div key={i} className="mb-1">{line}</div>
                        ))}
                    </div>

                    {(data?.exampleEn || data?.exampleVn) && (
                        <div className="mt-3 text-xs italic text-gray-600">
                            <div className="flex items-start gap-1">
                                <span>💬</span>
                                <div>
                                    {data?.exampleEn && <div className="mb-0.5">{data.exampleEn}</div>}
                                    {data?.exampleVn && <div className="text-gray-500">{data.exampleVn}</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
};

export default WordPopup;
