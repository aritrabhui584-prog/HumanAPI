from datetime import datetime, timezone
import hashlib

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from password_utils import hash_password, verify_password
from password_reset_schema import PasswordResetRequest
from password_reset_model import PasswordResetToken
from refresh_model import RefreshToken
from plimiter import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =====================================================
# Database Dependency
# =====================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =====================================================
# Password Strength Validation
# =====================================================

def validate_password_strength(password: str):

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not any(char.isupper() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not any(char.islower() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )

    if not any(not char.isalnum() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character"
        )


# =====================================================
# Reset Password
# =====================================================

@router.post("/reset-password")
@limiter.limit("5/minute")
def reset_password(
    request: Request,
    data: PasswordResetRequest,
    db: Session = Depends(get_db)
):

    # =================================================
    # Check Reset Token
    # =================================================

    if not data.reset_token:

        raise HTTPException(
            status_code=400,
            detail="Reset token is required"
        )


    # =================================================
    # Hash Reset Token
    # =================================================

    token_hash = hashlib.sha256(
        data.reset_token.encode("utf-8")
    ).hexdigest()


    # =================================================
    # Find Reset Token
    # =================================================

    reset_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.is_used == 0
        )
        .first()
    )

    if not reset_record:

        raise HTTPException(
            status_code=400,
            detail="Invalid or already used reset token"
        )


    # =================================================
    # Check Token Expiration
    # =================================================

    now = datetime.now(timezone.utc)

    expires_at = reset_record.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if now > expires_at:

        reset_record.is_used = 1

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Password reset token has expired"
        )


    # =================================================
    # Check Password Confirmation
    # =================================================

    if data.new_password != data.confirm_password:

        raise HTTPException(
            status_code=400,
            detail="New password and confirmation password do not match"
        )


    # =================================================
    # Validate Password Strength
    # =================================================

    validate_password_strength(
        data.new_password
    )


    # =================================================
    # Find User
    # =================================================

    user = (
        db.query(User)
        .filter(
            User.id == reset_record.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # =================================================
    # Prevent Old Password Reuse
    # =================================================

    if verify_password(
        data.new_password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=400,
            detail="New password must be different from the old password"
        )


    # =================================================
    # Hash New Password
    # =================================================

    user.password_hash = hash_password(
        data.new_password
    )


    # =================================================
    # Mark Reset Token as Used
    # =================================================

    reset_record.is_used = 1


    # =================================================
    # Revoke All Existing Refresh Tokens
    # =================================================
    # revoked is stored as INTEGER:
    # 0 = active
    # 1 = revoked

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked == 0
    ).update(
        {
            RefreshToken.revoked: 1
        },
        synchronize_session=False
    )


    # =================================================
    # Save Changes
    # =================================================

    db.commit()


    # =================================================
    # Response
    # =================================================

    return {
        "message": "Password reset successfully. Please log in again."
    }