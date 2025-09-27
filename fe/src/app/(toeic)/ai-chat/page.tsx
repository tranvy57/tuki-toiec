"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  isExpanded?: boolean;
}

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
    title: "Job Interview",
    description: "Practice your interview skills",
    icon: Briefcase,
    color: "toeic-primary",
    prompt: "I'm an HR manager conducting a job interview. Let's practice! What position are you applying for?"
  },
  {
    id: "ask-directions",
    title: "Ask for directions",
    description: "Learn to ask for help navigating",
    icon: MapPin,
    color: "toeic-primary",
    prompt: "I'm a local resident. You seem lost - how can I help you find your way?"
  },
  {
    id: "shopping",
    title: "Shopping at the mall",
    description: "Practice shopping conversations",
    icon: ShoppingBag,
    color: "toeic-primary",
    prompt: "Welcome to our store! I'm a sales assistant. How can I help you today?"
  },
  {
    id: "chat-friend",
    title: "Chat with a friend",
    description: "Casual conversation practice",
    icon: Users,
    color: "toeic-primary",
    prompt: "Hey there! I'm your friend. Let's catch up - how has your day been?"
  },
  {
    id: "custom",
    title: "My own scenario",
    description: "Create your own roleplay",
    icon: Lightbulb,
    color: "toeic-primary",
    prompt: "What scenario would you like to practice? Describe the situation and I'll play the appropriate role!"
  },
  {
    id: "surprise",
    title: "Surprise me",
    description: "Random conversation starter",
    icon: Gift,
    color: "toeic-primary",
    prompt: "Surprise! Let me think of an interesting scenario for us to practice..."
  }
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
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
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast.error("Voice recognition error. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      toast.success("Listening... Start speaking!");
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (voiceEnabled && "speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startScenario = (scenario: RolePlayScenario) => {
    setSelectedScenario(scenario);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: scenario.prompt,
      timestamp: new Date(),
      isExpanded: scenario.prompt.length <= 100
    };
    
    setMessages([welcomeMessage]);
    
    // Speak the prompt if voice is enabled
    if (voiceEnabled) {
      speakMessage(scenario.prompt);
    }
    
    toast.success(`Started: ${scenario.title}`);
  };

  const endRolePlay = () => {
    setSelectedScenario(null);
    setMessages([]);
    stopSpeaking();
    toast.success("Role-play ended");
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      "job-interview": [
        "That's very interesting! Can you tell me more about your experience with that? I'd like to understand how you've grown in that role and what specific challenges you've overcome. What would you say was your most significant accomplishment during that time?",
        "What do you consider your greatest strength and how has it helped you in your professional career?",
        "How do you handle challenges at work? Can you walk me through a specific example of a difficult situation you faced and how you resolved it? What did you learn from that experience?",
        "Where do you see yourself in five years? What are your career goals and how does this position align with your long-term aspirations?",
        "Excellent! Do you have any questions about our company culture, the team you'd be working with, or the growth opportunities we offer here?"
      ],
      "ask-directions": [
        "Oh, you're looking for that place! It's about 10 minutes from here if you walk straight down this street, then turn left at the traffic lights. You'll see a big shopping center on your right - the place you're looking for is just behind it. Are you familiar with this area?",
        "Do you prefer walking or taking public transport? Walking would take about 15 minutes and it's a nice route through the park, but there's also a bus that goes directly there every 10 minutes.",
        "I can show you on the map if you'd like. Here, let me draw you a quick sketch of the route. It's actually quite straightforward once you know the landmarks to look for.",
        "That's a great place! Have you been there before? They have excellent food and the atmosphere is really cozy. You'll love it there.",
        "Would you like me to write down the directions for you? Sometimes it's easier to have them written down, especially if you're not familiar with the neighborhood."
      ],
      "shopping": [
        "That's a very popular item! Let me show you what we have in stock. We actually just received a new shipment yesterday, so we have all sizes and colors available. What specifically are you looking for?",
        "What size are you looking for? We have this item in sizes ranging from XS to XXL, and I can also check if we have it in petite or tall sizes if you need them.",
        "We have a special promotion today - buy two and get one free! Would you be interested in that? You could get different colors or styles, and it's a great deal for the quality.",
        "This would look absolutely fantastic on you! The color really complements your skin tone. Would you like to try it on? The fitting rooms are just over there, and I can bring you different sizes if needed.",
        "We also have this in different colors and patterns. Which do you prefer - the classic navy blue, the burgundy, or this new floral pattern that just came in? Each one has its own unique style."
      ],
      "chat-friend": [
        "That sounds absolutely awesome! Tell me more about it - I want to hear all the details! How did it make you feel and what was the best part about the whole experience?",
        "I totally understand how you feel about that. It's completely normal to have those emotions, and I've been through something similar myself. How are you coping with everything?",
        "Have you tried doing something different about that situation? Sometimes a fresh approach can make all the difference. What options do you think you have?",
        "You always have such interesting and entertaining stories! I love how you tell them with so much detail and emotion. What happened next in that situation?",
        "What are you planning to do this weekend? Any exciting plans or just relaxing at home? I'd love to hear what you have in mind!"
      ],
      "custom": [
        "That's a fantastic scenario! I'm completely ready to play that role and make this practice session as realistic as possible for you. What character should I portray and what's the setting we're working with?",
        "Very interesting situation! How should we start this roleplay? Should I begin with a specific scenario or would you like to set the scene first? I'm excited to help you practice this!",
        "I can definitely help you practice that scenario. It sounds like it will be great practice for real-life situations. What specific aspects would you like to focus on during our roleplay?",
        "Let's dive right into this roleplay! What happens next in this scenario? I'll adapt my responses to match whatever role you need me to play. Just give me the context and we'll begin.",
        "Perfect! I'll adapt to whatever role you need me to play in this scenario. Whether it's formal, casual, professional, or personal - just let me know the tone and setting you want to practice."
      ],
      "surprise": [
        "Plot twist! Let's say we're at a busy coffee shop during the morning rush and you're trying to place a complex order in English. The barista is friendly but speaks quickly. How would you handle this situation?",
        "Imagine you're at an international airport and your connecting flight has been delayed by 4 hours. You need to rebook your flight and find accommodation. How do you handle this stressful situation in English?",
        "Let's pretend we're at an upscale restaurant and there's a problem with your order - they brought you something completely different from what you ordered. How would you politely address this with the waiter?",
        "Surprise scenario! You're walking through the city center when a confused tourist approaches you asking for directions to a famous landmark. They don't speak much of the local language. How do you help them?",
        "Random situation: You're at a department store trying to return an item you bought online, but you don't have the receipt and the item doesn't fit properly. How do you explain the situation to the customer service representative?"
      ]
    };

    const scenarioId = selectedScenario?.id || "chat-friend";
    const scenarioResponses = responses[scenarioId as keyof typeof responses] || responses["chat-friend"];
    
    return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedScenario) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      isVoice: isListening
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Generate AI response after a delay
    setTimeout(() => {
      const responseContent = generateAIResponse(inputMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responseContent,
        timestamp: new Date(),
        isExpanded: responseContent.length <= 100
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Speak AI response if voice is enabled
      if (voiceEnabled) {
        speakMessage(aiResponse.content);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMessageExpand = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg
    ));
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (!selectedScenario) {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 flex-shrink-0">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-toeic-primary rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                EXPERIENCE <span className="text-toeic-primary">AI ASSISTANT</span>
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto border border-gray-200 shadow-lg">
              <p className="text-gray-800 mb-2">Hi! Welcome to AI Assistant.</p>
              <p className="text-gray-600 text-sm">Please select one of the following role plays:</p>
            </div>
          </div>

          {/* Role Play Scenarios */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto pb-6">
            {rolePlayScenarios.map((scenario) => {
              const IconComponent = scenario.icon;
              return (
                <Card 
                  key={scenario.id}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => startScenario(scenario)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-toeic-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-gray-800 font-semibold text-base mb-2">{scenario.title}</h3>
                    <p className="text-gray-600 text-xs">{scenario.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          </div>
          
          {/* Features */}
          <div className="mt-4 max-w-4xl mx-auto flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
              <h2 className="text-gray-800 text-lg font-bold text-center mb-4">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-toeic-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">Choose Scenario</h3>
                  <p className="text-gray-600 text-xs">Select a roleplay situation to practice</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-toeic-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">Voice & Text</h3>
                  <p className="text-gray-600 text-xs">Communicate using voice or text input</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-toeic-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">AI Interaction</h3>
                  <p className="text-gray-600 text-xs">Practice with intelligent AI responses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
    style={{
        maxHeight: "calc(100vh - 64px)"            
    }}
    className="h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col border border-gray-200 shadow-lg min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar mt-5">
            {messages.map((message) => {
              if (message.type === "user") {
                // User messages - always show full content
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[80%] flex items-start gap-3 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-toeic-primary">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="rounded-2xl bg-toeic-primary text-white">
                        <div className="p-4">
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            {message.isVoice && <Mic className="w-3 h-3" />}
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // AI messages - show as button when collapsed, full content when expanded
                return (
                  <div key={message.id} className="flex justify-start">
                    <div className="max-w-[80%] flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-600">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      
                      {!message.isExpanded ? (
                        // Collapsed state - show as transcript button
                        <Button
                          onClick={() => toggleMessageExpand(message.id)}
                          variant="outline"
                          className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 rounded-2xl p-4 h-auto text-left"
                        >
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">Show transcript</span>
                            <ChevronDown className="w-3 h-3" />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </Button>
                      ) : (
                        // Expanded state - show full content
                        <div className="rounded-2xl bg-gray-100 text-gray-800">
                          <div className="p-4">
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-xs opacity-70">
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                              </div>
                              
                              <Button
                                onClick={() => toggleMessageExpand(message.id)}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-xs opacity-70 hover:opacity-100"
                              >
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Hide
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 border-t border-gray-200 flex-shrink-0">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice..."
              className="flex-1 bg-transparent border-none text-gray-800 placeholder-gray-500 focus:ring-0"
            />
            
            <Button
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              variant="outline"
              size="sm"
              className={`${
                isListening 
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-toeic-primary hover:bg-red-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
