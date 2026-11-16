import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatTileProps = {
  title: string;
  value: string;
  note: string;
};

/** One headline number with a line of context under it. */
export function StatTile({ title, value, note }: StatTileProps) {
  return (
    <Card className="gap-1 border border-dashed bg-transparent ring-0 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="mt-1 text-3xl tracking-tight tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{note}</CardContent>
    </Card>
  );
}
