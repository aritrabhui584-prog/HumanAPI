from database import engine, Base
from models import User, OTPVerification
from refresh_model import RefreshToken
from email_verification_model import EmailVerification
from password_recovery_model import PasswordRecovery
from password_reset_model import PasswordResetToken


Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")