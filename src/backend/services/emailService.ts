import tls from "tls";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "465", 10);
const EMAIL_USERNAME = process.env.EMAIL_USERNAME || "gethumanapirb@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "rifc ites hzyo aclt";

/**
 * Send real 6-digit OTP email using TLS SMTP directly to recipient email.
 */
export async function sendOtpEmail(to: string, otpCode: string): Promise<boolean> {
  // If demo email or test email, log and return success
  if (to.endsWith(".test") || to.includes("demo.user")) {
    console.log(`[DEVELOPMENT EMAIL SINK] OTP for ${to}: ${otpCode}`);
    return true;
  }

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(EMAIL_PORT, EMAIL_HOST, { rejectUnauthorized: false }, () => {
        let step = 0;

        const send = (cmd: string) => {
          socket.write(cmd + "\r\n");
        };

        socket.on("data", (data) => {
          const str = data.toString();

          if (step === 0 && str.startsWith("220")) {
            step = 1;
            send(`EHLO humanapi.io`);
          } else if (step === 1 && str.startsWith("250")) {
            step = 2;
            const authStr = Buffer.from(`\0${EMAIL_USERNAME}\0${EMAIL_PASSWORD}`).toString("base64");
            send(`AUTH PLAIN ${authStr}`);
          } else if (step === 2 && str.startsWith("235")) {
            step = 3;
            send(`MAIL FROM:<${EMAIL_USERNAME}>`);
          } else if (step === 3 && str.startsWith("250")) {
            step = 4;
            send(`RCPT TO:<${to}>`);
          } else if (step === 4 && str.startsWith("250")) {
            step = 5;
            send(`DATA`);
          } else if (step === 5 && str.startsWith("354")) {
            step = 6;
            const msg = [
              `From: "HumanAPI Security" <${EMAIL_USERNAME}>`,
              `To: <${to}>`,
              `Subject: Your HumanAPI Verification Code: ${otpCode}`,
              `Content-Type: text/plain; charset=utf-8`,
              ``,
              `Hello,`,
              ``,
              `Your 6-digit HumanAPI security verification code is:`,
              ``,
              `   ${otpCode}`,
              ``,
              `This code will expire in 10 minutes. Do not share this code with anyone.`,
              ``,
              `Regards,`,
              `HumanAPI Security Team`
            ].join("\r\n");

            send(msg + "\r\n.");
          } else if (step === 6 && str.startsWith("250")) {
            step = 7;
            send(`QUIT`);
            socket.end();
            console.log(`[SMTP EMAIL DELIVERED] Real OTP ${otpCode} delivered to ${to}`);
            resolve(true);
          }
        });

        socket.on("error", (err) => {
          console.error(`[SMTP ERROR] Failed to send email to ${to}:`, err.message);
          resolve(false);
        });
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        console.error(`[SMTP TIMEOUT] Email delivery to ${to} timed out.`);
        resolve(false);
      });
    } catch (err: any) {
      console.error(`[SMTP EXCEPTION] Email delivery exception:`, err.message);
      resolve(false);
    }
  });
}
