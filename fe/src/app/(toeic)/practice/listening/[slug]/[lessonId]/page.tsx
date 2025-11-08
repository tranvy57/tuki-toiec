"use client";

import { useParams, useRouter } from "next/navigation";
import { useLessonsByModality } from "@/api/useLessons";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import { MCQItem } from "@/components/listening/exercises/MCQItemDemo";
import ClozeListeningQuestion from "@/components/listening/exercises/ClozeListeningQuestion";
import DictationDemo from "@/components/listening/exercises/DictationDemo";

interface MCQOption {
    content: string;
    answer_key: string;
}

interface MCQOption {
    content: string;
    answer_key: string;
}

interface MCQItem {
    id: string;
    title: string;
    promptJsonb: {
        text?: string;
        choices?: MCQOption[];
        audio_url?: string;
        transcript?: string;
        translation?: string;
        explanation?: string;
    };
    solutionJsonb: {
        correct_answer?: string;
        explanation?: string;
    };
}

interface ClozeItem {
    id: string;
    title: string;
    promptJsonb: {
        text?: string;
        audio_url?: string;
        blank_ratio?: number;
    };
    solutionJsonb: {
        answers?: string[];
        transcript?: string;
    };
}

interface DictationItem {
    id: string;
    modality: string;
    title: string;
    difficulty: string;
    bandHint: number;
    promptJsonb: {
        title?: string;
        segments?: Array<{
            end: number;
            text: string;
            start: number;
        }>;
        audio_url?: string;
        source_url?: string;
        instructions?: string;
    };
    solutionJsonb: {
        sentences?: string[];
        correct_answers?: Array<{
            text: string;
            segment_index: number;
        }>;
        full_transcript?: string;
    };
}

export default function MCQTestPage() {
    const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
    const router = useRouter();



    const {
        data: lessons,
        isLoading,
        isError,
        error
    } = useLessonsByModality({
        modality: slug,
        skillType: "listening"
    });

    console.log(lessons)

    // Find the current lesson and its items
    const currentLesson = lessons?.find(lesson =>
        lesson.lessonId === lessonId
    );

    const questions = currentLesson?.items || [];

    const handleTestFinish = (results: { correct: number; total: number; userAnswers: Record<string, string> }) => {
        // Save results to sessionStorage
        sessionStorage.setItem(`listening-results-${lessonId}`, JSON.stringify(results));

        // Navigate to results page
        router.push(`/practice/listening/${slug}/${lessonId}/results`);
    };



    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Listening", href: "/practice/listening" },
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-lg text-gray-600">Loading MCQ test...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !currentLesson) {
        return (
            <div className="container mx-auto px-6 py-4">
                <PracticeBreadcrumb
                    items={[
                        { label: "Listening", href: "/practice/listening" },
                        { label: getExerciseName(slug) }
                    ]}
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test not found</h3>
                        <p className="text-gray-600 mb-4">
                            The requested MCQ test could not be found.
                        </p>
                        <Button
                            onClick={() => router.push(`/practice/listening/${slug}`)}
                            variant="outline"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to lessons
                        </Button>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-6 py-4">
            <PracticeBreadcrumb
                items={[
                    { label: "Listening", href: "/practice/listening" },
                    { label: getExerciseName(slug), href: `/practice/listening/${slug}` },
                    { label: slug === "mcq" ? "MCQ Test" : slug === "cloze" ? "Cloze Test" : "Dictation Test" }
                ]}
            />
            {
                slug === "mcq" && (
                    <MCQItem
                        lessonId={lessonId}
                        questions={questions as MCQItem[]}
                        onFinish={handleTestFinish}
                        onBack={() => router.push(`/practice/listening/${slug}`)}
                    />
                )
            }

            {
                slug === "cloze" && (
                    <ClozeListeningQuestion
                        lessonId={lessonId}
                        questions={questions as ClozeItem[]}
                        onFinish={handleTestFinish}
                        onBack={() => router.push(`/practice/listening/${slug}`)}
                    />
                )
            }

            {
                slug === "dictation" && (
                    <DictationDemo
                        items={questions as DictationItem[]}
                        onAnswerSubmit={(id: string, answer: any, score: number) => {
                            console.log("Answer submitted:", { id, answer, score });
                        }}
                    />
                )
            }

        </div>
    );
}