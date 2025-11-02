import { WeakVocabulary } from "@/types/implements/vocabulary";

interface MultipleChoiceQuizProps {
  word: any;
  options: { key: string; value: string }[];
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
  console.log("word", word);

  console.log("options", options);

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">{word?.content?.question}</p>
      <div className="space-y-2">
        {options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(option.key)}
            disabled={isCompleted}
            className={`w-full p-3 text-left rounded-lg border transition-colors ${
              isCompleted
                ? option.value === word.meaning
                  ? "bg-green-50 border-green-300 text-green-700"
                  : option.value === selectedOption &&
                    option.value !== word.meaning
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
                : selectedOption === option.value
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium mr-2">{option.key}.</span>
            {option.value}
          </button>
        ))}
      </div>
    </div>
  );
}
