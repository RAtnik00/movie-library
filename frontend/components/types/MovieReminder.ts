export type MovieReminder = {
  id: number;
  movie_id: number;
  user_id: number;
  remind_at: string;
  note: string | null;
  created_at: string;
  updated_at: string | null;
  movie: {
    id: number;
    tmdb_id: number;
    title: string;
    poster_path: string | null;
  };
};
