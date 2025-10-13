import { useState } from "react";
import { Check } from "lucide-react";

interface MultipleChoiceProps {
  question: {
    text: string;
    options: string[];
  };
  onAnswer: (answer: string) => void;
}

export default function MultipleChoice({
  question,
  onAnswer,
}: MultipleChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    onAnswer(question.options[index]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.text}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedOption === index
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-pink-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900">{option}</span>
              {selectedOption === index && (
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
