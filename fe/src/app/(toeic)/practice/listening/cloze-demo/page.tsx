"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ClozeListeningQuestion from "@/components/listening/exercises/ClozeListeningQuestion";

export default function ClozeTestPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showSingle, setShowSingle] = useState(false);

  // Single question example
  const singleQuestion = {
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
    text: "What most likely will ____ woman do next ?",
    answers: ["the"],
    transcript: "What most likely will the woman do next?",
  };

  const handleComplete = (userAnswers: string[], isCorrect: boolean) => {
    console.log("User answers:", userAnswers);
    console.log("Is correct:", isCorrect);
  };


  if (showSingle) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={() => setShowSingle(false)}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <ClozeListeningQuestion
            audioUrl={singleQuestion.audioUrl}
            text={singleQuestion.text}
            answers={singleQuestion.answers}
            transcript={singleQuestion.transcript}
            onComplete={handleComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            TOEIC Listening Cloze Practice
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose between a single question demo or a complete practice session
            with multiple questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Single Question Demo */}
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setShowSingle(true)}
          >
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">
                Single Question Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Try out a single cloze listening question to see the interface
                in action.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <div>✓ Dynamic input sizing</div>
                <div>✓ Audio player with replay limits</div>
                <div>✓ Real-time feedback</div>
                <div>✓ Transcript reveal</div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Try Single Question
              </Button>
            </CardContent>
          </Card>

          {/* Complete Practice Session */}
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setShowDemo(true)}
          >
            <CardHeader>
              <CardTitle className="text-xl text-green-800">
                Complete Practice Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Practice with multiple questions of varying difficulty levels.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <div>✓ 3 questions (Easy, Medium, Hard)</div>
                <div>✓ Progress tracking</div>
                <div>✓ Difficulty indicators</div>
                <div>✓ Final score summary</div>
              </div>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Start Practice Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                🎧
              </div>
              <h3 className="font-semibold mb-2">Smart Audio Player</h3>
              <p className="text-sm text-slate-600">
                Replay limits, progress scrubbing, and volume control
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                📝
              </div>
              <h3 className="font-semibold mb-2">Dynamic Input Fields</h3>
              <p className="text-sm text-slate-600">
                Input width automatically adjusts to expected answer length
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                ⚡
              </div>
              <h3 className="font-semibold mb-2">Instant Feedback</h3>
              <p className="text-sm text-slate-600">
                Real-time validation with correct answers displayed inline
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Technical Implementation
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">
                JSON Structure:
              </h4>
              <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
                {`{
  "prompt": {
    "text": "What ____ likely will ____ woman do?",
    "audio_url": "https://example.com/audio.mp3"
  },
  "solution": {
    "answers": ["most", "the"],
    "transcript": "What most likely will the woman do?"
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">React Props:</h4>
              <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
                {`interface ClozeListeningProps {
  audioUrl: string;
  text: string;
  answers: string[];
  transcript: string;
  onComplete?: (answers: string[], correct: boolean) => void;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
