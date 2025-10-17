// TypeScript types for LanguageTool API

export interface GrammarMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: Array<{
    value: string;
    shortDescription?: string;
  }>;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence?: string;
  type: {
    typeName: string;
  };
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
  ignoreForIncompleteSentence?: boolean;
  contextForSureMatch?: number;
}

export interface GrammarResponse {
  matches: GrammarMatch[];
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
      confidence: number;
    };
  };
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    premium: boolean;
    premiumHint?: string;
    status?: string;
  };
  warnings?: {
    incompleteResults: boolean;
  };
}

export interface GrammarCheckOptions {
  text: string;
  language?: string;
  enabledOnly?: boolean;
  level?: "default" | "picky";
  enabledRules?: string;
  disabledRules?: string;
}

export interface UseGrammarCheckReturn {
  matches: GrammarMatch[];
  loading: boolean;
  error: string | null;
  checkGrammar: (text: string) => Promise<void>;
  clearResults: () => void;
}

export interface GrammarCheckError {
  message: string;
  status?: number;
  code?: string;
}
