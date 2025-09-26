import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TOEIC_COLORS, type PracticeSkill } from "@/constants/toeic";

interface PracticeSkillCardProps {
  skill: PracticeSkill;
}

export function PracticeSkillCard({ skill }: PracticeSkillCardProps) {
  const Icon = skill.icon;
  
  return (
    <Link href={skill.href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 text-center">
          <Icon 
            className="h-8 w-8 mx-auto mb-2" 
            style={{ color: TOEIC_COLORS.primary }}
          />
          <p className="text-sm font-medium">{skill.title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
