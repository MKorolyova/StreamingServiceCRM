import { and, asc, avg, count, desc, eq, ilike, inArray, isNotNull, type SQL, type SQLWrapper } from "drizzle-orm";
import { db } from "@/db";
import { genres, movieGenres, movies, ratings, watchSessions } from "@/db/schema";
import { shareOf } from "@/lib/sql-rates";
import type { ListMoviesQuery, MaturityLevel } from "@/types/catalog";

const ratedMovies = db
  .select({
    movieId: ratings.movieId,
    total: count().as("rating_total"),
    averageStars: avg(ratings.stars).mapWith(Number).as("average_stars"),
  })
  .from(ratings)
  .groupBy(ratings.movieId)
  .as("rated_movies");

const MOVIE_SORT_COLUMNS: Record<ListMoviesQuery["sortBy"], SQLWrapper> = {
  title: movies.title,
  released: movies.releaseYear,
  runtime: movies.runtimeMinutes,
  maturity: movies.maturityRating,
  views: count(watchSessions.movieId),
  completion: shareOf(watchSessions.completed),
  rating: ratedMovies.averageStars,
};

function buildMovieConditions(params: ListMoviesQuery): SQL | undefined {
  return and(
    params.query ? ilike(movies.title, `%${params.query}%`) : undefined,
    params.maturityRating ? eq(movies.maturityRating, params.maturityRating) : undefined,
    params.releaseYear ? eq(movies.releaseYear, params.releaseYear) : undefined,
    params.genreId ? inArray( movies.movieId, db.select({ movieId: movieGenres.movieId }).from(movieGenres).where(eq(movieGenres.genreId, params.genreId))) : undefined,
  );
}

export async function getMoviesTotal(params: ListMoviesQuery): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(movies)
    .where(buildMovieConditions(params));

  return row?.total ?? 0;
}

export type MovieListEntry = {
  movieId: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  maturityRating: MaturityLevel;
  genres: string[];
  views: number;
  completionRate: number | null;
  ratings: number;
  averageStars: number | null;
};

export async function listMovies(params: ListMoviesQuery): Promise<MovieListEntry[]> {

  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = MOVIE_SORT_COLUMNS[params.sortBy];

  const rows = await db
    .select({
      movieId: movies.movieId,
      title: movies.title,
      releaseYear: movies.releaseYear,
      runtimeMinutes: movies.runtimeMinutes,
      maturityRating: movies.maturityRating,
      views: count(watchSessions.movieId),
      completionRate: shareOf(watchSessions.completed),
      ratings: ratedMovies.total,
      averageStars: ratedMovies.averageStars,
    })
    .from(movies)
    .leftJoin(watchSessions, eq(watchSessions.movieId, movies.movieId))
    .leftJoin(ratedMovies, eq(ratedMovies.movieId, movies.movieId))
    .where(buildMovieConditions(params))
    .groupBy(movies.movieId, ratedMovies.total, ratedMovies.averageStars)
    .orderBy(
      desc(isNotNull(sortColumn)),
      direction(sortColumn),
      movies.title,
      movies.movieId,
    )
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);

  if (rows.length === 0) return [];

  const genreRows = await db
    .select({ movieId: movieGenres.movieId, name: genres.name })
    .from(movieGenres)
    .innerJoin(genres, eq(genres.genreId, movieGenres.genreId))
    .where(inArray(movieGenres.movieId, rows.map((row) => row.movieId)))
    .orderBy(genres.name);

  const genresByMovie = Map.groupBy(genreRows, (genre) => genre.movieId);

  return rows.map((row) => ({
    movieId: row.movieId,
    title: row.title,
    releaseYear: row.releaseYear,
    runtimeMinutes: row.runtimeMinutes,
    maturityRating: row.maturityRating,
    genres: genresByMovie.get(row.movieId)?.map((genre) => genre.name) ?? [],
    views: row.views,
    completionRate: row.completionRate,
    ratings: row.ratings ?? 0,
    averageStars: row.averageStars,
  }));
}

export type MovieFilterOptions = {
  genres: { genreId: string; name: string }[];
  releaseYears: number[];
};

export async function getMovieFilterOptions(): Promise<MovieFilterOptions> {
  const [genreRows, yearRows] = await Promise.all([
    db
      .selectDistinct({ genreId: genres.genreId, name: genres.name })
      .from(genres)
      .innerJoin(movieGenres, eq(movieGenres.genreId, genres.genreId))
      .orderBy(genres.name),

    db.selectDistinct({ releaseYear: movies.releaseYear }).from(movies).orderBy(desc(movies.releaseYear)),
  ]);

  return {
    genres: genreRows,
    releaseYears: yearRows.map((row) => row.releaseYear),
  };
}
