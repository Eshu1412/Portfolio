import { NextRequest, NextResponse } from 'next/server';
import getDb, { initSchema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

function parseHeroRoles(heroRoles: unknown) {
  if (Array.isArray(heroRoles)) {
    return heroRoles
      .map(role => String(role).trim())
      .filter(Boolean);
  }

  if (typeof heroRoles === 'string') {
    try {
      const parsed = JSON.parse(heroRoles);
      if (Array.isArray(parsed)) {
        return parsed
          .map(role => String(role).trim())
          .filter(Boolean);
      }
    } catch {
      return heroRoles
        .split('\n')
        .map(role => role.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeProfile(profile: Record<string, unknown> | undefined) {
  if (!profile) return {};
  return {
    ...profile,
    hero_roles: parseHeroRoles(profile.hero_roles),
  };
}

export async function GET() {
  const db = getDb();
  await initSchema(); // Lazy migration check
  const result = await db.execute('SELECT * FROM profile LIMIT 1');
  const profile = result.rows[0];
  return NextResponse.json(normalizeProfile(profile as Record<string, unknown> | undefined));
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  await initSchema(); // Lazy migration check
  const body = await request.json();
  const {
    full_name, tagline, hero_roles, bio, avatar_url, resume_url,
    github, linkedin, twitter, email, location,
    phone, whatsapp, status, focus, superpower,
    projects_built, technologies, experience,
    projects_title, projects_subtitle, skills_title, skills_subtitle
  } = body;

  const existingResult = await db.execute('SELECT * FROM profile LIMIT 1');
  const existing = existingResult.rows[0] as any;
  const serializedHeroRoles = JSON.stringify(
    parseHeroRoles(hero_roles).length ? parseHeroRoles(hero_roles) : parseHeroRoles(existing?.hero_roles),
  );

  if (existing) {
    await db.execute({
      sql: `
        UPDATE profile SET
          full_name = ?, tagline = ?, hero_roles = ?, bio = ?, avatar_url = ?, resume_url = ?,
          github = ?, linkedin = ?, twitter = ?, email = ?, phone = ?, whatsapp = ?, location = ?,
          status = ?, focus = ?, superpower = ?,
          projects_built = ?, technologies = ?, experience = ?,
          projects_title = ?, projects_subtitle = ?, skills_title = ?, skills_subtitle = ?,
          updated_at = unixepoch()
        WHERE id = ?
      `,
      args: [
        full_name   ?? existing.full_name,
        tagline     ?? existing.tagline,
        serializedHeroRoles,
        bio         ?? existing.bio,
        avatar_url  ?? existing.avatar_url,
        resume_url  ?? existing.resume_url,
        github      ?? existing.github,
        linkedin    ?? existing.linkedin,
        twitter     ?? existing.twitter,
        email       ?? existing.email,
        phone       ?? existing.phone,
        whatsapp    ?? existing.whatsapp,
        location    ?? existing.location,
        status          ?? existing.status,
        focus           ?? existing.focus,
        superpower      ?? existing.superpower,
        projects_built  ?? existing.projects_built,
        technologies    ?? existing.technologies,
        experience      ?? existing.experience,
        projects_title  ?? existing.projects_title,
        projects_subtitle ?? existing.projects_subtitle,
        skills_title    ?? existing.skills_title,
        skills_subtitle ?? existing.skills_subtitle,
        existing.id,
      ]
    });
  } else {
    await db.execute({
      sql: `
        INSERT INTO profile
          (full_name, tagline, hero_roles, bio, avatar_url, resume_url, github, linkedin, twitter, email, phone, whatsapp, location, status, focus, superpower, projects_built, technologies, experience, projects_title, projects_subtitle, skills_title, skills_subtitle)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        full_name, tagline, serializedHeroRoles, bio, avatar_url, resume_url,
        github, linkedin, twitter, email, phone, whatsapp, location,
        status, focus, superpower, projects_built, technologies, experience,
        projects_title, projects_subtitle, skills_title, skills_subtitle,
      ]
    });
  }

  const updatedResult = await db.execute('SELECT * FROM profile LIMIT 1');
  return NextResponse.json(
    normalizeProfile(updatedResult.rows[0] as Record<string, unknown> | undefined),
  );
}
