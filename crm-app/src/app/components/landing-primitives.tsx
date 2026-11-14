import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";

const CORNERS = [
  { position: "-top-px -left-px", shape: "polygon(0 0, 100% 0, 0 100%)" },
  { position: "-top-px -right-px", shape: "polygon(0 0, 100% 0, 100% 100%)" },
  { position: "-bottom-px -left-px", shape: "polygon(0 0, 0 100%, 100% 100%)" },
  { position: "-right-px -bottom-px", shape: "polygon(100% 0, 0 100%, 100% 100%)" },
];

/**
 * Four small triangles marking the corners of a square-edged box. The parent
 * must be `relative` with a 1px border. Colour follows the text colour.
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
};

/** Small monospace section label in square brackets, e.g. [About]. */
export function BracketLabel({ children, className, marker = false }: BracketLabelProps) {
  return (
    <p className={cn("flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase", className)}>
      {marker && (
        <svg viewBox="0 0 12 10" aria-hidden className="h-2.5 w-3 shrink-0" fill="currentColor">
          <path d="M0 0 12 5 0 10Z" />
        </svg>
      )}
      <span className="opacity-70">[{children}]</span>
    </p>
  );
}

type LandingLinkProps = ComponentProps<"a"> & {
  /** `solid` sits on the light background, `inverted` on the dark one. */
  variant?: "solid" | "inverted" | "outline";
};

const LINK_VARIANTS = {
  solid: "border-forest bg-forest text-lemongrass hover:bg-forest/90",
  inverted: "border-lemongrass bg-lemongrass text-forest hover:bg-lemongrass/90",
  outline: "border-forest/40 text-forest hover:bg-forest/5",
} as const;

/** Call-to-action link styled as a button. */
export function LandingLink({ variant = "solid", className, children, ...props }: LandingLinkProps) {
  return (
    <a
      className={cn(
        "relative inline-flex min-h-11 items-center justify-center gap-2 border px-5 text-[0.95rem] font-medium transition-[background-color,scale] outline-none hover:scale-[0.98] focus-visible:ring-3 focus-visible:ring-current/30 active:scale-[0.96]",
        LINK_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      <Corners className={variant === "solid" ? "size-1.5 text-lemongrass" : "size-1.5 text-forest"} />
      {children}
    </a>
  );
}

/** Play-button mark used as the logo. */
export function PlayMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-7 items-center justify-center border border-forest bg-forest text-lemongrass",
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
