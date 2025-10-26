"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProps {
    title?: string;
    description?: string;
    variant?: "default" | "minimal" | "dots" | "pulse";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function Loading({
    title,
    description,
    variant = "default",
    size = "md",
    className = ""
}: LoadingProps) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    const titleSizes = {
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl"
    };

    if (variant === "minimal") {
        return (
            <div className={`flex items-center justify-center p-4 ${className}`}>
                <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
            </div>
        );
    }

    if (variant === "dots") {
        return (
            <div className={`flex items-center justify-center p-4 ${className}`}>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === "pulse") {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
                        <div className={`absolute inset-0 animate-ping rounded-full bg-primary/20 ${sizeClasses[size]}`}></div>
                    </div>
                    {(title || description) && (
                        <div className="text-center space-y-2">
                            {title && (
                                <p className={`font-semibold text-gray-900 ${titleSizes[size]}`}>
                                    {title}
                                </p>
                            )}
                            {description && (
                                <p className="text-sm text-gray-600 max-w-md">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/50 ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6 p-8"
            >
                <div className="relative">
                    <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
                    <div className={`absolute inset-0 animate-ping rounded-full bg-primary/20 ${sizeClasses[size]}`}></div>
                </div>

                {(title || description) && (
                    <div className="text-center space-y-2">
                        {title && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`font-semibold text-gray-900 ${titleSizes[size]}`}
                            >
                                {title}
                            </motion.p>
                        )}
                        {description && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm text-gray-600 max-w-md"
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>
                )}

                {/* Animated dots indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-1"
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

// Preset loading components for common use cases
export const PageLoading = ({ title = "Đang tải...", description }: { title?: string; description?: string }) => (
    <Loading title={title} description={description} variant="default" size="lg" />
);

export const SectionLoading = ({ title, description }: { title?: string; description?: string }) => (
    <Loading title={title} description={description} variant="pulse" size="md" />
);

export const InlineLoading = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => (
    <Loading variant="minimal" size={size} />
);

export const DotsLoading = ({ className }: { className?: string }) => (
    <Loading variant="dots" className={className} />
);