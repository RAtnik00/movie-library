export type TmdbMovie = {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  adult?: boolean;
  release_date?: string;
  vote_average?: number;
  director?: string | null;
};
