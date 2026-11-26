import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MATURITY_LABELS } from "@/constants/constants";
import type { Profile } from "@/types/subscribers";

export function SubscriberProfiles({ profiles }: { profiles: Profile[] }) {
  
  if (profiles.length === 0) {
    return <p className="py-2 text-muted-foreground">This subscriber has no profiles yet.</p>;
  }

  return (
    <Table className="text-[0.8rem]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {["Profile", "Maturity", "Language"].map((heading) => (
            <TableHead
              key={heading}
              className="h-8 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase border-b"
            >
              {heading}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.profileName} className="border-dashed hover:bg-transparent">
            <TableCell>
              <span className="flex items-center gap-2">
                <span className="font-medium">{profile.profileName}</span>
                {profile.isDefault && (
                  <Badge
                    variant="outline"
                    className="border-dashed px-2 font-mono text-[0.65rem] font-normal tracking-wider text-muted-foreground uppercase"
                  >
                    Default
                  </Badge>
                )}
              </span>
            </TableCell>
            <TableCell>{MATURITY_LABELS[profile.maturityLevel]}</TableCell>
            <TableCell>{profile.language}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
