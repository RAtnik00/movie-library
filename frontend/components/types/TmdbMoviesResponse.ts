import { TmdbMovie } from "./TmbdbMovie";

export type TmdbMoviesResponse = {
  page: number;
  results: TmdbMovie[];
};
