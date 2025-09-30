import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Target, Clock, Star } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";

interface StatsOverviewProps {
  vocabularies: WeakVocabulary[];
}

export default function StatsOverview({ vocabularies }: StatsOverviewProps) {
  const criticalWords = vocabularies.filter(
    (v) => v.weaknessLevel === "critical"
  ).length;
  const moderateWords = vocabularies.filter(
    (v) => v.weaknessLevel === "moderate"
  ).length;
  const mildWords = vocabularies.filter(
    (v) => v.weaknessLevel === "mild"
  ).length;
  const markedForReview = vocabularies.filter(
    (v) => v.isMarkedForReview
  ).length;

  const stats = [
    {
      icon: TrendingDown,
      value: criticalWords,
      label: "Rất yếu",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    {
      icon: Target,
      value: moderateWords,
      label: "Trung bình",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      valueColor: "text-orange-600",
    },
    {
      icon: Clock,
      value: mildWords,
      label: "Hơi yếu",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-600",
    },
    {
      icon: Star,
      value: markedForReview,
      label: "Đánh dấu ôn",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.valueColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

