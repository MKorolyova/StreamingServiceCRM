import { Clapperboard, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PREVIEW_STATS = [
  { title: "Active subscribers", value: "12,480", note: "+3.2% vs last month" },
  { title: "Monthly revenue", value: "$148,920", note: "+1.8% vs last month" },
  { title: "Hours watched", value: "86,310", note: "-0.6% vs last month" },
  { title: "Churn rate", value: "2.4%", note: "Down from 2.7%" },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Clapperboard aria-hidden className="size-4" />
        </div>
        <span className="font-heading font-semibold">Streaming CRM</span>
        <Badge variant="outline">Preview</Badge>
      </header>
      <Separator />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Subscribers, viewing, billing and campaigns over the last 30 days.
          </p>
        </div>

        <Alert>
          <Info />
          <AlertTitle>You&apos;re looking at a preview</AlertTitle>
          <AlertDescription>
            The figures on this page are sample data. Live numbers will appear here once the
            database is connected.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_STATS.map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="font-heading text-2xl font-semibold tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{stat.note}</CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
