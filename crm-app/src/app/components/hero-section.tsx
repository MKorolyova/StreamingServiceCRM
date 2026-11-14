import { BracketLabel, Corners, LandingLink } from "./landing-primitives";
import { PlayCoin } from "./play-coin";

const COVERAGE = ["Subscribers", "Profiles", "Plans", "Payments", "Campaigns", "Promo codes", "Devices", "Viewing"];

/** Vertical ruler of tick marks that frames the hero panel on wide screens. */
function Ruler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-6 hidden w-4 text-forest/35 lg:block ${
        side === "left" ? "left-3" : "right-3 -scale-x-100"
      }`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 12px), repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 60px)",
        backgroundSize: "9px 100%, 16px 100%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function HeroSection() {
  return (
    <section id="top" className="px-5 pt-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl border border-forest/25 bg-forest/[0.045] px-5 py-14 text-center md:py-20">
        <Corners className="size-3" />
        <Ruler side="left" />
        <Ruler side="right" />

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <BracketLabel>CRM for streaming services</BracketLabel>

          <h1 className="mt-6 text-[2.75rem] leading-[0.98] font-medium tracking-[-0.04em] text-balance sm:text-7xl lg:text-[5.25rem]">
            The CRM built for the business of movies
          </h1>

          <PlayCoin className="mt-10 w-full max-w-[15rem] motion-safe:animate-float sm:max-w-[20rem] lg:max-w-[23rem]" />

          <p className="mt-8 max-w-md text-lg leading-relaxed text-pretty opacity-80">
            Streaming CRM keeps subscribers, plans, billing, campaigns and viewing in one
            workspace, so your team always knows who is watching and what brings them back.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LandingLink href="#about">See how it works</LandingLink>
            <LandingLink href="#analytics" variant="outline">
              Explore analytics
            </LandingLink>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl py-12 md:py-16">
        <p className="text-center font-mono text-xs tracking-[0.14em] uppercase opacity-70">
          One record for everything your service runs on
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {COVERAGE.map((item) => (
            <li key={item} className="border border-dashed border-forest/45 px-3.5 py-1.5 font-mono text-xs tracking-[0.12em] uppercase">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
