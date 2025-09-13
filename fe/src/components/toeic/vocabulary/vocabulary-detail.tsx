"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VocabularyDetailProps } from "@/types/vocabulary";
import { 
  Volume2, 
  Heart, 
  X,
  BookOpen 
} from "lucide-react";

export function VocabularyDetail({
  vocabulary,
  onClose,
  onPlayAudio,
  onAddToFavorites,
  isFavorite
}: VocabularyDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Vocabulary Detail</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Word Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-3xl font-bold text-[#ff776f]">
                {vocabulary.word}
              </h1>
              <div className="flex items-center gap-2">
                {vocabulary.audioUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPlayAudio}
                    className="h-8 w-8 p-0"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  onClick={onAddToFavorites}
                  className="h-8 w-8 p-0"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              {vocabulary.pronunciation && (
                <span className="text-lg text-muted-foreground italic">
                  {vocabulary.pronunciation}
                </span>
              )}
              <Badge variant="outline">
                {vocabulary.partOfSpeech}
              </Badge>
            </div>
          </div>

          {/* Meaning */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#ff776f]" />
              Meaning
            </h3>
            <p className="text-foreground leading-relaxed text-lg">
              {vocabulary.meaning}
            </p>
          </div>

          {/* Examples */}
          {(vocabulary.exampleEn || vocabulary.exampleVn) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Examples</h3>
              
              {vocabulary.exampleEn && (
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-l-[#ff776f]">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    English:
                  </p>
                  <p className="text-secondary-foreground italic leading-relaxed">
                    {vocabulary.exampleEn}
                  </p>
                </div>
              )}
              
              {vocabulary.exampleVn && (
                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Vietnamese:
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {vocabulary.exampleVn}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-[#ff776f] hover:bg-[#e55a52]"
              onClick={() => {
                // TODO: Mark as learned
                console.log('Mark as learned:', vocabulary.word);
              }}
            >
              Mark as Learned
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // TODO: Practice this word
                console.log('Practice word:', vocabulary.word);
              }}
            >
              Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
