from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.movies import get_movies_api_client
from app.models.user import User
from app.schemas.movie import (
    MovieReminderCreateRequest,
    MovieReminderResponse,
    MovieReminderUpdateRequest,
)
from app.services.movies_api import MoviesAPIClient
from app.services.reminder_service import ReminderService


router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.post("", response_model=MovieReminderResponse, status_code=201)
def create_reminder(
    body: MovieReminderCreateRequest,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
    current_user: User = Depends(get_current_user),
):
    service = ReminderService(db)
    return service.create(
        current_user,
        body.tmdb_id,
        body.remind_at,
        body.note,
        client,
    )


@router.get("", response_model=list[MovieReminderResponse])
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReminderService(db)
    return service.get_all(current_user)


@router.get("/upcoming", response_model=list[MovieReminderResponse])
def get_upcoming_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReminderService(db)
    return service.get_upcoming(current_user)


@router.patch("/{reminder_id}", response_model=MovieReminderResponse)
def update_reminder(
    reminder_id: int,
    body: MovieReminderUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReminderService(db)
    reminder = service.update(
        current_user,
        reminder_id,
        body.remind_at,
        body.note,
    )

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    return reminder


@router.delete("/{reminder_id}", response_model=MovieReminderResponse)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReminderService(db)
    reminder = service.remove(current_user, reminder_id)

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    return reminder