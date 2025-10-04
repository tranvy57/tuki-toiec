// app/study-plan/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="flex items-center gap-3 text-slate-600">
        <span className="size-3 animate-pulse rounded-full bg-primary" />
        <span className="size-3 animate-pulse rounded-full bg-primary/70 [animation-delay:100ms]" />
        <span className="size-3 animate-pulse rounded-full bg-primary/50 [animation-delay:200ms]" />
        <span className="ml-2 font-medium">Loading your study plan…</span>
      </div>
    </div>
  );
}
