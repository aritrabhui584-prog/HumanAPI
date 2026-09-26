from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request

from sqlalchemy.orm import Session

from database import SessionLocal

from models import User, OTPVerification

from otp_hash_utils import verify_otp

from verify_schema import VerifyOTPRequest

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
# Verify Phone OTP
# =====================================================

@router.post("/verify-otp")
@limiter.limit("5/minute")
def verify_user_otp(
    request: Request,
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):

    # =================================================
    # Find User
    # =================================================

    user = (
        db.query(User)
        .filter(
            User.id == data.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # =================================================
    # Find Latest Active OTP
    # =================================================

    otp_record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user.id,
            OTPVerification.is_verified == False
        )
        .order_by(
            OTPVerification.id.desc()
        )
        .first()
    )

    if not otp_record:

        raise HTTPException(
            status_code=400,
            detail="No active OTP found"
        )


    # =================================================
    # OTP Expiration Check
    # =================================================

    if datetime.utcnow() > otp_record.expires_at:

        raise HTTPException(
            status_code=400,
            detail="OTP has expired"
        )


    # =================================================
    # OTP Attempt Limit
    # =================================================

    if otp_record.attempts >= 5:

        raise HTTPException(
            status_code=400,
            detail="Too many incorrect OTP attempts"
        )


    # =================================================
    # Verify OTP
    # =================================================

    if not verify_otp(
        data.otp,
        otp_record.otp_hash
    ):

        otp_record.attempts += 1

        db.commit()

        remaining_attempts = (
            5 - otp_record.attempts
        )

        if remaining_attempts <= 0:

            raise HTTPException(
                status_code=400,
                detail="Too many incorrect OTP attempts"
            )

        raise HTTPException(
            status_code=400,
            detail=(
                "Incorrect OTP. "
                f"{remaining_attempts} attempts remaining."
            )
        )


    # =================================================
    # Successful OTP Verification
    # =================================================

    otp_record.is_verified = True

    user.is_phone_verified = True

    db.commit()


    # =================================================
    # Response
    # =================================================

    return {
        "message": "OTP verified successfully",
        "phone_verified": True
    }