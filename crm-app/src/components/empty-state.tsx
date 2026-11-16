import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional action, such as a button that creates the first record. */
  children?: ReactNode;
  className?: string;
};

/** Shown when data loaded successfully but there is nothing to list. */
export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <Icon aria-hidden className="size-6 text-muted-foreground" strokeWidth={1.5} />
      <p className="text-lg font-medium tracking-tight">{title}</p>
      <p className="max-w-sm leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
