"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";

type SortableHeadProps<Column extends string> = {
  column: Column;
  label: string;
  sortBy: Column;
  sortDir: "asc" | "desc";
  align?: "left" | "right";
};

export function SortableHead<Column extends string>({
  column,
  label,
  sortBy,
  sortDir,
  align = "left",
}: SortableHeadProps<Column>) {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSorted = sortBy === column;
  const direction = sortDir === "asc" ? "desc" : "asc";

  const params = new URLSearchParams(searchParams);

  params.set("sortBy", column);
  params.set("sortDir", direction);
  params.delete("page");

  return (
    <TableHead
      className={cn(
        "h-11 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase",
        align === "right" && "text-right",
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="-mx-2 px-2 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase"
        nativeButton={false}
        render={<Link href={`${pathname}?${params}`} scroll={false} />}
      >
        {label}
        <span data-icon="inline-end" aria-hidden className="flex flex-col">
          <ChevronUp className={cn("-mb-1 size-3", isSorted && sortDir === "asc" ? "text-foreground" : "opacity-40")} />
          <ChevronDown className={cn("size-3", isSorted && sortDir === "desc" ? "text-foreground" : "opacity-40")} />
        </span>
      </Button>
    </TableHead>
  );
}
