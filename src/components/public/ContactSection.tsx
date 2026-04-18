'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Reveal from '@/components/public/Reveal';

interface Profile {
  email?: string;
  github?: string;
  linkedin?: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
}

interface Props { profile?: Profile; }

const SOCIALS_META = [
  {
    key: 'email',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'COMM CHANNEL',
    color: '#00f5ff',
  },
  {
    key: 'phone',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5.5A2.5 2.5 0 015.5 3h2.379a1.5 1.5 0 011.49 1.322l.53 3.89a1.5 1.5 0 01-.86 1.56l-1.466.732a14.04 14.04 0 006.96 6.96l.733-1.466a1.5 1.5 0 011.559-.86l3.89.53A1.5 1.5 0 0121 16.121V18.5A2.5 2.5 0 0118.5 21h-1C9.492 21 3 14.508 3 6.5v-1Z" />
      </svg>
    ),
    label: 'DIRECT LINE',
    color: '#ffd700',
  },
  {
    key: 'whatsapp',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.75 13.96c.25.13 1.47.72 1.7.8.23.08.38.13.54-.12.16-.25.62-.8.76-.96.14-.17.29-.19.54-.06.25.13 1.06.39 2.02 1.24.74.66 1.24 1.47 1.38 1.72.14.25.02.39-.1.52-.12.11-.25.29-.37.43-.12.14-.16.25-.25.41-.08.17-.04.31.02.43.06.13.54 1.3.74 1.78.19.46.38.4.54.41.14.01.31.01.48.01.17 0 .44-.06.67-.31.23-.25.88-.86 1-2.09.12-1.23-.8-2.43-.92-2.59-.12-.17-1.63-2.49-3.98-3.49-.56-.24-1-.38-1.34-.49-.56-.18-1.07-.15-1.47.09-.45.27-1.38 1.35-1.69 1.63-.31.29-.62.31-1.14.06-.52-.25-2.18-.8-4.15-2.54-1.53-1.36-2.56-3.03-2.86-3.55-.29-.52-.03-.8.22-1.05.22-.22.52-.58.78-.87.26-.29.35-.49.52-.82.17-.33.08-.62-.04-.87-.12-.25-1.14-2.74-1.56-3.75-.41-.99-.83-.86-1.14-.88-.29-.01-.62-.02-.95-.02s-.87.12-1.32.62c-.45.5-1.72 1.68-1.72 4.1 0 2.42 1.76 4.76 2 5.09.25.33 3.45 5.27 8.36 7.39 1.17.5 2.08.8 2.79 1.03 1.17.37 2.24.31 3.08.19.94-.14 2.9-1.18 3.31-2.31.41-1.13.41-2.1.29-2.31-.12-.21-.23-.33-.48-.45Z" />
        <path d="M20.52 3.48A11.86 11.86 0 0012.07 0C5.44 0 .05 5.39.05 12.01c0 2.12.55 4.2 1.6 6.05L0 24l6.12-1.6a11.94 11.94 0 005.95 1.53h.01c6.62 0 12.01-5.39 12.01-12.01 0-3.2-1.25-6.21-3.57-8.44Zm-8.45 18.42h-.01a9.96 9.96 0 01-5.08-1.39l-.36-.21-3.63.95.97-3.54-.24-.37a9.92 9.92 0 01-1.52-5.3C2.2 6.56 6.63 2.13 12.08 2.13c2.65 0 5.14 1.03 7.02 2.91A9.86 9.86 0 0122 12.05c0 5.45-4.43 9.85-9.93 9.85Z" />
      </svg>
    ),
    label: 'WHATSAPP',
    color: '#25d366',
  },
  {
    key: 'github',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    label: 'SOURCE CODE',
    color: '#bf00ff',
  },
  {
    key: 'linkedin',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'PROFESSIONAL NET',
    color: '#00ff88',
  },
  {
    key: 'location',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'LOCATION',
    color: '#ff0080',
  },
];

export default function ContactSection({ profile }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const email    = profile?.email    || 'mauryatushar115@gmail.com';
  const github   = profile?.github   || '';
  const linkedin = profile?.linkedin || '';
  const location = profile?.location || 'India';
  const phone    = profile?.phone    || '';
  const whatsapp = profile?.whatsapp || '';
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null;
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : null;

  const infoMap: Record<string, string | null> = {
    email:    email,
    phone:    phone || null,
    whatsapp: whatsapp || null,
    github:   github    || null,
    linkedin: linkedin  || null,
    location: location,
  };

  const hrefMap: Record<string, string | null> = {
    email:    `mailto:${email}`,
    phone:    phoneHref,
    whatsapp: whatsappHref,
    github:   github   || null,
    linkedin: linkedin || null,
    location: null,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message transmitted! I'll respond within 24 hours 🚀");
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Transmission failed');
      }
    } catch {
      toast.error('Network error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="section"
      id="contact"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 60% 40% at 20% 60%, rgba(0,245,255,0.03) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 50% 40% at 80% 40%, rgba(191,0,255,0.03) 0%, transparent 70%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 32, right: 32, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Header */}
        <Reveal className="section-header">
          <div className="section-tag" style={{ color: '#ff0080', borderColor: 'rgba(255,0,128,0.3)', background: 'rgba(255,0,128,0.05)' }}>
            <span className="section-tag-dot" style={{ background: '#ff0080', boxShadow: '0 0 8px #ff0080' }} />
            Initiate Contact
          </div>
          <h2 className="section-title">
            Let&apos;s <span className="text-gradient-cyber">Work Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind? Open a comm channel and let&apos;s build something legendary.
          </p>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 48, alignItems: 'start',
        }}>
          {/* ── Left: Contact Info ── */}
          <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 12 }} x={-28}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.62rem', letterSpacing: '0.22em',
              color: 'rgba(0,245,255,0.35)', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {'// COMM LINKS'}
            </div>

            {SOCIALS_META.map(({ key, icon, label, color }) => {
              const value = infoMap[key];
              const href  = hrefMap[key];
              if (!value) return null;
              return (
                <div key={key} className="card" style={{
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                  borderColor: `${color}12`,
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                }}>
                  <div style={{
                    width: 42, height: 42, flexShrink: 0,
                    background: `${color}0d`,
                    border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color,
                    clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                  }}>
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.58rem', color: `${color}80`,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      marginBottom: 3,
                    }}>
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: '0.9rem', color: '#7ab3cc',
                          textDecoration: 'none', wordBreak: 'break-all',
                          transition: 'color 0.25s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = color)}
                        onMouseLeave={e => (e.currentTarget.style.color = '#7ab3cc')}
                      >
                        {value.replace('https://', '')}
                      </a>
                    ) : (
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', color: '#7ab3cc' }}>
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Response time card */}
            <div className="card" style={{
              padding: '24px',
              clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
              border: '1px solid rgba(0,255,136,0.12)',
              background: 'rgba(0,255,136,0.03)',
              marginTop: 8,
            }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.62rem', color: 'rgba(0,255,136,0.5)',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                ◆ RESPONSE PROTOCOL
              </div>
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#7ab3cc', fontSize: '0.95rem', lineHeight: 1.75,
              }}>
                Typically respond within{' '}
                <strong style={{ color: '#00ff88', fontFamily: "'Orbitron', sans-serif", fontSize: '0.85rem' }}>24 hours</strong>.
                Open for freelance, full-time, and collaboration missions.
              </p>
            </div>
          </Reveal>

          {/* ── Right: Contact Form ── */}
          <Reveal x={28}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Terminal header */}
            <div style={{
              background: 'rgba(0,245,255,0.03)',
              border: '1px solid rgba(0,245,255,0.1)',
              borderBottom: 'none',
              padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
              clipPath: 'polygon(4px 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}>
              {['#ff0080', '#ffd700', '#00ff88'].map(c => (
                <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.62rem', color: 'rgba(0,245,255,0.4)',
                letterSpacing: '0.18em', marginLeft: 6,
              }}>
                {'// INITIATE_MESSAGE.exe'}
              </span>
            </div>

            <div style={{
              border: '1px solid rgba(0,245,255,0.1)',
              padding: '28px',
              display: 'flex', flexDirection: 'column', gap: 16,
              background: 'rgba(0,245,255,0.015)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
            }}>
              {/* Name + Email row */}
              <div className="contactFormRow" style={{ display: 'grid', gap: 16 }}>
                <FieldGroup label="IDENTIFIER (NAME) *">
                  <input
                    type="text" className="input" placeholder="john_doe"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required id="contact-name"
                  />
                </FieldGroup>
                <FieldGroup label="COMM ADDRESS (EMAIL) *">
                  <input
                    type="email" className="input" placeholder="user@domain.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required id="contact-email"
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="SUBJECT">
                <input
                  type="text" className="input" placeholder="project_collaboration | freelance_inquiry | ..."
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  id="contact-subject"
                />
              </FieldGroup>

              <FieldGroup label="MESSAGE PAYLOAD *">
                <textarea
                  className="input"
                  placeholder={`// Describe your mission...\n// Tell me about timeline, scope + requirements`}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required rows={6} id="contact-message"
                />
              </FieldGroup>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="contact-submit"
                style={{
                  width: '100%', justifyContent: 'center',
                  opacity: loading ? 0.7 : 1,
                  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: '1px solid rgba(0,245,255,0.3)',
                      borderTopColor: '#00f5ff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    SEND TRANSMISSION
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            </form>
          </Reveal>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .contactFormRow { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) {
          #contact .container > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .contactFormRow { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.6rem', fontWeight: 400,
        color: 'rgba(0,245,255,0.45)',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
