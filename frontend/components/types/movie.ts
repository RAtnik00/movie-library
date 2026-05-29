export type Movie = {
  id: string;
  title: string;
  director: string;
  score: number;
  adult: boolean;
  favorite: boolean;
  watched: boolean;
  watchlisted: boolean;
  poster: string;
  desc: string;
  release_date: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
};
