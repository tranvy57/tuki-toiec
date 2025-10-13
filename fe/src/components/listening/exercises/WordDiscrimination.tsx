import { useState } from "react";

interface WordDiscriminationProps {
  question: {
    text: string;
    wordA: string;
    wordB: string;
  };
  onAnswer: (answer: string) => void;
}

export default function WordDiscrimination({
  question,
  onAnswer,
}: WordDiscriminationProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleSelect = (word: string) => {
    setSelectedWord(word);
    onAnswer(word);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.text}
      </h2>

      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => handleSelect(question.wordA)}
          className={`group relative p-8 rounded-2xl border-4 transition-all hover:scale-105 ${
            selectedWord === question.wordA
              ? "border-pink-500 bg-pink-50 shadow-xl"
              : "border-gray-200 bg-white hover:border-pink-300"
          }`}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-pink-500 mb-2">A</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {question.wordA}
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelect(question.wordB)}
          className={`group relative p-8 rounded-2xl border-4 transition-all hover:scale-105 ${
            selectedWord === question.wordB
              ? "border-pink-500 bg-pink-50 shadow-xl"
              : "border-gray-200 bg-white hover:border-pink-300"
          }`}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-pink-500 mb-2">B</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {question.wordB}
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>💡 Gợi ý: Nghe kỹ và chọn từ bạn nghe được</p>
      </div>
    </div>
  );
}
