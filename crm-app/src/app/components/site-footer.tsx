import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PlayMark } from "./landing-primitives";
import { PlayCoin } from "./play-coin";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#about", label: "About" },
      { href: "#analytics", label: "Easy Analytics" },
      { href: "#security", label: "Security" },
    ],
  },
  {
    title: "Built for",
    links: [
      { href: "#about", label: "Support" },
      { href: "#about", label: "Billing" },
      { href: "#about", label: "Marketing" },
      { href: "#about", label: "Content" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-5 pt-20 pb-8 lg:px-8 lg:pt-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div id="get-started" className="relative flex scroll-mt-24 flex-col items-center text-center">
          <PlayCoin className="w-36 motion-safe:animate-float-slow sm:w-44" />
          <h2 className="mt-8 max-w-3xl text-4xl leading-[1.02] font-medium tracking-[-0.04em] text-balance sm:text-6xl">
            Press play on your subscriber data
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            One workspace for the people who watch, the plans they pay for and the titles they
            love.
          </p>
          <Button size="lg" className="cut-corners mt-8 h-11 px-5 text-[0.95rem]" nativeButton={false} render={<a href="#top" />}>
            Back to the top
          </Button>
        </div>

        <Separator variant="dashed" className="mt-20 lg:mt-28" />

        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <PlayMark />
              <span className="text-lg font-semibold tracking-tight">Streaming CRM</span>
            </div>
            <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
              Subscribers, viewing, billing and campaigns for the streaming service.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{column.title}</p>
              <ul className="mt-3 flex flex-col items-start gap-0.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Button variant="link" className="px-0 text-base font-normal" nativeButton={false} render={<a href={link.href} />}>
                      {link.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator variant="dashed" className="mt-12" />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-sm text-muted-foreground">
          <p>© 2026 Streaming CRM</p>
          <p className="font-mono text-xs tracking-wider uppercase">Made for movie people</p>
        </div>
      </div>
    </footer>
  );
}
