import { cn } from "cn";
import { KeyRound, ShieldCheck, TriangleAlert, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/constants/permissions";

import { BracketLabel, Corners } from "./landing-primitives";
import { SecurityCard } from "./security-card";

const ROLE_LABELS = ["Admin", "Support", "Billing", "Marketing", "Content", "Analyst"];

const FEATURES = [
  {
    icon: Users,
    title: "Roles that match the job",
    body: "Support, billing, marketing, content and analyst roles each open only the parts of the CRM that work needs.",
  },
  {
    icon: KeyRound,
    title: "Permission by permission",
    body: "Viewing a payment and refunding it are separate rights. Access is granted action by action, not screen by screen.",
  },
  {
    icon: ShieldCheck,
    title: "Hidden unless allowed",
    body: "Anything a person is not permitted to use is checked on the server and never reaches their browser.",
  },
  {
    icon: TriangleAlert,
    title: "No accidental deletes",
    body: "Destructive actions ask for confirmation first, and say exactly what is about to change.",
  },
];

// Dashed dividers between feature tiles at 1, 2 and 4 columns.
const FEATURE_DIVIDERS = [
  "",
  "border-t md:border-t-0 md:border-l",
  "border-t lg:border-t-0 lg:border-l",
  "border-t md:border-l lg:border-t-0",
];

export function SecuritySection() {
  const stats = [
    { value: Object.keys(ROLE_PERMISSIONS).length, label: "built-in roles" },
    { value: PERMISSIONS.length, label: "individual permissions" },
  ];

  return (
    <section id="security" className="scroll-mt-16 px-5 lg:px-8">
      {/* `dark` inverts the theme tokens for everything inside this panel. */}
      <div className="dark relative mx-auto w-full max-w-7xl bg-background px-6 py-16 text-foreground sm:px-10 lg:px-16 lg:py-24">
        <Corners className="size-5" />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:py-6">
            <BracketLabel>Security</BracketLabel>
            <h2 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
              Everyone sees what they need, and nothing else
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Subscriber and payment data is sensitive. Access is decided by role, enforced on
              the server, and narrow by default.
            </p>

            <dl className="mt-10 flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-5xl font-medium tracking-[-0.04em] tabular-nums sm:text-6xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>

            <ul className="mt-10 flex flex-wrap gap-2">
              {ROLE_LABELS.map((role) => (
                <li key={role}>
                  <Badge
                    variant="outline"
                    className="h-auto border-dashed px-3 py-1 font-mono font-normal tracking-wider uppercase"
                  >
                    {role}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <SecurityCard />
        </div>

        <Card className="relative mt-12 overflow-visible bg-transparent py-0 text-base lg:mt-16">
          <Corners />
          <CardContent className="px-0">
            <ul className="grid md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, index) => (
                <li key={feature.title} className={cn("flex flex-col border-dashed p-6", FEATURE_DIVIDERS[index])}>
                  <feature.icon aria-hidden className="size-5 text-muted-foreground" strokeWidth={1.5} />
                  <h3 className="mt-10 text-lg leading-snug font-medium tracking-tight">{feature.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{feature.body}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
