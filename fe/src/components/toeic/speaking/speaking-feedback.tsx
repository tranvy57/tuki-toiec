"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Clock, 
  Volume2,
  MessageCircle,
  TrendingUp,
  Download,
  Share
} from "lucide-react";

interface SpeakingFeedback {
  overallScore: number;
  pronunciation: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  confidence: number;
  speakingTime: number;
  wordsPerMinute: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
  topicCompleted: boolean;
  nextTopicSuggestion?: string;
}

interface SpeakingFeedbackProps {
  feedback: SpeakingFeedback;
  onNewSession: () => void;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
}

export default function SpeakingFeedbackComponent({
  feedback,
  onNewSession,
  onDownloadReport,
  onShareResults
}: SpeakingFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", class: "bg-green-100 text-green-800" };
    if (score >= 80) return { text: "Very Good", class: "bg-blue-100 text-blue-800" };
    if (score >= 70) return { text: "Good", class: "bg-yellow-100 text-yellow-800" };
    if (score >= 60) return { text: "Fair", class: "bg-orange-100 text-orange-800" };
    return { text: "Needs Improvement", class: "bg-red-100 text-red-800" };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const overallBadge = getScoreBadge(feedback.overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {feedback.topicCompleted ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : (
              <AlertCircle className="w-16 h-16 text-yellow-600" />
            )}
          </div>
          <CardTitle className="text-2xl">Speaking Practice Complete!</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}%
            </div>
            <Badge className={overallBadge.class}>
              {overallBadge.text}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Detailed Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pronunciation</span>
                  <span className={getScoreColor(feedback.pronunciation)}>{feedback.pronunciation}%</span>
                </div>
                <Progress value={feedback.pronunciation} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fluency</span>
                  <span className={getScoreColor(feedback.fluency)}>{feedback.fluency}%</span>
                </div>
                <Progress value={feedback.fluency} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Vocabulary</span>
                  <span className={getScoreColor(feedback.vocabulary)}>{feedback.vocabulary}%</span>
                </div>
                <Progress value={feedback.vocabulary} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Grammar</span>
                  <span className={getScoreColor(feedback.grammar)}>{feedback.grammar}%</span>
                </div>
                <Progress value={feedback.grammar} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Confidence</span>
                  <span className={getScoreColor(feedback.confidence)}>{feedback.confidence}%</span>
                </div>
                <Progress value={feedback.confidence} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Session Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Speaking Time</span>
              </div>
              <div className="text-2xl font-bold">{formatTime(feedback.speakingTime)}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Words/Minute</span>
              </div>
              <div className="text-2xl font-bold">{feedback.wordsPerMinute}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Topic Status</span>
              </div>
              <div className="text-lg font-medium">
                {feedback.topicCompleted ? (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">Overall</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <TrendingUp className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Personalized Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Next Topic Recommendation */}
      {feedback.nextTopicSuggestion && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Recommended Next Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{feedback.nextTopicSuggestion}</p>
            <Button onClick={onNewSession} className="w-full">
              Start New Practice Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onNewSession} className="flex-1">
          <MessageCircle className="w-4 h-4 mr-2" />
          Practice More
        </Button>
        
        {onDownloadReport && (
          <Button onClick={onDownloadReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        )}
        
        {onShareResults && (
          <Button onClick={onShareResults} variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        )}
      </div>
    </div>
  );
}

