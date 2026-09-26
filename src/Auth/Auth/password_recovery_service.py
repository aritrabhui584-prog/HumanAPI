from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models import User
from password_recovery_model import PasswordRecovery
from email_code_utils import generate_email_code
from email_code_hash_utils import hash_email_code


def create_password_recovery_code(
    db: Session,
    user: User
):
    # Invalidate previous active recovery codes
    db.query(PasswordRecovery).filter(
        PasswordRecovery.user_id == user.id,
        PasswordRecovery.is_verified == 0
    ).update({
        PasswordRecovery.is_verified: 1
    })

    # Generate a new 6-digit code
    code = generate_email_code()

    # Hash the code before storing it
    code_hash = hash_email_code(code)

    # Code expires after 10 minutes
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    recovery = PasswordRecovery(
        user_id=user.id,
        email=user.email,
        code_hash=code_hash,
        expires_at=expires_at,
        attempts=0,
        is_verified=0
    )

    db.add(recovery)
    db.commit()
    db.refresh(recovery)

    return code