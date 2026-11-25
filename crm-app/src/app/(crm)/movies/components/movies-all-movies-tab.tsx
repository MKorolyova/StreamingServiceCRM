import Link from "next/link";
import { redirect } from "next/navigation";
import { Clapperboard, SearchX } from "lucide-react";

import { MATURITY_LABELS } from "@/constants/constants";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FilterSelect } from "../../../../components/filter-select";
import { SearchField } from "../../../components/search-field";
import { ListPagination } from "../../../components/list-pagination";
import { Corners } from "../../../components/landing-primitives";

import { MoviesTable } from "./movies-table";

import { maturityLevelEnum } from "@/db/schema";

import type { ListMoviesQuery } from "@/types/catalog";
import { getMovieFilterOptions, getMoviesTotal, listMovies } from "../queries";


function moviesHref(params: Partial<ListMoviesQuery>): string {

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);
  if (params.genreId) search.set("genreId", params.genreId);
  if (params.maturityRating) search.set("maturityRating", params.maturityRating);
  if (params.releaseYear) search.set("releaseYear", String(params.releaseYear));

  return `/movies?${search}`;
}

export async function MoviesListTab(params: ListMoviesQuery) {

  const [moviesEntries, moviesTotal, filterOptions] = await Promise.all([
    listMovies(params),
    getMoviesTotal(params),
    getMovieFilterOptions(),
  ]);

  if (moviesTotal > 0 && moviesEntries.length === 0) {
    redirect(moviesHref({ ...params, page: Math.ceil(moviesTotal / params.pageSize) }));
  }

  const hasFilters = Boolean(params.genreId || params.maturityRating || params.releaseYear);
  const hasSearch = Boolean(params.query);

  if (moviesTotal === 0 && !hasFilters && !hasSearch) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="No movies yet"
        description="Movies appear here as soon as the first one is added to the catalog."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">

      <Card size="sm" className="relative rounded-none bg-background lg:sticky lg:top-6">
        <Corners className="text-primary" />

        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          <FilterSelect
            param="genreId"
            label="Genre"
            allLabel="All genres"
            options={filterOptions.genres.map((genre) => ({ value: genre.genreId, label: genre.name }))}
          />

          <FilterSelect
            param="maturityRating"
            label="Maturity rating"
            allLabel="All ratings"
            options={maturityLevelEnum.enumValues.map((level) => ({ value: level, label: MATURITY_LABELS[level] }))}
          />

          <FilterSelect
            param="releaseYear"
            label="Release year"
            allLabel="All years"
            options={filterOptions.releaseYears.map((year) => ({ value: String(year), label: String(year) }))}
          />

          {hasFilters && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={moviesHref({ pageSize: params.pageSize, query: params.query, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">

        <SearchField label="Search by title" placeholder="Movie title" className="sm:max-w-none" />

        {moviesTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No movies match"
            description="No movie in the catalog fits this search and these filters. Clear them to see more."
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={moviesHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear search and filters
            </Button>
          </EmptyState>

        ) : (
          <>
            <MoviesTable moviesEntries={moviesEntries} sortBy={params.sortBy} sortDir={params.sortDir} />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={moviesTotal}
              hrefForPage={(target) => moviesHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
