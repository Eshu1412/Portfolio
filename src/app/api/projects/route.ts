import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all projects (public + admin)
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    let query = 'SELECT * FROM projects';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) { conditions.push('status = ?'); params.push(status); }
    if (featured === 'true') { conditions.push('featured = 1'); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await db.execute({ sql: query, args: params });
    const projects = result.rows;

    return NextResponse.json(projects.map((p: any) => ({
      ...p,
      tech_stack: JSON.parse(p.tech_stack || '[]'),
      theme: p.theme || 'cyber',
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST — create project (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, tech_stack, status, github_url, live_url, image_url, theme, featured, display_order } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const db = getDb();
    const result = await db.execute({
      sql: `
        INSERT INTO projects (title, description, tech_stack, status, github_url, live_url, image_url, theme, featured, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        title, description || '',
        JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []),
        status || 'pending',
        github_url || '', live_url || '', image_url || '',
        theme || 'cyber',
        featured ? 1 : 0,
        display_order || 0
      ]
    });

    const projectResult = await db.execute({
      sql: 'SELECT * FROM projects WHERE id = ?',
      args: [Number(result.lastInsertRowid)]
    });
    const project = projectResult.rows[0];

    return NextResponse.json({
      ...project,
      tech_stack: JSON.parse(String(project.tech_stack || '[]')),
      theme: project.theme || 'cyber',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
