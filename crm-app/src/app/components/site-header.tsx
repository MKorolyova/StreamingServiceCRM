import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PlayMark } from "./landing-primitives";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#analytics", label: "Easy Analytics" },
  { href: "#security", label: "Security" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <PlayMark />
          <span className="text-lg font-semibold tracking-tight">Streaming CRM</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-3 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="lg"
              className="px-3 text-[0.95rem] font-normal text-muted-foreground"
              nativeButton={false}
              render={<a href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <Button size="lg" className="cut-corners h-10 px-4 text-[0.95rem]" nativeButton={false} render={<a href="#get-started" />}>
          Get started
        </Button>
      </div>
      <Separator variant="dashed" />
    </header>
  );
}
