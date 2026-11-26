"use client";

import { useId, useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Search param the text is kept in. */
const QUERY_PARAM = "query";

type SearchFieldProps = {
  label: string;
  placeholder: string;
  className?: string;
};

/** Text search kept in the URL. Submitting starts again from the first page. */
export function SearchField({ label, placeholder, className }: SearchFieldProps) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentValue = searchParams.get(QUERY_PARAM) ?? "";

  function applySearch(nextValue: string) {
    const params = new URLSearchParams(searchParams);
    if (nextValue) params.set(QUERY_PARAM, nextValue);
    else params.delete(QUERY_PARAM);
    params.delete("page");

    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(String(new FormData(event.currentTarget).get(QUERY_PARAM) ?? "").trim());
  }

  return (
    <form
      role="search"
      onSubmit={submitSearch}
      className={cn("flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-md", className)}
    >
      <Label htmlFor={id} className="font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          name={QUERY_PARAM}
          type="search"
          // The URL is the source of truth; the key resets the field when a link changes it.
          key={currentValue}
          defaultValue={currentValue}
          placeholder={placeholder}
          maxLength={100}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? (
            <LoaderCircle data-icon="inline-start" aria-hidden className="animate-spin" />
          ) : (
            <Search data-icon="inline-start" aria-hidden />
          )}
          Search
        </Button>
        {currentValue && (
          <Button type="button" variant="ghost" disabled={isPending} onClick={() => applySearch("")}>
            <X data-icon="inline-start" aria-hidden />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
