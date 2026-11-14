import { KeyRound, ShieldCheck, TriangleAlert, Users } from "lucide-react";

import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/auth/permissions";

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
      <div className="mx-auto w-full relative max-w-7xl border border-forest bg-forest px-6 py-16 text-lemongrass sm:px-10 lg:px-16 lg:py-24">
        <Corners className="size-5" />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:py-6">
            <BracketLabel>Security</BracketLabel>
            <h2 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
              Everyone sees what they need, and nothing else
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed opacity-80">
              Subscriber and payment data is sensitive. Access is decided by role, enforced on
              the server, and narrow by default.
            </p>

            <dl className="mt-10 flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-5xl font-medium tracking-[-0.04em] tabular-nums sm:text-6xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-sm opacity-70">{stat.label}</dt>
                </div>
              ))}
            </dl>

            <ul className="mt-10 flex flex-wrap gap-2">
              {ROLE_LABELS.map((role) => (
                <li
                  key={role}
                  className="border border-dashed border-lemongrass/45 px-3 py-1 font-mono text-xs tracking-wider uppercase opacity-80"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <SecurityCard />
        </div>

        <div className="relative mt-12 border border-lemongrass/30 lg:mt-16">
          <Corners />
          <ul className="grid md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.title}
                className={`flex flex-col border-dashed border-lemongrass/35 p-6 ${FEATURE_DIVIDERS[index]}`}
              >
                <feature.icon aria-hidden className="size-5 opacity-80" strokeWidth={1.5} />
                <h3 className="mt-10 text-lg leading-snug font-medium tracking-tight">{feature.title}</h3>
                <p className="mt-2 leading-relaxed opacity-70">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
