import { Input } from "@/components/ui/input";
import { WeakVocabulary } from "@/types/implements/vocabulary";

interface FillBlankQuizProps {
  word: any; // Ideally WeakVocabulary
  answer: string;
  onAnswerChange: (answer: string) => void;
  isCompleted: boolean;
}

export default function FillBlankQuiz({
  word,
  answer,
  onAnswerChange,
  isCompleted,
}: FillBlankQuizProps) {
  // Helper to generate the question content
  const getQuestionContent = () => {
    if (word?.exampleEn && word?.word) {
      // Create a regex to replace the word case-insensitively
      const regex = new RegExp(`\\b${word.word}\\b`, "gi");
      const parts = word.exampleEn.split(regex);
      
      // If the word was found and split correctly
      if (parts.length > 1) {
        return (
          <div className="text-center text-lg font-medium leading-relaxed">
             {parts.map((part: string, i: number) => (
                <span key={i}>
                  {part}
                  {i < parts.length - 1 && (
                    <span className="inline-block border-b-2 border-indigo-500 min-w-[60px] mx-1 text-center font-bold text-indigo-700">
                      {isCompleted ? word.word : "______"}
                    </span>
                  )}
                </span>
             ))}
             <p className="mt-2 text-sm text-gray-500 italic">({word.meaning})</p>
          </div>
        );
      }
    }

    console.log("word", word);
    
    // Fallback if no valid example sentence
    return (
      <div className="text-center space-y-2">
         <p className="text-gray-600">Điền từ tiếng Anh có nghĩa là:</p>
        <h3 className="text-xl font-bold text-indigo-700">"{word?.content?.text}"</h3>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
        {getQuestionContent()}
      </div>
      
      <div className="space-y-4">
        <p className="text-center text-sm text-gray-500">Nhập đáp án của bạn:</p>
        <Input
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Nhập từ vựng..."
          className="text-center text-lg h-12 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isCompleted}
          autoFocus
          onKeyDown={(e) => {
             // Optional: allow submit on enter? Parent doesn't pass submit handler here directly though.
          }}
        />
      </div>
      
      {isCompleted && (
        <div className="text-center animate-in fade-in slide-in-from-bottom-2">
           <p className="text-sm text-gray-600">
             Đáp án đúng: <strong className="text-green-600 text-lg">{word.word}</strong>
           </p>
           {word?.pronunciation && (
              <p className="text-xs text-gray-500 mt-1">{word.pronunciation}</p>
           )}
        </div>
      )}
    </div>
  );
}
