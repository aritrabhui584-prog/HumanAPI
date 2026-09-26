import secrets


def generate_otp() -> str:
    """
    Generate a secure 6-digit OTP.
    """
    otp = secrets.randbelow(1000000)

    return f"{otp:06d}"


if __name__ == "__main__":
    print("Generated OTP:", generate_otp())