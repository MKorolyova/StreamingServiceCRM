import type { ReactNode } from "react";
import { cn } from "cn";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DataTableColumn = {
  label: string;
  align?: "left" | "right";
};

export type DataTableRow = {
  key: string;
  cells: ReactNode[];
};

type DataTableProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  caption: string;
};

export function DataTable({ columns, rows, caption }: DataTableProps) {
  return (
    <div className="border">
      <Table aria-label={caption}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={cn(
                  "h-11 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase",
                  column.align === "right" && "text-right",
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key} className="border-dashed">
              {row.cells.map((cell, index) => (
                <TableCell
                  key={columns[index].label}
                  className={cn("px-3 py-3", columns[index].align === "right" && "text-right tabular-nums")}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
