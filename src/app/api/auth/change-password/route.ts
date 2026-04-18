import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [auth.userId as number] });
  const user = result.rows[0] as any;
  
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 12);
  await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE id = ?', args: [hash, auth.userId as number] });

  return NextResponse.json({ success: true });
}
