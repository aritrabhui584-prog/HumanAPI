from pydantic import BaseModel


class ResendOTPRequest(BaseModel):
    user_id: int