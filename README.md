# Movie Library Backend

Backend-only documentation for the Movie Library project. The frontend is intentionally not covered here.

## Stack

- Python 3.14
- FastAPI
- PostgreSQL 17
- SQLAlchemy
- Alembic
- Pytest
- Docker Compose

## Backend Structure

```text
backend/
  app/
    core/            # settings and security helpers
    dependencies/    # FastAPI dependencies
    models/          # SQLAlchemy models
    repositories/    # database access layer
    routes/          # HTTP routes
    schemas/         # Pydantic schemas
    services/        # business logic and external API clients
    main.py          # FastAPI app entrypoint
  alembic/           # database migrations
  tests/             # backend tests
```

## Environment Variables

Create `backend/.env` before running the backend. Do not commit real secrets.

```env
DB_NAME=movie_library
DB_USER=movie_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5433

SECRET_KEY=change_me
ACCESS_TOKEN_EXPIRE_MINUTES=30

TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3

SMTP_HOST=your_smtp_host
SMTP_PORT=465
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_USE_SSL=true
SMTP_FROM_EMAIL=no-reply@example.com
FRONTEND_RESET_PASSWORD_URL=http://localhost:8081/reset-password

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta

FIREBASE_STORAGE_BUCKET=your_bucket_name
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
```

When running through Docker Compose, `DB_HOST` and `DB_PORT` are overridden for the backend container:

```text
DB_HOST=db
DB_PORT=5432
```

## Run With Docker

From the project root:

```bash
docker compose up -d --build backend
```

The backend will be available at:

```text
http://localhost:8000
```

Useful Docker commands:

```bash
docker compose ps
docker compose logs -f backend
docker compose down
```

## Run Locally

Start PostgreSQL first. The easiest option is to run only the database container:

```bash
docker compose up -d db
```

Then run the backend locally:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If you run locally against the Compose database, use:

```env
DB_HOST=localhost
DB_PORT=5433
```

## Database Migrations

Run migrations inside the backend environment:

```bash
cd backend
alembic upgrade head
```

With Docker:

```bash
docker compose exec backend alembic upgrade head
```

Create a new migration:

```bash
cd backend
alembic revision --autogenerate -m "describe_change"
```

## Tests

Run all backend tests:

```bash
cd backend
pytest
```

Or from the project root with the existing virtual environment:

```bash
./.venv/bin/pytest -q backend/tests
```

Run tests inside Docker:

```bash
docker compose exec backend pytest -q
```

## API Docs

FastAPI exposes interactive documentation after the backend starts:

```text
http://localhost:8000/docs
http://localhost:8000/openapi.json
```

## Main Routes

Health:

```text
GET /
```

Auth:

```text
POST  /auth/register
POST  /auth/login
POST  /auth/logout
POST  /auth/refresh
GET   /auth/me
PATCH /auth/avatar
POST  /auth/avatar/upload
```

Movies:

```text
GET /api/movies
GET /api/movies/search
GET /api/movies/{movie_id}
```

Collections:

```text
POST   /api/favorites
GET    /api/favorites
DELETE /api/favorites/{tmdb_id}

POST   /api/watchlist
GET    /api/watchlist
DELETE /api/watchlist/{tmdb_id}

POST   /api/watched
GET    /api/watched
DELETE /api/watched/{tmdb_id}
PATCH  /api/watched/{tmdb_id}/rating
```

Comments:

```text
POST   /api/comments
GET    /api/comments/movie/{tmdb_id}
PATCH  /api/comments/{comment_id}
DELETE /api/comments/{comment_id}
```

Reminders:

```text
POST   /api/reminders
GET    /api/reminders
GET    /api/reminders/upcoming
PATCH  /api/reminders/{reminder_id}
DELETE /api/reminders/{reminder_id}
```

AI:

```text
POST /api/ai/movie-assistant
```

## Notes

- Most `/api/*` routes require a Bearer access token.
- TMDB is used for movie data.
- Gemini is used by the AI assistant route.
- SMTP settings are used for password reset email flows.
- Firebase storage is used for avatar uploads when configured.
