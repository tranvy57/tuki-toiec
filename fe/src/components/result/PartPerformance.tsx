import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface TestPart {
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  accuracy: number;
  questions: any[];
}

interface PartPerformanceProps {
  parts: TestPart[];
}

export function PartPerformance({ parts }: PartPerformanceProps) {
  const [expandedParts, setExpandedParts] = useState<number[]>([]);

  const togglePartExpansion = (partNumber: number) => {
    setExpandedParts((prev) =>
      prev.includes(partNumber)
        ? prev.filter((p) => p !== partNumber)
        : [...prev, partNumber]
    );
  };

  const getPartTitle = (partNumber: number) => {
    const titles = {
      1: "Photographs",
      2: "Question-Response",
      3: "Conversations",
      4: "Short Talks",
      5: "Incomplete Sentences",
      6: "Text Completion",
      7: "Reading Comprehension",
    };
    return titles[partNumber as keyof typeof titles] || `Part ${partNumber}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-primary" />
        Performance by Part
      </h2>

      {parts.map((part) => (
        <Collapsible
          key={part.partNumber}
          open={expandedParts.includes(part.partNumber)}
          onOpenChange={() => togglePartExpansion(part.partNumber)}
        >
          <Card className="overflow-hidden">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <Badge
                        variant="outline"
                        className="mr-3 border-primary text-primary"
                      >
                        Part {part.partNumber}
                      </Badge>
                      <span className="font-semibold text-lg">
                        {getPartTitle(part.partNumber)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-muted-foreground">
                        {part.correctAnswers}/{part.totalQuestions} correct
                      </span>
                      <span
                        className={`font-bold text-lg ${getAccuracyColor(
                          part.accuracy
                        )}`}
                      >
                        {part.accuracy.toFixed(1)}%
                      </span>
                    </div>

                    <Progress value={part.accuracy} className="h-3" />
                  </div>

                  {expandedParts.includes(part.partNumber) ? (
                    <ChevronUp className="h-5 w-5 ml-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 ml-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center p-3 rounded-lg bg-green-50">
                      <div className="w-4 h-4 rounded-full bg-green-500 mb-2"></div>
                      <div className="font-bold text-green-700">
                        {part.correctAnswers}
                      </div>
                      <div className="text-xs text-green-600">Correct</div>
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-red-50">
                      <div className="w-4 h-4 rounded-full bg-red-500 mb-2"></div>
                      <div className="font-bold text-red-700">
                        {part.incorrectAnswers}
                      </div>
                      <div className="text-xs text-red-600">Wrong</div>
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-yellow-50">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mb-2"></div>
                      <div className="font-bold text-yellow-700">
                        {part.skippedQuestions}
                      </div>
                      <div className="text-xs text-yellow-600">Skipped</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}
