import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clapperboard, SearchX } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MATURITY_LABELS } from "@/constants/constants";
import { maturityLevelEnum } from "@/db/schema";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatPercent, formatStars, formatWatchTime } from "@/lib/format";

import { DataTable } from "../../components/data-table";
import { FilterSelect } from "../../components/filter-select";
import { buildListHref, type PageSearchParams } from "../../components/list-href";
import { ListPagination } from "../../components/list-pagination";
import { PageHeader } from "../../components/page-header";
import { SearchField } from "../../components/search-field";
import { getMovieFilterOptions, listMovies } from "./queries";
import { moviesPageQuerySchema } from "./validators";

export const metadata: Metadata = { title: "Movies · Streaming CRM" };

const PAGE_SIZE = 20;

export default async function MoviesPage({ searchParams }: { searchParams: PageSearchParams }) {
  const context = await requireAuthContext();
  context.requirePermission("catalog.view");

  const { page, sort, ...filters } = moviesPageQuerySchema.parse(await searchParams);
  if (filters.query === "") filters.query = undefined;

  const [{ entries, total }, filterOptions] = await Promise.all([
    listMovies(page, PAGE_SIZE, filters, sort),
    getMovieFilterOptions(),
  ]);

  const hasFilters = Object.values(filters).some((value) => value !== undefined);
  const hrefForPage = (target: number) =>
    buildListHref("/movies", { ...filters, sort: sort === "title" ? null : sort, page: target > 1 ? target : null });

  // A page past the end, for example from an old link: go to the last real page.
  if (total > 0 && entries.length === 0) redirect(hrefForPage(Math.ceil(total / PAGE_SIZE)));

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Movies"
          title="The catalog"
          description="Every movie with how often it is watched, how often it is finished and how it is rated. Open one for its trends and certifications."
        />

        <div className="flex flex-wrap items-end gap-4">
          <SearchField label="Search by title" placeholder="Movie title" />
          <FilterSelect
            param="genre"
            label="Genre"
            allLabel="All genres"
            options={filterOptions.genres.map((genre) => ({ value: genre.genreId, label: genre.name }))}
          />
          <FilterSelect
            param="maturity"
            label="Maturity rating"
            allLabel="All ratings"
            options={maturityLevelEnum.enumValues.map((level) => ({ value: level, label: MATURITY_LABELS[level] }))}
          />
          <FilterSelect
            param="year"
            label="Release year"
            allLabel="All years"
            options={filterOptions.releaseYears.map((year) => ({ value: String(year), label: String(year) }))}
          />
          <FilterSelect
            param="sort"
            label="Sort by"
            allLabel="Title (A–Z)"
            options={[
              { value: "views", label: "Most viewed" },
              { value: "completion", label: "Highest completion" },
              { value: "rating", label: "Highest rated" },
              { value: "newest", label: "Newest release" },
            ]}
          />
        </div>

        {total === 0 && !hasFilters ? (
          <EmptyState
            icon={Clapperboard}
            title="No movies yet"
            description="Movies appear here as soon as the first one is added to the catalog."
          />
        ) : total === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No movies match"
            description="No movie in the catalog fits this search and these filters."
          >
            <Button variant="outline" nativeButton={false} render={<Link href="/movies" />}>
              Clear search and filters
            </Button>
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-4">
            <DataTable
              caption="Movies in the catalog"
              columns={[
                { label: "Title" },
                { label: "Released", align: "right" },
                { label: "Runtime", align: "right" },
                { label: "Maturity" },
                { label: "Genres" },
                { label: "Views", align: "right" },
                { label: "Completion", align: "right" },
                { label: "Rating", align: "right" },
              ]}
              rows={entries.map((movie) => ({
                key: movie.movieId,
                cells: [
                  <Link
                    key="title"
                    href={`/movies/${movie.movieId}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {movie.title}
                  </Link>,
                  movie.releaseYear,
                  formatWatchTime(movie.runtimeMinutes),
                  MATURITY_LABELS[movie.maturityRating],
                  movie.genres.length === 0 ? (
                    <span key="genres" className="text-muted-foreground">
                      No genre
                    </span>
                  ) : (
                    <span key="genres" className="flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="border-dashed px-2 font-normal">
                          {genre}
                        </Badge>
                      ))}
                    </span>
                  ),
                  formatCount(movie.sessions),
                  formatPercent(movie.sessions === 0 ? null : movie.completedSessions / movie.sessions, 0),
                  <span key="rating">
                    {formatStars(movie.averageStars)}
                    {movie.ratings > 0 && <span className="text-muted-foreground"> ({formatCount(movie.ratings)})</span>}
                  </span>,
                ],
              }))}
            />
            <ListPagination page={page} pageSize={PAGE_SIZE} total={total} hrefForPage={hrefForPage} />
          </div>
        )}
      </div>
    </main>
  );
}
