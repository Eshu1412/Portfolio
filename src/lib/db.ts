import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

export default function getDb(): Client {
  if (!db) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local');
    }
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return db;
}

export async function initSchema() {
  const database = getDb();

  await database.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL,
      otp TEXT,
      otp_expires_at INTEGER,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL DEFAULT 'Tushar Maurya',
      tagline TEXT DEFAULT 'Full Stack Developer & Creative Technologist',
      hero_roles TEXT DEFAULT '["Full Stack Developer & Creative Technologist","WebGL & 3D Web Specialist","React · Next.js · Node.js Engineer","Building immersive digital experiences"]',
      bio TEXT DEFAULT 'Passionate developer who loves building immersive web experiences.',
      avatar_url TEXT,
      resume_url TEXT,
      github TEXT DEFAULT 'https://github.com/mauryatushar115',
      linkedin TEXT,
      twitter TEXT,
      email TEXT DEFAULT 'mauryatushar115@gmail.com',
      phone TEXT,
      whatsapp TEXT,
      location TEXT DEFAULT 'India',
      status TEXT DEFAULT 'Open to Work',
      focus TEXT DEFAULT 'Full Stack + 3D Web',
      superpower TEXT DEFAULT 'Turning ideas → products',
      projects_built TEXT DEFAULT '5+',
      technologies TEXT DEFAULT '15+',
      experience TEXT DEFAULT '2+',
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      tech_stack TEXT DEFAULT '[]',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed')),
      github_url TEXT,
      live_url TEXT,
      image_url TEXT,
      theme TEXT DEFAULT 'cyber',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Other',
      proficiency INTEGER DEFAULT 80 CHECK(proficiency BETWEEN 1 AND 100),
      icon TEXT,
      display_order INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `);

  // Safe migrations for existing databases
  const profileCols = [
    { name: 'hero_roles', def: `TEXT DEFAULT '["Full Stack Developer & Creative Technologist","WebGL & 3D Web Specialist","React · Next.js · Node.js Engineer","Building immersive digital experiences"]'` },
    { name: 'phone', def: 'TEXT' },
    { name: 'whatsapp', def: 'TEXT' },
    { name: 'status',     def: "TEXT DEFAULT 'Open to Work'" },
    { name: 'focus',      def: "TEXT DEFAULT 'Full Stack + 3D Web'" },
    { name: 'superpower', def: "TEXT DEFAULT 'Turning ideas → products'" },
    { name: 'projects_built', def: "TEXT DEFAULT '5+'" },
    { name: 'technologies', def: "TEXT DEFAULT '15+'" },
    { name: 'experience', def: "TEXT DEFAULT '2+'" },
    { name: 'projects_title', def: "TEXT DEFAULT 'Projects'" },
    { name: 'projects_subtitle', def: "TEXT DEFAULT 'A selection of things I''ve built — from full-stack apps to 3D immersive experiences.'" },
    { name: 'skills_title', def: "TEXT DEFAULT 'Skills & Tech'" },
    { name: 'skills_subtitle', def: "TEXT DEFAULT 'My technical arsenal and creative toolkit.'" },
  ];

  for (const col of profileCols) {
    try {
      await database.execute(`ALTER TABLE profile ADD COLUMN ${col.name} ${col.def}`);
    } catch {
      // Column already exists — ignore
    }
  }

  try {
    await database.execute(`ALTER TABLE projects ADD COLUMN theme TEXT DEFAULT 'cyber'`);
  } catch {
    // Column already exists — ignore
  }
}
