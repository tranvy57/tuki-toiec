import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { playAudio, generateQuizOptions } from "@/utils/vocabularyUtils";
import { Input } from "@/components/ui/input";

interface AudioQuizProps {
  answer: string;
  word: any;
  onAnswerChange: (answer: string) => void;
  isCompleted: boolean;
}

export default function AudioQuiz({
  word,
  answer,
  isCompleted,
  onAnswerChange,
}: AudioQuizProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">Nghe audio và nhập từ đúng:</p>
      <div className="flex justify-center flex-col gap-4">
        <Button
          variant="outline"
          onClick={() => playAudio(word.audioUrl)}
          className="rounded-full mx-auto mb-2"
        >
          <Volume2 className="h-5 w-5 mr-2" />
          Phát lại
        </Button>

        <Input
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Nhập từ..."
          className="text-center text-lg"
          disabled={isCompleted}
        />
      </div>
      <div className="grid grid-cols-2 gap-2"></div>
    </div>
  );
}
