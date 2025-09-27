"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import SpeakingTopicSelector, { SpeakingTopic } from "@/components/toeic/speaking/speaking-topic-selector";
import SpeakingFeedbackComponent from "@/components/toeic/speaking/speaking-feedback";
import { speakingTopicsData, getRandomTopic } from "@/libs/speaking-data";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2,
  MessageCircle,
  Brain,
  Clock,
  Star,
  Home
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

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

export default function SpeakingPage() {
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<SpeakingFeedback | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Speech recognition error. Please try again.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isSessionActive]);

  const startSession = (topic: SpeakingTopic) => {
    setSelectedTopic(topic);
    setIsSessionActive(true);
    setSessionTime(0);
    setCurrentQuestionIndex(0);
    setMessages([]);
    
    // Add initial AI greeting
    const greeting = `Hello! I'm your AI speaking partner. Today we'll practice "${topic.title}". Let's start with the first question: ${topic.questions[0]}`;
    setMessages([{
      id: Date.now().toString(),
      type: "ai",
      content: greeting,
      timestamp: new Date()
    }]);

    // Speak the greeting
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    toast.success(`Started speaking session: ${topic.title}`);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setIsRecording(false);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Generate feedback
    const feedback = generateSessionFeedback();
    setSessionFeedback(feedback);
    setShowFeedback(true);
    
    toast.success(`Session completed! Total time: ${Math.floor(sessionTime / 60)}:${(sessionTime % 60).toString().padStart(2, "0")}`);
  };

  const generateSessionFeedback = (): SpeakingFeedback => {
    // This is a simplified feedback generation - in a real app, this would use AI analysis
    const wordsSpoken = messages.filter(m => m.type === "user").join(" ").split(" ").length;
    const wordsPerMinute = Math.round((wordsSpoken / sessionTime) * 60);
    
    const baseScore = Math.min(90, Math.max(60, 70 + (sessionTime > 300 ? 10 : 0) + (wordsPerMinute > 100 ? 10 : 0)));
    
    return {
      overallScore: baseScore,
      pronunciation: baseScore + Math.floor(Math.random() * 10) - 5,
      fluency: baseScore + Math.floor(Math.random() * 10) - 5,
      vocabulary: baseScore + Math.floor(Math.random() * 10) - 5,
      grammar: baseScore + Math.floor(Math.random() * 10) - 5,
      confidence: baseScore + Math.floor(Math.random() * 10) - 5,
      speakingTime: sessionTime,
      wordsPerMinute,
      suggestions: [
        "Try to speak more slowly and clearly for better pronunciation.",
        "Use more varied vocabulary to express your ideas.",
        "Practice linking words and phrases for smoother flow.",
        "Work on reducing filler words like 'um' and 'uh'."
      ],
      strengths: [
        "Good use of examples to support your points.",
        "Clear organization of ideas.",
        "Confident delivery and good volume."
      ],
      improvements: [
        "Focus on more complex sentence structures.",
        "Expand your vocabulary range.",
        "Work on natural rhythm and intonation."
      ],
      topicCompleted: currentQuestionIndex >= (selectedTopic?.questions.length || 0) - 1,
      nextTopicSuggestion: `Based on your performance, try "${getRandomTopic(selectedTopic?.difficulty)?.title}" next!`
    };
  };

  const resetToTopicSelection = () => {
    setSelectedTopic(null);
    setShowFeedback(false);
    setSessionFeedback(null);
    setMessages([]);
    setCurrentQuestionIndex(0);
    setSessionTime(0);
    setUserTranscript("");
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setUserTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Listening... Start speaking!");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (userTranscript.trim()) {
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: userTranscript,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Generate AI response
        setTimeout(() => {
          generateAIResponse(userTranscript);
        }, 1000);
        
        setUserTranscript("");
      }
    }
  };

  const generateAIResponse = (userInput: string) => {
    if (!selectedTopic) return;

    // Simple AI response simulation
    const responses = [
      "That's very interesting! Could you elaborate more on that?",
      "I understand your perspective. What do you think about the other side of this topic?",
      "Great answer! Let me ask you another question to practice more.",
      "Thank you for sharing that. How do you feel about this compared to your previous experiences?",
      "Excellent! Your pronunciation is getting better. Let's continue with another aspect."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    let aiContent = randomResponse;
    
    // Move to next question if available
    if (currentQuestionIndex < selectedTopic.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      aiContent += ` Here's your next question: ${selectedTopic.questions[nextIndex]}`;
    } else {
      aiContent += " Great job! You've completed all questions for this topic. Feel free to continue the conversation or end the session.";
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: aiContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Speak AI response
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(aiContent);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (showFeedback && sessionFeedback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={resetToTopicSelection}
            variant="outline"
            className="mb-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Topics
          </Button>
        </div>
        
        <SpeakingFeedbackComponent
          feedback={sessionFeedback}
          onNewSession={resetToTopicSelection}
          onDownloadReport={() => toast.success("Download feature coming soon!")}
          onShareResults={() => toast.success("Share feature coming soon!")}
        />
      </div>
    );
  }

  if (!selectedTopic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Speaking Practice</h1>
          <p className="text-gray-600">Choose a topic to start practicing your English speaking skills with our AI tutor.</p>
        </div>

        <SpeakingTopicSelector
          topics={speakingTopicsData}
          onTopicSelect={startSession}
        />

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                How AI Speaking Practice Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Choose Topic</h3>
                  <p className="text-sm text-gray-600">Select a speaking topic that matches your level</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mic className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">Speak & Practice</h3>
                  <p className="text-sm text-gray-600">Answer questions and have conversations with AI</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-1">Get Feedback</h3>
                  <p className="text-sm text-gray-600">Receive instant feedback and improvement tips</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          onClick={resetToTopicSelection}
          variant="outline"
          className="mb-4"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTopic.title}</span>
                <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
                  {selectedTopic.difficulty}
                </Badge>
              </CardTitle>
              <CardDescription>{selectedTopic.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Session Time:</span>
                <span className="font-mono">{formatTime(sessionTime)}</span>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{currentQuestionIndex + 1}/{selectedTopic.questions.length}</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / selectedTopic.questions.length) * 100} />
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Current Question:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">
                  {selectedTopic.questions[currentQuestionIndex]}
                </p>
              </div>

              <Button onClick={endSession} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </CardContent>
          </Card>

          {/* Recording Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`w-full ${isListening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                size="lg"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Speaking
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>

              {isListening && (
                <div className="text-center">
                  <div className="animate-pulse flex justify-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-1"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-1 animate-ping"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-1"></div>
                  </div>
                  <p className="text-sm text-gray-600">Listening...</p>
                </div>
              )}

              {userTranscript && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">You said:</p>
                  <p className="text-sm">{userTranscript}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your conversation will appear here</p>
                    <p className="text-sm">Click "Start Speaking" to begin</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
