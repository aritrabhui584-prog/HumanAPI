import os
import requests
from dotenv import load_dotenv

load_dotenv()

TWOFACTOR_API_KEY = os.getenv("TWOFACTOR_API_KEY")

BASE_URL = "https://2factor.in/API/V1"


def send_otp(phone_number: str):
    if not TWOFACTOR_API_KEY:
        raise RuntimeError("TWOFACTOR_API_KEY is not configured")

    phone_number = phone_number.replace("+", "").strip()

    url = f"{BASE_URL}/{TWOFACTOR_API_KEY}/SMS/{phone_number}/AUTOGEN"

    response = requests.get(
        url,
        timeout=10
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"2Factor OTP request failed: {response.text}"
        )

    data = response.json()

    if data.get("Status") != "Success":
        raise RuntimeError(
            f"2Factor OTP request failed: {data}"
        )

    return data["Details"]


def verify_otp(session_id: str, otp: str):
    if not TWOFACTOR_API_KEY:
        raise RuntimeError("TWOFACTOR_API_KEY is not configured")

    session_id = session_id.strip()
    otp = otp.strip()

    url = (
        f"{BASE_URL}/"
        f"{TWOFACTOR_API_KEY}/"
        f"SMS/VERIFY/"
        f"{session_id}/"
        f"{otp}"
    )

    response = requests.get(
        url,
        timeout=10
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"2Factor OTP verification request failed: {response.text}"
        )

    return response.json()