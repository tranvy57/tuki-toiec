"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

export function FixedActionBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-primary-2 to-primary/80 backdrop-blur-sm border-t border-primary/20 shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          size="lg"
          variant="secondary"
          className="w-full sm:w-auto bg-white hover:bg-gray-50 text-primary font-semibold"
        >
          <Search className="w-5 h-5 mr-2" />
          Xem lại Đáp án
        </Button>
        <Button
          size="lg"
          className="w-full sm:w-auto bg-white hover:bg-gray-50 text-primary font-semibold"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Làm lại Câu sai
        </Button>
      </div>
    </motion.div>
  );
}
