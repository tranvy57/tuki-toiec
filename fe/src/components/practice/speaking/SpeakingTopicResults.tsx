"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Clock,
    Star,
    Calendar,
    History,
    TrendingUp,
    Award,
    Target,
    BarChart3
} from 'lucide-react'
import { useSpeakingHistory, createSpeakingAttempt } from '@/store/speaking-history-store'
import { motion } from 'framer-motion'

interface SpeakingTopicResultsProps {
    skill: string
    topicId: string
    currentScore?: number
    currentDuration?: number
    onRetake?: () => void
}

export const SpeakingTopicResults: React.FC<SpeakingTopicResultsProps> = ({
    skill,
    topicId,
    currentScore,
    currentDuration,
    onRetake
}) => {
    const [historyOpen, setHistoryOpen] = useState(false)
    const { getAttemptsByTopic, addAttempt } = useSpeakingHistory()

    const topicAttempts = getAttemptsByTopic(skill, topicId)
    const completedAttempts = topicAttempts.filter(a => a.status === 'completed')

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date))
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200'
        if (score >= 60) return 'bg-yellow-50 border-yellow-200'
        return 'bg-red-50 border-red-200'
    }

    const averageScore = completedAttempts.length > 0
        ? Math.round(completedAttempts.reduce((acc, a) => acc + a.score, 0) / completedAttempts.length)
        : 0

    const bestScore = completedAttempts.length > 0
        ? Math.max(...completedAttempts.map(a => a.score))
        : 0

    const totalTime = completedAttempts.reduce((acc, a) => acc + a.duration, 0)

    // Mock function to simulate completing an exercise
    const handleCompleteExercise = () => {
        if (currentScore !== undefined && currentDuration !== undefined) {
            const newAttempt = createSpeakingAttempt(
                skill,
                'Bài tập thực hành',
                'Hoàn thành bài tập speaking',
                currentScore,
                currentDuration,
                topicId
            )
            addAttempt(newAttempt)
        }
    }

    return (
        <div className="space-y-6">
            {/* Current Results (if available) */}
            {currentScore !== undefined && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="">
                    <Card className={`border-2 ${getScoreBgColor(currentScore)}`}>
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Award className="w-6 h-6" />
                                Kết Quả Lần Này
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="text-6xl font-bold mb-2">
                                <span className={getScoreColor(currentScore)}>{currentScore}%</span>
                            </div>
                            {currentDuration && (
                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Thời gian: {formatDuration(currentDuration)}</span>
                                </div>
                            )}
                            <div className="flex gap-2 justify-center">
                                <Button onClick={onRetake} variant="outline">
                                    Làm Lại
                                </Button>
                                <Button onClick={handleCompleteExercise} variant="default">
                                    Lưu Kết Quả
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Topic Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{topicAttempts.length}</div>
                        <div className="text-sm text-gray-600">Lần thực hiện</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
                        <div className="text-sm text-gray-600">Điểm trung bình</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                            <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{bestScore}%</div>
                        <div className="text-sm text-gray-600">Điểm cao nhất</div>
                    </CardContent>
                </Card>
            </div>

            {/* History Button and Dialog */}
            {/* <div className="flex justify-center">
                <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Xem Lịch Sử ({topicAttempts.length})
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Lịch Sử Luyện Tập Topic
                            </DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="max-h-[60vh] pr-4">
                            {topicAttempts.length === 0 ? (
                                <div className="text-center py-8">
                                    <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử</h3>
                                    <p className="text-gray-500">Hãy hoàn thành bài tập để xem lịch sử tại đây.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-gray-900">{totalTime > 0 ? Math.round(totalTime / 60) : 0}</div>
                                            <div className="text-xs text-gray-600">Phút luyện tập</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-gray-900">{completedAttempts.length}</div>
                                            <div className="text-xs text-gray-600">Hoàn thành</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-gray-900">{averageScore}%</div>
                                            <div className="text-xs text-gray-600">Điểm TB</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        {topicAttempts
                                            .sort((a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime())
                                            .map((attempt, index) => (
                                                <motion.div
                                                    key={attempt.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Card className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                                            <span className="text-sm text-gray-600">
                                                                                {formatDate(attempt.attemptDate)}
                                                                            </span>
                                                                        </div>
                                                                        {attempt.status === 'completed' && (
                                                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                                                <Star className="w-3 h-3" />
                                                                                {attempt.score}%
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {formatDuration(attempt.duration)}
                                                                        </div>
                                                                        <span>{attempt.details.taskType}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div> */}
        </div>
    )
}