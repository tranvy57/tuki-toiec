"use client";

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ErrorProps {
    title?: string;
    description?: string;
    variant?: "default" | "minimal" | "network" | "404";
    showRetry?: boolean;
    showHome?: boolean;
    showBack?: boolean;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorPage({
    title,
    description,
    variant = "default",
    showRetry = true,
    showHome = true,
    showBack = false,
    onRetry,
    className = ""
}: ErrorProps) {
    const router = useRouter();

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    const handleHome = () => {
        router.push("/");
    };

    const handleBack = () => {
        router.back();
    };

    // Get error content based on variant
    const getErrorContent = () => {
        switch (variant) {
            case "404":
                return {
                    title: title || "Không tìm thấy trang",
                    description: description || "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
                    icon: AlertTriangle,
                    color: "text-orange-500"
                };
            case "network":
                return {
                    title: title || "Lỗi kết nối",
                    description: description || "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.",
                    icon: RefreshCw,
                    color: "text-red-500"
                };
            case "minimal":
                return {
                    title: title || "Có lỗi xảy ra",
                    description: description || "Vui lòng thử lại sau.",
                    icon: AlertTriangle,
                    color: "text-red-500"
                };
            default:
                return {
                    title: title || "Oops! Có lỗi xảy ra",
                    description: description || "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục.",
                    icon: AlertTriangle,
                    color: "text-red-500"
                };
        }
    };

    const errorContent = getErrorContent();
    const IconComponent = errorContent.icon;

    if (variant === "minimal") {
        return (
            <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
                <IconComponent className={`h-8 w-8 mb-3 ${errorContent.color}`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {errorContent.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md">
                    {errorContent.description}
                </p>
                {showRetry && (
                    <Button onClick={handleRetry} size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Thử lại
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/50 ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full mx-4"
            >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <div className={`p-4 rounded-full bg-gray-100 ${errorContent.color}`}>
                            <IconComponent className="h-12 w-12" />
                        </div>
                    </motion.div>

                    {/* Error Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-gray-900 mb-3"
                    >
                        {errorContent.title}
                    </motion.h1>

                    {/* Error Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-8 leading-relaxed"
                    >
                        {errorContent.description}
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        {showRetry && (
                            <Button onClick={handleRetry} className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Thử lại
                            </Button>
                        )}

                        {showBack && (
                            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại
                            </Button>
                        )}

                        {showHome && (
                            <Button onClick={handleHome} variant="outline" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Trang chủ
                            </Button>
                        )}
                    </motion.div>
                </div>

                {/* Additional Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-6"
                >
                    <p className="text-sm text-gray-500">
                        Nếu vấn đề tiếp tục, vui lòng{" "}
                        <a href="mailto:support@tuki.com" className="text-primary hover:underline">
                            liên hệ hỗ trợ
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Preset error components for common use cases
export const NotFoundError = ({ title, description }: { title?: string; description?: string }) => (
    <ErrorPage
        variant="404"
        title={title}
        description={description}
        showRetry={false}
        showBack={true}
    />
);

export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => (
    <ErrorPage
        variant="network"
        onRetry={onRetry}
        showHome={false}
    />
);

export const GeneralError = ({ title, description, onRetry }: {
    title?: string;
    description?: string;
    onRetry?: () => void;
}) => (
    <ErrorPage
        title={title}
        description={description}
        onRetry={onRetry}
    />
);

export const InlineError = ({ title, description, onRetry }: {
    title?: string;
    description?: string;
    onRetry?: () => void;
}) => (
    <ErrorPage
        variant="minimal"
        title={title}
        description={description}
        onRetry={onRetry}
        showHome={false}
    />
);