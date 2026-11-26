import type { ReactNode } from "react";
import { cn } from "cn";

const CORNERS = [
  { position: "top-0 left-0", shape: "polygon(0 0, 100% 0, 0 100%)" },
  { position: "top-0 right-0", shape: "polygon(0 0, 100% 0, 100% 100%)" },
  { position: "bottom-0 left-0", shape: "polygon(0 0, 0 100%, 100% 100%)" },
  { position: "right-0 bottom-0", shape: "polygon(100% 0, 0 100%, 100% 100%)" },
];

/**
 * Decorative triangles marking the four corners of a square-edged box, such
 * as a Card or Button. The parent must be `relative`. Colour follows the
 * parent's text colour.
 */
export function Corners({ className }: { className?: string }) {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner.position}
          aria-hidden
          className={cn("pointer-events-none absolute size-2 bg-current", corner.position, className)}
          style={{ clipPath: corner.shape }}
        />
      ))}
    </>
  );
}

type BracketLabelProps = {
  children: ReactNode;
  className?: string;
  /** Show a small play arrow before the label. */
  marker?: boolean;
  /** `destructive` turns the label and its arrow red, for blocked or failed states. */
  tone?: "default" | "destructive";
};

/** Small monospace section label in square brackets, e.g. [About]. */
export function BracketLabel({ children, className, marker = false, tone = "default" }: BracketLabelProps) {
  const isDestructive = tone === "destructive";

  return (
    <p className={cn("flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase", className)}>
      {marker && (
        <svg
          viewBox="0 0 12 10"
          aria-hidden
          className={cn("h-2.5 w-3 shrink-0", isDestructive ? "text-destructive" : "text-foreground")}
          fill="currentColor"
        >
          <path d="M0 0 12 5 0 10Z" />
        </svg>
      )}
      <span className={isDestructive ? "text-destructive" : "text-muted-foreground"}>[{children}]</span>
    </p>
  );
}

/** Play-button mark used as the logo. */
export function PlayMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-7 items-center justify-center bg-primary text-primary-foreground",
        className,
      )}
    >
      <Corners className="size-1.5" />
      <svg viewBox="0 0 12 12" className="ml-0.5 size-3" fill="currentColor">
        <path d="M2.5 1.6c0-.6.6-.9 1.1-.6l6.6 4.4c.4.3.4.9 0 1.2l-6.6 4.4c-.5.3-1.1 0-1.1-.6V1.6Z" />
      </svg>
    </span>
  );
}
