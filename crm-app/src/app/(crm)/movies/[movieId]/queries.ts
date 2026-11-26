import { and, avg, count, desc, eq, sum } from "drizzle-orm";

import type { MaturityLevel } from "@/constants/constants";
import { db } from "@/db";
import {
  countries,
  devices,
  genres,
  movieCertifications,
  movieGenres,
  movies,
  ratings,
  subscribers,
  watchSessions,
} from "@/db/schema";
import type { DeviceType } from "@/types/devices";

export type MovieDetails = {
  movieId: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  maturityRating: MaturityLevel;
  genres: string[];
  sessions: number;
  completedSessions: number;
  minutesWatched: number;
  ratings: number;
  averageStars: number | null;
};

export async function getMovieById(movieId: string): Promise<MovieDetails | null> {
  const [[movie], genreRows, [watched], completedSessions, [rated]] = await Promise.all([
    db
      .select({
        movieId: movies.movieId,
        title: movies.title,
        releaseYear: movies.releaseYear,
        runtimeMinutes: movies.runtimeMinutes,
        maturityRating: movies.maturityRating,
      })
      .from(movies)
      .where(eq(movies.movieId, movieId)),

    db
      .select({ 
        name: genres.name 
      })
      .from(movieGenres)
      .innerJoin(genres, eq(genres.genreId, movieGenres.genreId))
      .where(eq(movieGenres.movieId, movieId))
      .orderBy(genres.name),

    db
      .select({
        sessions: count(),
        minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number),
      })
      .from(watchSessions)
      .where(eq(watchSessions.movieId, movieId)),

    db.$count(watchSessions, and(
      eq(watchSessions.movieId, movieId), 
      eq(watchSessions.completed, true)
    )),
    
    db
      .select({
        ratings: count(),
        averageStars: avg(ratings.stars).mapWith(Number),
      })
      .from(ratings)
      .where(eq(ratings.movieId, movieId)),
  ]);

  if (!movie) return null;

  return {
    movieId: movie.movieId,
    title: movie.title,
    releaseYear: movie.releaseYear,
    runtimeMinutes: movie.runtimeMinutes,
    maturityRating: movie.maturityRating,
    genres: genreRows.map((genre) => genre.name),
    sessions: watched?.sessions ?? 0,
    completedSessions,
    minutesWatched: watched?.minutesWatched ?? 0,
    ratings: rated?.ratings ?? 0,
    averageStars: rated?.averageStars ?? null,
  };
}

export type StarCount = {
  stars: number;
  ratings: number;
};

export async function listMovieStarDistribution(movieId: string): Promise<StarCount[]> {
  const [oneStar, twoStars, threeStars, fourStars, fiveStars] =  await Promise.all([
      db.$count(ratings, and(eq(ratings.movieId, movieId), eq(ratings.stars, 1))),
      db.$count(ratings, and(eq(ratings.movieId, movieId), eq(ratings.stars, 2))),
      db.$count(ratings, and(eq(ratings.movieId, movieId), eq(ratings.stars, 3))),
      db.$count(ratings, and(eq(ratings.movieId, movieId), eq(ratings.stars, 4))),
      db.$count(ratings, and(eq(ratings.movieId, movieId), eq(ratings.stars, 5))),
  ]);
  return [
    { stars: 1, ratings: oneStar },
    { stars: 2, ratings: twoStars },
    { stars: 3, ratings: threeStars },
    { stars: 4, ratings: fourStars },
    { stars: 5, ratings: fiveStars },
  ];
}

export type CountryViews = {
  countryName: string;
  sessions: number;
};

export async function listMovieViewsByCountry(movieId: string): Promise<CountryViews[]> {
  return db
    .select({ countryName: countries.name, sessions: count() })
    .from(watchSessions)
    .innerJoin(subscribers, eq(subscribers.subscriberId, watchSessions.subscriberId))
    .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
    .where(eq(watchSessions.movieId, movieId))
    .groupBy(countries.name)
    .orderBy(desc(count()), countries.name);
}

export type DeviceTypeViews = {
  deviceType: DeviceType;
  sessions: number;
};

export async function listMovieViewsByDeviceType(movieId: string): Promise<DeviceTypeViews[]> {
  return db
    .select({ deviceType: devices.type, sessions: count() })
    .from(watchSessions)
    .innerJoin(devices, eq(devices.deviceId, watchSessions.deviceId))
    .where(eq(watchSessions.movieId, movieId))
    .groupBy(devices.type)
    .orderBy(desc(count()));
}

export type CountryCertification = {
  countryCode: string;
  countryName: string;
  certification: string | null;
  subscribers: number;
};

export async function listMovieCertifications(movieId: string): Promise<CountryCertification[]> {
  return db
    .select({
      countryCode: countries.countryCode,
      countryName: countries.name,
      certification: movieCertifications.certification,
      subscribers: count(subscribers.subscriberId),
    })
    .from(countries)
    .leftJoin(
      movieCertifications,
      and(
        eq(movieCertifications.countryCode, countries.countryCode),
        eq(movieCertifications.movieId, movieId),
      ),
    )
    .leftJoin(subscribers, eq(subscribers.countryCode, countries.countryCode))
    .groupBy(countries.countryCode, countries.name, movieCertifications.certification)
    .orderBy(countries.name);
}
