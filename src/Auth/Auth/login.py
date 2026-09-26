from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request

from sqlalchemy.orm import Session

from database import SessionLocal

from models import User

from refresh_model import RefreshToken

from refresh_token import create_refresh_token

from refresh_token_utils import hash_refresh_token

from password_utils import verify_password

from login_schema import LoginRequest

from jwt_utils import create_access_token

from plimiter import limiter


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


@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    # =====================================================
    # Find User
    # =====================================================

    user = db.query(User).filter(
        User.email == data.email.lower().strip()
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # =====================================================
    # Account Lock Check
    # =====================================================

    if user.locked_until:

        if datetime.utcnow() < user.locked_until:

            remaining_minutes = int(
                (
                    user.locked_until - datetime.utcnow()
                ).total_seconds() / 60
            ) + 1

            raise HTTPException(
                status_code=403,
                detail=(
                    "Account is temporarily locked. "
                    f"Try again in {remaining_minutes} minutes."
                )
            )

        user.locked_until = None
        user.failed_login_attempts = 0

        db.commit()


    # =====================================================
    # Active Account Check
    # =====================================================

    if not user.is_active:

        raise HTTPException(
            status_code=403,
            detail="Account is inactive"
        )


    # =====================================================
    # Phone Verification Check
    # =====================================================

    if not user.is_phone_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your phone number first"
        )


    # =====================================================
    # Email Verification Check
    # =====================================================

    if not user.is_email_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your email address first"
        )


    # =====================================================
    # Password Verification
    # =====================================================

    password_correct = verify_password(
        data.password,
        user.password_hash
    )

    if not password_correct:

        user.failed_login_attempts += 1

        # ---------------------------------------------
        # Lock account after 5 failed attempts
        # ---------------------------------------------

        if user.failed_login_attempts >= 5:

            user.locked_until = (
                datetime.utcnow()
                + timedelta(hours=24)
            )

            db.commit()

            raise HTTPException(
                status_code=403,
                detail=(
                    "Too many failed login attempts. "
                    "Account locked for 24 hours."
                )
            )

        db.commit()

        remaining_attempts = (
            5 - user.failed_login_attempts
        )

        raise HTTPException(
            status_code=401,
            detail=(
                "Invalid email or password. "
                f"{remaining_attempts} attempts remaining."
            )
        )


    # =====================================================
    # Successful Login
    # =====================================================

    user.failed_login_attempts = 0
    user.locked_until = None


    # =====================================================
    # Create Access Token
    # =====================================================

    access_token = create_access_token(
        user.id
    )


    # =====================================================
    # Create Refresh Token
    # =====================================================

    refresh_token, expires_at = create_refresh_token()


    # =====================================================
    # Hash Refresh Token
    # =====================================================

    refresh_token_hash = hash_refresh_token(
        refresh_token
    )


    # =====================================================
    # Store Refresh Token
    # =====================================================

    refresh_token_record = RefreshToken(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=expires_at,
        revoked=0
    )

    db.add(refresh_token_record)

    db.commit()


    # =====================================================
    # Login Response
    # =====================================================

    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }