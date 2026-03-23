import { Skeleton } from "@/components/ui/skeleton";

export default function BlogEditorLoading() {
  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36">
      {/* Header with Actions Skeleton */}
      <div className="sticky top-28 md:top-36 z-10 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 bg-muted" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 bg-muted/60" />
            <Skeleton className="h-9 w-20 bg-muted/60" />
            <Skeleton className="h-9 w-24 bg-muted" />
          </div>
        </div>
      </div>

      {/* Main Editor Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="space-y-6">
          {/* Title Input Skeleton */}
          <div className="py-2">
            <Skeleton className="h-14 w-3/4 bg-muted" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-2 py-1">
            <Skeleton className="h-7 w-16 rounded-full bg-muted/40" />
            <Skeleton className="h-7 w-20 rounded-full bg-muted/40" />
            <Skeleton className="h-7 w-24 bg-muted/20" />
          </div>

          {/* Summary Skeleton */}
          <div className="py-2">
            <Skeleton className="h-8 w-full bg-muted/40" />
            <Skeleton className="h-4 w-12 ml-auto mt-2 bg-muted/20" />
          </div>

          {/* Separator */}
          <div className="border-t border-border/60 my-8" />

          {/* Tiptap Editor Skeleton */}
          <div className="space-y-4">
            {/* Toolbar Area */}
            <div className="flex gap-2 p-2 border border-border/40 rounded-t-lg bg-muted/20">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 bg-muted/40" />
              ))}
            </div>
            {/* Content Area */}
            <div className="min-h-[500px] p-6 border border-border/40 rounded-b-lg space-y-4">
              <Skeleton className="h-4 w-full bg-muted/20" />
              <Skeleton className="h-4 w-full bg-muted/20" />
              <Skeleton className="h-4 w-2/3 bg-muted/20" />
              <div className="pt-8 space-y-4">
                <Skeleton className="h-4 w-full bg-muted/20" />
                <Skeleton className="h-4 w-5/6 bg-muted/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
