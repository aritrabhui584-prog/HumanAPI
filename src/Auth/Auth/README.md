# Authentication API Service

A modular, production-ready **FastAPI** authentication and user management backend service supporting PostgreSQL database storage, JWT-based session management, email verification, 2FA/Voice OTP, rate limiting, and password recovery workflows.

---

## 🚀 Features

* **User Registration & Email Verification**: Create new user accounts with email verification code/link handlers.
* **JWT Authentication & Session Management**: Issue access tokens and refresh tokens for secure session maintenance.
* **Password Management**: Secure password hashing with Argon2/Passlib, password recovery, verification codes, and password reset functionalities.
* **Multi-Factor Authentication (2FA)**: Two-factor authentication support via SMS/Voice OTP integration (`2Factor` API).
* **Rate Limiting**: Built-in request rate limiting using **SlowAPI** to prevent brute-force attacks on sensitive endpoints.
* **PostgreSQL & SQLAlchemy**: Relational data modeling and ORM integration using SQLAlchemy and `psycopg3`.
* **Containerization Ready**: Out-of-the-box `Dockerfile` setup for quick containerized deployment.

---

## 🛠 Tech Stack

* **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
* **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
* **Database & ORM**: PostgreSQL, [SQLAlchemy](https://www.sqlalchemy.org/)
* **Security & Auth**: PyJWT, Argon2, Passlib
* **Rate Limiting**: SlowAPI
* **Validation & Schemas**: Pydantic v2, Email Validator, Phone Numbers
* **Data Processing**: OpenPyXL

---

## 📁 Repository Structure

```text
Auth/
├── main.py                        # FastAPI application entrypoint & route registration
├── database.py                    # Database connection & SQLAlchemy Session configuration
├── models.py                      # Core SQLAlchemy database models
├── tables.py                      # Database tables definitions
│
├── register.py                    # User registration router
├── login.py                       # Login router
├── logout.py                      # Logout & session invalidation router
├── authenticate.py                # Current user dependency & auth checks
│
├── refresh.py                     # Refresh token endpoint
├── refresh_token.py               # Refresh token processing
├── refresh_model.py               # Refresh token ORM model
├── refresh_schema.py              # Refresh token Pydantic schema
│
├── email_verify.py                # Email verification router
├── email_verification_service.py  # Email verification service logic
├── email_verification_model.py    # Email verification ORM model
├── email_utils.py                 # SMTP email dispatch utilities
│
├── otp_verify.py                  # OTP verification router
├── otp_service.py                 # OTP generation and validation service
├── resend_otp.py                  # Resend OTP router
├── p2factor.py                    # 2Factor API service integration
├── pvoice_otp.py                  # Voice OTP dispatch integration
│
├── password_recovery.py           # Password recovery router
├── password_recovery_verify.py    # Password recovery verification code router
├── password_reset.py              # Password reset router
├── change_password.py             # Change password router
│
├── jwt_utils.py                   # JWT generation & decoding utilities
├── password_utils.py              # Password hashing helper functions
├── plimiter.py                    # SlowAPI rate limiter instance
├── profile_excel.py               # User profile Excel import/export helpers
│
├── Dockerfile                     # Container definition file
├── requirements.txt               # Python package dependencies
└── .env                           # Environment configuration settings
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root directory containing the following configuration variables:

```env
DATABASE_URL=postgresql+psycopg://postgres:<PASSWORD>@localhost:5432/<DATABASE_NAME>
JWT_SECRET_KEY=<YOUR_SUPER_SECRET_JWT_KEY>

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=<YOUR_EMAIL_ADDRESS>
EMAIL_PASSWORD=<YOUR_APP_SPECIFIC_PASSWORD>

TWOFACTOR_API_KEY=<YOUR_2FACTOR_API_KEY>
```

---

## 📥 Installation & Running Locally

### 1. Prerequisites
* Python 3.10+
* PostgreSQL database server

### 2. Setup Virtual Environment
```bash
# Clone or navigate into the directory
cd Auth

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Development Server
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Access the interactive OpenAPI documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## 🐳 Running with Docker

To build and run the application container using Docker:

```bash
# Build the Docker image
docker build -t auth-api .

# Run the container
docker run -d -p 8000:8000 --env-file .env --name auth-api-container auth-api
```

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status message |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/auth/profile` | Protected route (Requires Authentication) |
| `POST` | `/register` | User Registration |
| `POST` | `/login` | User Authentication & Token issuance |
| `POST` | `/logout` | Logout user |
| `POST` | `/refresh` | Refresh Access Token using Refresh Token |
| `POST` | `/email-verify` | Verify email address using code |
| `POST` | `/verify-otp` | Verify OTP for account activation / 2FA |
| `POST` | `/resend-otp` | Request a new OTP |
| `POST` | `/password-recovery` | Initiate password recovery workflow |
| `POST` | `/password-recovery-verify` | Verify password recovery code |
| `POST` | `/password-reset` | Reset password using recovery token |
| `POST` | `/change-password` | Change user password |
