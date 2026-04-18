import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user = result.rows[0] as any;

    if (!user || !user.otp) {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    if (user.otp !== otp || user.otp_expires_at < now) {
      return NextResponse.json({ error: 'OTP is invalid or has expired' }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await db.execute({
      sql: 'UPDATE users SET password_hash = ?, otp = NULL, otp_expires_at = NULL WHERE id = ?',
      args: [hash, user.id]
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
