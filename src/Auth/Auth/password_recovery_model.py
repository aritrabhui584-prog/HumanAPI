from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from database import Base


class PasswordRecovery(Base):
    __tablename__ = "password_recoveries"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    email = Column(String(255), nullable=False)

    code_hash = Column(String(255), nullable=False)

    expires_at = Column(DateTime, nullable=False)

    attempts = Column(Integer, default=0)

    is_verified = Column(Integer, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )