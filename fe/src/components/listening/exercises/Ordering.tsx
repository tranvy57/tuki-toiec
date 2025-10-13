import { useState } from "react";
import { GripVertical } from "lucide-react";

interface OrderingProps {
  question: {
    sentences: string[];
  };
  onAnswer: (order: number[]) => void;
}

export default function Ordering({ question, onAnswer }: OrderingProps) {
  const [sentences, setSentences] = useState(
    question.sentences.map((sentence, index) => ({ id: index, text: sentence }))
  );
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newSentences = [...sentences];
    const draggedSentence = newSentences[draggedItem];
    newSentences.splice(draggedItem, 1);
    newSentences.splice(index, 0, draggedSentence);

    setSentences(newSentences);
    setDraggedItem(index);
    onAnswer(newSentences.map((s) => s.id));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Sắp xếp các câu theo thứ tự đúng
      </h2>

      <div className="space-y-3">
        {sentences.map((sentence, index) => (
          <div
            key={sentence.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 cursor-move transition-all ${
              draggedItem === index
                ? "border-pink-500 shadow-lg scale-105"
                : "border-gray-200 hover:border-pink-300"
            }`}
          >
            <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-semibold text-pink-500 mr-2">
                {index + 1}.
              </span>
              <span className="text-gray-900">{sentence.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>💡 Gợi ý: Kéo thả để sắp xếp các câu theo thứ tự logic</p>
      </div>
    </div>
  );
}
