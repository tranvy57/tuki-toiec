"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/libs";

interface PassageQuestion {
  id: number;
  question: string;
  options: string[];
}

interface Passage {
  type: string;
  content: string;
  questions: PassageQuestion[];
  title?: string;
}

interface PassageLayoutProps {
  passage: Passage;
  currentQuestion: number;
  answers: Record<number, string>;
  onAnswerChange: (questionId: number, value: string) => void;
}

export function PassageLayout({ 
  passage, 
  currentQuestion, 
  answers, 
  onAnswerChange 
}: PassageLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Passage */}
      <div className="space-y-4">
        {(passage as any).title && (
          <h3 className="font-semibold text-lg">{(passage as any).title}</h3>
        )}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {passage.content}
          </pre>
        </div>
      </div>

      {/* Right: Questions */}
      <div className="space-y-6">
        {passage.questions.map((questionData) => (
          <div 
            key={questionData.id}
            className={cn(
              "border rounded-lg p-4 transition-all duration-300",
              questionData.id === currentQuestion 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="text-lg font-medium text-blue-600 min-w-[60px]">
                {questionData.id}
              </div>
              
              <div className="flex-1 space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  {questionData.question}
                </p>
                
                <RadioGroup
                  value={answers[questionData.id] || ""}
                  onValueChange={(value) => onAnswerChange(questionData.id, value)}
                  className="space-y-2"
                >
                  {questionData.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-start space-x-3">
                      <RadioGroupItem 
                        value={option.split('.')[0]} 
                        id={`${questionData.id}-${optionIndex}`} 
                        className="mt-0.5"
                      />
                      <Label 
                        htmlFor={`${questionData.id}-${optionIndex}`}
                        className="cursor-pointer text-sm leading-relaxed flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
