import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEVICE_TYPE_LABELS, MATURITY_LABELS } from "@/constants/constants";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatPercent, formatStars, formatWatchTime } from "@/lib/format";
import { uuidSchema } from "@/validators/common";

import { BarChart } from "../../../../components/bar-chart";
import { BarList } from "../../../../components/bar-list";
import { ChartCard } from "../../../../components/chart-card";
import { DataTable } from "../../../../components/data-table";
import { PageHeader } from "../../../components/page-header";
import { StatTile } from "../../../components/stat-tile";
import {
  getMovieById,
  listMovieCertifications,
  listMovieStarDistribution,
  listMovieViewsByCountry,
  listMovieViewsByDeviceType,
} from "./queries";

export const metadata: Metadata = { title: "Movie · Streaming CRM" };

const TREND_MONTHS = 12;
const TOP_COUNTRIES = 8;

export default async function MoviePage({ params }: { params: Promise<{ movieId: string }> }) {
  const context = await requireAuthContext();
  context.requirePermission("catalog.view");
  const canViewCountries = context.hasPermission("reports.view");

  const movieId = uuidSchema.safeParse((await params).movieId).data;
  if (!movieId) notFound();

  const [movie, starDistribution, viewsByCountry, viewsByDeviceType, certifications] = await Promise.all([
    getMovieById(movieId),
    listMovieStarDistribution(movieId),
    listMovieViewsByCountry(movieId),
    listMovieViewsByDeviceType(movieId),
    listMovieCertifications(movieId),
  ]);
  if (!movie) notFound();

  const certified = certifications.filter((country) => country.certification !== null);
  const uncertified = certifications
    .filter((country) => country.certification === null)
    .sort((a, b) => b.subscribers - a.subscribers || a.countryName.localeCompare(b.countryName));
  const uncoveredSubscribers = uncertified.reduce((sum, country) => sum + country.subscribers, 0);

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          label="Movie"
          title={movie.title}
          description={`Released ${movie.releaseYear} · ${formatWatchTime(movie.runtimeMinutes)} · rated ${MATURITY_LABELS[movie.maturityRating]}`}
        >
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline" className="h-6 border-dashed px-2.5 font-normal">
                {genre}
              </Badge>
            ))}
          </div>
          <Button variant="outline" className="mt-6 border-dashed" nativeButton={false} render={<Link href="/movies" />}>
            <ArrowLeft data-icon="inline-start" aria-hidden />
            All movies
          </Button>
        </PageHeader>

        <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile title="Views" value={formatCount(movie.sessions)} note="Watch sessions across all profiles" />
          <StatTile title="Watch time" value={formatWatchTime(movie.minutesWatched)} note="Total time spent on this movie" />
          <StatTile
            title="Completion rate"
            value={formatPercent(movie.sessions === 0 ? null : movie.completedSessions / movie.sessions, 0)}
            note={
              movie.sessions === 0
                ? "Nobody has watched it yet"
                : `${formatCount(movie.completedSessions)} of ${formatCount(movie.sessions)} sessions reached the end`
            }
          />
          <StatTile
            title="Average rating"
            value={formatStars(movie.averageStars)}
            note={movie.ratings === 0 ? "Not rated yet" : `From ${formatCount(movie.ratings)} ratings`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">

          <ChartCard
            title="Ratings distribution"
            description="This movie's ratings by the stars given."
            isEmpty={movie.ratings === 0}
            emptyDescription="Nobody has rated this movie yet."
          >
            <BarChart
              unit="ratings"
              entries={starDistribution.map((entry) => ({
                label: `${entry.stars} ${entry.stars === 1 ? "star" : "stars"}`,
                value: entry.ratings,
              }))}
            />
          </ChartCard>
           <section className="grid gap-4 lg:grid-row-2">
              <ChartCard
                title="Views by country"
                description={`Where the viewers live. The ${TOP_COUNTRIES} countries with the most views.`}
                isEmpty={viewsByCountry.length === 0}
                emptyDescription="Nobody has watched this movie yet."
              >
                <BarList
                  entries={viewsByCountry.slice(0, TOP_COUNTRIES).map((entry) => ({
                    label: entry.countryName,
                    value: entry.sessions,
                  }))}
                />
              </ChartCard>

              <ChartCard
                title="Views by device"
                description="What kind of device the movie is watched on."
                isEmpty={viewsByDeviceType.length === 0}
                emptyDescription="Nobody has watched this movie yet."
              >
                <BarList
                  entries={viewsByDeviceType.map((entry) => ({
                    label: DEVICE_TYPE_LABELS[entry.deviceType],
                    value: entry.sessions,
                    note: formatPercent(entry.sessions / movie.sessions, 0) + " of views",
                  }))}
                />
              </ChartCard>
          </section>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={`Certified in ${formatCount(certified.length)} ${certified.length === 1 ? "country" : "countries"}`}
            description="Countries where the movie has a local certification."
            isEmpty={certified.length === 0}
            emptyDescription="This movie has no certification anywhere yet."
          >
            <DataTable
              caption="Countries where the movie is certified"
              columns={[{ label: "Country" }, { label: "Certification" }, { label: "Subscribers", align: "right" }]}
              rows={certified.map((country) => ({
                key: country.countryCode,
                cells: [
                  <span key="country" className="font-medium">
                    {country.countryName}
                  </span>,
                  <Badge key="certification" variant="outline" className="px-2.5 font-mono font-normal">
                    {country.certification}
                  </Badge>,
                  formatCount(country.subscribers),
                ],
              }))}
            />
          </ChartCard>

          <ChartCard
            title={`Not certified in ${formatCount(uncertified.length)} ${uncertified.length === 1 ? "country" : "countries"}`}
            description={`${formatCount(uncoveredSubscribers)} subscribers live where the movie has no certification. Countries with the most subscribers come first.`}
            isEmpty={uncertified.length === 0}
            emptyDescription="The movie is certified in every country."
          >
            <div className="max-h-96 overflow-y-auto">
              <DataTable
                caption="Countries where the movie has no certification"
                columns={[{ label: "Country" }, { label: "Subscribers", align: "right" }]}
                rows={uncertified.map((country) => ({
                  key: country.countryCode,
                  cells: [
                    canViewCountries ? (
                      <Link
                        key="country"
                        href={`/countries?countryCode=${country.countryCode}#certification-gaps-heading`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {country.countryName}
                      </Link>
                    ) : (
                      <span key="country" className="font-medium">
                        {country.countryName}
                      </span>
                    ),
                    formatCount(country.subscribers),
                  ],
                }))}
              />
            </div>
          </ChartCard>
        </section>
      </div>
    </main>
  );
}
