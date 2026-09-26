from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from email_verification_model import EmailVerification
from email_code_hash_utils import verify_email_code
from email_verify_schema import VerifyEmailRequest


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


@router.post("/verify-email")
def verify_email(
    data: VerifyEmailRequest,
    db: Session = Depends(get_db)
):

    email = data.email.lower().strip()

    # Find user
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Already verified
    if user.is_email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified"
        )

    # Find latest active verification
    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.user_id == user.id,
            EmailVerification.is_verified == 0
        )
        .order_by(
            EmailVerification.id.desc()
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=400,
            detail="No active verification code found"
        )

    # Check expiration
    if datetime.utcnow() > verification.expires_at:

        verification.is_verified = 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Verification code has expired"
        )

    # Check attempts
    if verification.attempts >= 5:
        raise HTTPException(
            status_code=400,
            detail="Too many incorrect attempts"
        )

    # Verify code
    if not verify_email_code(
        data.code,
        verification.code_hash
    ):

        verification.attempts += 1

        db.commit()

        remaining_attempts = (
            5 - verification.attempts
        )

        raise HTTPException(
            status_code=400,
            detail=(
                f"Incorrect verification code. "
                f"{remaining_attempts} attempts remaining."
            )
        )

    # Mark verification successful
    verification.is_verified = 1
    user.is_email_verified = True

    db.commit()

    return {
        "message": "Email verified successfully",
        "email_verified": True
    }