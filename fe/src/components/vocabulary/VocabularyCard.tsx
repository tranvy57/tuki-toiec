import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Star } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { getWeaknessColor, getWeaknessLabel, playAudio } from "@/utils/vocabularyUtils";

interface VocabularyCardProps {
  vocabulary: WeakVocabulary;
  onToggleMarkForReview: (id: string) => void;
}

export default function VocabularyCard({
  vocabulary,
  onToggleMarkForReview,
}: VocabularyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {vocabulary.word}
              </h3>
              <span className="text-sm text-muted-foreground">
                {vocabulary.pronunciation}
              </span>
              <Badge className={getWeaknessColor(vocabulary.weaknessLevel)}>
                {getWeaknessLabel(vocabulary.weaknessLevel)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {vocabulary.mistakeCount} lỗi
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">
                  [{vocabulary.partOfSpeech}]
                </span>{" "}
                {vocabulary.meaning}
              </p>
              <div className="text-sm text-muted-foreground">
                <div>
                  <strong>Ví dụ:</strong> {vocabulary.exampleEn}
                </div>
                <div>
                  <strong>Dịch:</strong> {vocabulary.exampleVn}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Ôn tập lần cuối:{" "}
              {new Date(vocabulary.lastReviewDate).toLocaleDateString("vi-VN")}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAudio(vocabulary.audioUrl)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>

            <Button
              variant={vocabulary.isMarkedForReview ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleMarkForReview(vocabulary.id)}
              className={
                vocabulary.isMarkedForReview
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              <Star
                className={`h-4 w-4 ${
                  vocabulary.isMarkedForReview ? "fill-current" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

