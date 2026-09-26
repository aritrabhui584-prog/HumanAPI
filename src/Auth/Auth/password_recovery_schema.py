from pydantic import BaseModel, EmailStr


class PasswordRecoveryRequest(BaseModel):
    email: EmailStr


class VerifyPasswordRecoveryRequest(BaseModel):
    email: EmailStr
    code: str