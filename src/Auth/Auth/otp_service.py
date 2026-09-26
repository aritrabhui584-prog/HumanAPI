from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models import OTPVerification
from otp_utilis import generate_otp
from otp_hash_utils import hash_otp


def create_otp(db: Session, user_id: int, phone_number: str):
    # Generate a 6-digit OTP
    otp = generate_otp()

    # Hash the OTP before storing it
    otp_hash = hash_otp(otp)

    # OTP will expire after 5 minutes
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # Create OTP record
    otp_record = OTPVerification(
        user_id=user_id,
        phone_number=phone_number,
        otp_hash=otp_hash,
        expires_at=expires_at
    )

    # Save to database
    db.add(otp_record)
    db.commit()
    db.refresh(otp_record)

    return otp

