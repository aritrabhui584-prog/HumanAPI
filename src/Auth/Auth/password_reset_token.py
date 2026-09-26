import hashlib
import secrets
from datetime import datetime, timedelta, timezone


RESET_TOKEN_EXPIRE_MINUTES = 10


def create_password_reset_token():
    token = secrets.token_urlsafe(32)

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    )

    return token, expires_at


def hash_password_reset_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()