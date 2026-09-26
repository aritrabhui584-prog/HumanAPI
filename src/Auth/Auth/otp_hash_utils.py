from passlib.context import CryptContext


otp_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_otp(otp: str) -> str:
    """
    Securely hash the OTP.
    """
    return otp_context.hash(otp)


def verify_otp(otp: str, otp_hash: str) -> bool:
    """
    Verify an OTP against its stored hash.
    """
    return otp_context.verify(otp, otp_hash)

if __name__ == "__main__":
    otp = "583214"

    hashed = hash_otp(otp)

    print("OTP:", otp)
    print("Hashed OTP:", hashed)
    print("Correct OTP:", verify_otp(otp, hashed))
    print("Wrong OTP:", verify_otp("123456", hashed))