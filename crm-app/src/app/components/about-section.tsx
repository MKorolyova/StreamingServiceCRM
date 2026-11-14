import { Clapperboard, CreditCard, Headset, Megaphone } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { BracketLabel, Corners } from "./landing-primitives";

const TEAMS = [
  {
    label: "Support",
    icon: Headset,
    title: "The whole account at a glance",
    body: "Profiles, plan, devices and payment history sit on one subscriber page, so agents answer without switching tools.",
  },
  {
    label: "Billing",
    icon: CreditCard,
    title: "Payments without the puzzle",
    body: "Record payments, issue refunds and manage plans with every change tied to the subscriber it belongs to.",
  },
  {
    label: "Marketing",
    icon: Megaphone,
    title: "Campaigns that bring viewers back",
    body: "Target promos, win-backs and new releases, then follow each one from sent to redeemed.",
  },
  {
    label: "Content",
    icon: Clapperboard,
    title: "A catalog you can reason about",
    body: "Movies, genres, certifications and ratings live beside the viewing they generate.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <BracketLabel>About</BracketLabel>

        <h2 className="mt-6 max-w-5xl text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
          A streaming service runs on subscribers, payments and titles.{" "}
          <span className="opacity-45">
            Most teams keep them in separate tools. Streaming CRM puts them in one place.
          </span>
        </h2>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {TEAMS.map((team) => (
            <li key={team.label}>
              <Card className="relative h-full gap-3 text-base transition-colors [--card-spacing:--spacing(6)] hover:bg-muted">
                <Corners />
                <CardHeader>
                  <CardDescription>
                    <BracketLabel marker>{team.label}</BracketLabel>
                  </CardDescription>
                  <CardAction>
                    <team.icon aria-hidden className="size-5 text-muted-foreground" strokeWidth={1.5} />
                  </CardAction>
                  {/* Dashed elbow leading from the label down to the title. */}
                  <span aria-hidden className="ml-[0.3rem] h-2.5 border-b border-l border-dashed" />
                  <CardTitle className="mt-1 text-xl tracking-tight">{team.title}</CardTitle>
                </CardHeader>
                <CardContent className="leading-relaxed text-muted-foreground">{team.body}</CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
