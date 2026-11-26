"use client";

import { useId, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseISO } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toIsoDate } from "@/lib/dates";
import { formatDateOnly } from "@/lib/format";

/** Earliest month the year dropdown offers. */
const FIRST_MONTH = new Date(2015, 0, 1);

type FilterDateProps = {
  /** Search param this filter reads and writes, as YYYY-MM-DD. */
  param: string;
  label: string;
  /** Earliest date that can be picked, as YYYY-MM-DD. */
  min?: string;
  /** Latest date that can be picked, as YYYY-MM-DD. */
  max?: string;
};

/** Calendar-date filter kept in the URL. Clearing the date removes the filter. */
export function FilterDate({ param, label, min, max }: FilterDateProps) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const value = searchParams.get(param) ?? "";
  const selected = value ? parseISO(value) : undefined;
  const today = new Date();

  const disabled: Matcher[] = [];
  if (min) disabled.push({ before: parseISO(min) });
  if (max) disabled.push({ after: parseISO(max) });

  function applyFilter(nextValue: string) {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams);
    if (nextValue) params.set(param, nextValue);
    else params.delete(param);
    params.delete("page");

    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              disabled={isPending}
              aria-busy={isPending}
              className="w-full justify-start font-normal"
            />
          }
        >
          {isPending ? (
            <LoaderCircle data-icon="inline-start" aria-hidden className="animate-spin" />
          ) : (
            <CalendarIcon data-icon="inline-start" aria-hidden />
          )}
          <span className={value ? undefined : "text-muted-foreground"}>
            {value ? formatDateOnly(value) : "Any date"}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selected}
            defaultMonth={selected ?? (max ? parseISO(max) : today)}
            startMonth={FIRST_MONTH}
            endMonth={today}
            disabled={disabled}
            onSelect={(date) => applyFilter(date ? toIsoDate(date) : "")}
          />
          {value && (
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => applyFilter("")}>
                Clear date
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
