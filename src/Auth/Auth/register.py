from fastapi import APIRouter, Depends, HTTPException, Request

from plimiter import limiter

import phonenumbers

from phonenumbers import NumberParseException

from sqlalchemy.orm import Session

from database import SessionLocal

from models import User

from password_utils import hash_password

from schemas import RegisterRequest

from otp_service import create_otp

from email_verification_service import (
    create_email_verification
)

from email_utils import send_verification_email

from profile_excel import add_user_to_excel

from pvoice_otp import send_voice_otp


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# DATABASE DEPENDENCY
# =========================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# PHONE NUMBER VALIDATION
# =========================================================
def normalize_phone_number(phone_number: str) -> str:
    """
    Validate and normalize a phone number to E.164 format.

    Examples:

    9876543210
        -> +919876543210

    +919876543210
        -> +919876543210

    +14155552671
        -> +14155552671
    """

    phone = phone_number.strip()

    if not phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number cannot be empty"
        )

    try:

        # International number
        # Example: +14155552671
        if phone.startswith("+"):

            parsed_number = phonenumbers.parse(
                phone,
                None
            )

        # Number without country code
        # For backward compatibility, assume India
        else:

            parsed_number = phonenumbers.parse(
                phone,
                "IN"
            )

    except NumberParseException:

        raise HTTPException(
            status_code=400,
            detail="Invalid phone number format"
        )

    # Check whether the number is actually valid
    if not phonenumbers.is_valid_number(
        parsed_number
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid phone number"
        )

    # Convert to E.164 format
    return phonenumbers.format_number(
        parsed_number,
        phonenumbers.PhoneNumberFormat.E164
    )


# =========================================================
# REGISTER USER
# =========================================================
@router.post(
    "/register",
    status_code=201
)
@limiter.limit("5/minute")
def register_user(
    request: Request,
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # =====================================================
    # 1. NORMALIZE EMAIL
    # =====================================================
    email = user_data.email.lower().strip()


    # =====================================================
    # 2. NORMALIZE + VALIDATE PHONE
    # =====================================================
    phone_number = normalize_phone_number(
        user_data.phone_number
    )


    # =====================================================
    # 3. CHECK DUPLICATE EMAIL
    # =====================================================
    existing_email = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )


    # =====================================================
    # 4. CHECK DUPLICATE PHONE
    # =====================================================
    existing_phone = (
        db.query(User)
        .filter(
            User.phone_number == phone_number
        )
        .first()
    )

    if existing_phone:

        raise HTTPException(
            status_code=400,
            detail="Phone number is already registered"
        )


    # =====================================================
    # 5. HASH PASSWORD
    # =====================================================
    hashed_password = hash_password(
        user_data.password
    )


    # =====================================================
    # 6. CREATE USER
    # =====================================================
    new_user = User(
        name=user_data.name.strip(),
        email=email,
        phone_number=phone_number,
        password_hash=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    # =====================================================
    # 7. ADD USER TO EXCEL
    # =====================================================
    print("Adding user to Excel...")

    add_user_to_excel(
        user_id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        phone_number=new_user.phone_number,
        email_verified=new_user.is_email_verified,
        phone_verified=new_user.is_phone_verified,
        account_active=new_user.is_active,
        failed_login_attempts=new_user.failed_login_attempts,
        account_locked_until=new_user.locked_until,
        role=new_user.role,
        registration_date=new_user.created_at,
        last_updated=new_user.updated_at
    )


    # =====================================================
    # 8. CREATE PHONE OTP
    # =====================================================
    otp = create_otp(
        db=db,
        user_id=new_user.id,
        phone_number=new_user.phone_number
    )


    # =====================================================
    # 9. SEND OTP THROUGH VOICE CALL
    # =====================================================
    try:

        send_voice_otp(
            new_user.phone_number,
            otp
        )

    except Exception as e:

        print(
            f"Voice OTP sending failed: {e}"
        )

        # Remove newly-created user
        # if voice OTP cannot be sent.
        db.delete(new_user)
        db.commit()

        raise HTTPException(
            status_code=500,
            detail="Unable to send voice OTP"
        )


    # =====================================================
    # 10. CREATE EMAIL VERIFICATION CODE
    # =====================================================
    email_code = create_email_verification(
        db=db,
        user=new_user
    )


    # =====================================================
    # 11. SEND EMAIL VERIFICATION
    # =====================================================
    try:

        send_verification_email(
            recipient_email=new_user.email,
            verification_code=email_code
        )

    except Exception:

        # If email sending fails,
        # remove the newly-created database user.
        db.delete(new_user)
        db.commit()

        raise HTTPException(
            status_code=500,
            detail="Unable to send verification email"
        )


    # =====================================================
    # 12. RESPONSE
    # =====================================================
    return {

        "message": (
            "Registration successful. "
            "Verification codes have been sent "
            "through email and voice call."
        ),

        "user_id": new_user.id,

        "email_verification": "sent",

        "phone_verification": "voice_call_sent"
    }