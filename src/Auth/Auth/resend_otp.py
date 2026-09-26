from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request

from sqlalchemy.orm import Session

from database import SessionLocal

from models import User, OTPVerification

from resend_schema import ResendOTPRequest

from otp_service import create_otp

from pvoice_otp import send_voice_otp

from plimiter import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =====================================================
# DATABASE DEPENDENCY
# =====================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# RESEND OTP
# =====================================================
@router.post("/resend-otp")
@limiter.limit("3/minute")
def resend_otp(
    request: Request,
    data: ResendOTPRequest,
    db: Session = Depends(get_db)
):

    # =====================================================
    # 1. FIND USER
    # =====================================================
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


    # =====================================================
    # 2. CHECK PHONE VERIFICATION
    # =====================================================
    if user.is_phone_verified:

        raise HTTPException(
            status_code=400,
            detail="Phone number is already verified"
        )


    # =====================================================
    # 3. FIND LATEST OTP
    # =====================================================
    latest_otp = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user.id
        )
        .order_by(
            OTPVerification.id.desc()
        )
        .first()
    )


    # =====================================================
    # 4. 30-SECOND RESEND COOLDOWN
    # =====================================================
    if latest_otp:

        created_at = latest_otp.created_at

        if created_at:

            # Handle timezone-naive database datetime
            now = datetime.utcnow()

            if now - created_at < timedelta(
                seconds=30
            ):

                remaining_seconds = int(
                    30 - (
                        now - created_at
                    ).total_seconds()
                )

                if remaining_seconds < 1:
                    remaining_seconds = 1

                raise HTTPException(
                    status_code=429,
                    detail=(
                        "Please wait "
                        f"{remaining_seconds} seconds "
                        "before requesting another OTP."
                    )
                )


    # =====================================================
    # 5. CREATE NEW OTP
    # =====================================================
    otp = create_otp(
        db=db,
        user_id=user.id,
        phone_number=user.phone_number
    )


    # =====================================================
    # 6. SEND OTP THROUGH VOICE CALL
    # =====================================================
    try:

        send_voice_otp(
            user.phone_number,
            otp
        )

    except Exception as e:

        print(
            f"Voice OTP sending failed: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send voice OTP"
        )


    # =====================================================
    # 7. RESPONSE
    # =====================================================
    return {

        "message": (
            "OTP resent successfully "
            "through voice call"
        ),

        "phone_number": user.phone_number,

        "phone_verification": "voice_call_sent",

        "expires_in_minutes": 1
    }