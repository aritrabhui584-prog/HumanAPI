import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_verification_email(
    recipient_email: str,
    verification_code: str
):
    message = EmailMessage()

    message["Subject"] = "Verify Your Email — Human API"
    message["From"] = EMAIL_USERNAME
    message["To"] = recipient_email

    message.set_content(
        f"""
Hello,

Thank you for registering with Human API.

Your 6-digit email verification code is:

{verification_code}

This code will expire in 10 minutes.

If you did not create this account, you can safely ignore this email.

For your security, never share this verification code with anyone.

Regards,
Human API Team
"""
    )

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(message)


def send_password_reset_email(
    recipient_email: str,
    verification_code: str
):
    message = EmailMessage()

    message["Subject"] = "Password Reset Code — Human API"
    message["From"] = EMAIL_USERNAME
    message["To"] = recipient_email

    message.set_content(
        f"""
Hello,

We received a request to reset the password for your Human API account.

Your 6-digit password reset code is:

{verification_code}

This code will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.
Your password will not be changed unless the verification process is completed.

For your security, never share this verification code with anyone.

Regards,
Human API Team
"""
    )

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(message)