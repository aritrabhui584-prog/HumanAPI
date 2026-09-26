from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from refresh_model import RefreshToken
from refresh_schema import RefreshTokenRequest
from refresh_token_utils import verify_refresh_token, hash_refresh_token
from refresh_token import create_refresh_token
from jwt_utils import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/refresh")
def refresh_access_token(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):

    # =========================
    # Find active refresh token
    # =========================

    token_records = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.revoked == 0
        )
        .all()
    )

    matched_record = None

    for record in token_records:

        if verify_refresh_token(
            data.refresh_token,
            record.token_hash
        ):
            matched_record = record
            break

    # =========================
    # Invalid token
    # =========================

    if not matched_record:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    # =========================
    # Check expiration
    # =========================

    expires_at = matched_record.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if datetime.now(timezone.utc) >= expires_at:

        matched_record.revoked = 1
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Refresh token has expired"
        )

    # =========================
    # Find user
    # =========================

    user = db.query(User).filter(
        User.id == matched_record.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # =========================
    # Check account status
    # =========================

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account is inactive"
        )

    # =========================
    # Revoke old refresh token
    # =========================

    matched_record.revoked = 1

    # =========================
    # Generate new tokens
    # =========================

    new_access_token = create_access_token(
        user.id
    )

    new_refresh_token, new_expires_at = (
        create_refresh_token()
    )

    # =========================
    # Hash new refresh token
    # =========================

    new_refresh_token_hash = hash_refresh_token(
        new_refresh_token
    )

    # =========================
    # Store new refresh token
    # =========================

    new_refresh_token_record = RefreshToken(
        user_id=user.id,
        token_hash=new_refresh_token_hash,
        expires_at=new_expires_at,
        revoked=0
    )

    db.add(new_refresh_token_record)

    db.commit()

    # =========================
    # Return new tokens
    # =========================

    return {
        "message": "Tokens refreshed successfully",
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }   