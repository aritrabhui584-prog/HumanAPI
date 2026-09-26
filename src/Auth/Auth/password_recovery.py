from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User

from password_recovery_schema import PasswordRecoveryRequest
from password_recovery_service import create_password_recovery_code

from email_utils import send_password_reset_email

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
# Forgot Password
# =====================================================

@router.post("/forgot-password")
@limiter.limit("3/minute")
def forgot_password(
    request: Request,
    data: PasswordRecoveryRequest,
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
    # Generate Recovery Code
    # =================================================

    code = create_password_recovery_code(
        db=db,
        user=user
    )


    # =================================================
    # Send Recovery Email
    # =================================================

    try:

        send_password_reset_email(
            recipient_email=user.email,
            verification_code=code
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Unable to send password recovery email"
        )


    # =================================================
    # Response
    # =================================================

    return {
        "message": (
            "Password recovery code has been "
            "sent to your email"
        )
    }