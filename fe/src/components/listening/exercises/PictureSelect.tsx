import { useState } from "react";
import { Check } from "lucide-react";

interface PictureSelectProps {
  question: {
    text: string;
    images: string[];
  };
  onAnswer: (answer: number) => void;
}

export default function PictureSelect({
  question,
  onAnswer,
}: PictureSelectProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedImage(index);
    onAnswer(index);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.text}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {question.images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`relative aspect-video rounded-xl overflow-hidden border-4 transition-all ${
              selectedImage === index
                ? "border-pink-500 shadow-lg"
                : "border-gray-200 hover:border-pink-300"
            }`}
          >
            <img
              src={image}
              alt={`Option ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {selectedImage === index && (
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="text-white font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
