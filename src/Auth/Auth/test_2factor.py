from p2factor import send_otp, verify_otp


phone_number = input("Enter your phone number with country code: ")

session_id = send_otp(phone_number)

print("\nOTP sent successfully!")
print("Session ID received.")

otp = input("Enter the OTP you received: ")

result = verify_otp(session_id, otp)

print("\nVerification result:")
print(result)