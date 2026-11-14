import { LandingLink, PlayMark } from "./landing-primitives";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#analytics", label: "Easy Analytics" },
  { href: "#security", label: "Security" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-dashed border-forest/35 bg-lemongrass/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-forest/30">
          <PlayMark />
          <span className="text-lg font-semibold tracking-tight">Streaming CRM</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.95rem] opacity-75 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-forest/30"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <LandingLink href="#get-started" className="min-h-10 px-4">
          Get started
        </LandingLink>
      </div>
    </header>
  );
}
