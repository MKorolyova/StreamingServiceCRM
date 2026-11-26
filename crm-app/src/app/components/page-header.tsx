import type { ReactNode } from "react";

import { BracketLabel } from "./landing-primitives";

type PageHeaderProps = {
  /** Short section name shown in brackets above the title. */
  label: string;
  title: string;
  description: string;
  /** Optional content under the description, such as a back link. */
  children?: ReactNode;
};

/** Bracket label, headline and one-paragraph intro shared by every CRM page. */
export function PageHeader({ label, title, description, children }: PageHeaderProps) {
  return (
    <div>
      <BracketLabel marker>{label}</BracketLabel>
      <h1 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

/** Heading for one block of a page, with an optional line explaining what it shows. */
export function SectionHeading({ id, title, description }: { id?: string; title: string; description?: string }) {
  return (
    <div>
      <h2 id={id} className="text-xl font-medium tracking-tight">
        {title}
      </h2>
      {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
