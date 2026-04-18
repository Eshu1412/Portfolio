'use client';

import { useEffect, useState, useRef } from 'react';
import Reveal from '@/components/public/Reveal';

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  status: 'pending' | 'in_progress' | 'completed';
  theme?: string;
  github_url: string;
  live_url: string;
  featured: number;
}

const STATUS_META: Record<string, { label: string; color: string; glow: string }> = {
  completed: { label: 'COMPLETED', color: '#00ff88', glow: 'rgba(0,255,136,0.3)' },
  in_progress: { label: 'IN PROGRESS', color: '#00f5ff', glow: 'rgba(0,245,255,0.3)' },
  pending: { label: 'COMING SOON', color: '#ffd700', glow: 'rgba(255,215,0,0.3)' },
};

const FILTER_OPTS = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
];

const THEME_META: Record<string, { accent: string; accentSoft: string; glow: string; chip: string; panel: string }> = {
  cyber: {
    accent: '#bf00ff',
    accentSoft: 'rgba(191,0,255,0.22)',
    glow: 'rgba(191,0,255,0.26)',
    chip: 'rgba(191,0,255,0.12)',
    panel: 'linear-gradient(135deg, rgba(191,0,255,0.08), rgba(4,4,18,0.96))',
  },
  aurora: {
    accent: '#00f5ff',
    accentSoft: 'rgba(0,245,255,0.22)',
    glow: 'rgba(0,245,255,0.22)',
    chip: 'rgba(0,245,255,0.12)',
    panel: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(4,10,28,0.96))',
  },
  sunset: {
    accent: '#ff7a18',
    accentSoft: 'rgba(255,122,24,0.22)',
    glow: 'rgba(255,122,24,0.24)',
    chip: 'rgba(255,122,24,0.12)',
    panel: 'linear-gradient(135deg, rgba(255,122,24,0.1), rgba(38,8,18,0.96))',
  },
  emerald: {
    accent: '#00ff88',
    accentSoft: 'rgba(0,255,136,0.2)',
    glow: 'rgba(0,255,136,0.2)',
    chip: 'rgba(0,255,136,0.12)',
    panel: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(4,18,16,0.96))',
  },
};

export default function ProjectsSection({ profile }: { profile?: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('Failed to load projects:', data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <section
      ref={sectionRef}
      className="section"
      id="projects"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Purple glow background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(191,0,255,0.03) 0%, transparent 70%)',
      }} />

      {/* Top / bottom dividers */}
      <div style={{
        position: 'absolute', top: 0, left: 32, right: 32, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(191,0,255,0.2), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Header */}
        <Reveal className="section-header">
          <div className="section-tag" style={{ color: '#bf00ff', borderColor: 'rgba(191,0,255,0.3)', background: 'rgba(191,0,255,0.05)' }}>
            <span className="section-tag-dot" style={{ background: '#bf00ff', boxShadow: '0 0 8px #bf00ff' }} />
            Portfolio
          </div>
          <h2 className="section-title">
            {profile?.projects_title ? profile.projects_title : <>Featured <span className="text-gradient">Projects</span></>}
          </h2>
          <p className="section-subtitle">
            {profile?.projects_subtitle || "A selection of things I've built — from full-stack apps to 3D immersive experiences"}
          </p>
        </Reveal>

        {/* Filter row */}
        <Reveal style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' }} delay={0.08}>
          {FILTER_OPTS.map(f => {
            const isAct = filter === f.value;
            return (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                padding: '9px 26px',
                background: isAct ? 'rgba(191,0,255,0.1)' : 'rgba(0,0,0,0)',
                border: `1px solid ${isAct ? 'rgba(191,0,255,0.5)' : 'rgba(0,245,255,0.08)'}`,
                color: isAct ? '#bf00ff' : '#3a6070',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.68rem', letterSpacing: '0.16em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.28s ease',
                clipPath: 'polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%)',
                boxShadow: isAct ? '0 0 24px rgba(191,0,255,0.25)' : 'none',
                textShadow: isAct ? '0 0 10px rgba(191,0,255,0.8)' : 'none',
              }}>
                {f.label}
              </button>
            );
          })}
        </Reveal>

        {/* Projects Grid */}
        <Reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }} delay={0.12}>
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              height: 300,
              background: 'linear-gradient(135deg, rgba(191,0,255,0.03), rgba(0,0,0,0))',
              border: '1px solid rgba(191,0,255,0.06)',
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              animation: `pulseLoad 1.8s ease-in-out ${i * 0.12}s infinite`,
            }} />
          ))}
          {!loading && filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} visible={visible} />
          ))}
        </Reveal>

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: "'Share Tech Mono', monospace",
            color: 'rgba(0,245,255,0.2)', fontSize: '0.72rem', letterSpacing: '0.24em',
          }}>
            {'// NO PROJECTS FOUND'}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseLoad {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

function ProjectCard({ project, index, visible }: { project: Project; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_META[project.status] || STATUS_META.pending;
  const theme = THEME_META[project.theme || 'cyber'] || THEME_META.cyber;

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px',
        display: 'flex', flexDirection: 'column', gap: 18,
        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, box-shadow 0.35s, border-color 0.35s`,
        boxShadow: hovered ? `0 0 40px ${theme.glow}, 0 24px 50px rgba(0,0,0,0.5)` : 'none',
        borderColor: hovered ? theme.accentSoft : undefined,
        background: hovered
          ? theme.panel
          : undefined,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Chamfer accent — top-right */}
      <div style={{
        position: 'absolute', top: -1, right: -1, width: 40, height: 40,
        background:
          `linear-gradient(270deg, ${theme.accent}, transparent) 100% 0 / 40px 1px no-repeat, ` +
          `linear-gradient(180deg, ${theme.accent}, transparent) 100% 0 / 1px 40px no-repeat`,
        transition: 'opacity 0.35s',
        opacity: hovered ? 1 : 0.4,
        pointerEvents: 'none',
      }} />

      {/* Purple glow orb */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 180, height: 180,
        background: `radial-gradient(circle, ${theme.accentSoft} 0%, transparent 70%)`,
        borderRadius: '50%', transform: 'translate(40%, -30%)',
        pointerEvents: 'none',
      }} />

      {/* Top row: icon + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{
          width: 52, height: 52,
          background: project.featured ? 'rgba(255,215,0,0.08)' : theme.chip,
          border: `1px solid ${project.featured ? 'rgba(255,215,0,0.25)' : theme.accentSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem',
          clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          transition: 'box-shadow 0.35s',
          boxShadow: hovered ? (project.featured ? '0 0 20px rgba(255,215,0,0.3)' : `0 0 20px ${theme.glow}`) : 'none',
        }}>
          {project.featured ? '⭐' : '◈'}
        </div>

        <span className={`badge badge-${project.status}`}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.color, boxShadow: `0 0 6px ${status.color}` }} />
          {status.label}
        </span>
      </div>

      {/* Text content */}
      <div style={{ position: 'relative' }}>
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1rem', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 10, lineHeight: 1.3,
          color: hovered ? '#fff' : '#dff0ff',
          transition: 'color 0.25s',
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.95rem', color: '#5a8095', lineHeight: 1.72, fontWeight: 400,
        }}>
          {project.description.length > 140
            ? project.description.slice(0, 140) + '…'
            : project.description}
        </p>
      </div>

      {/* Tech stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tech_stack.slice(0, 5).map(tech => (
          <span key={tech} style={{
            padding: '3px 12px',
            background: theme.chip,
            border: `1px solid ${theme.accentSoft}`,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem', color: '#3a6070',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            clipPath: 'polygon(3px 0%, 100% 0%, calc(100% - 3px) 100%, 0% 100%)',
            transition: 'border-color 0.25s, color 0.25s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.accent;
              (e.currentTarget as HTMLElement).style.color = theme.accent;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.accentSoft;
              (e.currentTarget as HTMLElement).style.color = '#3a6070';
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Source
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

