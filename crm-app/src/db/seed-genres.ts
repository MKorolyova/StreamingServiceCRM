export const SEED_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Sport",
  "Thriller",
  "War",
  "Western",
] as const;

export type SeedGenre = (typeof SEED_GENRES)[number];
