from passlib.context import CryptContext


refresh_token_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_refresh_token(token: str) -> str:
    """
    Securely hash a refresh token.
    """
    return refresh_token_context.hash(token)


def verify_refresh_token(
    token: str,
    token_hash: str
) -> bool:
    """
    Verify a refresh token against its stored hash.
    """
    return refresh_token_context.verify(
        token,
        token_hash
    )