"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  BookOpen,
  Lightbulb,
  X,
  Check,
} from "lucide-react";
import { useGrammarCheck } from "@/hooks/useGrammarCheck";
import { applySuggestions, formatGrammarMatch } from "@/lib/grammar-check";
import type { GrammarMatch } from "@/types/grammar";

interface GrammarHighlightTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

interface GrammarMatchDisplayProps {
  match: GrammarMatch;
  index: number;
  onApplySuggestion: (index: number, replacement: string) => void;
  onIgnore: (index: number) => void;
}

const GrammarMatchDisplay: React.FC<GrammarMatchDisplayProps> = ({
  match,
  index,
  onApplySuggestion,
  onIgnore,
}) => {
  const formatted = formatGrammarMatch(match);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "misspelling":
        return "bg-red-100 text-red-700 border-red-200";
      case "grammar":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "style":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "typography":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 border rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs ${getTypeColor(formatted.type)}`}
            >
              {formatted.type}
            </Badge>
            <span className="text-xs text-gray-500">{formatted.category}</span>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed">
            {match.message}
          </p>

          {match.context && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">Context: </span>
              <span className="font-mono">
                {match.context.text.substring(0, match.context.offset)}
                <span className="bg-red-200 px-1 rounded">
                  {match.context.text.substring(
                    match.context.offset,
                    match.context.offset + match.context.length
                  )}
                </span>
                {match.context.text.substring(
                  match.context.offset + match.context.length
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => onIgnore(index)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {match.replacements && match.replacements.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Suggestions:
          </h5>
          <div className="flex flex-wrap gap-2">
            {match.replacements.slice(0, 3).map((replacement, replIndex) => (
              <Button
                key={replIndex}
                onClick={() => onApplySuggestion(index, replacement.value)}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              >
                <Check className="w-3 h-3 mr-1" />
                {replacement.value}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const GrammarHighlightTextarea: React.FC<GrammarHighlightTextareaProps> = ({
  value,
  onChange,
  placeholder = "Start typing to check grammar...",
  className = "",
  disabled = false,
  maxLength,
}) => {
  const { matches, loading, error, checkGrammar, clearResults } =
    useGrammarCheck(800);
  const [ignoredMatches, setIgnoredMatches] = useState<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter out ignored matches
  const visibleMatches = matches.filter(
    (_, index) => !ignoredMatches.has(index)
  );

  // Check grammar when value changes
  useEffect(() => {
    if (value && value.trim().length > 2) {
      checkGrammar(value);
    } else {
      clearResults();
    }
  }, [value, checkGrammar, clearResults]);

  const handleApplySuggestion = (matchIndex: number, replacement: string) => {
    const match = matches[matchIndex];
    if (!match) return;

    const newValue =
      value.substring(0, match.offset) +
      replacement +
      value.substring(match.offset + match.length);

    onChange(newValue);

    // Add to ignored matches to prevent showing it again
    setIgnoredMatches((prev) => new Set(prev.add(matchIndex)));
  };

  const handleIgnoreMatch = (matchIndex: number) => {
    setIgnoredMatches((prev) => new Set(prev.add(matchIndex)));
  };

  const handleRefreshCheck = () => {
    setIgnoredMatches(new Set());
    clearResults();
    if (value && value.trim().length > 2) {
      checkGrammar(value);
    }
  };

  const applyAllSuggestions = () => {
    if (!matches.length) return;

    const matchesToApply = matches
      .map((match, index) => ({ match, index }))
      .filter(({ index }) => !ignoredMatches.has(index))
      .filter(
        ({ match }) => match.replacements && match.replacements.length > 0
      );

    if (!matchesToApply.length) return;

    let newValue = value;

    // Sort by offset in descending order to avoid position shifting
    matchesToApply
      .sort((a, b) => b.match.offset - a.match.offset)
      .forEach(({ match }) => {
        const replacement = match.replacements[0].value;
        newValue =
          newValue.substring(0, match.offset) +
          replacement +
          newValue.substring(match.offset + match.length);
      });

    onChange(newValue);
    setIgnoredMatches(new Set());
  };

  const getGrammarScore = () => {
    if (!value || value.trim().length < 10) return null;

    const totalWords = value.trim().split(/\s+/).length;
    const errorCount = visibleMatches.length;
    const score = Math.max(
      0,
      Math.min(100, 100 - (errorCount / totalWords) * 20)
    );

    return Math.round(score);
  };

  const grammarScore = getGrammarScore();

  return (
    <div className="space-y-4">
      {/* Grammar Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : visibleMatches.length === 0 && value.length > 10 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : visibleMatches.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            ) : null}

            <span className="text-sm font-medium text-gray-700">
              {loading
                ? "Checking grammar..."
                : visibleMatches.length === 0 && value.length > 10
                ? "No issues found"
                : visibleMatches.length > 0
                ? `${visibleMatches.length} issue${
                    visibleMatches.length > 1 ? "s" : ""
                  } found`
                : "Grammar Check"}
            </span>
          </div>

          {grammarScore !== null && (
            <Badge
              variant="outline"
              className={`${
                grammarScore >= 90
                  ? "bg-green-50 text-green-700 border-green-200"
                  : grammarScore >= 70
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              Score: {grammarScore}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {visibleMatches.length > 0 && (
            <Button
              onClick={applyAllSuggestions}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Apply All
            </Button>
          )}

          <Button
            onClick={handleRefreshCheck}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[200px] resize-none ${className} ${
            visibleMatches.length > 0
              ? "border-yellow-300 focus:border-yellow-400"
              : ""
          }`}
          disabled={disabled}
          maxLength={maxLength}
        />

        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">
              Grammar check failed: {error}
            </span>
          </div>
        </motion.div>
      )}

      {/* Grammar Issues */}
      <AnimatePresence mode="popLayout">
        {visibleMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <h4 className="font-medium text-gray-800">
                Grammar & Style Issues
              </h4>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {visibleMatches.map((match, index) => (
                <GrammarMatchDisplay
                  key={`${match.offset}-${match.length}-${index}`}
                  match={match}
                  index={matches.indexOf(match)}
                  onApplySuggestion={handleApplySuggestion}
                  onIgnore={handleIgnoreMatch}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrammarHighlightTextarea;
