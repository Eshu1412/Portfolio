import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { read } = await request.json();
  const db = getDb();
  await db.execute({ sql: 'UPDATE messages SET read = ? WHERE id = ?', args: [read ? 1 : 0, id] });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] });
  return NextResponse.json({ success: true });
}
