
"use client";

import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface HeaderBreadcrumbProps {
  unitTitle: string;
}

export function HeaderBreadcrumb({ unitTitle }: HeaderBreadcrumbProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 text-sm text-slate-600 mb-6"
    >
      <span>Khóa học ngôn ngữ</span>
      <ChevronRight className="w-4 h-4" />
      <span className="text-slate-900 font-medium">{unitTitle}</span>
    </m.div>
  );
}
