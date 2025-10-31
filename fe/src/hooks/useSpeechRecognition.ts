import { useState, useEffect, useCallback, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition as useBaseSpeechRecognition,
} from "react-speech-recognition";
import { diffWords } from "diff";

export interface ErrorSegment {
  word: string;
  status: "correct" | "mispronounced" | "missing" | "extra";
  similarity?: number;
  position?: number;
  suggestion?: string;
}

export interface SpeechAnalysisResult {
  score: number;
  fluency: number;
  accuracy: number;
  recognized_text: string;
  error_segments: ErrorSegment[];
  feedback: string;
  words_correct: number;
  words_total: number;
  words_missing: number;
  words_extra: number;
}

export interface UseSpeechRecognitionProps {
  expectedText?: string;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onRealTimeAnalysis?: (analysis: SpeechAnalysisResult) => void;
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Helper function to calculate similarity between two words
function calculateWordSimilarity(word1: string, word2: string): number {
  const distance = levenshteinDistance(
    word1.toLowerCase(),
    word2.toLowerCase()
  );
  const maxLength = Math.max(word1.length, word2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// Helper function to normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

// Helper function to split text into words
function getWords(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 0);
}

export function useSpeechRecognition({
  expectedText = "",
  language = "en-US",
  continuous = true,
  interimResults = true,
  onRealTimeAnalysis,
}: UseSpeechRecognitionProps = {}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useBaseSpeechRecognition();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<SpeechAnalysisResult | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  // Check browser support on mount
  useEffect(() => {
    setIsSupported(browserSupportsSpeechRecognition && isMicrophoneAvailable);
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Analyze text comparison and generate error segments with position tracking
  const analyzeText = useCallback(
    (recognizedText: string, expectedText: string): SpeechAnalysisResult => {
      const expectedWords = getWords(expectedText);
      const recognizedWords = getWords(recognizedText);

      const errorSegments: ErrorSegment[] = [];
      let wordsCorrect = 0;
      let wordsMissing = 0;
      let wordsExtra = 0;

      // Initialize all expected words with their positions
      expectedWords.forEach((word, index) => {
        errorSegments.push({
          word,
          status: "missing", // Start as missing, will update if found
          position: index,
          similarity: 0,
          suggestion: `Missing word: "${word}"`,
        });
      });

      // Track which expected positions have been matched
      const matchedPositions = new Set<number>();

      // Process recognized words in order
      for (let recIndex = 0; recIndex < recognizedWords.length; recIndex++) {
        const recognizedWord = recognizedWords[recIndex];
        let bestMatch = { position: -1, similarity: 0, word: "" };

        // Find best match in expected words starting from current position
        for (
          let expIndex = recIndex;
          expIndex < Math.min(expectedWords.length, recIndex + 3);
          expIndex++
        ) {
          if (matchedPositions.has(expIndex)) continue;

          const expectedWord = expectedWords[expIndex];
          const similarity = calculateWordSimilarity(
            recognizedWord,
            expectedWord
          );

          if (similarity > bestMatch.similarity) {
            bestMatch = { position: expIndex, similarity, word: expectedWord };
          }
        }

        // If we found a good match
        if (bestMatch.similarity >= 0.6 && bestMatch.position !== -1) {
          matchedPositions.add(bestMatch.position);

          if (bestMatch.similarity >= 0.8) {
            // Correct pronunciation
            errorSegments[bestMatch.position] = {
              word: bestMatch.word,
              status: "correct",
              position: bestMatch.position,
              similarity: bestMatch.similarity,
            };
            wordsCorrect++;
          } else {
            // Mispronounced but recognizable
            errorSegments[bestMatch.position] = {
              word: recognizedWord,
              status: "mispronounced",
              position: bestMatch.position,
              similarity: bestMatch.similarity,
              suggestion: `Did you mean "${bestMatch.word}"?`,
            };
          }
        } else {
          // Extra word - add at the end
          errorSegments.push({
            word: recognizedWord,
            status: "extra",
            position: expectedWords.length + wordsExtra,
            similarity: 0,
          });
          wordsExtra++;
        }
      }

      // Count missing words
      wordsMissing = errorSegments.filter(
        (seg) => seg.status === "missing"
      ).length; // Calculate metrics
      const wordsTotal = expectedWords.length;
      const accuracy = wordsTotal > 0 ? wordsCorrect / wordsTotal : 0;

      // Calculate fluency based on speech rhythm and completeness
      const completeness =
        wordsTotal > 0
          ? (wordsCorrect + (wordsTotal - wordsCorrect - wordsMissing)) /
            wordsTotal
          : 0;
      const fluency = Math.max(0, completeness - wordsExtra * 0.1);

      // Overall score calculation
      const score = Math.round((accuracy * 0.7 + fluency * 0.3) * 100);

      // Generate feedback message
      let feedback = "";
      if (score >= 90) {
        feedback = "Excellent pronunciation! Very clear and accurate.";
      } else if (score >= 80) {
        feedback = "Good pronunciation with minor issues.";
      } else if (score >= 70) {
        feedback = "Fair pronunciation. Focus on clarity.";
      } else {
        feedback = "Needs improvement. Practice slowly and clearly.";
      }

      if (wordsMissing > 0) {
        feedback += ` You missed ${wordsMissing} word(s).`;
      }
      if (wordsExtra > 0) {
        feedback += ` You added ${wordsExtra} extra word(s).`;
      }

      const mispronounced = errorSegments.filter(
        (seg) => seg.status === "mispronounced"
      ).length;
      if (mispronounced > 0) {
        feedback += ` ${mispronounced} word(s) may need clearer pronunciation.`;
      }

      return {
        score,
        fluency,
        accuracy,
        recognized_text: recognizedText,
        error_segments: errorSegments,
        feedback,
        words_correct: wordsCorrect,
        words_total: wordsTotal,
        words_missing: wordsMissing,
        words_extra: wordsExtra,
      };
    },
    []
  );

  // Real-time analysis effect
  useEffect(() => {
    if (!expectedText || !transcript) return;

    // Debounce analysis to avoid too frequent updates
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      setIsAnalyzing(true);

      try {
        const analysis = analyzeText(transcript, expectedText);
        setCurrentAnalysis(analysis);
        onRealTimeAnalysis?.(analysis);
      } catch (error) {
        console.error("Speech analysis error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [transcript, expectedText, analyzeText, onRealTimeAnalysis]);

  // Start listening function
  const startListening = useCallback(() => {
    if (!isSupported) {
      console.error("Speech recognition not supported");
      return;
    }

    resetTranscript();
    setCurrentAnalysis(null);

    SpeechRecognition.startListening({
      continuous,
      language,
      interimResults,
    });
  }, [isSupported, resetTranscript, continuous, language, interimResults]);

  // Stop listening function
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  // Reset function
  const reset = useCallback(() => {
    resetTranscript();
    setCurrentAnalysis(null);
    setIsAnalyzing(false);
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
  }, [resetTranscript]);

  // Get final analysis
  const getFinalAnalysis = useCallback(() => {
    if (!expectedText || !transcript) return null;
    return analyzeText(transcript, expectedText);
  }, [transcript, expectedText, analyzeText]);

  return {
    // Speech recognition state
    transcript,
    listening,
    isSupported,

    // Analysis state
    isAnalyzing,
    currentAnalysis,

    // Control functions
    startListening,
    stopListening,
    reset,
    getFinalAnalysis,

    // Utility functions
    analyzeText,
  };
}
