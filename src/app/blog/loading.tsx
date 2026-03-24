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
          <div key={i} className="flex flex-col gap-4 p-8 border border-border/30 rounded-2xl bg-card/40 animate-pulse h-full">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-full bg-muted" />
              <Skeleton className="h-8 w-2/3 bg-muted" />
              <Skeleton className="h-3 w-32 bg-muted/60 mt-1" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full bg-muted/30" />
              <Skeleton className="h-4 w-full bg-muted/30" />
              <Skeleton className="h-4 w-5/6 bg-muted/30" />
            </div>
            <div className="flex gap-2 mt-auto pt-6">
              <Skeleton className="h-5 w-14 rounded-md bg-muted/40" />
              <Skeleton className="h-5 w-14 rounded-md bg-muted/40" />
              <Skeleton className="h-5 w-14 rounded-md bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
