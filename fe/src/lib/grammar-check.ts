import type {
  GrammarResponse,
  GrammarCheckOptions,
  GrammarCheckError,
} from "@/types/grammar";

/**
 * Grammar check function using LanguageTool API
 * Sends a POST request to check grammar and spelling
 */
export async function checkGrammarWithLanguageTool(
  options: GrammarCheckOptions
): Promise<GrammarResponse> {
  const {
    text,
    language = "en-US",
    enabledOnly = false,
    level = "default",
    enabledRules,
    disabledRules,
  } = options;

  // Validate input
  if (!text || text.trim().length === 0) {
    return {
      matches: [],
      language: {
        name: "English (US)",
        code: "en-US",
        detectedLanguage: {
          name: "English (US)",
          code: "en-US",
          confidence: 1,
        },
      },
      software: {
        name: "LanguageTool",
        version: "6.0",
        buildDate: "",
        apiVersion: 1,
        premium: false,
      },
    };
  }

  try {
    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("text", text);
    formData.append("language", language);
    formData.append("enabledOnly", enabledOnly.toString());
    formData.append("level", level);

    if (enabledRules) {
      formData.append("enabledRules", enabledRules);
    }

    if (disabledRules) {
      formData.append("disabledRules", disabledRules);
    }

    console.log("🔍 Checking grammar with LanguageTool...", {
      textLength: text.length,
      language,
      enabledOnly,
      level,
    });

    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ LanguageTool API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      const error: GrammarCheckError = {
        message: `Grammar check failed: ${response.statusText}`,
        status: response.status,
        code: "API_ERROR",
      };
      throw error;
    }

    const result: GrammarResponse = await response.json();

    console.log("✅ Grammar check completed:", {
      matchesFound: result.matches.length,
      detectedLanguage: result.language.detectedLanguage.name,
    });

    return result;
  } catch (error) {
    console.error("❌ Grammar check error:", error);

    if (error instanceof Error) {
      const grammarError: GrammarCheckError = {
        message: error.message,
        code: "NETWORK_ERROR",
      };
      throw grammarError;
    }

    throw error;
  }
}

/**
 * Simplified grammar check function for quick usage
 */
export async function checkGrammar(
  text: string,
  language = "en-US"
): Promise<GrammarResponse> {
  return checkGrammarWithLanguageTool({ text, language });
}

/**
 * Helper function to format grammar matches for display
 */
export function formatGrammarMatch(match: any) {
  return {
    message: match.message,
    suggestion: match.replacements?.[0]?.value || "",
    position: {
      start: match.offset,
      end: match.offset + match.length,
    },
    type: match.rule?.issueType || "grammar",
    category: match.rule?.category?.name || "General",
    ruleId: match.rule?.id || "unknown",
  };
}

/**
 * Helper function to get error-free text by applying suggestions
 */
export function applySuggestions(
  originalText: string,
  matches: any[],
  selectedMatches: number[]
): string {
  if (!matches.length || !selectedMatches.length) return originalText;

  // Sort matches by offset in descending order to avoid position shifting
  const sortedMatches = matches
    .filter((_, index) => selectedMatches.includes(index))
    .sort((a, b) => b.offset - a.offset);

  let correctedText = originalText;

  for (const match of sortedMatches) {
    if (match.replacements && match.replacements.length > 0) {
      const replacement = match.replacements[0].value;
      const start = match.offset;
      const end = match.offset + match.length;

      correctedText =
        correctedText.substring(0, start) +
        replacement +
        correctedText.substring(end);
    }
  }

  return correctedText;
}
