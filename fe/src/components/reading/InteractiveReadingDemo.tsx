"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    BookOpen,
    Edit,
    Eye,
    MessageSquare,
    Play,
    FileText,
    Target,
    Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomCard } from "../CustomCard";

// Mock data for reading MCQ questions
const mockMCQQuestions = [
    {
        id: "mcq-1",
        passage: "The quarterly business review meeting has been scheduled for next Tuesday at 9:00 AM in the main conference room. All department heads are expected to attend, along with senior management. The agenda will include a review of financial performance, discussion of new product launches, and planning for the upcoming fiscal year. Please prepare your departmental reports in advance and bring any necessary documentation to support your presentations.",
        questionText: "What is the main purpose of the meeting?",
        options: [
            { id: "a", text: "To review quarterly business performance", isCorrect: true },
            { id: "b", text: "To discuss vacation schedules", isCorrect: false },
            { id: "c", text: "To interview new employees", isCorrect: false },
            { id: "d", text: "To plan office renovations", isCorrect: false },
        ],
        explanation:
            "The passage clearly states that this is a quarterly business review meeting, focused on reviewing financial performance and planning.",
    },
];

const readingExerciseTypes = [
    {
        id: "1",
        name: "Multiple Choice Questions",
        slug: "mcq",
        icon: MessageSquare,
        description: "Đọc đoạn văn và chọn đáp án đúng từ các lựa chọn cho trước theo format chuẩn TOEIC Reading.",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        difficulty: "Medium",
        difficultyColor: "bg-blue-100 text-blue-800",
        order: 1,
        exerciseCount: 30,
        estimatedTime: "20-30 phút",
        gradient: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200",
        instruction: [
            "Đọc kỹ đoạn văn trước khi xem câu hỏi.",
            "Xác định từ khóa quan trọng trong câu hỏi.",
            "Tìm thông tin tương ứng trong đoạn văn.",
            "Loại trừ các đáp án rõ ràng sai.",
            "Chọn đáp án phù hợp nhất với nội dung đoạn văn.",
        ],
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
        },
    },
};

export default function InteractiveReadingDemo() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-20 left-10 w-20 h-20 bg-pink-400/10 rounded-full blur-xl"
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <div className="container mx-auto px-4 py-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className=""
                >
                    <div className="flex items-center justify-start gap-3 mb-4">
                        <div className="p-3 rounded-xl">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-3xl font-bold text-[#23085A]">
                            Reading Comprehension
                        </h1>
                    </div>
                    {/* Mô tả chính */}
                    <p className="pb-4 text-lg">
                        Nâng cao kỹ năng đọc hiểu tiếng Anh qua các bài tập trắc nghiệm theo chuẩn TOEIC.
                        Với Tuki, bạn được luyện tập với các đoạn văn đa dạng và câu hỏi mô phỏng đề thi thật,
                        hệ thống sẽ tự động cá nhân hóa nội dung phù hợp với trình độ và mục tiêu điểm số của bạn.
                    </p>
                </motion.div>

                <h2 className="text-2xl font-bold text-[#23085A] pb-4">
                    Dạng bài tập Reading:
                </h2>

                <div className="flex gap-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1"
                    >
                        {readingExerciseTypes.map((exercise) => (
                            <motion.div
                                key={exercise.id}
                                variants={itemVariants}
                                className="group"
                            >
                                <CustomCard
                                    slug={exercise.slug}
                                    name={exercise.name}
                                    description={exercise.description}
                                    imageUrl={exercise.imageUrl}
                                    icon={exercise.icon}
                                    href={`/practice/reading/${exercise.slug}`}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>


                {/* Bottom Tips Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center mt-8"
                >
                    <Card className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border-blue-200 shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <span className="text-lg font-semibold text-gray-800">
                                Mẹo đọc hiểu hiệu quả
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>Đọc lướt nhanh</strong> để nắm ý chính, sau đó{" "}
                            <strong>đọc kỹ</strong> để tìm chi tiết. Chú ý các từ khóa trong câu hỏi
                            và tìm thông tin tương ứng trong đoạn văn. Thường xuyên luyện tập sẽ giúp
                            bạn cải thiện tốc độ và độ chính xác.
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}