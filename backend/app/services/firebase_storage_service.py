from pathlib import Path
from uuid import uuid4

import firebase_admin
from fastapi import HTTPException, UploadFile
from firebase_admin import credentials, storage

from app.core.config import settings


class FirebaseStorageService:
    def __init__(self):
        self.bucket_name = settings.FIREBASE_STORAGE_BUCKET
        self.credentials_path = settings.FIREBASE_CREDENTIALS_PATH

    def upload_avatar(self, user_id: int, file: UploadFile) -> str:
        if not self.bucket_name or not self.credentials_path:
            raise HTTPException(
                status_code=503,
                detail="Firebase Storage is not configured",
            )

        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Avatar must be an image",
            )

        bucket = self._get_bucket()
        extension = Path(file.filename or "").suffix or ".jpg"
        blob_name = f"avatars/{user_id}/{uuid4()}{extension}"
        blob = bucket.blob(blob_name)

        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()

        return blob.public_url

    def _get_bucket(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate(self.credentials_path)
            firebase_admin.initialize_app(
                cred,
                {"storageBucket": self.bucket_name},
            )

        return storage.bucket()
