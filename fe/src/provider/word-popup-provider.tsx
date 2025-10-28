"use client";

import WordPopup from "@/components/layout/word-popup";
import React, { useCallback, useEffect, useState } from "react";

/** Vị trí popup */
type Pos = { x: number; y: number } | null;

/**
 * Provider toàn cục cho tính năng double click để dịch & lưu từ
 * - Nghe sự kiện double-click toàn trang
 * - Hiển thị WordPopup với từ được chọn
 * - Dùng cache nhỏ để tránh gọi lại API dịch
 */
export const WordPopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [position, setPosition] = useState<Pos>(null);
    const [cache] = useState<Record<string, string>>({}); // bộ nhớ tạm cho từ đã dịch

    const getCached = (w: string) => cache[w] ?? null;
    const setCached = (w: string, meaning: string) => (cache[w] = meaning);

    const handleClose = () => {
        setSelectedWord(null);
        setPosition(null);
    };

    /**
     * Xử lý khi double-click — popup sẽ chỉ hiển thị khi user dblclick
     * - Nếu có selection text, dùng bounding rect của selection để đặt vị trí
     * - Ngược lại, fallback về vị trí click
     */
    const handleSelect = useCallback((e: MouseEvent) => {
        // bỏ qua khi đang click trong input, textarea, contenteditable
        const target = e.target as HTMLElement | null;
        if (target?.closest("input, textarea, [contenteditable=true]")) return;

        // Only respond to actual double-click events (for robustness when using 'click' listener)
        if (e.detail !== 2) return;

        // Try selection first
        const sel = window.getSelection();
        let word: string | null = null;
        let pos: Pos | null = null;

        if (sel && sel.toString().trim()) {
            const raw = sel.toString().trim();
            word = raw.split(/\s+/)[0];

            // Use the selection's bounding rect so popup anchors to the text (viewport coords)
            try {
                if (sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    // place near the bottom-center of selection
                    pos = { x: rect.left + rect.width / 2, y: rect.bottom };
                }
            } catch (err) {
                // ignore and fallback to click coords
            }
        }

        if (!word) {
            // No selection: attempt to get the word under the cursor
            const getWordFromPoint = (x: number, y: number): string | null => {
                try {
                    let range: Range | null = null;
                    const doc: any = document;
                    if (typeof doc.caretRangeFromPoint === "function") {
                        range = doc.caretRangeFromPoint(x, y);
                    } else if (typeof doc.caretPositionFromPoint === "function") {
                        const pos = doc.caretPositionFromPoint(x, y);
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.setEnd(pos.offsetNode, pos.offset);
                    }
                    if (!range) return null;

                    let node = range.startContainer;
                    let offset = range.startOffset;

                    if (node.nodeType !== Node.TEXT_NODE) {
                        const child = node.childNodes[offset] as Node | undefined;
                        if (child && child.nodeType === Node.TEXT_NODE) {
                            node = child;
                            offset = 0;
                        } else {
                            const prev = node.childNodes[offset - 1];
                            if (prev && prev.nodeType === Node.TEXT_NODE) {
                                node = prev;
                                offset = (node.textContent || "").length;
                            } else {
                                return null;
                            }
                        }
                    }

                    const text = (node.textContent || "");
                    if (!text) return null;

                    offset = Math.max(0, Math.min(offset, text.length));
                    const isWordChar = (ch: string) => /[A-Za-z0-9'’\-\u00C0-\u017F]/.test(ch);

                    let start = offset;
                    while (start > 0 && isWordChar(text[start - 1])) start--;
                    let end = offset;
                    while (end < text.length && isWordChar(text[end])) end++;

                    const w = text.slice(start, end).trim();
                    if (!w) return null;
                    return w.replace(/^[^A-Za-z0-9'’\-]+|[^A-Za-z0-9'’\-]+$/g, "");
                } catch (err) {
                    return null;
                }
            };

            word = getWordFromPoint(e.clientX, e.clientY);
            // if we can compute a bounding rect from caret, try to get a rect for position
            try {
                const doc: any = document;
                let range: Range | null = null;
                if (typeof doc.caretRangeFromPoint === "function") range = doc.caretRangeFromPoint(e.clientX, e.clientY);
                else if (typeof doc.caretPositionFromPoint === "function") {
                    const p = doc.caretPositionFromPoint(e.clientX, e.clientY);
                    range = document.createRange();
                    range.setStart(p.offsetNode, p.offset);
                    range.setEnd(p.offsetNode, p.offset);
                }
                if (range) {
                    const r = range.getBoundingClientRect();
                    if (r && r.left !== 0 && r.top !== 0) pos = { x: r.left, y: r.bottom };
                }
            } catch (err) {
                // ignore
            }
        }

        if (!word) return;

        setSelectedWord(word);
        // prefer selection-based pos (viewport coords), otherwise fallback to click client coords
        setPosition(pos ?? { x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleSelect);
        return () => document.removeEventListener("click", handleSelect);
    }, [handleSelect]);

    return (
        <>
            {children}
            {selectedWord && position && (
                <WordPopup
                    word={selectedWord}
                    position={position}
                    onClose={handleClose}
                    getCached={getCached}
                    setCached={setCached}
                />
            )}
        </>
    );
};

export default WordPopupProvider;
