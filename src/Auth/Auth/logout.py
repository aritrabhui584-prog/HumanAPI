from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from refresh_model import RefreshToken
from refresh_schema import RefreshTokenRequest
from refresh_token_utils import verify_refresh_token


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


@router.post("/logout")
def logout(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):

    # Find all active refresh tokens
    token_records = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.revoked == 0
        )
        .all()
    )

    matched_record = None

    # Find the refresh token
    for record in token_records:

        if verify_refresh_token(
            data.refresh_token,
            record.token_hash
        ):
            matched_record = record
            break

    # Token not found
    if not matched_record:
        raise HTTPException(
            status_code=401,
            detail="Invalid or already revoked refresh token"
        )

    # Revoke token
    matched_record.revoked = 1

    db.commit()

    return {
        "message": "Logout successful"
    }