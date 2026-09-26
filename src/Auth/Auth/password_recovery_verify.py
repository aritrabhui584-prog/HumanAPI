from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request

from sqlalchemy.orm import Session

from database import SessionLocal

from models import User

from password_recovery_model import PasswordRecovery

from password_recovery_schema import (
    VerifyPasswordRecoveryRequest
)

from email_code_hash_utils import verify_email_code

from password_reset_token import (
    create_password_reset_token,
    hash_password_reset_token
)

from password_reset_model import PasswordResetToken

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
# Verify Password Recovery Code
# =====================================================

@router.post("/verify-password-recovery")
@limiter.limit("5/minute")
def verify_password_recovery(
    request: Request,
    data: VerifyPasswordRecoveryRequest,
    db: Session = Depends(get_db)
):

    # =================================================
    # Normalize Email
    # =================================================

    email = data.email.lower().strip()


    # =================================================
    # Find User
    # =================================================

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )


    # =================================================
    # Find Latest Active Recovery Code
    # =================================================

    recovery = (
        db.query(PasswordRecovery)
        .filter(
            PasswordRecovery.user_id == user.id,
            PasswordRecovery.is_verified == 0
        )
        .order_by(
            PasswordRecovery.id.desc()
        )
        .first()
    )

    if not recovery:

        raise HTTPException(
            status_code=400,
            detail="No active password recovery code found"
        )


    # =================================================
    # Check Expiration
    # =================================================

    now = datetime.utcnow()

    expires_at = recovery.expires_at

    if expires_at.tzinfo is not None:

        expires_at = expires_at.replace(
            tzinfo=None
        )

    if now > expires_at:

        recovery.is_verified = 1

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Password recovery code has expired"
        )


    # =================================================
    # Check Attempt Limit
    # =================================================

    if recovery.attempts >= 5:

        raise HTTPException(
            status_code=400,
            detail="Too many incorrect attempts"
        )


    # =================================================
    # Verify Recovery Code
    # =================================================

    if not verify_email_code(
        data.code,
        recovery.code_hash
    ):

        recovery.attempts += 1

        db.commit()

        remaining_attempts = (
            5 - recovery.attempts
        )

        if remaining_attempts <= 0:

            raise HTTPException(
                status_code=400,
                detail="Too many incorrect attempts"
            )

        raise HTTPException(
            status_code=400,
            detail=(
                "Incorrect verification code. "
                f"{remaining_attempts} attempts remaining."
            )
        )


    # =================================================
    # Mark Recovery Code as Verified
    # =================================================

    recovery.is_verified = 1


    # =================================================
    # Create Password Reset Token
    # =================================================

    reset_token, expires_at = (
        create_password_reset_token()
    )


    # =================================================
    # Hash Reset Token
    # =================================================

    token_hash = hash_password_reset_token(
        reset_token
    )


    # =================================================
    # Store Reset Token
    # =================================================

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        is_used=0
    )

    db.add(reset_record)

    db.commit()


    # =================================================
    # Response
    # =================================================

    return {
        "message": (
            "Password recovery code verified successfully"
        ),
        "reset_token": reset_token,
        "expires_in_minutes": 10
    }