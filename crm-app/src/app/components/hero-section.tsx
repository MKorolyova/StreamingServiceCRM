import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BracketLabel, Corners } from "./landing-primitives";
import { PlayCoin } from "./play-coin";

const COVERAGE = ["Subscribers", "Profiles", "Plans", "Payments", "Campaigns", "Promo codes", "Devices", "Viewing"];

/** Vertical ruler of tick marks that frames the hero panel on wide screens. */
function Ruler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-6 hidden w-4 text-border lg:block",
        side === "left" ? "left-3" : "right-3 -scale-x-100",
      )}
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
      <Card className="relative mx-auto w-full max-w-7xl py-14 text-center md:py-20">
        <Corners className="size-3" />
        <Ruler side="left" />
        <Ruler side="right" />

        <CardContent className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <BracketLabel>CRM for streaming services</BracketLabel>

          <h1 className="mt-6 text-[2.75rem] leading-[0.98] font-medium tracking-[-0.04em] text-balance sm:text-7xl lg:text-[5.25rem]">
            The CRM built for the business of movies
          </h1>

          <PlayCoin className="mt-10 w-full max-w-[15rem] motion-safe:animate-float sm:max-w-[20rem] lg:max-w-[23rem]" />

          <p className="mt-8 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
            Streaming CRM keeps subscribers, plans, billing, campaigns and viewing in one
            workspace, so your team always knows who is watching and what brings them back.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="cut-corners h-11 px-5 text-[0.95rem]" nativeButton={false} render={<a href="#about" />}>
              See how it works
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="relative h-11 bg-transparent px-5 text-[0.95rem]"
              nativeButton={false}
              render={<a href="#analytics" />}
            >
              <Corners className="size-1.5" />
              Explore analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto w-full max-w-7xl py-12 md:py-16">
        <p className="text-center font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          One record for everything your service runs on
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {COVERAGE.map((item) => (
            <li key={item}>
              <Badge
                variant="outline"
                className="h-auto border-dashed px-3.5 py-1.5 font-mono font-normal tracking-[0.12em] uppercase"
              >
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
