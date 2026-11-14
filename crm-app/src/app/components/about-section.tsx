import { Clapperboard, CreditCard, Headset, Megaphone } from "lucide-react";

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
    <section id="about" className="scroll-mt-16 border-t border-dashed border-forest/35 px-5 py-20 lg:px-8 lg:py-28">
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
            <li
              key={team.label}
              className="relative flex flex-col border border-forest/25 bg-forest/[0.03] p-6 transition-colors hover:bg-forest/[0.06]"
            >
              <Corners />
              <div className="flex items-center justify-between">
                <BracketLabel marker>{team.label}</BracketLabel>
                <team.icon aria-hidden className="size-5 opacity-70" strokeWidth={1.5} />
              </div>
              <span
                aria-hidden
                className="mt-1 ml-[0.3rem] block h-2.5 border-b border-l border-dashed border-forest/45"
              />
              <h3 className="mt-1.5 text-xl leading-snug font-medium tracking-tight">{team.title}</h3>
              <p className="mt-3 leading-relaxed opacity-75">{team.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
