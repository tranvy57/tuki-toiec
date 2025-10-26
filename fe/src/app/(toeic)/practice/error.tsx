"use client";

import { GeneralError } from "@/components/ui/error";

export default function PracticeError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <GeneralError
            title="Lỗi tải bài luyện tập"
            description="Không thể tải nội dung luyện tập. Vui lòng thử lại sau."
            onRetry={reset}
        />
    );
}