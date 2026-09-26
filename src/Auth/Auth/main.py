from fastapi import FastAPI, Depends

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from plimiter import limiter


# =====================================================
# Routers
# =====================================================

from register import router as register_router

from otp_verify import router as otp_verify_router

from resend_otp import router as resend_otp_router

from login import router as login_router

from authenticate import get_current_user

from refresh import router as refresh_router

from logout import router as logout_router

from email_verify import router as email_verify_router

from password_recovery import (
    router as password_recovery_router
)

from password_recovery_verify import (
    router as password_recovery_verify_router
)

from password_reset import (
    router as password_reset_router
)

from change_password import (
    router as change_password_router
)


# =====================================================
# FastAPI Application
# =====================================================

app = FastAPI(
    title="Authentication API",
    description="Authentication module for the group project",
    version="1.0.0"
)


# =====================================================
# SlowAPI Configuration
# =====================================================

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


# =====================================================
# Include Routers
# =====================================================

app.include_router(register_router)

app.include_router(otp_verify_router)

app.include_router(resend_otp_router)

app.include_router(login_router)

app.include_router(refresh_router)

app.include_router(logout_router)

app.include_router(email_verify_router)

app.include_router(password_recovery_router)

app.include_router(
    password_recovery_verify_router
)

app.include_router(
    password_reset_router
)

app.include_router(
    change_password_router
)


# =====================================================
# Root Endpoint
# =====================================================

@app.get("/")
def root():

    return {
        "message": "Authentication API is running"
    }


# =====================================================
# Health Check
# =====================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }


# =====================================================
# Protected Profile Endpoint
# =====================================================

@app.get("/auth/profile")
def profile(
    user_id: int = Depends(get_current_user)
):

    return {
        "message": "You are authenticated",
        "user_id": user_id
    }