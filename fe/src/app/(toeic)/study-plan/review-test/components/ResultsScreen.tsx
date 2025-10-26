"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Users,
  Calendar,
  X,
} from "lucide-react";
import { TestResults, Question } from "../types";
import { BAND_SCORE_MAPPING, generateRecommendations, formatTime } from "../constants";

interface ResultsScreenProps {
  results: TestResults;
  questions: Question[];
  answers: Record<number, number>;
  onRetake: () => void;
  onCreateStudyPlan: () => void;
}

export function ResultsScreen({
  results,
  questions,
  answers,
  onRetake,
  onCreateStudyPlan,
}: ResultsScreenProps) {
  const scoreMapping = BAND_SCORE_MAPPING[results.correctAnswers] || BAND_SCORE_MAPPING[0];

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center"
        >
          <Award className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
        <p className="text-gray-600">Here are your results and recommendations</p>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{results.accuracy}%</div>
          <p className="text-gray-600">Accuracy</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {results.correctAnswers}/{results.totalQuestions}
          </div>
          <p className="text-gray-600">Correct Answers</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatTime(results.timeSpent)}
          </div>
          <p className="text-gray-600">Time Spent</p>
        </Card>
      </div>

      {/* Score Band */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Estimated TOEIC Score</h3>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${scoreMapping.color}`}>
              {scoreMapping.band} • {scoreMapping.level}
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </Card>

      {/* Detailed Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Question Review</h3>
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            return (
              <div key={question.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-1 rounded-full mt-1 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">Part {question.part}: {question.partName}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                  {!isCorrect && (
                    <div className="text-xs space-y-1">
                      <p className="text-red-600">
                        <span className="font-medium">Your answer:</span> {question.options[answers[index]] || 'Not answered'}
                      </p>
                      <p className="text-green-600">
                        <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        {results.weakAreas.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Areas to Improve</h3>
            <div className="space-y-3">
              {results.weakAreas.map((part) => {
                const Icon = part.icon;
                return (
                  <div key={part.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Icon className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">Part {part.id}: {part.name}</p>
                      <p className="text-sm text-red-700">{part.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Strong Areas */}
        {results.strongAreas.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Your Strengths</h3>
            <div className="space-y-3">
              {results.strongAreas.map((part) => {
                const Icon = part.icon;
                return (
                  <div key={part.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Part {part.id}: {part.name}</p>
                      <p className="text-sm text-green-700">{part.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Study Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-3">Focus Areas</h4>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-3">Next Steps</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Create a personalized study plan</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Practice with full-length tests</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Focus on identified weak areas</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Track progress regularly</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onCreateStudyPlan}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Users className="w-5 h-5 mr-2" />
          Create Study Plan
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRetake}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Retake Test
        </Button>
      </div>
    </motion.div>
  );
}