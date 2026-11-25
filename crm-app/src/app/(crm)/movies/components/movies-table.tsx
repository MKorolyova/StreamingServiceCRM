"use client";

import Link from "next/link";

import { MATURITY_LABELS } from "@/constants/constants";
import { formatCount, formatPercent, formatStars, formatWatchTime } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SortableHead } from "../../../../components/sortable-head";

import type { ListMoviesQuery } from "@/types/catalog";
import type { MovieListEntry } from "../queries";


type MoviesTableProps = {
  moviesEntries: MovieListEntry[];
  sortBy: ListMoviesQuery["sortBy"];
  sortDir: ListMoviesQuery["sortDir"];
};

export function MoviesTable({ moviesEntries, sortBy, sortDir }: MoviesTableProps) {
  return (
    <div className="border">
      <Table aria-label="Movies in the catalog">

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="title" label="Title" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="released" label="Released" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="runtime" label="Runtime" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="maturity" label="Maturity" sortBy={sortBy} sortDir={sortDir} />
            <TableHead className="h-11 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
              Genres
            </TableHead>
            <SortableHead column="views" label="Views" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="completion" label="Completion" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="rating" label="Rating" sortBy={sortBy} sortDir={sortDir} align="right" />
          </TableRow>
        </TableHeader>

        <TableBody>

          {moviesEntries.map((row) => (
            <TableRow key={row.movieId} className="border-dashed">

              <TableCell className="px-3 py-3 font-medium">
                <Link href={`/movies/${row.movieId}`} className="underline-offset-4 hover:underline">
                  {row.title}
                </Link>
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {row.releaseYear}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatWatchTime(row.runtimeMinutes)}
              </TableCell>

              <TableCell className="px-3">
                {MATURITY_LABELS[row.maturityRating]}
              </TableCell>

              <TableCell className="px-3">
                {row.genres.length === 0 ? (
                  <span className="text-muted-foreground">No genre</span>
                ) : (
                  <span className="flex flex-wrap gap-1">
                    {row.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="border-dashed px-2 font-normal">
                        {genre}
                      </Badge>
                    ))}
                  </span>
                )}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatCount(row.views)}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatPercent(row.completionRate, 0)}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatStars(row.averageStars)}
                {row.ratings > 0 && <span className="text-muted-foreground"> ({formatCount(row.ratings)})</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
