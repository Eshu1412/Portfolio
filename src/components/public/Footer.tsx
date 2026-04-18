interface Profile {
  full_name?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface Props { profile?: Profile; }

const NAV = ['#about', '#skills', '#projects', '#contact'];

export default function Footer({ profile }: Props) {
  const year     = new Date().getFullYear();
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'TM';

  const socials = [
    profile?.github   && { href: profile.github,   label: 'GitHub',   icon: <GithubIcon /> },
    profile?.linkedin && { href: profile.linkedin,  label: 'LinkedIn', icon: <LinkedInIcon /> },
    profile?.twitter  && { href: profile.twitter,   label: 'Twitter',  icon: <TwitterIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <footer style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Top border with glow */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), rgba(191,0,255,0.3), transparent)',
        boxShadow: '0 0 20px rgba(0,245,255,0.1)',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,20,0.8) 0%, transparent 70%)',
      }} />

      <div style={{ background: 'rgba(0,0,4,0.6)', backdropFilter: 'blur(12px)', padding: '64px 0 40px' }}>
        <div className="container" style={{ position: 'relative' }}>
          {/* Main footer grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 40,
            marginBottom: 48,
          }}>
            {/* Left: nav links */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {NAV.map(href => (
                <a
                  key={href}
                  href={href}
                  style={{
                    padding: '8px 16px',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.65rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', textDecoration: 'none',
                    color: '#3a6070',
                    transition: 'color 0.25s, text-shadow 0.25s',
                    clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#00f5ff';
                    (e.currentTarget as HTMLElement).style.textShadow = '0 0 12px rgba(0,245,255,0.6)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.04)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = '#3a6070';
                    (e.currentTarget as HTMLElement).style.textShadow = 'none';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {href.replace('#', '').charAt(0).toUpperCase() + href.slice(2)}
                </a>
              ))}
            </div>

            {/* Center: Logo */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 2,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.8rem', fontWeight: 900,
                letterSpacing: '0.1em',
              }}>
                <span style={{ color: 'rgba(0,245,255,0.3)', fontFamily: "'Share Tech Mono', monospace", fontSize: '1.4rem' }}>[ </span>
                <span style={{
                  background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {initials}
                </span>
                <span style={{ color: 'rgba(0,245,255,0.3)', fontFamily: "'Share Tech Mono', monospace", fontSize: '1.4rem' }}> ]</span>
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.58rem', color: '#1a3040',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginTop: 6,
              }}>
                FULL STACK DEVELOPER
              </div>
            </div>

            {/* Right: Social links */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  style={{
                    width: 40, height: 40,
                    background: 'rgba(0,245,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3a6070', textDecoration: 'none',
                    transition: 'all 0.28s ease',
                    clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(0,245,255,0.08)';
                    el.style.borderColor = 'rgba(0,245,255,0.35)';
                    el.style.color = '#00f5ff';
                    el.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)';
                    el.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(0,245,255,0.03)';
                    el.style.borderColor = 'rgba(0,245,255,0.1)';
                    el.style.color = '#3a6070';
                    el.style.boxShadow = 'none';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent)',
            marginBottom: 28,
          }} />

          {/* Bottom bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.62rem', color: '#1a3040', letterSpacing: '0.14em',
            }}>
              © {year}{' '}
              <span style={{ color: '#3a6070' }}>{profile?.full_name || 'Tushar Maurya'}</span>
              {' '}// ALL RIGHTS RESERVED
            </p>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.62rem', color: '#1a3040', letterSpacing: '0.12em',
            }}>
              BUILT WITH{' '}
              <span style={{ color: '#00f5ff' }}>NEXT.JS</span>
              {' '}+{' '}
              <span style={{ color: '#bf00ff' }}>THREE.JS</span>
              {' '}+{' '}
              <span style={{ color: '#ff0080' }}>❤</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
