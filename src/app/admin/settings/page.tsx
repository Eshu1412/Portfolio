'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  color: '#f8fafc', fontFamily: 'Inter, sans-serif',
  fontSize: '0.9rem', padding: '10px 14px', outline: 'none',
  boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16, padding: 28,
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc',
  marginBottom: 24, paddingBottom: 16,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

interface ProfileState {
  full_name: string;
  email: string;
  tagline: string;
  hero_roles: string;
  bio: string;
  location: string;
  phone: string;
  whatsapp: string;
  status: string;
  focus: string;
  superpower: string;
  projects_built: string;
  technologies: string;
  experience: string;
  github: string;
  linkedin: string;
  twitter: string;
  resume_url: string;
}

const EMPTY_PROFILE: ProfileState = {
  full_name: '',
  email: '',
  tagline: '',
  hero_roles: '',
  bio: '',
  location: '',
  phone: '',
  whatsapp: '',
  status: 'Open to Work',
  focus: '',
  superpower: '',
  projects_built: '5+',
  technologies: '15+',
  experience: '2+',
  github: '',
  linkedin: '',
  twitter: '',
  resume_url: '',
};

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<ProfileState>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        setProfile({
          ...EMPTY_PROFILE,
          ...d,
          hero_roles: Array.isArray(d?.hero_roles) ? d.hero_roles.join('\n') : (d?.hero_roles || ''),
        });
        setProfileLoading(false);
      })
      .catch(() => setProfileLoading(false));
  }, []);

  const set =
    (key: keyof ProfileState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setProfile(p => ({ ...p, [key]: e.target.value }));

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          hero_roles: profile.hero_roles
            .split('\n')
            .map(role => role.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile({
          ...EMPTY_PROFILE,
          ...updated,
          hero_roles: Array.isArray(updated?.hero_roles) ? updated.hero_roles.join('\n') : (updated?.hero_roles || ''),
        });
        toast.success('Profile updated successfully! 🎉');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to update profile');
      }
    } catch { toast.error('Network error'); }
    setProfileSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      if (res.ok) {
        toast.success('Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to change password');
      }
    } catch { toast.error('Network error'); }
    setPwSaving(false);
  };

  return (
    <AdminShell username="mauryatushar115">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
            Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage your portfolio profile and account settings
          </p>
        </div>

        {/* ── Profile Information ───────────────────────── */}
        <div style={cardStyle}>
          <h2 style={sectionHeading}>📋 Profile Information</h2>
          {profileLoading ? (
            <div style={{ color: '#475569', padding: '20px 0' }}>Loading profile...</div>
          ) : (
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} value={profile.full_name || ''} onChange={set('full_name')} placeholder="Tushar Maurya" />
                  </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" value={profile.email || ''} onChange={set('email')} placeholder="you@example.com" />
                </div>
              </div>
                <div>
                  <label style={labelStyle}>Tagline</label>
                  <input style={inputStyle} value={profile.tagline || ''} onChange={set('tagline')} placeholder="Full Stack Developer & Creative Technologist" />
                </div>
              <div>
                <label style={labelStyle}>Hero Typing Lines</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 124, resize: 'vertical' }}
                  value={profile.hero_roles || ''}
                  onChange={set('hero_roles')}
                  placeholder={'Full Stack Developer & Creative Technologist\nWebGL & 3D Web Specialist\nReact · Next.js · Node.js Engineer'}
                />
                <div style={{ color: '#475569', fontSize: '0.76rem', marginTop: 8 }}>
                  One line per rotating hero animation entry.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={profile.bio || ''} onChange={set('bio')} placeholder="Tell your story..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={profile.location || ''} onChange={set('location')} placeholder="India" />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input style={inputStyle} value={profile.phone || ''} onChange={set('phone')} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number</label>
                <input style={inputStyle} value={profile.whatsapp || ''} onChange={set('whatsapp')} placeholder="+91 98765 43210" />
              </div>

              {/* ── About Section Metadata ─────────────── */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                  About Section Cards
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>💼 Status</label>
                    <select data-dark-select="true" style={{ ...inputStyle, cursor: 'pointer' }} value={profile.status || 'Open to Work'} onChange={set('status')}>
                      <option>Open to Work</option>
                      <option>Employed</option>
                      <option>Freelancing</option>
                      <option>Available for Projects</option>
                      <option>Not Available</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>🎓 Focus</label>
                    <input style={inputStyle} value={profile.focus || ''} onChange={set('focus')} placeholder="Full Stack + 3D Web" />
                  </div>
                </div>
                <div style={{ marginTop: 18 }}>
                  <label style={labelStyle}>⚡ Superpower</label>
                  <input style={inputStyle} value={profile.superpower || ''} onChange={set('superpower')} placeholder="Turning ideas → products" />
                </div>
              </div>

              {/* ── Stats Section ─────────────────────── */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                  Statistics / Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>🚀 Projects Built</label>
                    <input style={inputStyle} value={profile.projects_built || ''} onChange={set('projects_built')} placeholder="5+" />
                  </div>
                  <div>
                    <label style={labelStyle}>💻 Technologies</label>
                    <input style={inputStyle} value={profile.technologies || ''} onChange={set('technologies')} placeholder="15+" />
                  </div>
                  <div>
                    <label style={labelStyle}>⏱️ Yrs Experience</label>
                    <input style={inputStyle} value={profile.experience || ''} onChange={set('experience')} placeholder="2+" />
                  </div>
                </div>
              </div>

              {/* ── Social Links ──────────────────────── */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                  Social Links
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>🐙 GitHub URL</label>
                    <input style={inputStyle} type="url" value={profile.github || ''} onChange={set('github')} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>💼 LinkedIn URL</label>
                    <input style={inputStyle} type="url" value={profile.linkedin || ''} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>🐦 Twitter URL</label>
                    <input style={inputStyle} type="url" value={profile.twitter || ''} onChange={set('twitter')} placeholder="https://twitter.com/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>📄 Resume URL</label>
                    <input style={inputStyle} type="url" value={profile.resume_url || ''} onChange={set('resume_url')} placeholder="https://drive.google.com/..." />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                <button type="submit" className="btn btn-primary" disabled={profileSaving} id="save-profile-btn"
                  style={{ minWidth: 140, justifyContent: 'center' }}>
                  {profileSaving ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Saving...
                    </>
                  ) : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Change Password ───────────────────────────── */}
        <div style={cardStyle}>
          <h2 style={sectionHeading}>🔐 Change Password</h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input style={inputStyle} type="password" value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                required placeholder="••••••••••••" id="current-password" />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input style={inputStyle} type="password" value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                required minLength={6} placeholder="Min. 6 characters" id="new-password" />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input style={inputStyle} type="password" value={pwForm.confirmPassword}
                onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                required placeholder="Repeat new password" id="confirm-password" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={pwSaving} id="change-password-btn"
                style={{ minWidth: 160, justifyContent: 'center' }}>
                {pwSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminShell>
  );
}
