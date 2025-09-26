import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TOEIC_COLORS, type ProgressStat } from "@/constants/toeic";

interface ProgressStatCardProps {
  stat: ProgressStat;
}

export function ProgressStatCard({ stat }: ProgressStatCardProps) {
  const Icon = stat.icon;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Icon 
            className="h-4 w-4 mr-2" 
            style={{ color: TOEIC_COLORS.primary }}
          />
          {stat.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stat.progress !== undefined ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stat.value}</span>
              <span>{stat.subtitle}</span>
            </div>
            <Progress value={stat.progress} className="h-2" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
