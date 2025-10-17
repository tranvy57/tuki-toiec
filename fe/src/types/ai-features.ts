// ==== Generate Email Types ====
export interface GenerateEmailRequest {
  purpose: string;
  tone: "formal" | "semi-formal" | "friendly" | "urgent";
  recipient: string;
  mainPoints: string[];
  context?: string;
  length?: "short" | "medium" | "long";
}

export interface GenerateEmailResponse {
  subject: string;
  body: string;
  keyPhrases: string[];
  suggestions: string[];
  toneAnalysis: string;
}

// ==== Evaluate Email Types ====
export interface EvaluateEmailRequest {
  subject: string;
  body: string;
  purpose?: string;
  targetRecipient?: string;
}

export interface EvaluateEmailResponse {
  overallScore: number;
  breakdown: {
    clarity: number;
    tone: number;
    grammar: number;
    vocabulary: number;
    structure: number;
    professionalism: number;
  };
  strengths: string[];
  weaknesses: string[];
  grammarErrors: Array<{
    error: string;
    correction: string;
    explanation: string;
  }>;
  vocabularyFeedback: string[];
  improvementSuggestions: string[];
  rewrittenVersion?: string;
}

// ==== Evaluate Image Description Types ====
export interface EvaluateImageDescriptionRequest {
  description: string;
  imageUrl?: string;
  expectedElements?: string[];
  descriptionType?: "basic" | "detailed" | "analytical";
}

export interface EvaluateImageDescriptionResponse {
  overallScore: number;
  breakdown: {
    completeness: number;
    accuracy: number;
    vocabulary: number;
    grammar: number;
    organization: number;
    creativity: number;
  };
  strengths: string[];
  weaknesses: string[];
  missingElements: string[];
  vocabularyFeedback: {
    goodChoices: string[];
    improvements: Array<{
      original: string;
      suggested: string;
      reason: string;
    }>;
  };
  grammarErrors: Array<{
    error: string;
    correction: string;
    explanation: string;
  }>;
  improvementSuggestions: string[];
  sampleImprovedDescription: string;
}

// ==== Evaluate Opinion Essay Types ====
export interface EvaluateOpinionEssayRequest {
  essay: string;
  topic: string;
  requiredLength?: number;
  timeLimit?: number;
  essayType?:
    | "agree-disagree"
    | "opinion"
    | "problem-solution"
    | "advantages-disadvantages";
}

export interface EvaluateOpinionEssayResponse {
  overallScore: number;
  breakdown: {
    taskResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
    grammaticalAccuracy: number;
    ideaDevelopment: number;
  };
  strengths: string[];
  weaknesses: string[];
  structureAnalysis: {
    introduction: {
      score: number;
      feedback: string;
    };
    bodyParagraphs: Array<{
      paragraph: number;
      score: number;
      feedback: string;
      mainIdea: string;
      supportingDetails: string[];
    }>;
    conclusion: {
      score: number;
      feedback: string;
    };
  };
  vocabularyAnalysis: {
    range: number;
    accuracy: number;
    sophistication: number;
    improvements: Array<{
      original: string;
      suggested: string;
      reason: string;
    }>;
  };
  grammarAnalysis: {
    errors: Array<{
      type: string;
      error: string;
      correction: string;
      explanation: string;
    }>;
    sentenceVariety: number;
    complexity: number;
  };
  argumentAnalysis: {
    clarity: number;
    logic: number;
    support: number;
    counterarguments: boolean;
  };
  improvementSuggestions: string[];
  sampleImprovedParagraph?: string;
  estimatedTOEICWritingScore: number;
}

// ==== API Error Response ====
export interface AIApiErrorResponse {
  error: string;
}

// ==== Common Evaluation Breakdown ====
export interface EvaluationBreakdown {
  [key: string]: number;
}

// ==== Grammar Error Interface ====
export interface GrammarError {
  error: string;
  correction: string;
  explanation: string;
  type?: string;
}

// ==== Vocabulary Improvement Interface ====
export interface VocabularyImprovement {
  original: string;
  suggested: string;
  reason: string;
}
