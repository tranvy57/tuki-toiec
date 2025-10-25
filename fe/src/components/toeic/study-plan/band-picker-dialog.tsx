"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Sparkles } from "lucide-react";
import { StudyPlan } from "@/api/usePlan";

interface BandPickerDialogProps {
  open: boolean;
  onBandSelected: (band: string) => void;
  latestCourse?: StudyPlan;
}

const bandOptions = [
  { value: "450", label: "450-500", description: "Elementary" },
  { value: "550", label: "550-750", description: "Intermediate" },
  { value: "750+", label: "750+", description: "Advanced" },
];

export function BandPickerDialog({
  open,
  onBandSelected,
  latestCourse,
}: BandPickerDialogProps) {
  const [selectedBand, setSelectedBand] = useState<string>("");
  const [customBand, setCustomBand] = useState<string>("");
  const [showCustom, setShowCustom] = useState(false);

  // Use latest course band as suggestion if available
  const suggestedBand = latestCourse?.band?.toString() || "750";

  const handleContinue = () => {
    const band = showCustom ? customBand : selectedBand;
    if (band) {
      onBandSelected(band);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-2xl bg-white border-white/10 backdrop-blur-xl">
        <div className="spotlight">
          <DialogHeader className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center"
            >
              <div className="rounded-2xl bg-pink-500/10 p-4 ring-1 ring-pink-500/20">
                <Target className="h-8 w-8 text-pink-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.06 }}
            >
              <DialogTitle className="text-3xl font-bold text-center">
                Choose your target TOEIC band
              </DialogTitle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.12 }}
            >
              <DialogDescription className="text-center text-base text-muted-foreground">
                We use this to personalize your plan and tailor the difficulty
                to your goals.
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.18 }}
            className="grid grid-cols-2 gap-3 py-6"
          >
            {bandOptions.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.24 + index * 0.06 }}
                onClick={() => {
                  setSelectedBand(option.value);
                  setShowCustom(false);
                }}
                className={`
                  group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all
                  ${
                    selectedBand === option.value
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }
                `}
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-foreground">
                    {option.label}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
                {selectedBand === option.value && (
                  <motion.div
                    layoutId="selected-band"
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.48 }}
            className="space-y-3"
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedBand && !customBand}
              className="w-full rounded-xl bg-pink-500 py-6 text-base font-semibold hover:bg-pink-600 disabled:opacity-50"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Review Test
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
