import { LucideIcon, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  message = "데이터가 없습니다.",
  icon: Icon = FolderOpen,
  className,
  action
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-32 text-center animate-in fade-in-50",
      className
    )}>
      <div className="bg-muted/30 p-4 rounded-full mb-4 ring-1 ring-border/50">
        <Icon className="w-10 h-10 text-muted-foreground/50" strokeWidth={1.5} />
      </div>
      <p className="text-lg text-muted-foreground font-medium mb-6">
        {message}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
