import { WeakVocabulary } from "@/types/implements/vocabulary";

interface MultipleChoiceQuizProps {
  word: WeakVocabulary;
  options: string[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  isCompleted: boolean;
}

export default function MultipleChoiceQuiz({
  word,
  options,
  selectedOption,
  onSelectOption,
  isCompleted,
}: MultipleChoiceQuizProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">
        Nghĩa của từ "<strong>{word.word}</strong>" là gì?
      </p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(option)}
            disabled={isCompleted}
            className={`w-full p-3 text-left rounded-lg border transition-colors ${
              isCompleted
                ? option === word.meaning
                  ? "bg-green-50 border-green-300 text-green-700"
                  : option === selectedOption && option !== word.meaning
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
                : selectedOption === option
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

