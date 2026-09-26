import secrets


def generate_email_code() -> str:
    """
    Generate a cryptographically secure
    6-digit email verification code.
    """

    code = secrets.randbelow(1000000)

    return f"{code:06d}"