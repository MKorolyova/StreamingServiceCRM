import { useId } from "react";

import { Corners } from "./landing-primitives";

const INK = "var(--color-forest)";
const PAPER = "var(--color-lemongrass)";

const SHIELD_PATH =
  "M150 22 C190 50 236 60 272 60 L272 172 C272 252 216 302 150 328 C84 302 28 252 28 172 L28 60 C64 60 110 50 150 22 Z";

// Outlines stepped back from the front of the shield form its thick edge.
const EDGE_STEPS = [1, 0.75, 0.5, 0.25];
const EDGE_OFFSET = { x: -34, y: 10 };

// Sagging contour lines across the front, like slices through a curved surface.
const CONTOURS = Array.from({ length: 40 }, (_, index) => -40 + index * 9.5);

/** Engraved shield drawn in contour lines. */
function ContourShield({ className }: { className?: string }) {
  const clipId = `${useId()}-shield`;

  return (
    <svg viewBox="0 0 300 350" fill="none" aria-hidden className={className}>
      <defs>
        <clipPath id={clipId}>
          <path d={SHIELD_PATH} />
        </clipPath>
      </defs>

      <g
        transform="rotate(-9 150 175)"
        stroke={INK}
        strokeOpacity={0.85}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {EDGE_STEPS.map((step) => (
          <path
            key={step}
            d={SHIELD_PATH}
            fill={PAPER}
            strokeWidth={step === 1 ? 1.8 : 1.3}
            transform={`translate(${EDGE_OFFSET.x * step} ${EDGE_OFFSET.y * step})`}
          />
        ))}

        <path d={SHIELD_PATH} fill={PAPER} />
        <g clipPath={`url(#${clipId})`} strokeWidth={1.5}>
          {CONTOURS.map((y) => (
            <path key={y} d={`M 20 ${y} C 90 ${y + 34} 190 ${y + 62} 280 ${y + 22}`} />
          ))}
        </g>
        <path d={SHIELD_PATH} />
      </g>
    </svg>
  );
}

/** Light card with cut corners, a contour-line shield and a short access statement. */
export function SecurityCard() {
  return (
    <figure className="relative flex min-h-[30rem] flex-col justify-between bg-lemongrass p-7 font-mono text-[0.8rem] leading-relaxed tracking-[0.16em] text-forest uppercase sm:p-9 lg:min-h-full">
      <Corners className="size-4" />

      <p aria-hidden className="flex justify-between gap-4">
        <span>&ldquo;Subscriber ID&rdquo;:</span>
        <span>1ED-9367</span>
      </p>

      <ContourShield className="pointer-events-none absolute top-1/2 left-1/2 h-[58%] w-auto -translate-x-[44%] -translate-y-[60%] overflow-visible" />

      <figcaption className="relative max-w-[17rem]">
        Access is decided by role and checked on the server, before anything reaches the browser.
      </figcaption>
    </figure>
  );
}
