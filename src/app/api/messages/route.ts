import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const result = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      args: [name, email, subject || '', message]
    });

    // Notify admin
    try {
      if (process.env.GMAIL_USER) {
        await sendWelcomeEmail(process.env.GMAIL_USER);
      }
    } catch (e) { /* silent fail */ }

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
