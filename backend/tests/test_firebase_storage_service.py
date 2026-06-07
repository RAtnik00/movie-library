from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.services.firebase_storage_service import FirebaseStorageService


def make_service(
    bucket_name: str | None = "test-bucket",
    credentials_path: str | None = "/fake/firebase.json",
) -> FirebaseStorageService:
    service = FirebaseStorageService()
    service.bucket_name = bucket_name
    service.credentials_path = credentials_path
    return service


def make_upload_file(content_type: str | None = "image/png"):
    return SimpleNamespace(
        content_type=content_type,
        filename="avatar.png",
        file=object(),
    )


def test_upload_avatar_rejects_missing_firebase_config():
    service = make_service(bucket_name=None)

    with pytest.raises(HTTPException) as error:
        service.upload_avatar(user_id=1, file=make_upload_file())

    assert error.value.status_code == 503
    assert error.value.detail == "Firebase Storage is not configured"


def test_upload_avatar_rejects_non_image_file():
    service = make_service()

    with pytest.raises(HTTPException) as error:
        service.upload_avatar(
            user_id=1,
            file=make_upload_file(content_type="application/pdf"),
        )

    assert error.value.status_code == 400
    assert error.value.detail == "Avatar must be an image"


def test_upload_avatar_uploads_file_and_returns_public_url(monkeypatch):
    service = make_service()
    upload_file = make_upload_file()
    created_blob_names = []

    class FakeBlob:
        public_url = "https://storage.test/avatar.png"

        def upload_from_file(self, file_obj, content_type):
            self.uploaded_file = file_obj
            self.uploaded_content_type = content_type

        def make_public(self):
            self.public = True

    class FakeBucket:
        def blob(self, blob_name):
            created_blob_names.append(blob_name)
            self.blob_obj = FakeBlob()
            return self.blob_obj

    fake_bucket = FakeBucket()

    monkeypatch.setattr(service, "_get_bucket", lambda: fake_bucket)

    result = service.upload_avatar(user_id=7, file=upload_file)

    assert result == "https://storage.test/avatar.png"
    assert created_blob_names[0].startswith("avatars/7/")
    assert created_blob_names[0].endswith(".png")
    assert fake_bucket.blob_obj.uploaded_file is upload_file.file
    assert fake_bucket.blob_obj.uploaded_content_type == "image/png"
    assert fake_bucket.blob_obj.public
