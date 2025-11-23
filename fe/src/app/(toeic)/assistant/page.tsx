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
    Circle,
    Volume2,
    Eye,
    EyeOff,
    Play,
    Pause,
    ArrowDown
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Spline from "@splinetool/react-spline";
import { useTTS } from "@/hooks/use-tts";
import { useChatMessage, generateChatId, DEFAULT_USER_ID } from "@/api/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

// Types
interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
    isVoice?: boolean;
    isVisible?: boolean;
    isPlaying?: boolean;
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
    const [autoScroll, setAutoScroll] = useState(false); // Disable auto scroll by default
    const [chatId] = useState(() => generateChatId()); // Generate unique chat ID

    // Chat API hook
    const chatMutation = useChatMessage();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { volume, isListening, hasPermission, toggleMicrophone } = useAudio();
    const { play: playTTS, stop: stopTTS } = useTTS();

    // Speech recognition for voice input
    const {
        transcript,
        listening: speechListening,
        isSupported: speechSupported,
        startListening: startSpeechListening,
        stopListening: stopSpeechListening,
        reset: resetSpeechRecognition
    } = useSpeechRecognition({
        language: "en-US",
        continuous: false,
        interimResults: true
    });

    // Auto scroll to bottom only when enabled and new messages are added
    const prevMessagesLengthRef = useRef(messages.length);
    useEffect(() => {
        // Only scroll if auto-scroll is enabled and new messages were added
        if (autoScroll && messages.length > prevMessagesLengthRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });
            }, 100); // Small delay to let DOM update
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages, autoScroll]);

    // Initial greeting
    useEffect(() => {
        const greetingText = "Hello! I'm Tuki AI, your voice chat assistant. Feel free to speak to me or type your message. How can I help you today?";
        const greeting: Message = {
            id: "greeting",
            type: "ai",
            content: greetingText,
            timestamp: new Date(),
            isVisible: true, // Make greeting visible by default
            isPlaying: false
        };
        setMessages([greeting]);

        // Don't auto-play greeting - let user decide
        // setTimeout(() => {
        //     playTTS(greetingText);
        // }, 1000);
    }, []);

    // Auto-update input when speech recognition provides transcript
    useEffect(() => {
        if (transcript && speechListening) {
            setInputMessage(transcript);
        }
    }, [transcript, speechListening]);

    // Auto-send message when speech recognition ends with content
    useEffect(() => {
        if (!speechListening && transcript.trim() && transcript !== inputMessage) {
            setInputMessage(transcript);
            // Auto-send after a short delay to allow user to see the transcript
            setTimeout(() => {
                if (transcript.trim()) {
                    sendMessage(transcript, true); // Mark as voice message
                    resetSpeechRecognition();
                }
            }, 1000);
        }
    }, [speechListening, transcript, inputMessage]);

    const sendMessage = async (content: string, isVoice: boolean = false) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content,
            timestamp: new Date(),
            isVoice,
            isVisible: true,
            isPlaying: false
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");

        // Show typing indicator
        setIsTyping(true);

        try {
            // Call real chat API
            const response = await chatMutation.mutateAsync({
                chat_id: chatId,
                user_input: content,
                user_id: DEFAULT_USER_ID
            });

            const aiResponseContent = response.data.result;
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: aiResponseContent,
                timestamp: new Date(),
                isVisible: false,
                isPlaying: false
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);

            // Auto-play AI message with improved teacher voice
            setTimeout(() => {
                playMessageVoice(aiResponse.id, aiResponseContent);
            }, 500);
        } catch (error) {
            console.error('Chat API error:', error);
            setIsTyping(false);

            // Fallback response on error
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date(),
                isVisible: false,
                isPlaying: false
            };

            setMessages(prev => [...prev, errorResponse]);
            toast.error("Failed to send message. Please try again.");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputMessage);
        }
    };

    // Voice input handlers
    const startVoiceInput = () => {
        if (!speechSupported) {
            toast.error("Speech recognition is not supported in your browser.");
            return;
        }

        resetSpeechRecognition();
        setInputMessage("");
        startSpeechListening();
        toast.info("Listening... Speak now!");
    };

    const stopVoiceInput = () => {
        stopSpeechListening();
        toast.success("Voice input stopped");
    };

    const toggleVoiceInput = () => {
        if (speechListening) {
            stopVoiceInput();
        } else {
            startVoiceInput();
        }
    };

    const resetConversation = () => {
        setMessages([{
            id: "greeting",
            type: "ai",
            content: "Hello! I'm Tuki AI, your voice chat assistant. Feel free to speak to me or type your message. How can I help you today?",
            timestamp: new Date(),
            isVisible: false,
            isPlaying: false
        }]);
        toast.success("Conversation reset");
    };

    const toggleMessageVisibility = (messageId: string) => {
        setMessages(prev => {
            const newMessages = prev.map(msg =>
                msg.id === messageId ? { ...msg, isVisible: !msg.isVisible } : msg
            );
            // Don't trigger scroll on visibility toggle
            prevMessagesLengthRef.current = newMessages.length;
            return newMessages;
        });
    };

    const playMessageVoice = (messageId: string, content: string) => {
        setMessages(prev => {
            const newMessages = prev.map(msg =>
                msg.id === messageId ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
            );
            // Don't trigger scroll on play state change
            prevMessagesLengthRef.current = newMessages.length;
            return newMessages;
        });

        playTTS(content);

        // Reset playing state after some time (approximate TTS duration)
        setTimeout(() => {
            setMessages(prev => {
                const newMessages = prev.map(msg =>
                    msg.id === messageId ? { ...msg, isPlaying: false } : msg
                );
                // Don't trigger scroll on play state change
                prevMessagesLengthRef.current = newMessages.length;
                return newMessages;
            });
        }, content.length * 100); // Rough estimate: 100ms per character
    };

    const stopMessageVoice = () => {
        stopTTS();
        setMessages(prev => {
            const newMessages = prev.map(msg => ({ ...msg, isPlaying: false }));
            // Don't trigger scroll on stop
            prevMessagesLengthRef.current = newMessages.length;
            return newMessages;
        });
    };

    // Manual scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        });
    };

    return (
        <div className=" bg-white max-h-[calc(100vh-72px)]">
            <div className="container mx-auto p-4 h-[calc(100vh-72px)] flex flex-col lg:flex-row gap-4 w-7xl">
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
                    className="flex flex-col w-7xl"
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

                                    {/* Auto-scroll toggle */}
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-gray-700 font-medium text-sm">Auto-scroll</label>
                                            <Button
                                                variant={autoScroll ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setAutoScroll(!autoScroll)}
                                                className="text-xs"
                                            >
                                                {autoScroll ? "ON" : "OFF"}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {autoScroll ? "Messages will auto-scroll to bottom" : "Stay at current position"}
                                        </p>
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

                                            <div className="space-y-2">
                                                {/* Message bubble with controls */}
                                                <div className={`rounded-2xl p-3 ${message.type === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-900 border border-neutral-200"
                                                    }`}>

                                                    {/* Message content - conditional visibility */}
                                                    <AnimatePresence>
                                                        {message.isVisible && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Controls row */}
                                                    <div className={`flex items-center justify-between gap-2 ${message.isVisible ? 'mt-2' : ''} text-xs ${message.type === "user" ? "text-white/70" : "text-gray-500"
                                                        }`}>
                                                        <div className="flex items-center gap-2">
                                                            {message.isVoice && <Mic className="w-3 h-3" />}
                                                            <span>{message.timestamp.toLocaleTimeString()}</span>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            {/* Voice play/pause button */}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    message.isPlaying ? stopMessageVoice() : playMessageVoice(message.id, message.content);
                                                                }}
                                                                className={`h-6 w-6 p-0 ${message.type === "user"
                                                                    ? "hover:bg-white/20 text-white/70 hover:text-white"
                                                                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                                                                    }`}
                                                            >
                                                                {message.isPlaying ? (
                                                                    <Pause className="w-3 h-3" />
                                                                ) : (
                                                                    <Volume2 className="w-3 h-3" />
                                                                )}
                                                            </Button>

                                                            {/* Show/hide message button */}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleMessageVisibility(message.id);
                                                                }}
                                                                className={`h-6 w-6 p-0 ${message.type === "user"
                                                                    ? "hover:bg-white/20 text-white/70 hover:text-white"
                                                                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                                                                    }`}
                                                            >
                                                                {message.isVisible ? (
                                                                    <EyeOff className="w-3 h-3" />
                                                                ) : (
                                                                    <Eye className="w-3 h-3" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
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
                                        placeholder={speechSupported
                                            ? "Type your message or click the microphone to speak..."
                                            : "Type your message..."}
                                        className="min-h-[60px] max-h-32 resize-none border-neutral-200 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isTyping}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {/* Scroll to Bottom Button */}
                                    <Button
                                        onClick={scrollToBottom}
                                        variant="outline"
                                        size="sm"
                                        className="border-neutral-200 text-gray-700 hover:bg-gray-50"
                                        title="Scroll to bottom"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>

                                    {/* Send Button */}
                                    <Button
                                        onClick={() => sendMessage(inputMessage)}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>

                                    {/* Voice Input Button */}
                                    <Button
                                        onClick={toggleVoiceInput}
                                        variant={speechListening ? "destructive" : "outline"}
                                        className={`${speechListening
                                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                            : "border-neutral-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        disabled={isTyping || !speechSupported}
                                        title={speechListening ? "Stop voice input" : "Start voice input"}
                                    >
                                        {speechListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>

                                    {/* Audio Visualization Toggle (Original Microphone) */}
                                    <Button
                                        onClick={toggleMicrophone}
                                        variant={isListening ? "destructive" : "outline"}
                                        className={`${isListening
                                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                                            : "border-neutral-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        title={isListening ? "Stop audio visualization" : "Start audio visualization"}
                                    >
                                        {isListening ? <Volume2 className="w-4 h-4" /> : <Volume2 className="w-4 h-4 opacity-50" />}
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

                            {/* Speech Recognition Status */}
                            {speechListening && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Mic className="w-4 h-4 text-red-600" />
                                    </motion.div>
                                    <div className="text-sm text-red-800">
                                        <p className="font-medium">Listening for speech...</p>
                                        {transcript && (
                                            <p className="text-red-600 mt-1">"{transcript}"</p>
                                        )}
                                    </div>
                                </div>
                            )}

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