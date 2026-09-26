from passlib.context import CryptContext


email_code_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_email_code(code: str) -> str:

    return email_code_context.hash(code)


def verify_email_code(
    code: str,
    code_hash: str
) -> bool:

    return email_code_context.verify(
        code,
        code_hash
    )