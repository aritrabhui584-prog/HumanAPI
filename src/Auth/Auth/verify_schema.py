from pydantic import BaseModel


class VerifyOTPRequest(BaseModel):
    user_id: int
    otp: str