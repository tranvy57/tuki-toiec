"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/libs";

interface Part {
  number: number;
  name: string;
  questions: number[];
}

interface PartTabsProps {
  parts: Part[];
  currentPart: number;
  onPartChange: (partNumber: number) => void;
}

export function PartTabs({ parts, currentPart, onPartChange }: PartTabsProps) {
  const handlePartClick = (part: Part) => {
    const firstQuestion = part.questions[0];
    onPartChange(firstQuestion);
  };

  return (
    <div className="bg-white border-b px-6 py-3">
      <div className="flex gap-1">
        {parts.map((part) => (
          <Button
            key={part.number}
            variant={part.number === currentPart ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              part.number === currentPart && "bg-blue-500 text-white hover:bg-blue-600"
            )}
            onClick={() => handlePartClick(part)}
          >
            Part {part.number}
          </Button>
        ))}
      </div>
    </div>
  );
}
