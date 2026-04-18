import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user = result.rows[0] as any;
    
    if (!user) {
      // Don't reveal if email exists — always return success
      return NextResponse.json({ success: true, message: 'If this email is registered, you will receive an OTP.' });
    }

    const otp = generateOtp();
    const expiresAt = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    await db.execute({
      sql: 'UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?',
      args: [otp, expiresAt, user.id]
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
