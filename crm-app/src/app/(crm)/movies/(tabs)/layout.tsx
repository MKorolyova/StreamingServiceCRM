import { PageHeader } from "../../../components/page-header";
import { MoviesTabs } from "../components/movies-tabs";

export default function MoviesLayout({ children }: LayoutProps<"/movies">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Movies"
          title="The catalog"
          description="Every movie with how often it is watched, how often it is finished and how it is rated. Open one for its trends and certifications."
        />

        <MoviesTabs />

        {children}
      </div>
    </main>
  );
}
