import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export function Recommendations() {
  return (
    <Card className="mt-8 border-2 border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center text-accent-foreground">
          <Target className="w-5 h-5 mr-2 text-accent" />
          Recommendations for Improvement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <p className="text-sm">
            <strong>Focus on Part 7 (Reading Comprehension):</strong> Your
            accuracy is 81.5%. Practice with longer passages and time
            management techniques.
          </p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <p className="text-sm">
            <strong>Strengthen Part 5 (Incomplete Sentences):</strong> Review
            grammar rules and common business vocabulary to improve from 83.3%.
          </p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <p className="text-sm">
            <strong>Overall Performance:</strong> Excellent work! You're in the
            Advanced level. Focus on consistency across all parts to reach the
            900+ range.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
