"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { addSampleSpeakingData, clearAllSpeakingData } from '@/lib/speaking-history-helpers'
import { Database, Trash2 } from 'lucide-react'

export const SpeakingHistoryDemoButtons: React.FC = () => {
    const handleAddSampleData = () => {
        addSampleSpeakingData()
    }

    const handleClearData = () => {
        clearAllSpeakingData()
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleAddSampleData}
                variant="secondary"
                size="sm"
                className="text-xs"
            >
                <Database className="w-3 h-3 mr-1" />
                Add Demo Data
            </Button>
            <Button
                onClick={handleClearData}
                variant="destructive"
                size="sm"
                className="text-xs"
            >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
            </Button>
        </div>
    )
}