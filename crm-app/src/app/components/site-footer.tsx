import { LandingLink, PlayMark } from "./landing-primitives";
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
      <div className="mx-auto w-full max-w-7xl">
        <div id="get-started" className="relative flex scroll-mt-24 flex-col items-center text-center">
          <PlayCoin className="w-36 motion-safe:animate-float-slow sm:w-44" />
          <h2 className="mt-8 max-w-3xl text-4xl leading-[1.02] font-medium tracking-[-0.04em] text-balance sm:text-6xl">
            Press play on your subscriber data
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed opacity-80">
            One workspace for the people who watch, the plans they pay for and the titles they
            love.
          </p>
          <LandingLink href="#top" className="mt-8">
            Back to the top
          </LandingLink>
        </div>

        <div className="mt-20 grid gap-10 border-t border-dashed border-forest/35 pt-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <PlayMark />
              <span className="text-lg font-semibold tracking-tight">Streaming CRM</span>
            </div>
            <p className="mt-4 max-w-xs leading-relaxed opacity-70">
              Subscribers, viewing, billing and campaigns for the streaming service.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-mono text-xs tracking-[0.14em] uppercase opacity-60">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="opacity-80 transition-opacity outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-forest/30"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-forest/35 pt-6 text-sm opacity-60">
          <p>© 2026 Streaming CRM</p>
          <p className="font-mono text-xs tracking-wider uppercase">Made for movie people</p>
        </div>
      </div>
    </footer>
  );
}
