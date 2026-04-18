import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM skills ORDER BY display_order ASC, created_at ASC');
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, category, proficiency, icon, display_order } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const db = getDb();
  const result = await db.execute({
    sql: 'INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES (?, ?, ?, ?, ?)',
    args: [name, category || 'Other', proficiency || 80, icon || '', display_order || 0]
  });

  const skillResult = await db.execute({
    sql: 'SELECT * FROM skills WHERE id = ?',
    args: [Number(result.lastInsertRowid)]
  });
  
  return NextResponse.json(skillResult.rows[0], { status: 201 });
}
