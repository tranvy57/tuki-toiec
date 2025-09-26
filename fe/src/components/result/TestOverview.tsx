import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TestOverviewProps {
  duration: string;
  accuracy: number;
  testDate: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
}

export function TestOverview({
  duration,
  accuracy,
  testDate,
  totalCorrect,
  totalIncorrect,
  totalSkipped,
}: TestOverviewProps) {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="mb-8 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Test Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{duration}</div>
          <div className="text-sm text-muted-foreground">Duration</div>
        </div>

        <div className="text-center">
          <div
            className={`text-2xl font-bold mb-1 ${getAccuracyColor(accuracy)}`}
          >
            {accuracy}%
          </div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </div>

        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-sm text-muted-foreground mb-2">Test Date</div>
          <div className="font-medium">{testDate}</div>
        </div>

        <div className="col-span-2 md:col-span-3 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {totalCorrect}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {totalIncorrect}
              </div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {totalSkipped}
              </div>
              <div className="text-xs text-muted-foreground">Skipped</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
