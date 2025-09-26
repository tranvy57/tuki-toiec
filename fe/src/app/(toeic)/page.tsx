"use client";

import { PromoBanner } from "@/components/toeic/home/promo-banner";
import { PracticeSkillCard } from "@/components/toeic/home/practice-skill-card";
import { ExamTypeCard } from "@/components/toeic/home/exam-type-card";
import { ProgressStatCard } from "@/components/toeic/home/progress-stat-card";
import { QuickActions } from "@/components/toeic/home/quick-actions";
import { PRACTICE_SKILLS, EXAM_TYPES, PROGRESS_STATS } from "@/constants/toeic";

export default function ToeicHomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <PromoBanner 
        title="Luyện thi TOEIC hiệu quả"
        description="Đạt điểm cao với phương pháp học tập khoa học"
      />

      <section>
        <h3 className="text-lg font-bold text-foreground mb-4">Luyện tập</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRACTICE_SKILLS.map((skill) => (
            <PracticeSkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-foreground mb-4">Đề thi</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {EXAM_TYPES.map((examType) => (
            <ExamTypeCard key={examType.id} examType={examType} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-foreground mb-4">Tiến độ học tập</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PROGRESS_STATS.map((stat) => (
            <ProgressStatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      <QuickActions />
    </div>
  );
}
