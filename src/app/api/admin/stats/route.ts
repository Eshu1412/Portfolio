import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const queries = [
    db.execute('SELECT COUNT(*) as c FROM projects'),
    db.execute("SELECT COUNT(*) as c FROM projects WHERE status = 'completed'"),
    db.execute("SELECT COUNT(*) as c FROM projects WHERE status = 'in_progress'"),
    db.execute("SELECT COUNT(*) as c FROM projects WHERE status = 'pending'"),
    db.execute('SELECT COUNT(*) as c FROM skills'),
    db.execute('SELECT COUNT(*) as c FROM messages'),
    db.execute('SELECT COUNT(*) as c FROM messages WHERE read = 0'),
    db.execute('SELECT * FROM messages ORDER BY created_at DESC LIMIT 5')
  ];

  const results = await Promise.all(queries);

  const totalProjects = (results[0].rows[0] as any).c;
  const completedProjects = (results[1].rows[0] as any).c;
  const inProgressProjects = (results[2].rows[0] as any).c;
  const pendingProjects = (results[3].rows[0] as any).c;
  const totalSkills = (results[4].rows[0] as any).c;
  const totalMessages = (results[5].rows[0] as any).c;
  const unreadMessages = (results[6].rows[0] as any).c;
  const recentMessages = results[7].rows;

  return NextResponse.json({
    projects: { total: totalProjects, completed: completedProjects, inProgress: inProgressProjects, pending: pendingProjects },
    skills: { total: totalSkills },
    messages: { total: totalMessages, unread: unreadMessages, recent: recentMessages },
  });
}
