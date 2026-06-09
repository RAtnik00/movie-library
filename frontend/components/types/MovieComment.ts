export type CommentUser = {
  id: number;
  username: string;
};

export type MovieComment = {
  id: number;
  movie_id: number;
  user_id: number;
  text: string;
  created_at: string;
  updated_at: string | null;
  user: CommentUser;
};
