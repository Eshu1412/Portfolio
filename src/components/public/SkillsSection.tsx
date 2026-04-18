'use client';

import { useEffect, useState, useRef } from 'react';
import Reveal from '@/components/public/Reveal';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
}

const CATEGORY_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  Frontend: { color: '#00f5ff', glow: 'rgba(0, 245, 255, 0.3)', label: 'FRONTEND' },
  Backend: { color: '#bf00ff', glow: 'rgba(191, 0, 255, 0.3)', label: 'BACKEND' },
  Database: { color: '#0080ff', glow: 'rgba(0, 128, 255, 0.3)', label: 'DATABASE' },
  DevOps: { color: '#ff6600', glow: 'rgba(255, 102, 0, 0.3)', label: 'DEVOPS' },
  Tools: { color: '#00ff88', glow: 'rgba(0, 255, 136, 0.3)', label: 'TOOLS' },
  Graphics: { color: '#ff0080', glow: 'rgba(255, 0, 128, 0.3)', label: 'GRAPHICS' },
  Other: { color: '#7ab3cc', glow: 'rgba(122, 179, 204, 0.3)', label: 'OTHER' },
};

const SKILL_ICONS: Record<string, string> = {
  react: '⚛', nextjs: '▲', typescript: 'TS', threejs: '◈', tailwind: '◇',
  gsap: '⚡', nodejs: '◬', python: 'Py', express: '⬡', postgresql: '◉',
  mongodb: '●', sqlite: '◫', docker: '◻', git: '⬡', webgl: '◆',
};

export default function SkillsSection({ profile }: { profile?: any }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          console.error('Failed to load skills:', data);
          setSkills([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setSkills([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      className="section"
      id="skills"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0, 245, 255, 0.025) 0%, transparent 70%)',
      }} />

      {/* Section corner decorations */}
      <div style={{
        position: 'absolute', top: 0, left: 32, right: 32, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.25), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Header */}
        <Reveal className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            Technical Arsenal
          </div>
          <h2 className="section-title">
            {profile?.skills_title ? profile.skills_title : <>My <span className="text-gradient-cyber">Skill Matrix</span></>}
          </h2>
          <p className="section-subtitle">
            {profile?.skills_subtitle || "Technologies and tools loaded in my combat-ready development loadout"}
          </p>
        </Reveal>

        {/* Category Filter */}
        <Reveal style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }} delay={0.08}>
          {categories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const isAct = activeCategory === cat;
            const color = cfg?.color || '#00f5ff';
            const glow = cfg?.glow || 'rgba(0,245,255,0.25)';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 24px',
                  background: isAct ? `${color}12` : 'rgba(0,245,255,0.02)',
                  border: `1px solid ${isAct ? color : 'rgba(0,245,255,0.08)'}`,
                  color: isAct ? color : 'rgba(122,179,204,0.6)',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.66rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.28s ease',
                  clipPath: 'polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%)',
                  boxShadow: isAct ? `0 0 24px ${glow}, inset 0 0 16px ${color}0a` : 'none',
                  textShadow: isAct ? `0 0 10px ${color}` : 'none',
                }}
              >
                {isAct && <span style={{ marginRight: 6, opacity: 0.6 }}>◆</span>}
                {cat}
              </button>
            );
          })}
        </Reveal>

        {/* Skills Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                height: 116,
                background: 'linear-gradient(90deg, rgba(0,245,255,0.02) 0%, rgba(0,245,255,0.05) 50%, rgba(0,245,255,0.02) 100%)',
                backgroundSize: '400% 100%',
                border: '1px solid rgba(0,245,255,0.05)',
                animation: `shimmerSkeleton 1.8s ease-in-out ${i * 0.1}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <Reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }} delay={0.12}>
            {filtered.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} visible={visible} />
            ))}
            {filtered.length === 0 && (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center', padding: '90px 0',
                fontFamily: "'Share Tech Mono', monospace",
                color: 'rgba(0,245,255,0.25)', fontSize: '0.72rem', letterSpacing: '0.24em',
              }}>
                {'// NO SKILLS FOUND IN SELECTED CATEGORY'}
              </div>
            )}
          </Reveal>
        )}
      </div>

      <style>{`
        @keyframes shimmerSkeleton {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}

function SkillCard({ skill, index, visible }: { skill: Skill; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cfg = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Other;
  const color = cfg.color;
  const glow = cfg.glow;
  const icon = SKILL_ICONS[skill.icon] || '◈';

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px 26px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.045}s, transform 0.55s ease ${index * 0.045}s`,
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        background: hovered
          ? `linear-gradient(135deg, ${color}06, rgba(4,4,18,0.96))`
          : 'linear-gradient(135deg, rgba(10,10,30,0.95), rgba(4,4,18,0.92))',
        boxShadow: hovered ? `0 0 30px ${glow}, 0 20px 40px rgba(0,0,0,0.4)` : 'none',
        cursor: 'default',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: hovered ? 1 : 0.3,
        transition: 'opacity 0.3s',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {/* Icon */}
        <div style={{
          width: 46, height: 46, flexShrink: 0,
          background: `${color}10`,
          border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '1rem', color, fontWeight: 700,
          letterSpacing: '0.04em',
          clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          textShadow: `0 0 14px ${color}`,
          transition: 'box-shadow 0.3s',
          boxShadow: hovered ? `0 0 20px ${glow}, inset 0 0 12px ${color}0a` : 'none',
        }}>
          {icon}
        </div>

        {/* Name + category */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700, fontSize: '0.78rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#dff0ff', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {skill.name}
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.6rem', color,
            textTransform: 'uppercase', letterSpacing: '0.16em',
            marginTop: 3, textShadow: `0 0 8px ${color}`,
          }}>
            {cfg.label}
          </div>
        </div>

        {/* Proficiency % */}
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900, fontSize: '1.25rem',
          color, letterSpacing: '0.04em', flexShrink: 0,
          textShadow: `0 0 18px ${glow}`,
        }}>
          {skill.proficiency}
          <span style={{ fontSize: '0.52rem', opacity: 0.5, marginLeft: 1 }}>%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 2,
        background: 'rgba(0,245,255,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Track fill */}
        <div style={{
          height: '100%',
          width: visible ? `${skill.proficiency}%` : '0%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: `width 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}50`,
          position: 'relative',
        }}>
          {/* Gleam */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '25%', height: '100%',
            background: `linear-gradient(90deg, transparent, ${color})`,
          }} />
        </div>
      </div>

      {/* Proficiency label */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        marginTop: 8,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.58rem',
        color: `${color}55`,
        letterSpacing: '0.14em',
      }}>
        {skill.proficiency >= 90 ? 'EXPERT' :
          skill.proficiency >= 75 ? 'ADVANCED' :
            skill.proficiency >= 60 ? 'PROFICIENT' : 'LEARNING'}
      </div>
    </div>
  );
}
