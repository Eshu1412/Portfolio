import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const existing = await db.execute({ sql: 'SELECT * FROM skills WHERE id = ?', args: [id] });
  if (existing.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { name, category, proficiency, icon, display_order } = await request.json();
  const current = existing.rows[0] as any;

  await db.execute({
    sql: `
      UPDATE skills SET
        name = ?, category = ?, proficiency = ?, icon = ?, display_order = ?
      WHERE id = ?
    `,
    args: [
      name ?? current.name,
      category ?? current.category,
      proficiency ?? current.proficiency,
      icon ?? current.icon,
      display_order ?? current.display_order,
      id
    ]
  });

  const updated = await db.execute({ sql: 'SELECT * FROM skills WHERE id = ?', args: [id] });
  return NextResponse.json(updated.rows[0]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM skills WHERE id = ?', args: [id] });
  if (result.rowsAffected === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
