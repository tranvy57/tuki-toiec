"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Clock,
    Star,
    Calendar,
    Mic,
    ChevronRight,
    Trophy,
    Target,
    TrendingUp,
    X
} from 'lucide-react'
import { useSpeakingHistory, SpeakingHistoryStore } from '@/store/speaking-history-store'
import { motion, AnimatePresence } from 'framer-motion'

interface SpeakingHistoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    skillFilter?: string // Optional filter for specific skill
}

export const SpeakingHistoryDialog: React.FC<SpeakingHistoryDialogProps> = ({
    open,
    onOpenChange,
    skillFilter,
}) => {
    const {
        attempts,
        selectedAttempt,
        isDetailDialogVisible,
        showDetailDialog,
        hideDetailDialog,
    } = useSpeakingHistory()

    // Filter attempts by skill if specified
    const filteredAttempts = skillFilter
        ? attempts.filter((attempt) => attempt.skill === skillFilter)
        : attempts

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date))
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 hover:bg-green-200'
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            case 'failed':
                return 'bg-red-100 text-red-800 hover:bg-red-200'
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành'
            case 'in-progress':
                return 'Đang thực hiện'
            case 'failed':
                return 'Thất bại'
            default:
                return 'Chưa xác định'
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 font-semibold'
        if (score >= 60) return 'text-yellow-600 font-semibold'
        return 'text-red-600 font-semibold'
    }

    const completedAttempts = filteredAttempts.filter(a => a.status === 'completed')
    const averageScore = completedAttempts.length > 0
        ? Math.round(completedAttempts.reduce((acc, a) => acc + a.score, 0) / completedAttempts.length)
        : 0

    return (
        <>
            {/* Main History Dialog */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Mic className="w-5 h-5 text-blue-600" />
                            Lịch Sử Luyện Tập Speaking
                            {skillFilter && (
                                <Badge variant="secondary" className="ml-2">
                                    {skillFilter}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
                        <div className="p-6">
                            {filteredAttempts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Bạn chưa có bài luyện tập speaking nào. Hãy bắt đầu luyện tập để
                                        xem lịch sử tại đây.
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Summary Stats */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                    >
                                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2">
                                                    <Target className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-blue-900">
                                                    {filteredAttempts.length}
                                                </div>
                                                <div className="text-sm text-blue-700">Tổng bài</div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-2">
                                                    <Trophy className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-green-900">
                                                    {completedAttempts.length}
                                                </div>
                                                <div className="text-sm text-green-700">Hoàn thành</div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2">
                                                    <TrendingUp className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-purple-900">
                                                    {averageScore}%
                                                </div>
                                                <div className="text-sm text-purple-700">Điểm TB</div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-orange-900">
                                                    {Math.round(completedAttempts.reduce((acc, a) => acc + a.duration, 0) / 60)}
                                                </div>
                                                <div className="text-sm text-orange-700">Phút luyện tập</div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <Separator />

                                    {/* Attempts List */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-900">Lịch Sử Bài Tập</h3>

                                        <div className="space-y-3">
                                            {filteredAttempts.map((attempt, index) => (
                                                <motion.div
                                                    key={attempt.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Card
                                                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
                                                        onClick={() => showDetailDialog(attempt)}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <h4 className="font-medium text-gray-900">
                                                                            {attempt.skill}
                                                                        </h4>
                                                                        <Badge className={getStatusColor(attempt.status)}>
                                                                            {getStatusText(attempt.status)}
                                                                        </Badge>
                                                                        {attempt.status === 'completed' && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="w-4 h-4 text-yellow-500" />
                                                                                <span className={getScoreColor(attempt.score)}>
                                                                                    {attempt.score}%
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        {attempt.details.taskType}
                                                                    </p>
                                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {formatDate(attempt.attemptDate)}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {formatDuration(attempt.duration)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogVisible} onOpenChange={(open) => !open && hideDetailDialog()}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    {selectedAttempt && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-blue-600" />
                                    Chi Tiết Bài Tập
                                </DialogTitle>
                            </DialogHeader>

                            <ScrollArea className="max-h-[calc(90vh-120px)]">
                                <div className="space-y-6 p-1">
                                    {/* General Info */}
                                    <Card>
                                        <CardHeader>
                                            <h3 className="font-semibold">Thông Tin Chung</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Kỹ năng:</span>
                                                    <div className="mt-1">{selectedAttempt.skill}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Loại bài:</span>
                                                    <div className="mt-1">{selectedAttempt.details.taskType}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Thời gian:</span>
                                                    <div className="mt-1">{formatDate(selectedAttempt.attemptDate)}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Thời lượng:</span>
                                                    <div className="mt-1">{formatDuration(selectedAttempt.duration)}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Results */}
                                    <Card>
                                        <CardHeader>
                                            <h3 className="font-semibold">Kết Quả</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-600">Trạng thái:</span>
                                                <Badge className={getStatusColor(selectedAttempt.status)}>
                                                    {getStatusText(selectedAttempt.status)}
                                                </Badge>
                                            </div>
                                            {selectedAttempt.status === 'completed' && (
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-600">Điểm số:</span>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                        <span className={`text-lg font-bold ${getScoreColor(selectedAttempt.score)}`}>
                                                            {selectedAttempt.score}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Question */}
                                    <Card>
                                        <CardHeader>
                                            <h3 className="font-semibold">Câu Hỏi</h3>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedAttempt.details.question}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Transcription */}
                                    {selectedAttempt.details.transcription && (
                                        <Card>
                                            <CardHeader>
                                                <h3 className="font-semibold">Nội Dung Ghi Âm</h3>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-gray-50 rounded-lg p-4 italic text-gray-700 leading-relaxed">
                                                    {selectedAttempt.details.transcription}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Feedback */}
                                    {selectedAttempt.details.feedback && (
                                        <Card>
                                            <CardHeader>
                                                <h3 className="font-semibold">Nhận Xét</h3>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-blue-50 rounded-lg p-4 text-blue-900 leading-relaxed">
                                                    {selectedAttempt.details.feedback}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}