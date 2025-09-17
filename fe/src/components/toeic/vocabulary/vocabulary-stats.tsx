"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VocabularyStatsProps } from "@/types/vocabulary";
import { 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  Flame 
} from "lucide-react";

export function VocabularyStats({
  totalWords,
  learnedWords,
  todayWords,
  weekStreak
}: VocabularyStatsProps) {
  const progressPercentage = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

  const stats = [
    {
      id: 'total',
      value: totalWords,
      label: 'Total Words',
      icon: BookOpen,
      color: 'text-[#ff776f]',
      bgColor: 'bg-[#ff776f]/10',
    },
    {
      id: 'learned',
      value: learnedWords,
      label: 'Learned',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'today',
      value: todayWords,
      label: 'Today',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'streak',
      value: weekStreak,
      label: 'Week Streak',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
        
        {/* Progress Overview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">
                {learnedWords} of {totalWords} words learned
              </span>
              <span className="text-lg font-bold text-[#ff776f]">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
