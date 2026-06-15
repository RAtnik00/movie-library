import { MovieComment } from "@/components/types/MovieComment";
import { apiRequest } from "./client";

export async function getMovieComments(
  tmdb_id: number,
): Promise<MovieComment[]> {
  return apiRequest<MovieComment[]>(`/api/comments/movie/${tmdb_id}`);
}

export async function createComment(
  tmdb_id: number,
  text: string,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tmdb_id, text }),
  });
}

export async function updateComment(
  comment_id: number,
  text: string,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>(`/api/comments/${comment_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ text }),
  });
}

export async function deleteComment(
  comment_id: number,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>(`/api/comments/${comment_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
