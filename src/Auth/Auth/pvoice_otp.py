import os
import secrets
import requests
from dotenv import load_dotenv

load_dotenv()

TWOFACTOR_API_KEY = os.getenv("TWOFACTOR_API_KEY")

BASE_URL = "https://2factor.in/API/V1/OBD/Send.php"


def generate_otp():
    return f"{secrets.randbelow(1000000):06d}"


def send_voice_otp(phone_number: str, otp: str):
    if not TWOFACTOR_API_KEY:
        raise RuntimeError("TWOFACTOR_API_KEY is not configured")

    phone_number = phone_number.replace("+", "").strip()

    message = (
        f"Your Human API verification code is {otp}. "
        "I repeat, your verification code is "
        f"{otp}. Please do not share this code with anyone."
    )

    params = {
        "Mode": "Ask",
        "APIKey": TWOFACTOR_API_KEY,
        "PhoneNo": phone_number,
        "Input": message
    }

    response = requests.get(
        BASE_URL,
        params=params,
        timeout=15
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"2Factor Voice OTP request failed: {response.text}"
        )

    return response.text