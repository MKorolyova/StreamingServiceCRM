import { useId } from "react";
import { cn } from "cn";

const INK = "var(--foreground)";
const PAPER = "var(--background)";

// A rounded, video-player style button turned away from the viewer, so its
// face is slightly narrowed and its thick edge shows on the left.
const CY = 165;
const FACE_X = 100;
const FACE_W = 268;
const FACE_H = 236;
const FACE_TOP = CY - FACE_H / 2;
const FACE_CX = FACE_X + FACE_W / 2;
const CORNER_X = 58;
const CORNER_Y = 72;
const DEPTH = 46;
const INSET = 15;

// Outlines stepped back from the face, drawn back to front, form the edge.
const EDGE_STEPS = [1, 0.8, 0.6, 0.4, 0.2];

type Point = [number, number];

function round(value: number) {
  return Math.round(value * 10) / 10;
}

/** Closed path through the given corners, each rounded by `radius`. */
function roundedPath(points: Point[], radius: number) {
  const segments = points.map((corner, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const toward = (target: Point): Point => {
      const length = Math.hypot(target[0] - corner[0], target[1] - corner[1]);
      const step = Math.min(radius, length / 2) / length;
      return [
        round(corner[0] + (target[0] - corner[0]) * step),
        round(corner[1] + (target[1] - corner[1]) * step),
      ];
    };
    const start = toward(previous);
    const end = toward(next);
    return `${index === 0 ? "M" : "L"} ${start.join(" ")} Q ${corner.join(" ")} ${end.join(" ")}`;
  });
  return `${segments.join(" ")} Z`;
}

function scaleAround(points: Point[], center: Point, factor: number): Point[] {
  return points.map(([x, y]) => [
    round(center[0] + (x - center[0]) * factor),
    round(center[1] + (y - center[1]) * factor),
  ]);
}

// Play triangle, foreshortened to lie on the turned face, raised off it by RELIEF.
const RELIEF = 16;
const PLAY_BASE: Point[] = [
  [FACE_CX - 50, CY - 68],
  [FACE_CX - 50, CY + 68],
  [FACE_CX + 60, CY],
];
const PLAY_TOP: Point[] = PLAY_BASE.map(([x, y]) => [x + RELIEF, y]);
const PLAY_CENTER: Point = [
  round((PLAY_TOP[0][0] + PLAY_TOP[1][0] + PLAY_TOP[2][0]) / 3),
  round((PLAY_TOP[0][1] + PLAY_TOP[1][1] + PLAY_TOP[2][1]) / 3),
];
const CONTOUR_FACTORS = [0.84, 0.68, 0.52, 0.36, 0.2];

/** Decorative engraved play button, drawn as a thick rounded slab. */
export function PlayCoin({ className }: { className?: string }) {
  const id = useId();
  const hatchId = `${id}-hatch`;
  const faceClipId = `${id}-face`;

  return (
    <svg viewBox="0 0 420 330" fill="none" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <pattern id={hatchId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
          <line x1="0" y1="4.5" x2="9" y2="4.5" stroke={INK} strokeWidth="1.5" />
        </pattern>
        <clipPath id={faceClipId}>
          <rect
            x={FACE_X + INSET}
            y={FACE_TOP + INSET}
            width={FACE_W - INSET * 2}
            height={FACE_H - INSET * 2}
            rx={CORNER_X - INSET}
            ry={CORNER_Y - INSET}
          />
        </clipPath>
      </defs>

      <g
        transform={`rotate(7 ${FACE_CX - DEPTH / 2} ${CY})`}
        stroke={INK}
        strokeOpacity={0.82}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Edge */}
        {EDGE_STEPS.map((step) => (
          <rect
            key={step}
            x={round(FACE_X - DEPTH * step)}
            y={FACE_TOP}
            width={FACE_W}
            height={FACE_H}
            rx={CORNER_X}
            ry={CORNER_Y}
            fill={PAPER}
            strokeWidth={step === 1 ? 1.6 : 1.2}
          />
        ))}

        {/* Face */}
        <rect x={FACE_X} y={FACE_TOP} width={FACE_W} height={FACE_H} rx={CORNER_X} ry={CORNER_Y} fill={PAPER} />
        <rect
          x={FACE_X}
          y={FACE_TOP}
          width={FACE_W}
          height={FACE_H}
          fill={`url(#${hatchId})`}
          stroke="none"
          opacity={0.82}
          clipPath={`url(#${faceClipId})`}
        />
        <rect
          x={FACE_X + INSET}
          y={FACE_TOP + INSET}
          width={FACE_W - INSET * 2}
          height={FACE_H - INSET * 2}
          rx={CORNER_X - INSET}
          ry={CORNER_Y - INSET}
        />

        {/* Play button in relief */}
        <path d={roundedPath(PLAY_BASE, 14)} fill={PAPER} />
        {[0.2, 0.4, 0.6, 0.8].map((step) => {
          const x = round(PLAY_BASE[0][0] + RELIEF * step);
          return <line key={step} x1={x} y1={CY - 60} x2={x} y2={CY + 60} strokeWidth={1.2} />;
        })}
        <path d={roundedPath(PLAY_TOP, 14)} fill={PAPER} />
        {CONTOUR_FACTORS.map((factor) => (
          <path
            key={factor}
            d={roundedPath(scaleAround(PLAY_TOP, PLAY_CENTER, factor), 14 * factor)}
            strokeWidth={1.2}
          />
        ))}
      </g>
    </svg>
  );
}
