"use client";

import { useId, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/** Stands for "no filter"; never written to the URL. */
const ALL_VALUE = "__all__";

export type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  /** Search param this filter reads and writes. */
  param: string;
  label: string;
  /** Label of the choice that clears the filter, such as "All countries". */
  allLabel: string;
  options: FilterOption[];
};

/** Dropdown filter kept in the URL, so a filtered view can be linked to and survives a refresh. */
export function FilterSelect({ param, label, allLabel, options }: FilterSelectProps) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const items = [{ value: ALL_VALUE, label: allLabel }, ...options];
  const value = searchParams.get(param) ?? ALL_VALUE;

  function applyFilter(nextValue: string | null) {
    const params = new URLSearchParams(searchParams);
    if (nextValue === null || nextValue === ALL_VALUE) params.delete(param);
    else params.set(param, nextValue);
    params.delete("page");

    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  return (
    <div className="flex min-w-40 flex-col gap-1.5">
      <Label htmlFor={id} className="font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </Label>
      <Select items={items} value={value} onValueChange={applyFilter} disabled={isPending}>
        <SelectTrigger id={id} className="w-full" aria-busy={isPending}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
