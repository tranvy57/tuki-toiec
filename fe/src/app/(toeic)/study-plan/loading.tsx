import { Loader2 } from "lucide-react";

export default function StudyPlanLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Đang tải kế hoạch học...</p>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đang chuẩn bị lộ trình học tập phù hợp với bạn
          </p>
        </div>
      </div>
    </div>
  );
}
