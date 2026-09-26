from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User

from authenticate import get_current_user

from password_utils import (
    verify_password,
    hash_password
)

from change_password_schema import ChangePasswordRequest

from refresh_model import RefreshToken


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


def validate_password_strength(password: str):
    """
    Basic password strength validation.
    """

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not any(char.isupper() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not any(char.islower() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )

    if not any(not char.isalnum() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character"
        )


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # ==========================================
    # 1. Find User
    # ==========================================

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # ==========================================
    # 2. Verify Current Password
    # ==========================================

    if not verify_password(
        data.current_password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Current password is incorrect"
        )


    # ==========================================
    # 3. Check Confirmation
    # ==========================================

    if data.new_password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="New password and confirmation password do not match"
        )


    # ==========================================
    # 4. Prevent Password Reuse
    # ==========================================

    if verify_password(
        data.new_password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password"
        )


    # ==========================================
    # 5. Validate Password Strength
    # ==========================================

    validate_password_strength(
        data.new_password
    )


    # ==========================================
    # 6. Hash New Password
    # ==========================================

    user.password_hash = hash_password(
        data.new_password
    )


    # ==========================================
    # 7. Revoke All Existing Refresh Tokens
    # ==========================================

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked == False
    ).update(
        {
            RefreshToken.revoked: True
        },
        synchronize_session=False
    )


    # ==========================================
    # 8. Save Changes
    # ==========================================

    db.commit()


    # ==========================================
    # 9. Response
    # ==========================================

    return {
        "message": (
            "Password changed successfully. "
            "Please log in again on all devices."
        )
    }