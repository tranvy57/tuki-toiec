"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Play, Settings, Volume2 } from "lucide-react";
import { AudioPlayer } from "./Audio";
import { usePracticeTest } from "@/hooks";

interface TestHeaderProps {
  testTitle: string;
  highlightContent: boolean;
  onHighlightChange: (checked: boolean) => void;
  onExit?: () => void;
}

export function TestHeader({
  testTitle,
  highlightContent,
  onHighlightChange,
  onExit,
}: TestHeaderProps) {
  const { fullTest } = usePracticeTest();
  return (
    <div className="">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex-1" />{" "}
        {/* giữ khoảng trống bên trái để title cân giữa */}
        <h1 className="text-xl font-medium text-center flex-1">{testTitle}</h1>
        <div className="flex-1 flex justify-end ">
          <Badge
            variant="outline"
            className="text-xs border-gray-300 cursor-pointer"
            onClick={onExit}
          >
            Thoát
          </Badge>
        </div>
      </div>

      {/* Audio player */}
      
    </div>
  );
}
