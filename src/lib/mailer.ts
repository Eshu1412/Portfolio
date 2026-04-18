import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"Tushar Portfolio Admin" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your One-Time Password (OTP) — Portfolio Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 40px auto; background: #111; border: 1px solid #222; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 700; }
          .body { padding: 32px; }
          .otp-box { background: #1a1a2e; border: 2px solid #6366f1; border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }
          .otp { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #818cf8; font-family: monospace; }
          p { color: #94a3b8; line-height: 1.6; margin: 0 0 16px; }
          .warning { color: #f59e0b; font-size: 13px; }
          .footer { padding: 16px 32px; border-top: 1px solid #222; text-align: center; }
          .footer p { color: #475569; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset OTP</h1>
          </div>
          <div class="body">
            <p>Use the following OTP to reset your portfolio admin password. This code is valid for <strong style="color:#818cf8">10 minutes</strong>.</p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            <p class="warning">⚠️ Never share this code with anyone. If you didn't request this, ignore this email.</p>
          </div>
          <div class="footer">
            <p>Tushar Maurya — Portfolio Admin System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail(to: string): Promise<void> {
  await transporter.sendMail({
    from: `"Tushar Portfolio" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'New message received on your portfolio!',
    html: `<p>Someone has sent you a new message via your portfolio contact form. Log in to the admin panel to read it.</p>`,
  });
}
