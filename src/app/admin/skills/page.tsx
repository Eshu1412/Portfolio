'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  display_order: number;
}

const EMPTY = { name: '', category: 'Frontend', proficiency: 80, icon: '', display_order: 0 };
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Graphics', 'Other'];

const COLOR_MAP: Record<string, string> = {
  Frontend: '#6366f1', Backend: '#8b5cf6', Database: '#06b6d4',
  DevOps: '#f59e0b', Tools: '#10b981', Graphics: '#f472b6', Other: '#94a3b8',
};

// ── Inline Confirm Dialog (replaces window.confirm) ────────
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
          <button
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            id="confirm-cancel-btn"
          >
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

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => { setSkills(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, icon: s.icon, display_order: s.display_order });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/skills/${editing.id}` : '/api/skills';
      const method = editing ? 'PATCH' : 'POST';
      const res    = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing ? 'Skill updated!' : 'Skill added!');
        setModalOpen(false);
        load();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to save');
      }
    } catch { toast.error('Network error'); }
    setSaving(false);
  };

  // Step 1: ask for confirmation via custom dialog
  const askDelete = (id: number, name: string) => {
    setConfirmTarget({ id, name });
  };

  // Step 2: user confirmed → actually delete
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/skills/${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`"${confirmTarget.name}" deleted`);
        load();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to delete');
      }
    } catch { toast.error('Network error'); }
    setDeleting(false);
    setConfirmTarget(null);
  };

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length) acc[cat] = catSkills;
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <AdminShell username="mauryatushar115">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
              Skills
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {skills.length} skills across {Object.keys(byCategory).length} categories
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} id="add-skill-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </button>
        </div>

        {/* Skills by Category */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading skills...</div>
        ) : skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚡</div>
            <p>No skills yet. Add your first one!</p>
          </div>
        ) : (
          Object.entries(byCategory).map(([cat, catSkills]) => (
            <div key={cat}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLOR_MAP[cat], flexShrink: 0 }} />
                <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cat}
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {catSkills.map(skill => (
                  <div
                    key={skill.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${COLOR_MAP[cat]}20`,
                      borderRadius: 14, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = COLOR_MAP[cat] + '40';
                      (e.currentTarget as HTMLElement).style.background   = `${COLOR_MAP[cat]}08`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = COLOR_MAP[cat] + '20';
                      (e.currentTarget as HTMLElement).style.background   = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc', marginBottom: 4 }}>
                        {skill.name}
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${skill.proficiency}%`,
                          background: `linear-gradient(90deg, ${COLOR_MAP[cat]}, ${COLOR_MAP[cat]}80)`,
                          borderRadius: 2,
                        }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: COLOR_MAP[cat], fontSize: '1rem', flexShrink: 0 }}>
                      {skill.proficiency}%
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '4px 10px' }}
                        onClick={() => openEdit(skill)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(skill.id, skill.name)}
                        style={{
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                          padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer',
                          fontFamily: 'inherit', fontWeight: 600,
                        }}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>
              {editing ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Skill Name *
                </label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="React.js" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Proficiency ({form.proficiency}%)
                  </label>
                  <input
                    type="range" min={1} max={100} value={form.proficiency}
                    onChange={e => setForm(p => ({ ...p, proficiency: +e.target.value }))}
                    style={{ width: '100%', accentColor: '#6366f1', marginTop: 8 }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Icon Key</label>
                  <input className="input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="react, nodejs..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Display Order</label>
                  <input type="number" className="input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: +e.target.value }))} min={0} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} id="save-skill-btn">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Dialog */}
      {confirmTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${confirmTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </AdminShell>
  );
}
