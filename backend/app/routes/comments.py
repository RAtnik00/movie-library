from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.movies import get_movies_api_client
from app.models.user import User
from app.schemas.movie import (
    MovieCommentCreateRequest,
    MovieCommentResponse,
    MovieCommentUpdateRequest,
)
from app.services.comment_service import CommentService
from app.services.movies_api import MoviesAPIClient


router = APIRouter(prefix="/comments", tags=["comments"])


@router.post("", response_model=MovieCommentResponse, status_code=201)
def create_comment(
    body: MovieCommentCreateRequest,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
    current_user: User = Depends(get_current_user),
):
    service = CommentService(db)
    return service.create(current_user, body.tmdb_id, body.text, client)


@router.get("/movie/{tmdb_id}", response_model=list[MovieCommentResponse])
def get_movie_comments(
    tmdb_id: int,
    db: Session = Depends(get_db),
):
    service = CommentService(db)
    return service.get_for_movie(tmdb_id)


@router.patch("/{comment_id}", response_model=MovieCommentResponse)
def update_comment(
    comment_id: int,
    body: MovieCommentUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CommentService(db)
    comment = service.update(current_user, comment_id, body.text)

    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    return comment


@router.delete("/{comment_id}", response_model=MovieCommentResponse)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CommentService(db)
    comment = service.remove(current_user, comment_id)

    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    return comment
