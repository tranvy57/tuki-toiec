import { Button } from "@/components/ui/button";
import { Volume2, Eye, ArrowRight } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { playAudio } from "@/utils/vocabularyUtils";

interface FlashcardSessionProps {
  currentWord: WeakVocabulary;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
  isLastCard: boolean;
}

export default function FlashcardSession({
  currentWord,
  showAnswer,
  onShowAnswer,
  onNext,
  isLastCard,
}: FlashcardSessionProps) {
  return (
    <div className="space-y-6">
      <div className="text-4xl font-bold text-gray-800">
        {currentWord.word}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => playAudio(currentWord.audioUrl)}
          className="rounded-full"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Phát âm
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {currentWord.pronunciation}
      </div>

      {!showAnswer && (
        <Button
          onClick={onShowAnswer}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Hiện đáp án
        </Button>
      )}

      {showAnswer && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-800 mb-2">
              [{currentWord.partOfSpeech}] {currentWord.meaning}
            </div>
            <div className="text-sm text-blue-700 mb-2">
              <strong>Ví dụ:</strong> {currentWord.exampleEn}
            </div>
            <div className="text-sm text-blue-600">
              <strong>Dịch:</strong> {currentWord.exampleVn}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {isLastCard ? "Hoàn thành" : "Từ tiếp theo"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

