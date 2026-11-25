import type { Metadata } from "next";
import { requireAuthContext } from "@/lib/auth/auth-context";
import type { ListMoviesQuery } from "@/types/catalog";
import type { PageSearchParams } from "@/types/search-params";
import { paginationMoviesQuerySchema } from "@/validators/catalog";
import { MoviesListTab } from "../components/movies-all-movies-tab";

export const metadata: Metadata = { title: "Movies · Streaming CRM" };

export default async function MoviesPage({ searchParams }: { searchParams: PageSearchParams }) {

  const context = await requireAuthContext();
  context.requirePermission("catalog.view");
  const params: ListMoviesQuery = paginationMoviesQuerySchema.safeParse(await searchParams).data ?? paginationMoviesQuerySchema.parse({});

  return (
    <div className="px-2 py-2">

        <MoviesListTab
          page={params.page}
          pageSize={params.pageSize}
          query={params.query}
          sortDir={params.sortDir}
          sortBy={params.sortBy}
          genreId={params.genreId}
          maturityRating={params.maturityRating}
          releaseYear={params.releaseYear}
        />

    </div>
  );
}
