"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
    Mic,
    MicOff,
    Send,
    Bot,
    User as UserIcon,
    Settings,
    RotateCcw,
    Loader2,
    AlertCircle,
    Circle
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Spline from "@splinetool/react-spline";

// Types
interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
    isVoice?: boolean;
}

interface AudioVisualizerProps {
    volume: number;
    isActive: boolean;
}

interface SplineAvatarCanvasProps {
    sceneUrl: string;
    sensitivity: number;
    smoothing: number;
    blinkMode: "auto" | "off" | "always";
    volume: number;
    isListening: boolean;
}

// Audio utilities
function rmsTimeDomain(buf: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
        const val = (buf[i] - 128) / 128;
        sum += val * val;
    }
    return Math.sqrt(sum / buf.length);
}

// Audio Visualizer Component
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, isActive }) => {
    const bars = 12;

    return (
        <div className="flex items-center justify-center gap-1 h-8 px-4">
            {Array.from({ length: bars }, (_, i) => {
                const delay = i * 0.1;
                const height = isActive ? Math.max(0.1, volume + Math.sin(Date.now() * 0.01 + delay) * 0.2) : 0.1;

                return (
                    <motion.div
                        key={i}
                        className="bg-purple-500 rounded-full w-1"
                        animate={{
                            height: `${Math.max(4, height * 24)}px`,
                            opacity: isActive ? 0.8 : 0.3
                        }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                    />
                );
            })}
        </div>
    );
};

// Spline Avatar Canvas Component
const SplineAvatarCanvas: React.FC<SplineAvatarCanvasProps> = ({
    sceneUrl,
    sensitivity,
    smoothing,
    blinkMode,
    volume,
    isListening
}) => {
    const splineRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const blinkStateRef = useRef<"Open" | "Closed">("Open");
    const lastBlinkRef = useRef(0);

    // Blink logic with hysteresis
    const updateBlink = useCallback((vol: number) => {
        if (blinkMode === "off") return;

        const now = performance.now();
        const cooldown = 80;
        const openThreshold = sensitivity - 0.15;
        const closeThreshold = sensitivity;

        if (now - lastBlinkRef.current < cooldown) return;

        const currentState = blinkStateRef.current;

        if (currentState === "Open" && vol > closeThreshold) {
            if (splineRef.current) {
                const eyes = splineRef.current.findObjectByName("Eyes");
                if (eyes) {
                    splineRef.current.setScene?.("Closed", eyes);
                    blinkStateRef.current = "Closed";
                    lastBlinkRef.current = now;
                }
            }
        } else if (currentState === "Closed" && vol < openThreshold) {
            if (splineRef.current) {
                const eyes = splineRef.current.findObjectByName("Eyes");
                if (eyes) {
                    splineRef.current.setScene?.("Open", eyes);
                    blinkStateRef.current = "Open";
                    lastBlinkRef.current = now;
                }
            }
        }
    }, [sensitivity, blinkMode]);

    // Update light and emissive intensity
    useEffect(() => {
        if (!splineRef.current || !isLoaded) return;

        const light = splineRef.current.findObjectByName("Point Light");
        const eyes = splineRef.current.findObjectByName("Eyes");

        if (light) {
            light.intensity = 2 + 10 * volume;
        }

        if (eyes?.material) {
            eyes.material.emissiveIntensity = 1 + 8 * volume;
        }

        updateBlink(volume);
    }, [volume, isLoaded, updateBlink]);

    const onLoad = (spline: any) => {
        splineRef.current = spline;
        setIsLoaded(true);
    };

    return (
        <div className="relative w-full h-full">
            <motion.div
                animate={{
                    rotateY: [0, 2, 0, -2, 0],
                    x: [0, 5, 0, -5, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            >
                <Spline
                    scene={sceneUrl}
                    onLoad={onLoad}
                    style={{ width: '100%', height: '100%', pointerEvents: 'none', cursor: 'default' }}
                />
            </motion.div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4">
                <Badge
                    variant={isListening ? "default" : "secondary"}
                    className={`${isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-white/80 text-gray-700"
                        }`}
                >
                    {isListening ? "Listening..." : "Ready"}
                </Badge>
            </div>
        </div>
    );
};

// Custom hook for audio processing
const useAudio = () => {
    const [volume, setVolume] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number>(0);

    const startMicrophone = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            streamRef.current = stream;
            setHasPermission(true);

            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.5;
            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            setIsListening(true);

            // Start analysis loop
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVolume = () => {
                if (!analyserRef.current || !isListening) return;

                analyserRef.current.getByteTimeDomainData(dataArray);
                const rms = rmsTimeDomain(dataArray);
                const normalizedVolume = Math.max(0, Math.min(1, rms - 0.02)); // Apply noise floor

                setVolume(normalizedVolume);
                animationRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
            toast.success("Microphone started");

        } catch (error) {
            console.error("Microphone error:", error);
            toast.error("Could not access microphone");
            setHasPermission(false);
        }
    }, [isListening]);

    const stopMicrophone = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        setIsListening(false);
        setVolume(0);
        toast.success("Microphone stopped");
    }, []);

    const toggleMicrophone = useCallback(() => {
        if (isListening) {
            stopMicrophone();
        } else {
            startMicrophone();
        }
    }, [isListening, startMicrophone, stopMicrophone]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopMicrophone();
        };
    }, [stopMicrophone]);

    return {
        volume,
        isListening,
        hasPermission,
        startMicrophone,
        stopMicrophone,
        toggleMicrophone
    };
};

// Main Page Component
export default function VoiceChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sensitivity, setSensitivity] = useState(0.35);
    const [smoothing, setSmoothing] = useState(0.5);
    const [blinkMode, setBlinkMode] = useState<"auto" | "off" | "always">("auto");
    const [showControls, setShowControls] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { volume, isListening, hasPermission, toggleMicrophone } = useAudio();

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        const greeting: Message = {
            id: "greeting",
            type: "ai",
            content: "Hello! I'm Tuki AI, your voice chat assistant. Feel free to speak to me or type your message. How can I help you today?",
            timestamp: new Date()
        };
        setMessages([greeting]);
    }, []);

    const sendMessage = (content: string, isVoice: boolean = false) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content,
            timestamp: new Date(),
            isVoice
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");

        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: generateAIResponse(content),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1500);
    };

    const generateAIResponse = (userInput: string): string => {
        const responses = [
            "That's very interesting! Can you tell me more about that?",
            "I understand your point. How do you feel about that situation?",
            "Great question! Let me think about that for a moment...",
            "That sounds like quite an experience. What was the most challenging part?",
            "I appreciate you sharing that with me. What would you recommend to others?",
            "That's a thoughtful perspective. How has this shaped your thinking?",
            "Excellent point! Can you give me a specific example?",
            "I can see why that would be important to you. What's your next step?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputMessage);
        }
    };

    const resetConversation = () => {
        setMessages([{
            id: "greeting",
            type: "ai",
            content: "Hello! I'm Tuki AI, your voice chat assistant. Feel free to speak to me or type your message. How can I help you today?",
            timestamp: new Date()
        }]);
        toast.success("Conversation reset");
    };

    return (
        <div className=" bg-white max-h-[calc(100vh-72px)]">
            <div className="container mx-auto p-4 h-screen flex flex-col lg:flex-row gap-4 max-w-7xl">
                {/* Left Panel - Spline Avatar */}
                <motion.div
                    className="w-full lg:w-[400px] h-[300px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                        <SplineAvatarCanvas
                            sceneUrl="https://prod.spline.design/MoDM2xB63NkbPFXg/scene.splinecode"
                            sensitivity={sensitivity}
                            smoothing={smoothing}
                            blinkMode={blinkMode}
                            volume={volume}
                            isListening={isListening}
                        />
                </motion.div>

                {/* Right Panel - Chat */}
                <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex-1 bg-white border border-neutral-200 rounded-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-neutral-200 p-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Tuki AI – Voice Chat
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"}`} />
                                        <span className="text-sm text-gray-600">
                                            Mic: {isListening ? "On" : "Off"}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowControls(!showControls)}
                                    className="border-neutral-200 text-gray-700"
                                >
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Audio Visualizer */}
                            <AudioVisualizer volume={volume} isActive={isListening} />
                        </div>

                        {/* Controls Panel */}
                        <AnimatePresence>
                            {showControls && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-b border-neutral-200 bg-gray-50 p-4"
                                >
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="text-gray-700 font-medium">Sensitivity</label>
                                            <Slider
                                                value={[sensitivity]}
                                                onValueChange={([value]) => setSensitivity(value)}
                                                max={1}
                                                min={0}
                                                step={0.05}
                                                className="mt-2"
                                            />
                                            <span className="text-xs text-gray-500">{sensitivity.toFixed(2)}</span>
                                        </div>

                                        <div>
                                            <label className="text-gray-700 font-medium">Smoothing</label>
                                            <Slider
                                                value={[smoothing]}
                                                onValueChange={([value]) => setSmoothing(value)}
                                                max={1}
                                                min={0}
                                                step={0.05}
                                                className="mt-2"
                                            />
                                            <span className="text-xs text-gray-500">{smoothing.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3">
                                        {["auto", "off", "always"].map((mode) => (
                                            <Button
                                                key={mode}
                                                variant={blinkMode === mode ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setBlinkMode(mode as any)}
                                                className="text-xs"
                                            >
                                                {mode}
                                            </Button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[80%] flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user" ? "bg-blue-600" : "bg-purple-600"
                                                }`}>
                                                {message.type === "user" ? (
                                                    <UserIcon className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Bot className="w-4 h-4 text-white" />
                                                )}
                                            </div>

                                            <div className={`rounded-2xl p-3 ${message.type === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-900 border border-neutral-200"
                                                }`}>
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <div className={`flex items-center gap-2 mt-2 text-xs ${message.type === "user" ? "text-white/70" : "text-gray-500"
                                                    }`}>
                                                    {message.isVoice && <Mic className="w-3 h-3" />}
                                                    <span>{message.timestamp.toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex justify-start"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-gray-100 rounded-2xl p-3 border border-neutral-200">
                                                <div className="flex gap-1">
                                                    <Circle className="w-2 h-2 fill-purple-600 text-purple-600 animate-bounce" />
                                                    <Circle className="w-2 h-2 fill-purple-600 text-purple-600 animate-bounce" style={{ animationDelay: "0.1s" }} />
                                                    <Circle className="w-2 h-2 fill-purple-600 text-purple-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-neutral-200 p-4 flex-shrink-0">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Textarea
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message or use the microphone..."
                                        className="min-h-[60px] max-h-32 resize-none border-neutral-200 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isTyping}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {/* Send Button */}
                                    <Button
                                        onClick={() => sendMessage(inputMessage)}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>

                                    {/* Microphone Toggle */}
                                    <Button
                                        onClick={toggleMicrophone}
                                        variant={isListening ? "destructive" : "outline"}
                                        className={`${isListening
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "border-neutral-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>

                                    {/* Reset Button */}
                                    <Button
                                        onClick={resetConversation}
                                        variant="outline"
                                        className="border-neutral-200 text-gray-700 hover:bg-gray-50"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Permission Warning */}
                            {!hasPermission && isListening && (
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium">Microphone access needed</p>
                                        <p>Please allow microphone access in your browser settings to use voice features.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}