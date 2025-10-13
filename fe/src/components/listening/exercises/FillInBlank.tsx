import { useState } from "react";

interface FillInBlankProps {
  question: {
    sentence: string;
    blanks: number[];
  };
  onAnswer: (answers: string[]) => void;
}

export default function FillInBlank({ question, onAnswer }: FillInBlankProps) {
  const [answers, setAnswers] = useState<string[]>(
    new Array(question.blanks.length).fill("")
  );

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const renderSentenceWithBlanks = () => {
    const parts = question.sentence.split("___");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <input
            type="text"
            value={answers[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            className="inline-block mx-2 px-3 py-1 border-b-2 border-pink-500 focus:outline-none focus:border-pink-600 bg-transparent text-center min-w-[100px]"
            placeholder="..."
          />
        )}
      </span>
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Điền từ còn thiếu vào chỗ trống
      </h2>

      <div className="bg-gray-50 rounded-xl p-6">
        <p className="text-lg leading-relaxed text-gray-900">
          {renderSentenceWithBlanks()}
        </p>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>💡 Gợi ý: Nghe kỹ và điền chính xác từ bạn nghe được</p>
      </div>
    </div>
  );
}
