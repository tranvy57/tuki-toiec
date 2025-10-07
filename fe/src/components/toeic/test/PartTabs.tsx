"use client";

import { Button } from "@/components/ui/button";
import { Part } from "@/types";
import { cn } from "@/utils/libs";


interface PartTabsProps {
  parts: Part[];
  currentPart: number;
  onPartChange: (partNumber: number) => void;
}

export function PartTabs({ parts, currentPart, onPartChange }: PartTabsProps) {
  const handlePartClick = (part: Part) => {
    onPartChange(part.partNumber);
  };

  return (
    <div className="bg-white  px-6 py-3">
      <div className="flex gap-1">
        {parts.map((part) => (
          <Button
            key={part.partNumber}
            variant={part.partNumber === currentPart ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              part.partNumber === currentPart && "bg-blue-500 text-white hover:bg-blue-600"
            )}
            onClick={() => handlePartClick(part)}
          >
            Part {part.partNumber}
          </Button>
        ))}
      </div>
    </div>
  );
}
