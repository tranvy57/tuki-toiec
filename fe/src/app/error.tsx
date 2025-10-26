"use client";

import { GeneralError } from "@/components/ui/error";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <GeneralError
            title="Có lỗi xảy ra"
            description="Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
            onRetry={reset}
        />
    );
}