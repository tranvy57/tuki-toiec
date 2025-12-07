import { WeakVocabulary } from "@/types/implements/vocabulary";

interface MultipleChoiceQuizProps {
  word: any;
  options: string[]; // Changed from { key: string; value: string }[] to string[] to match generateQuizOptions
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
      <div className="text-center space-y-2">
        <p className="text-gray-600">Từ này có nghĩa là gì?</p>
        <h3 className="text-2xl font-bold text-indigo-700">{word?.word}</h3>
        {word?.pronunciation && (
           <p className="text-sm text-gray-500">{word.pronunciation}</p>
        )}
      </div>
      
      <div className="space-y-2 mt-6">
        {options?.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          return (
            <button
              key={index}
              onClick={() => onSelectOption(option)}
              disabled={isCompleted}
              className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                isCompleted
                  ? option === word.meaning
                    ? "bg-green-50 border-green-300 text-green-700"
                    : option === selectedOption && option !== word.meaning
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                  : selectedOption === option
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span className={`font-medium mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                 selectedOption === option ? "bg-indigo-200 text-indigo-800" : "bg-gray-100 text-gray-600"
              }`}>
                {letter}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
