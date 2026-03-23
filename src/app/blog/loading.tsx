import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-32 md:pt-40">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-3">
          <Loader2 className="size-8 md:size-10 text-main animate-spin" />
          <Skeleton className="h-10 md:h-12 w-48 bg-muted" />
        </div>
        <p className="text-base md:text-lg text-body/60 animate-pulse">
          포스트를 불러오고 있습니다...
        </p>
      </div>

      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 bg-muted" />
          <Skeleton className="h-10 w-24 bg-muted" />
        </div>
        <Skeleton className="h-10 w-32 bg-muted" />
      </div>

      <Separator className="mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 border border-border/40 rounded-xl bg-card/40 animate-pulse">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-full bg-muted" />
              <Skeleton className="h-7 w-2/3 bg-muted" />
            </div>
            <Skeleton className="h-4 w-24 bg-muted/60" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full bg-muted/40" />
              <Skeleton className="h-4 w-full bg-muted/40" />
              <Skeleton className="h-4 w-3/4 bg-muted/40" />
            </div>
            <div className="flex gap-2 mt-auto pt-4">
              <Skeleton className="h-5 w-12 rounded-full bg-muted/60" />
              <Skeleton className="h-5 w-12 rounded-full bg-muted/60" />
              <Skeleton className="h-5 w-12 rounded-full bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
