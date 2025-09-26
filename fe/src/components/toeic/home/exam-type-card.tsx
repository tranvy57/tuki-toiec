import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ExamType } from "@/constants/toeic";

interface ExamTypeCardProps {
  examType: ExamType;
}

export function ExamTypeCard({ examType }: ExamTypeCardProps) {
  return (
    <Link href={examType.href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-1">{examType.title}</h4>
              <p className="text-sm text-muted-foreground">{examType.description}</p>
            </div>
            <Badge variant={examType.badge.variant}>{examType.badge.text}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
