"use client";

import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

export type SubscriberProfileRow = {
  profileName: string;
  maturityLabel: string;
  language: string;
  isDefault: boolean;
};

type SubscriberProfilesPopoverProps = {
  subscriberName: string;
  profiles: SubscriberProfileRow[];
};

/** "3 profiles" button that opens the list of profiles attached to a subscriber. */
export function SubscriberProfilesPopover({ subscriberName, profiles }: SubscriberProfilesPopoverProps) {
  if (profiles.length === 0) return <span className="text-muted-foreground">No profiles</span>;

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" size="sm" className="border-dashed font-normal tabular-nums" />}
      >
        {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
        <ChevronDown data-icon="inline-end" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-0 p-0 shadow-none ring-border">
        <PopoverHeader className="border-b border-dashed px-4 py-3">
          <PopoverTitle>Profiles of {subscriberName}</PopoverTitle>
        </PopoverHeader>
        <ul className="max-h-72 overflow-y-auto">
          {profiles.map((profile) => (
            <li
              key={profile.profileName}
              className="flex items-center justify-between gap-3 border-b border-dashed px-4 py-2.5 last:border-b-0"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-medium">{profile.profileName}</span>
                {profile.isDefault && (
                  <Badge variant="outline" className="border-dashed px-2 font-mono text-[0.65rem] font-normal tracking-wider text-muted-foreground uppercase">
                    Default
                  </Badge>
                )}
              </span>
              <span className="shrink-0 font-mono text-[0.7rem] tracking-wider text-muted-foreground uppercase">
                {profile.maturityLabel} · {profile.language}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
