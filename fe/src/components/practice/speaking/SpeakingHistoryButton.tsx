"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Clock,
    Star,
    Calendar,
    History,
    BarChart3
} from 'lucide-react'
import { useSpeakingHistory } from '@/store/speaking-history-store'
import { motion } from 'framer-motion'

interface SpeakingHistoryButtonProps {
    skill: string
    topicId: string
}

export const SpeakingHistoryButton: React.FC<SpeakingHistoryButtonProps> = ({
    skill,
    topicId
}) => {
    const [historyOpen, setHistoryOpen] = useState(false)
    const { getAttemptsByTopic } = useSpeakingHistory()

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

    const averageScore = completedAttempts.length > 0
        ? Math.round(completedAttempts.reduce((acc, a) => acc + a.score, 0) / completedAttempts.length)
        : 0

    const totalTime = completedAttempts.reduce((acc, a) => acc + a.duration, 0)

    return (
        <div className="flex justify-center mt-6">
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
                                {/* Summary Stats */}
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

                                {/* Attempts List */}
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
        </div>
    )
}