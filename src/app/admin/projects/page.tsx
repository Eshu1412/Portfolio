'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  status: string;
  theme: string;
  github_url: string;
  live_url: string;
  featured: number;
  display_order: number;
}

const EMPTY: Omit<Project, 'id'> = {
  title: '', description: '', tech_stack: [], status: 'pending', theme: 'cyber',
  github_url: '', live_url: '', featured: 0, display_order: 0,
};

const PROJECT_THEMES = [
  { value: 'cyber', label: 'Cyber Glow' },
  { value: 'aurora', label: 'Aurora Ice' },
  { value: 'sunset', label: 'Sunset Pulse' },
  { value: 'emerald', label: 'Emerald Flux' },
];

// Reusable custom confirm dialog — no window.confirm()
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '28px 32px', maxWidth: 380, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
          Confirm Delete
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} id="confirm-cancel-btn">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            id="confirm-delete-btn"
            style={{
              background: 'rgba(239,68,68,0.15)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 9999,
              padding: '8px 18px', fontSize: '0.85rem', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => { setProjects(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setTechInput(''); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, tech_stack: p.tech_stack,
      status: p.status, theme: p.theme || 'cyber', github_url: p.github_url, live_url: p.live_url,
      featured: p.featured, display_order: p.display_order,
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/projects/${editing.id}` : '/api/projects';
      const method = editing ? 'PATCH' : 'POST';
      const res    = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing ? 'Project updated!' : 'Project created!');
        setModalOpen(false);
        load();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to save');
      }
    } catch { toast.error('Network error'); }
    setSaving(false);
  };

  // Step 1: show confirm dialog
  const askDelete = (id: number, title: string) => setConfirmTarget({ id, title });

  // Step 2: confirmed — actually delete
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`"${confirmTarget.title}" deleted`);
        load();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to delete');
      }
    } catch { toast.error('Network error'); }
    setDeleting(false);
    setConfirmTarget(null);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.tech_stack.includes(t)) setForm(p => ({ ...p, tech_stack: [...p.tech_stack, t] }));
    setTechInput('');
  };
  const removeTech = (t: string) => setForm(p => ({ ...p, tech_stack: p.tech_stack.filter(x => x !== t) }));

  return (
    <AdminShell username="mauryatushar115">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Projects
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{projects.length} projects in your portfolio</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} id="add-project-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>Loading...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📁</div>
              <p>No projects yet. Add your first one!</p>
            </div>
          ) : (
            <table className={styles.responsiveTable}>
              <thead>
                <tr>
                  {['Project', 'Status', 'Featured', 'Tech Stack', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: i < projects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td data-label="Project">
                      <div className={styles.tdContent}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc', marginBottom: 2 }}>{p.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                          {p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}
                        </div>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`badge badge-${p.status}`}>{p.status.replace('_', ' ')}</span>
                    </td>
                    <td data-label="Featured" style={{ color: p.featured ? '#f59e0b' : '#475569' }}>
                      {p.featured ? '⭐' : '—'}
                    </td>
                    <td data-label="Tech Stack">
                      <div className={styles.tdContent}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {p.tech_stack.slice(0, 3).map(t => (
                            <span key={t} style={{ padding: '2px 8px', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                              {t}
                            </span>
                          ))}
                          {p.tech_stack.length > 3 && (
                            <span style={{ fontSize: '0.72rem', color: '#475569' }}>+{p.tech_stack.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Actions">
                      <div className={styles.tableCellAction} style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button
                          onClick={() => askDelete(p.id, p.title)}
                          disabled={deleting}
                          style={{
                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9999,
                            padding: '6px 14px', fontSize: '0.82rem', cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: 600,
                            opacity: deleting ? 0.5 : 1,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className={styles.modalContent}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>
              {editing ? 'Edit Project' : 'New Project'}
            </h2>
            <form id="project-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="My Awesome Project" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
                <textarea className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What does this project do?" rows={2} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ cursor: 'pointer' }}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Theme</label>
                  <select className="input" value={form.theme} onChange={e => setForm(p => ({ ...p, theme: e.target.value }))} style={{ cursor: 'pointer' }}>
                    {PROJECT_THEMES.map(theme => (
                      <option key={theme.value} value={theme.value}>{theme.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Display Order</label>
                  <input type="number" className="input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: +e.target.value }))} min={0} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tech Stack</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    className="input" value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="React, Node.js… (press Enter)"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addTech} style={{ flexShrink: 0 }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.tech_stack.map(t => (
                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '0.8rem', color: '#818cf8' }}>
                      {t}
                      <button type="button" onClick={() => removeTech(t)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '1rem' }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub URL</label>
                  <input className="input" type="url" value={form.github_url} onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live URL</label>
                  <input className="input" type="url" value={form.live_url} onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))} placeholder="https://myproject.com" />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', color: '#94a3b8' }}>
                <input
                  type="checkbox" checked={!!form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked ? 1 : 0 }))}
                  style={{ width: 16, height: 16, accentColor: '#6366f1' }}
                />
                Featured project (shown prominently)
              </label>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} id="save-project-btn">
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Dialog */}
      {confirmTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${confirmTarget.title}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </AdminShell>
  );
}
