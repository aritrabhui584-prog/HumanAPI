from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models import User
from email_verification_model import EmailVerification
from email_code_utils import generate_email_code
from email_code_hash_utils import hash_email_code


def create_email_verification(
    db: Session,
    user: User
):
    # Invalidate previous verification codes
    db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.is_verified == 0
    ).update({
        EmailVerification.is_verified: 1
    })

    # Generate new verification code
    code = generate_email_code()

    # Hash the code
    code_hash = hash_email_code(code)

    # Set expiration to 10 minutes
    expires_at = datetime.utcnow() + timedelta(
        minutes=10
    )

    verification = EmailVerification(
        user_id=user.id,
        email=user.email,
        code_hash=code_hash,
        expires_at=expires_at,
        attempts=0,
        is_verified=0
    )

    db.add(verification)
    db.commit()
    db.refresh(verification)

    return code