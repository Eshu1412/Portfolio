import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  
  const result = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  const project = result.rows[0];
  
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    ...project,
    tech_stack: JSON.parse(String(project.tech_stack || '[]')),
    theme: project.theme || 'cyber',
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  
  const existingResult = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  const existing = existingResult.rows[0] as any;
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const { title, description, tech_stack, status, github_url, live_url, image_url, theme, featured, display_order } = body;

  await db.execute({
    sql: `
      UPDATE projects SET
        title = ?, description = ?, tech_stack = ?, status = ?,
        github_url = ?, live_url = ?, image_url = ?, theme = ?,
        featured = ?, display_order = ?, updated_at = unixepoch()
      WHERE id = ?
    `,
    args: [
      title ?? existing.title,
      description ?? existing.description,
      JSON.stringify(Array.isArray(tech_stack) ? tech_stack : JSON.parse(existing.tech_stack || '[]')),
      status ?? existing.status,
      github_url ?? existing.github_url,
      live_url ?? existing.live_url,
      image_url ?? existing.image_url,
      theme ?? existing.theme ?? 'cyber',
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      display_order ?? existing.display_order,
      id
    ]
  });

  const updatedResult = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  const updated = updatedResult.rows[0] as any;
  
  return NextResponse.json({
    ...updated,
    tech_stack: JSON.parse(updated.tech_stack || '[]'),
    theme: updated.theme || 'cyber',
  });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  
  const result = await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
  
  if (result.rowsAffected === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
