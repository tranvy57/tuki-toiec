"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VocabularyCardProps } from "@/types/vocabulary";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VocabularyCard({ 
  vocabulary, 
  onPress, 
  variant = 'default' 
}: VocabularyCardProps) {
  const handlePress = () => {
    onPress?.(vocabulary);
  };

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={handlePress}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with word and pronunciation */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#ff776f]">{vocabulary.word}</h3>
            {vocabulary.pronunciation && (
              <p className="text-sm text-muted-foreground italic">
                {vocabulary.pronunciation}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {vocabulary.partOfSpeech}
            </Badge>
            {vocabulary.audioUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Meaning */}
        <p className="text-foreground leading-relaxed">{vocabulary.meaning}</p>

        {/* Example sentence (for detailed variant) */}
        {variant === 'detailed' && vocabulary.exampleEn && (
          <div className="mt-3 p-3 bg-secondary rounded-lg border-l-4 border-l-[#ff776f]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Example:
            </p>
            <p className="text-sm text-secondary-foreground italic leading-relaxed">
              {vocabulary.exampleEn}
            </p>
            {vocabulary.exampleVn && (
              <p className="text-sm text-muted-foreground mt-1">
                {vocabulary.exampleVn}
              </p>
            )}
          </div>
        )}

        {/* Learning indicator */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full" />
      </CardContent>
    </Card>
  );
}
