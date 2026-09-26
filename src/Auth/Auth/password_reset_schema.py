from pydantic import BaseModel


class PasswordResetRequest(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str