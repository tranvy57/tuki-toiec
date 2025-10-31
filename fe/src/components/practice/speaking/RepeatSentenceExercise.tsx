"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Headphones,
    Eye,
    EyeOff,
} from "lucide-react";
import { AudioPlayer } from "@/components/toeic/test/Audio";

interface RepeatSentenceExerciseProps {
    exerciseData: any;
}

export default function RepeatSentenceExercise({ exerciseData }: RepeatSentenceExerciseProps) {
    const [showAudioTranscript, setShowAudioTranscript] = useState(false);

    return (
        <div className="bg-white rounded-sm p-4">
            <div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    {exerciseData.title}
                </div>
            </div>
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Headphones className="w-6 h-6 text-green-600" />
                            <span className="font-medium text-green-800">
                                Âm thanh mẫu
                            </span>
                        </div>
                        <Button
                            onClick={() =>
                                setShowAudioTranscript(!showAudioTranscript)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        >
                            {showAudioTranscript ? (
                                <EyeOff className="w-4 h-4 mr-1" />
                            ) : (
                                <Eye className="w-4 h-4 mr-1" />
                            )}
                            {showAudioTranscript
                                ? "Ẩn transcript"
                                : "Xem transcript"}
                        </Button>
                    </div>

                    <div className="mb-4 w-full">
                        <AudioPlayer
                            audioUrl={
                                "https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_7.mp3"
                            }
                        />
                    </div>

                    {/* Audio Transcript */}
                    <AnimatePresence>
                        {showAudioTranscript && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/80 rounded-lg p-4 border border-green-200"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <h5 className="font-medium text-green-800">
                                        Transcript:
                                    </h5>
                                </div>
                                <p className="text-gray-800 italic text-sm leading-relaxed">
                                    "
                                    {(exerciseData as any).prompt ||
                                        "Where was the company picnic held?(A) In April.(B) Refreshments will be provided.(C) At a park next to a lake."}
                                    "
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}