import { Info } from "lucide-react";
import { ScoreRing } from "./ScoreRing";

export function ScoreOverview({
  totalScore,
  listeningScore,
  readingScore,
  levelLabel,
}: {
  totalScore: number;
  listeningScore: number | null;
  readingScore: number | null;
  levelLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      {/* decor blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      {/* overlay tăng tương phản */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kết quả TOEIC</h1>
        <p className="text-primary-foreground/80 text-sm">Tổng quan hiệu suất của bạn</p>

        {/* Glass card chứa vòng điểm */}
        <div className="mx-auto mt-4 w-fit rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,.35)]">
          <div className="relative">
            <ScoreRing score={totalScore ?? 0} maxScore={990} />
            {/* Glow mỏng */}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_40px_6px_rgba(255,255,255,.18)]" />
          </div>
        </div>

        {/* Level + tooltip */}
        <div className="mt-3">
          <span
            title="Advanced: ~785–900 (tham chiếu thang TOEIC)"
            className="inline-flex items-center gap-1 rounded-full bg-blue-100/90 px-2.5 py-1 text-xs font-medium text-blue-800"
          >
            <Info className="h-3.5 w-3.5" />
            {levelLabel}
          </span>
        </div>

        {/* Sub-scores */}
        <div className="mt-4 flex items-center justify-center gap-10">
          <div className="text-center">
            <div className="text-2xl font-bold leading-none">{listeningScore ?? "—"}</div>
            <div className="mt-0.5 text-xs opacity-90">Listening / 495</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold leading-none">{readingScore ?? "—"}</div>
            <div className="mt-0.5 text-xs opacity-90">Reading / 495</div>
          </div>
        </div>
      </div>
    </section>
  );
}
