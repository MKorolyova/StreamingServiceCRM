import { AboutSection } from "./components/about-section";
import { AnalyticsSection } from "./components/analytics-section";
import { HeroSection } from "./components/hero-section";
import { SecuritySection } from "./components/security-section";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col bg-lemongrass text-forest selection:bg-forest selection:text-lemongrass">
      <SiteHeader />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <AnalyticsSection />
        <SecuritySection />
      </main>
      <SiteFooter />
    </div>
  );
}
