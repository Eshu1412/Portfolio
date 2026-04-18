import getDb, { initSchema } from './db';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const db = getDb();
  await initSchema();

  // Seed admin user
  const userResult = await db.execute({ sql: 'SELECT id FROM users WHERE username = ?', args: ['mauryatushar115'] });
  const existingUser = userResult.rows[0];
  if (!existingUser) {
    const hash = await bcrypt.hash('#EshuMaurya#@1412', 12);
    await db.execute({
      sql: 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
      args: ['mauryatushar115', hash, 'mauryatushar115@gmail.com']
    });
  }

  // Seed profile
  const profileResult = await db.execute('SELECT id FROM profile LIMIT 1');
  const existingProfile = profileResult.rows[0];
  if (!existingProfile) {
    await db.execute({
      sql: `
        INSERT INTO profile (full_name, tagline, hero_roles, bio, github, email, phone, whatsapp, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        'Tushar Maurya',
        'Full Stack Developer & Creative Technologist',
        JSON.stringify([
          'Full Stack Developer & Creative Technologist',
          'WebGL & 3D Web Specialist',
          'React · Next.js · Node.js Engineer',
          'Building immersive digital experiences',
        ]),
        'I build immersive, performant web applications that live at the intersection of engineering and design. Passionate about 3D web experiences, scalable backends, and clean code that ships.',
        'https://github.com/mauryatushar115',
        'mauryatushar115@gmail.com',
        '+91 00000 00000',
        '+91 00000 00000',
        'India'
      ]
    });
  }

  // Seed skills
  const skillsCountResult = await db.execute('SELECT COUNT(*) as count FROM skills');
  const existingSkillsCount = skillsCountResult.rows[0] as unknown as { count: number };
  if (existingSkillsCount.count === 0) {
    const skills = [
      // Frontend
      { name: 'React.js', category: 'Frontend', proficiency: 90, icon: 'react', display_order: 1 },
      { name: 'Next.js', category: 'Frontend', proficiency: 85, icon: 'nextjs', display_order: 2 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 82, icon: 'typescript', display_order: 3 },
      { name: 'Three.js / R3F', category: 'Frontend', proficiency: 75, icon: 'threejs', display_order: 4 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 88, icon: 'tailwind', display_order: 5 },
      { name: 'GSAP', category: 'Frontend', proficiency: 78, icon: 'gsap', display_order: 6 },
      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 85, icon: 'nodejs', display_order: 7 },
      { name: 'Python / FastAPI', category: 'Backend', proficiency: 80, icon: 'python', display_order: 8 },
      { name: 'Express.js', category: 'Backend', proficiency: 83, icon: 'express', display_order: 9 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 78, icon: 'postgresql', display_order: 10 },
      { name: 'MongoDB', category: 'Database', proficiency: 75, icon: 'mongodb', display_order: 11 },
      { name: 'SQLite', category: 'Database', proficiency: 82, icon: 'sqlite', display_order: 12 },
      // Tools
      { name: 'Docker', category: 'DevOps', proficiency: 72, icon: 'docker', display_order: 13 },
      { name: 'Git / GitHub', category: 'Tools', proficiency: 90, icon: 'git', display_order: 14 },
      { name: 'WebGL / GLSL', category: 'Graphics', proficiency: 68, icon: 'webgl', display_order: 15 },
    ];

    for (const s of skills) {
      await db.execute({
        sql: 'INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES (?, ?, ?, ?, ?)',
        args: [s.name, s.category, s.proficiency, s.icon, s.display_order]
      });
    }
  }

  // Seed projects
  const projectsCountResult = await db.execute('SELECT COUNT(*) as count FROM projects');
  const existingProjectsCount = projectsCountResult.rows[0] as unknown as { count: number };
  if (existingProjectsCount.count === 0) {
    const projects = [
      {
        title: 'BookStore Full-Stack App',
        description: 'A complete full-stack bookstore application with user authentication, product management, cart, and order system. Built with React frontend and Node.js/Express backend with PostgreSQL.',
        tech_stack: JSON.stringify(['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT']),
        status: 'completed',
        github_url: 'https://github.com/mauryatushar115',
        live_url: '',
        theme: 'cyber',
        featured: 1,
        display_order: 1,
      },
      {
        title: 'Gem-AI Code Generator',
        description: 'An AI-powered full-stack application that generates project structures and code using Google Gemini API. Features ZIP download of generated projects, Clerk auth, and a premium glassmorphic UI.',
        tech_stack: JSON.stringify(['React', 'FastAPI', 'Python', 'Google Gemini', 'Clerk']),
        status: 'completed',
        github_url: 'https://github.com/mauryatushar115',
        live_url: '',
        theme: 'aurora',
        featured: 1,
        display_order: 2,
      },
      {
        title: 'EventFlow — Event Management Platform',
        description: 'A comprehensive event management application with booking, dashboard, and admin capabilities. Built with React, Vite, and Tailwind CSS with a rich design system.',
        tech_stack: JSON.stringify(['React', 'Vite', 'Tailwind CSS', 'Node.js']),
        status: 'in_progress',
        github_url: 'https://github.com/mauryatushar115',
        live_url: '',
        theme: 'sunset',
        featured: 1,
        display_order: 3,
      },
      {
        title: '3D Portfolio Website',
        description: 'An immersive 3D portfolio built with Next.js, Three.js, and React Three Fiber. Features particle galaxy hero, 3D skill nodes, scroll-driven animations, and a full CMS admin panel.',
        tech_stack: JSON.stringify(['Next.js', 'Three.js', 'React Three Fiber', 'SQLite', 'GSAP']),
        status: 'completed',
        github_url: 'https://github.com/mauryatushar115',
        live_url: '',
        theme: 'cyber',
        featured: 1,
        display_order: 4,
      },
      {
        title: 'AI Chat Interface',
        description: 'A premium AI chat application with multi-model support, conversation history, and a stunning glassmorphic dark UI. Fully responsive with theme switching.',
        tech_stack: JSON.stringify(['React', 'Python', 'FastAPI', 'WebSockets']),
        status: 'pending',
        github_url: 'https://github.com/mauryatushar115',
        live_url: '',
        theme: 'emerald',
        featured: 0,
        display_order: 5,
      },
    ];

    for (const p of projects) {
      await db.execute({
        sql: `
          INSERT INTO projects (title, description, tech_stack, status, github_url, live_url, theme, featured, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [p.title, p.description, p.tech_stack, p.status, p.github_url, p.live_url, p.theme, p.featured, p.display_order]
      });
    }
  }

  console.log('✅ Database seeded successfully');
}
