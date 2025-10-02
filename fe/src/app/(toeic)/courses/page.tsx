
import { CourseHero } from "@/components/courses/course-hero"
import { FAQ } from "@/components/courses/faq"
import { FinalCTA } from "@/components/courses/final-cta"
import { PlanCompare } from "@/components/courses/plan-compare"
import { Pricing } from "@/components/courses/pricing"
import { SyllabusPreview } from "@/components/courses/syllabus-preview"
import { Testimonials } from "@/components/courses/testimonials"
import { ValueBento } from "@/components/courses/value-bento"


export default function CoursePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <CourseHero />
        <ValueBento />
        <SyllabusPreview />
        <PlanCompare />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
    </div>
  );
}
