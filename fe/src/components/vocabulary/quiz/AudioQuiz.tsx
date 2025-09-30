import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { playAudio, generateQuizOptions } from "@/utils/vocabularyUtils";

interface AudioQuizProps {
  word: WeakVocabulary;
  allVocabularies: WeakVocabulary[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  isCompleted: boolean;
}

export default function AudioQuiz({
  word,
  allVocabularies,
  selectedOption,
  onSelectOption,
  isCompleted,
}: AudioQuizProps) {
  const audioOptions = generateQuizOptions(
    word.word,
    allVocabularies.map((v) => ({ ...v, meaning: v.word }))
  ).slice(0, 4);

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">
        Nghe audio và chọn từ đúng:
      </p>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => playAudio(word.audioUrl)}
          className="rounded-full"
        >
          <Volume2 className="h-5 w-5 mr-2" />
          Phát lại
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {audioOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(option)}
            disabled={isCompleted}
            className={`p-3 text-center rounded-lg border transition-colors font-medium ${
              isCompleted
                ? option === word.word
                  ? "bg-green-50 border-green-300 text-green-700"
                  : option === selectedOption && option !== word.word
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
                : selectedOption === option
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

