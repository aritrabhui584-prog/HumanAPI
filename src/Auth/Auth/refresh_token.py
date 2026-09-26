import os
import secrets

from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv


load_dotenv()


REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_refresh_token():
    """
    Generate a secure random refresh token.
    """

    token = secrets.token_urlsafe(64)

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return token, expires_at


def is_refresh_token_expired(expires_at):
    """
    Check whether a refresh token has expired.
    """

    return datetime.now(timezone.utc) >= expires_at