"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Target,
  BookOpen,
  Play,
  BarChart3,
  Loader2,
} from "lucide-react";
import { TOEIC_PARTS, SAMPLE_QUESTIONS } from "../constants";

interface IntroScreenProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function IntroScreen({ onStart, isLoading }: IntroScreenProps) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <BarChart3 className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          TOEIC Review Test
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take this quick assessment to evaluate your current TOEIC level and get personalized study recommendations.
        </p>
      </div>

      

      <div className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Test Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOEIC_PARTS.map((part) => {
              const Icon = part.icon;
              return (
                <div key={part.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`p-2 rounded-lg ${part.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Part {part.id}: {part.name}</p>
                    <p className="text-sm text-gray-600">{part.questions} questions • {part.skill}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>

      <div className="text-center">
        <Button
          onClick={onStart}
          size="lg"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang chuẩn bị...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Review Test
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          {isLoading ? "Vui lòng đợi trong giây lát..." : "No registration required • Results available immediately"}
        </p>
      </div>
    </motion.div>
  );
}