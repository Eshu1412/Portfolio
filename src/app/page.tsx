'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/public/Navbar';
import SkillsSection from '@/components/public/SkillsSection';
import ProjectsSection from '@/components/public/ProjectsSection';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import CursorGlow from '@/components/public/CursorGlow';
import PageLoader from '@/components/public/PageLoader';
import Reveal from '@/components/public/Reveal';
import ScrollNavigator from '@/components/public/ScrollNavigator';
import { useTypewriter } from '@/hooks/useTypewriter';
import styles from './page.module.css';

const HeroScene = dynamic(() => import('@/components/public/HeroScene'), {
  ssr: false,
  loading: () => <div className={styles.heroSceneLoader} />,
});

interface Profile {
  full_name: string;
  tagline: string;
  hero_roles: string[];
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  resume_url: string;
  status: string;
  focus: string;
  superpower: string;
  projects_built: string;
  technologies: string;
  experience: string;
}

const DEFAULT_PROFILE: Profile = {
  full_name: 'Tushar Maurya',
  tagline: 'Full Stack Developer & Creative Technologist',
  hero_roles: [
    'Full Stack Developer & Creative Technologist',
    'WebGL & 3D Web Specialist',
    'React · Next.js · Node.js Engineer',
    'Building immersive digital experiences',
  ],
  bio: ' ',
  email: ' ',
  phone: '',
  whatsapp: '',
  github: ' ',
  linkedin: '',
  twitter: '',
  location: ' ',
  resume_url: '',
  status: ' ',
  focus: ' ',
  superpower: ' ',
  projects_built: ' ',
  technologies: '',
  experience: ' ',
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(' ');
  return { first: parts[0], rest: parts.slice(1).join(' ') };
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const typedTagline = useTypewriter(
    profile.hero_roles.length ? profile.hero_roles : DEFAULT_PROFILE.hero_roles,
    { typeSpeed: 52, deleteSpeed: 28, pauseDelay: 2200 },
  );

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.full_name) {
          setProfile({
            ...DEFAULT_PROFILE,
            ...data,
            hero_roles: Array.isArray(data.hero_roles) && data.hero_roles.length
              ? data.hero_roles
              : DEFAULT_PROFILE.hero_roles,
          });
        }
      })
      .catch(() => { });
  }, []);

  const { first, rest } = splitName(profile.full_name);

  const aboutItems = [
    { icon: '📍', label: 'Location', value: profile.location || 'India' },
    { icon: '💼', label: 'Status', value: profile.status || 'Open to Work' },
    { icon: '🎯', label: 'Focus', value: profile.focus || 'Full Stack + 3D Web' },
    { icon: '⚡', label: 'Superpower', value: profile.superpower || 'Turning ideas → products' },
  ];

  const phoneText = profile.phone || '+91 8765082284';
  const waString = profile.whatsapp || phoneText;
  
  const cleanPhone = phoneText.replace(/[^\d+]/g, '');
  const cleanWa = waString.replace(/\D/g, '');

  const heroSignals = [
    { label: 'Focus', value: profile.focus || DEFAULT_PROFILE.focus, isContact: false },
    { label: 'Base', value: profile.location || DEFAULT_PROFILE.location, isContact: false },
    { 
      label: 'Direct', 
      value: phoneText, 
      isContact: true, 
      phoneLink: `tel:${cleanPhone}`, 
      waLink: `https://wa.me/${cleanWa}` 
    },
  ];

  return (
    <>
      <PageLoader />
      <CursorGlow />
      <ScrollNavigator />
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className={styles.hero} id="home">
        <div className={styles.heroCanvas}>
          <HeroScene />
        </div>

        <div className={`container ${styles.heroContent}`}>
          {/* Status tag */}
          <div className={styles.heroTag}>
            <span className={styles.heroTagDot} />
            {profile.status || 'Available for work'}
          </div>

          {/* Main title */}
          <h1 className={styles.heroTitle}>
            <span className={styles.heroName}>{first}</span>
            {rest && (
              <span className={styles.heroLastName}>{rest}</span>
            )}
          </h1>

          {/* Role line — typewriter */}
          <div className={styles.heroRoleShell}>
            <p className={styles.heroRole}>
              <span className={styles.heroRolePrefix}>//</span>
              <span>{typedTagline}</span>
              <span className={styles.heroRoleCursor}>▌</span>
            </p>
          </div>

          <p className={styles.heroDesc}>{profile.bio}</p>

          <div className={styles.heroSignals}>
            {heroSignals.map(signal => (
              <div key={signal.label} className={styles.heroSignal}>
                <span className={styles.heroSignalLabel}>{signal.label}</span>
                {signal.isContact ? (
                  <a 
                    href={signal.phoneLink} 
                    className={styles.heroSignalValue} 
                    style={{ textDecoration: 'underline', textDecorationColor: 'rgba(0, 245, 255, 0.4)', textUnderlineOffset: '4px', cursor: 'pointer', transition: 'text-shadow 0.2s, color 0.2s' }} 
                    onMouseEnter={e => { e.currentTarget.style.color = '#00f5ff'; e.currentTarget.style.textShadow = '0 0 10px rgba(0, 245, 255, 0.4)'; }} 
                    onMouseLeave={e => { e.currentTarget.style.color = '#dff0ff'; e.currentTarget.style.textShadow = 'none'; }}
                    title="Call Me Direct"
                  >
                    {signal.value}
                  </a>
                ) : (
                  <span className={styles.heroSignalValue}>{signal.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className={styles.heroCta}>
            <a href="#projects" className="btn btn-primary btn-lg">
              View My Work
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-ghost btn-lg">
              Let&apos;s Talk
            </a>
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            {[
              { value: profile.projects_built || '5+', label: 'Projects Built' },
              { value: profile.technologies || '15+', label: 'Technologies' },
              { value: profile.experience || '2+', label: 'Yrs Experience' },
            ].map(stat => (
              <div key={stat.label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.heroScroll}>
          <div className={styles.heroScrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ ABOUT ═════════════════════════════════════ */}
      <section className="section" id="about" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,245,255,0.025) 0%, transparent 70%)',
        }} />

        <div style={{
          position: 'absolute', top: 0, left: 32, right: 32, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div className={styles.aboutGrid}>
            {/* Left — text content */}
            <Reveal x={-30} y={0}>

              <div className="section-tag">
                <span className="section-tag-dot" />
                About Me
              </div>

              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Crafting Digital{' '}
                <span className="text-gradient-cyber">Experiences</span>
              </h2>

              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#7ab3cc',
                lineHeight: 1.85,
                marginBottom: 32,
                fontSize: '1.08rem',
                fontWeight: 400,
              }}>
                {profile.bio}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="btn btn-primary">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Me
                  </a>
                )}
                <a href={heroSignals[2].phoneLink} className="btn btn-primary" title="Call Me">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5.5A2.5 2.5 0 015.5 3h2.379a1.5 1.5 0 011.49 1.322l.53 3.89a1.5 1.5 0 01-.86 1.56l-1.466.732a14.04 14.04 0 006.96 6.96l.733-1.466a1.5 1.5 0 011.559-.86l3.89.53A1.5 1.5 0 0121 16.121V18.5A2.5 2.5 0 0118.5 21h-1C9.492 21 3 14.508 3 6.5v-1Z" />
                  </svg>
                  Call
                </a>
                <a href={heroSignals[2].waLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ background: 'rgba(37, 211, 102, 0.1)', borderColor: 'rgba(37, 211, 102, 0.4)', color: '#25d366' }} title="WhatsApp Chat">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.75 13.96c.25.13 1.47.72 1.7.8.23.08.38.13.54-.12.16-.25.62-.8.76-.96.14-.17.29-.19.54-.06.25.13 1.06.39 2.02 1.24.74.66 1.24 1.47 1.38 1.72.14.25.02.39-.1.52-.12.11-.25.29-.37.43-.12.14-.16.25-.25.41-.08.17-.04.31.02.43.06.13.54 1.3.74 1.78.19.46.38.4.54.41.14.01.31.01.48.01.17 0 .44-.06.67-.31.23-.25.88-.86 1-2.09.12-1.23-.8-2.43-.92-2.59-.12-.17-1.63-2.49-3.98-3.49-.56-.24-1-.38-1.34-.49-.56-.18-1.07-.15-1.47.09-.45.27-1.38 1.35-1.69 1.63-.31.29-.62.31-1.14.06-.52-.25-2.18-.8-4.15-2.54-1.53-1.36-2.56-3.03-2.86-3.55-.29-.52-.03-.8.22-1.05.22-.22.52-.58.78-.87.26-.29.35-.49.52-.82.17-.33.08-.62-.04-.87-.12-.25-1.14-2.74-1.56-3.75-.41-.99-.83-.86-1.14-.88-.29-.01-.62-.02-.95-.02s-.87.12-1.32.62c-.45.5-1.72 1.68-1.72 4.1 0 2.42 1.76 4.76 2 5.09.25.33 3.45 5.27 8.36 7.39 1.17.5 2.08.8 2.79 1.03 1.17.37 2.24.31 3.08.19.94-.14 2.9-1.18 3.31-2.31.41-1.13.41-2.1.29-2.31-.12-.21-.23-.33-.48-.45Z" />
                    <path d="M20.52 3.48A11.86 11.86 0 0012.07 0C5.44 0 .05 5.39.05 12.01c0 2.12.55 4.2 1.6 6.05L0 24l6.12-1.6a11.94 11.94 0 005.95 1.53h.01c6.62 0 12.01-5.39 12.01-12.01 0-3.2-1.25-6.21-3.57-8.44Zm-8.45 18.42h-.01a9.96 9.96 0 01-5.08-1.39l-.36-.21-3.63.95.97-3.54-.24-.37a9.92 9.92 0 01-1.52-5.3C2.2 6.56 6.63 2.13 12.08 2.13c2.65 0 5.14 1.03 7.02 2.91A9.86 9.86 0 0122 12.05c0 5.45-4.43 9.85-9.93 9.85Z" />
                  </svg>
                  Message
                </a>
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resume
                  </a>
                )}
              </div>
            </Reveal>

            {/* Right — card */}
            <Reveal x={30} y={0} delay={0.08}>

              <div className={styles.aboutCard}>
                <div className={styles.aboutAvatarRing}>
                  <div className={styles.aboutAvatar}>
                    {profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.6rem', color: 'rgba(0,245,255,0.3)',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  marginBottom: 16,
                }}>
                  {'// PROFILE.DATA'}
                </div>

                <div className={styles.aboutInfo}>
                  {aboutItems.map(item => (
                    <div key={item.label} className={styles.aboutInfoItem}>
                      <span className={styles.aboutInfoIcon}>{item.icon}</span>
                      <div>
                        <div className={styles.aboutInfoLabel}>{item.label}</div>
                        <div className={styles.aboutInfoValue}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SkillsSection profile={profile} />
      <ProjectsSection profile={profile} />
      <ContactSection profile={profile} />
      <Footer profile={profile} />
    </>
  );
}
