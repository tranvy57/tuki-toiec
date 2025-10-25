"use client";

import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  X,
  Sparkles,
  BookOpen,
  Video,
  BarChart3,
  Target,
} from "lucide-react";
import { StudyPlan } from "@/api/usePlan";

interface UpgradeProSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyPlan?: StudyPlan;
}

const proBenefits = [
  {
    icon: BookOpen,
    title: "Full Theory Access",
    description: "Unlock all theory lessons and in-depth explanations",
  },
  {
    icon: Video,
    title: "Tips & Video Lessons",
    description: "Expert strategies and video tutorials for every section",
  },
  {
    icon: Target,
    title: "Checkpoint Quizzes",
    description:
      "Test your knowledge with comprehensive checkpoint assessments",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description: "Track your progress with advanced analytics and insights",
  },
];

const comparisonFeatures = [
  { feature: "Practice Questions", free: true, pro: true },
  { feature: "Review Test", free: true, pro: true },
  { feature: "Basic Progress Tracking", free: true, pro: true },
  { feature: "Theory Lessons", free: false, pro: true },
  { feature: "Tips & Video Content", free: false, pro: true },
  { feature: "Checkpoint Quizzes", free: false, pro: true },
  { feature: "Detailed Analytics", free: false, pro: true },
  { feature: "Personalized Study Plan", free: false, pro: true },
];

export function UpgradeProSheet({
  open,
  onOpenChange,
  studyPlan,
}: UpgradeProSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-slate-900/95 border-white/10 backdrop-blur-xl overflow-y-auto"
      >
        <div className="spotlight">
          <SheetHeader className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center"
            >
              <div className="rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 p-4 ring-1 ring-pink-500/30">
                <Crown className="h-10 w-10 text-pink-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.06 }}
            >
              <SheetTitle className="text-3xl font-bold text-center">
                Upgrade to Pro
              </SheetTitle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.12 }}
            >
              <SheetDescription className="text-center text-base text-muted-foreground">
                Unlock the complete TOEIC learning experience with theory,
                expert tips, and detailed progress tracking.
              </SheetDescription>
            </motion.div>
          </SheetHeader>

          {/* Pro Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.18 }}
            className="space-y-3 mb-8"
          >
            {proBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.24 + index * 0.06 }}
                >
                  <Card className="glass border-white/10 p-4 hover:border-pink-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-pink-500/10 p-2.5 ring-1 ring-pink-500/20 flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.48 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Free vs Pro
            </h3>
            <Card className="glass border-white/10 overflow-hidden">
              <div className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 border-b border-white/10 bg-white/5">
                <div className="font-semibold">Feature</div>
                <div className="font-semibold text-center w-20">Free</div>
                <div className="font-semibold text-center w-20 flex items-center justify-center gap-1">
                  <Crown className="h-4 w-4 text-pink-500" />
                  Pro
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {comparisonFeatures.map((item, index) => (
                  <motion.div
                    key={item.feature}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.54 + index * 0.04 }}
                    className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 items-center"
                  >
                    <div className="text-sm">{item.feature}</div>
                    <div className="flex justify-center w-20">
                      {item.free ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex justify-center w-20">
                      {item.pro ? (
                        <Check className="h-5 w-5 text-pink-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.9 }}
            className="mb-8"
          >
            <Card className="glass border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 p-6">
              <div className="text-center mb-4">
                <Badge className="rounded-full bg-pink-500/20 text-pink-500 border-pink-500/30 mb-3">
                  Limited Time Offer
                </Badge>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cancel anytime. No commitment.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.96 }}
            className="space-y-3"
          >
            <Button className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 py-6 text-base font-semibold">
              <Sparkles className="mr-2 h-5 w-5" />
              Upgrade to Pro
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10 py-6 text-base"
            >
              Continue with Free
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 1.02 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            Join 10,000+ learners who upgraded to Pro
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
