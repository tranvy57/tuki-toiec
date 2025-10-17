"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  MicOff,
  Send,
  MessageCircle,
  Briefcase,
  MapPin,
  ShoppingBag,
  Users,
  Lightbulb,
  Gift,
  Home,
  Bot,
  User as UserIcon,
  Settings,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  RotateCcw,
  SkipForward,
  CheckCircle,
  Clock,
  Star,
  Camera,
  MessageSquare,
  Brain,
  FileText,
  Play,
  Pause,
  Square,
  Award,
  Target,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  isExpanded?: boolean;
  audioUrl?: string;
}

interface TOEICSpeakingTask {
  id: string;
  type:
    | "describe-picture"
    | "respond-question"
    | "opinion-paragraph"
    | "roleplay";
  title: string;
  instruction: string;
  prompt: string;
  imageUrl?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // seconds
  targetBand: string;
  tips: string[];
}

interface BotState {
  mode: "idle" | "speaking" | "listening" | "processing" | "evaluating";
  currentTask?: TOEICSpeakingTask;
  isRecording: boolean;
  recordingTime: number;
  showTranscript: boolean;
  audioProgress: number;
}

const speakingTasks: TOEICSpeakingTask[] = [
  {
    id: "desc-1",
    type: "describe-picture",
    title: "Describe Picture",
    instruction: "Look at the picture and describe what you see in detail",
    prompt:
      "Describe the picture in as much detail as possible. You have 45 seconds to prepare and 45 seconds to speak.",
    imageUrl: "/images/toeic-speaking-1.jpg",
    difficulty: "Easy",
    timeLimit: 45,
    targetBand: "6-7",
    tips: [
      "Start with the main subject",
      "Describe locations and positions",
      "Use present continuous tense",
      "Include details about clothing, actions, and setting",
    ],
  },
  {
    id: "respond-1",
    type: "respond-question",
    title: "Respond to Questions",
    instruction: "Answer questions about daily life or work situations",
    prompt:
      "I will ask you some questions about your daily routine. Please answer each question in 15 seconds.",
    difficulty: "Medium",
    timeLimit: 15,
    targetBand: "5-6",
    tips: [
      "Give specific examples",
      "Use past, present, and future tenses",
      "Explain your reasons",
      "Keep answers natural and conversational",
    ],
  },
  {
    id: "opinion-1",
    type: "opinion-paragraph",
    title: "Express Opinion",
    instruction: "Give your opinion on a topic with supporting reasons",
    prompt:
      "Some people prefer working from home, while others prefer working in an office. Which do you prefer and why? Give specific reasons and examples.",
    difficulty: "Hard",
    timeLimit: 60,
    targetBand: "7-8",
    tips: [
      "State your opinion clearly",
      "Give 2-3 supporting reasons",
      "Use examples from personal experience",
      "Organize your response logically",
    ],
  },
];

interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prompt: string;
}

const rolePlayScenarios: RolePlayScenario[] = [
  {
    id: "job-interview",
    title: "Job Interview Practice",
    description: "Practice professional interview skills",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    prompt:
      "Welcome to your interview! I'm the hiring manager. Let's start with: Tell me about yourself and why you're interested in this position.",
  },
  {
    id: "ask-directions",
    title: "Asking for Directions",
    description: "Learn to navigate and ask for help",
    icon: MapPin,
    color: "from-green-500 to-emerald-500",
    prompt:
      "Hello! You look a bit lost. I'm a local resident - how can I help you find your way around the city?",
  },
  {
    id: "shopping",
    title: "Shopping Conversation",
    description: "Practice retail and customer service interactions",
    icon: ShoppingBag,
    color: "from-purple-500 to-pink-500",
    prompt:
      "Good morning! Welcome to our store. I'm here to help you find what you're looking for. What can I assist you with today?",
  },
  {
    id: "phone-call",
    title: "Business Phone Call",
    description: "Professional phone conversation practice",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
    prompt:
      "Thank you for calling our company. This is Sarah from customer service. How may I assist you today?",
  },
];

export default function AISpeakingBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedScenario, setSelectedScenario] =
    useState<RolePlayScenario | null>(null);
  const [currentTask, setCurrentTask] = useState<TOEICSpeakingTask | null>(
    null
  );
  const [botState, setBotState] = useState<BotState>({
    mode: "idle",
    isRecording: false,
    recordingTime: 0,
    showTranscript: false,
    audioProgress: 0,
  });
  const [preparationTime, setPreparationTime] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preparationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputMessage(finalTranscript);
          setBotState((prev) => ({
            ...prev,
            mode: "processing",
            isRecording: false,
          }));
          stopRecording();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setBotState((prev) => ({ ...prev, mode: "idle", isRecording: false }));
        toast.error("Voice recognition error. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setBotState((prev) => ({ ...prev, isRecording: false }));
      };
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (botState.isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setBotState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [botState.isRecording]);

  const startRecording = () => {
    if (recognitionRef.current && !botState.isRecording) {
      setBotState((prev) => ({
        ...prev,
        mode: "listening",
        isRecording: true,
        recordingTime: 0,
      }));
      recognitionRef.current.start();
      toast.success("🎤 Recording started - speak now!");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && botState.isRecording) {
      recognitionRef.current.stop();
      setBotState((prev) => ({ ...prev, isRecording: false }));
    }
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      setBotState((prev) => ({ ...prev, mode: "speaking", audioProgress: 0 }));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => {
        setBotState((prev) => ({ ...prev, mode: "idle", audioProgress: 0 }));
      };

      utterance.onerror = () => {
        setBotState((prev) => ({ ...prev, mode: "idle", audioProgress: 0 }));
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setBotState((prev) => ({ ...prev, mode: "idle", audioProgress: 0 }));
    }
  };

  const startTask = (task: TOEICSpeakingTask) => {
    setCurrentTask(task);
    setBotState((prev) => ({ ...prev, currentTask: task, mode: "speaking" }));

    const instruction = `Let's practice ${task.title}. ${task.instruction}. ${task.prompt}`;

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: instruction,
      timestamp: new Date(),
      isExpanded: true,
    };

    setMessages([welcomeMessage]);
    speakMessage(instruction);
    toast.success(`Started: ${task.title}`);
  };

  const startScenario = (scenario: RolePlayScenario) => {
    setSelectedScenario(scenario);
    setBotState((prev) => ({ ...prev, mode: "speaking" }));

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: scenario.prompt,
      timestamp: new Date(),
      isExpanded: true,
    };

    setMessages([welcomeMessage]);
    speakMessage(scenario.prompt);
    toast.success(`Started: ${scenario.title}`);
  };

  const endSession = () => {
    setSelectedScenario(null);
    setCurrentTask(null);
    setMessages([]);
    setBotState({
      mode: "idle",
      isRecording: false,
      recordingTime: 0,
      showTranscript: false,
      audioProgress: 0,
    });
    stopSpeaking();
    toast.success("Session ended");
  };

  const generateAIResponse = (userMessage: string): string => {
    if (currentTask) {
      // TOEIC task-specific responses
      const taskResponses = {
        "describe-picture": [
          "Great description! I can clearly visualize the scene. Can you tell me more about the people's expressions or what they might be thinking?",
          "Excellent use of descriptive language! Now, can you describe the background or setting in more detail?",
          "Very good! I like how you mentioned the colors and positions. What about the atmosphere or mood of the scene?",
          "Nice work! Can you add more details about what the people are wearing or their actions?",
          "Perfect! You're using good present continuous tense. Now tell me about any objects you can see.",
        ],
        "respond-question": [
          "That's a thoughtful answer! Can you give me a specific example from your own experience?",
          "Interesting perspective! How does that compare to what other people might think?",
          "Good response! What would you do differently in that situation?",
          "I appreciate your honesty! Can you explain why you feel that way?",
          "Nice answer! What advice would you give to someone in a similar situation?",
        ],
        "opinion-paragraph": [
          "Strong argument! Your reasoning is very clear. Can you provide another supporting point?",
          "Excellent! I like how you structured your response. What might someone with the opposite view say?",
          "Very persuasive! Your examples really strengthen your argument. How would you address counterarguments?",
          "Great job organizing your thoughts! Can you elaborate on your most important point?",
          "Well done! Your opinion is well-supported. What personal experience led you to this conclusion?",
        ],
        roleplay: [
          "That's exactly the right approach! Very professional and clear. Let me ask you another question...",
          "Perfect response! Your tone and language are spot-on. How would you handle this follow-up situation?",
          "Excellent communication skills! You're very natural and confident. Let's continue...",
          "Great job! You're speaking clearly and expressing yourself well. Here's another scenario...",
          "Outstanding! Your responses are very appropriate for this context. Let me add more complexity...",
        ],
      };

      const responses =
        taskResponses[currentTask.type] || taskResponses["roleplay"];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (selectedScenario) {
      // Roleplay scenario responses (keeping existing logic)
      const responses = {
        "job-interview": [
          "That's very interesting! Can you tell me more about your experience with that? I'd like to understand how you've grown in that role.",
          "What do you consider your greatest strength and how has it helped you in your professional career?",
          "How do you handle challenges at work? Can you walk me through a specific example?",
          "Where do you see yourself in five years? What are your career goals?",
          "Excellent! Do you have any questions about our company culture or growth opportunities?",
        ],
        "ask-directions": [
          "Oh, you're looking for that place! It's about 10 minutes from here if you walk straight down this street, then turn left at the traffic lights.",
          "Do you prefer walking or taking public transport? Walking would take about 15 minutes through the park.",
          "I can show you on the map if you'd like. Let me draw you a quick sketch of the route.",
          "That's a great place! Have you been there before? They have excellent food and atmosphere.",
          "Would you like me to write down the directions? Sometimes it's easier to have them written down.",
        ],
        shopping: [
          "That's a very popular item! Let me show you what we have in stock. We just received a new shipment yesterday.",
          "What size are you looking for? We have this item in sizes ranging from XS to XXL.",
          "We have a special promotion today - buy two and get one free! Would you be interested?",
          "This would look absolutely fantastic on you! The color really complements your skin tone.",
          "We also have this in different colors and patterns. Which do you prefer?",
        ],
        "phone-call": [
          "I understand your concern. Let me look into this matter for you right away.",
          "Thank you for bringing this to our attention. Can you provide me with more details?",
          "I apologize for the inconvenience. Let me see how we can resolve this quickly.",
          "That's a great question! Let me check our current policies and get back to you.",
          "I'm happy to help you with that. Can you hold for just a moment while I review your account?",
        ],
      };

      const scenarioResponses =
        responses[selectedScenario.id as keyof typeof responses] ||
        responses["phone-call"];
      return scenarioResponses[
        Math.floor(Math.random() * scenarioResponses.length)
      ];
    }

    return "I'm here to help you practice! Please start a task or scenario to begin.";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || (!selectedScenario && !currentTask)) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      isVoice: botState.isRecording,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setBotState((prev) => ({ ...prev, mode: "processing" }));

    // Generate AI response after a delay
    setTimeout(() => {
      const responseContent = generateAIResponse(inputMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responseContent,
        timestamp: new Date(),
        isExpanded: true,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setBotState((prev) => ({ ...prev, mode: "idle" }));

      // Speak AI response
      speakMessage(aiResponse.content);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTranscript = () => {
    setBotState((prev) => ({ ...prev, showTranscript: !prev.showTranscript }));
  };

  const skipTask = () => {
    if (currentTask) {
      toast.success("Task skipped! Moving to next...");
      // In a real app, you'd load the next task
      endSession();
    }
  };

  const submitResponse = () => {
    if (currentTask) {
      setBotState((prev) => ({ ...prev, mode: "evaluating" }));

      // Simulate evaluation
      setTimeout(() => {
        const score = Math.floor(Math.random() * 3) + 6; // 6-8 range
        setCurrentScore(score);
        setBotState((prev) => ({ ...prev, mode: "idle" }));
        toast.success(`Great job! Score: ${score}/9`);
      }, 2000);
    }
  };

  // Home screen - choose task type
  if (!selectedScenario && !currentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TOEIC Speaking AI Coach
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Practice TOEIC speaking tasks with intelligent AI feedback. Choose
              from structured tasks or free conversation practice.
            </p>
          </motion.div>

          {/* Task Type Selection */}
          <div className="grid gap-8 max-w-6xl mx-auto">
            {/* TOEIC Speaking Tasks */}
            {/* <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                TOEIC Speaking Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {speakingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => startTask(task)}
                    className="cursor-pointer"
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              task.difficulty === "Easy"
                                ? "bg-green-100 text-green-700"
                                : task.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {task.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Band {task.targetBand}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-800">
                          {task.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4">
                          {task.instruction}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.timeLimit}s
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            TOEIC Format
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section> */}

            {/* Role Play Scenarios */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Conversation Practice
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rolePlayScenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -3 }}
                    onClick={() => startScenario(scenario)}
                    className="cursor-pointer"
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${scenario.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                        >
                          <scenario.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm mb-2">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {scenario.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Features Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-6">
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      AI Conversation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Intelligent responses that adapt to your level and provide
                      feedback
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Voice Recognition
                    </h4>
                    <p className="text-sm text-gray-600">
                      Speak naturally and get instant transcription and
                      pronunciation feedback
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      TOEIC Scoring
                    </h4>
                    <p className="text-sm text-gray-600">
                      Get band scores and detailed feedback based on TOEIC
                      criteria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Speaking Bot Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Top Header - Task Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={endSession}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit
            </Button>

            {currentTask && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {currentTask.type.replace("-", " ").toUpperCase()}
                </Badge>
                <h2 className="font-bold text-gray-800">{currentTask.title}</h2>
                <Badge
                  className={`text-xs ${
                    currentTask.difficulty === "Easy"
                      ? "bg-green-500"
                      : currentTask.difficulty === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {currentTask.difficulty}
                </Badge>
              </div>
            )}

            {selectedScenario && (
              <div className="flex items-center gap-3">
                <selectedScenario.icon className="w-5 h-5 text-purple-600" />
                <h2 className="font-bold text-gray-800">
                  {selectedScenario.title}
                </h2>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentScore > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Score: {currentScore}/9
              </Badge>
            )}
            {currentTask && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Target: Band {currentTask.targetBand}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Left Column - Task/Image */}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Task Instructions
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentTask.imageUrl && (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={currentTask.imageUrl}
                        alt="Task image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {currentTask.prompt}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Tips:</h4>
                    <ul className="space-y-1">
                      {currentTask.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 flex items-start gap-2"
                        >
                          <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Limit:</span>
                    <Badge variant="outline">{currentTask.timeLimit}s</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Center Column - Bot Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={currentTask ? "lg:col-span-2" : "lg:col-span-3"}
          >
            <Card className="h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg flex flex-col">
              {/* Bot Avatar & Status */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Animated Bot Avatar */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        botState.mode === "speaking"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600"
                          : botState.mode === "listening"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600"
                          : botState.mode === "processing"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                          : botState.mode === "evaluating"
                          ? "bg-gradient-to-r from-purple-500 to-pink-600"
                          : "bg-gradient-to-r from-gray-400 to-gray-600"
                      }`}
                      animate={{
                        scale: botState.mode === "speaking" ? [1, 1.05, 1] : 1,
                        rotate:
                          botState.mode === "processing" ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{
                        duration: botState.mode === "speaking" ? 0.8 : 2,
                        repeat:
                          botState.mode === "speaking" ||
                          botState.mode === "processing"
                            ? Infinity
                            : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <Bot className="w-8 h-8 text-white" />

                      {/* Voice Activity Ring */}
                      {botState.mode === "speaking" && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-4 border-blue-300"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0.3, 0.7],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        AI Speaking Coach
                      </h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            botState.mode === "speaking"
                              ? "bg-blue-500 animate-pulse"
                              : botState.mode === "listening"
                              ? "bg-green-500 animate-pulse"
                              : botState.mode === "processing"
                              ? "bg-yellow-500 animate-pulse"
                              : botState.mode === "evaluating"
                              ? "bg-purple-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm text-gray-600 capitalize">
                          {botState.mode === "speaking"
                            ? "Speaking..."
                            : botState.mode === "listening"
                            ? "Listening..."
                            : botState.mode === "processing"
                            ? "Processing..."
                            : botState.mode === "evaluating"
                            ? "Evaluating..."
                            : "Ready"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={
                        botState.mode === "speaking" ? stopSpeaking : () => {}
                      }
                      variant="outline"
                      size="sm"
                      disabled={botState.mode !== "speaking"}
                      className="flex items-center gap-2"
                    >
                      {botState.mode === "speaking" ? (
                        <>
                          <Square className="w-3 h-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          Audio
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={toggleTranscript}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {botState.showTranscript ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {botState.showTranscript ? "Hide" : "Show"} Text
                    </Button>
                  </div>
                </div>

                {/* Audio Progress Bar */}
                {botState.mode === "speaking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Progress value={botState.audioProgress} className="h-1" />
                  </motion.div>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {botState.showTranscript &&
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
                        } p-4 shadow-md`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          {message.isVoice && <Mic className="w-3 h-3" />}
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {botState.mode === "processing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4 shadow-md">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Recording Area */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  {/* Recording Button */}
                  <motion.button
                    onClick={
                      botState.isRecording ? stopRecording : startRecording
                    }
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      botState.isRecording
                        ? "bg-gradient-to-r from-red-500 to-pink-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      botState.isRecording
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0px 0px 0px 0px rgba(239, 68, 68, 0.4)",
                              "0px 0px 0px 10px rgba(239, 68, 68, 0)",
                              "0px 0px 0px 0px rgba(239, 68, 68, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      repeat: botState.isRecording ? Infinity : 0,
                    }}
                  >
                    {botState.isRecording ? (
                      <Square className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </motion.button>

                  {/* Recording Info */}
                  <div className="flex-1">
                    {botState.isRecording ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-red-600">
                            Recording
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(botState.recordingTime / 60)}:
                          {(botState.recordingTime % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Badge>
                        {currentTask && (
                          <Progress
                            value={
                              (botState.recordingTime / currentTask.timeLimit) *
                              100
                            }
                            className="flex-1 h-2"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {currentTask
                          ? `Press to record your ${currentTask.timeLimit}s response`
                          : "Press to start speaking"}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {currentTask && (
                      <>
                        <Button
                          onClick={submitResponse}
                          disabled={
                            botState.mode === "evaluating" ||
                            messages.length === 0
                          }
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          {botState.mode === "evaluating" ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Evaluating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Submit
                            </>
                          )}
                        </Button>

                        <Button onClick={skipTask} variant="outline" size="sm">
                          <SkipForward className="w-4 h-4 mr-2" />
                          Skip
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() =>
                        speakMessage(
                          messages[messages.length - 1]?.content ||
                            "Hello! Let's practice speaking."
                        )
                      }
                      variant="outline"
                      size="sm"
                      disabled={botState.mode === "speaking"}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Replay
                    </Button>
                  </div>
                </div>

                {/* Text Input (Hidden unless specifically needed) */}
                <AnimatePresence>
                  {inputMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Or type your response..."
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
