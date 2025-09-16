"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestItem } from "@/types/test";
import { getDifficultyColor, getDifficultyBgColor } from "@/lib/test-data";
import { 
  Clock, 
  FileText, 
  ArrowRight,
  Play
} from "lucide-react";

interface TestCardProps {
  test: TestItem;
  onTestPress: (testId: number) => void;
  onTestStart: (testId: number) => void;
}

export function TestCard({ test, onTestPress, onTestStart }: TestCardProps) {
  const difficultyColor = getDifficultyColor(test.difficulty);
  const difficultyBgColor = getDifficultyBgColor(test.difficulty);

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onTestPress(test.test_id)}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground leading-tight">
              {test.title}
            </h3>
            <Badge 
              variant="outline" 
              className={`${difficultyColor} ${difficultyBgColor} border-current`}
            >
              {test.difficulty}
            </Badge>
          </div>
          
          {test.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {test.description}
            </p>
          )}
        </div>

        {/* Test Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {test.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{test.duration} mins</span>
            </div>
          )}
          
          {test.totalQuestions && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{test.totalQuestions} questions</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-[#ff776f] hover:bg-[#e55a52]"
            onClick={(e) => {
              e.stopPropagation();
              onTestStart(test.test_id);
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Test
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTestPress(test.test_id);
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
