import { useState } from "react";

interface DictationProps {
  question: {
    text: string;
  };
  onAnswer: (answer: string) => void;
}

export default function Dictation({ question, onAnswer }: DictationProps) {
  const [answer, setAnswer] = useState("");

  const handleChange = (value: string) => {
    setAnswer(value);
    onAnswer(value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.text}
      </h2>

      <div className="bg-gray-50 rounded-xl p-6">
        <textarea
          value={answer}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Gõ câu bạn nghe được..."
          className="w-full min-h-[150px] p-4 border-2 border-gray-300 focus:border-pink-500 rounded-xl focus:outline-none resize-none text-lg"
        />
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Số ký tự: {answer.length}</span>
          <button
            onClick={() => handleChange("")}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Xóa tất cả
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>💡 Gợi ý: Chú ý dấu câu và viết hoa chữ cái đầu câu</p>
        </div>
      </div>
    </div>
  );
}
