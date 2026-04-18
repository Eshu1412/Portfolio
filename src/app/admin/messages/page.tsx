'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: number;
  created_at: number;
}

// Custom in-DOM confirm dialog — no window.confirm()
function ConfirmDialog({
  senderName,
  onConfirm,
  onCancel,
}: {
  senderName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
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
          Delete Message
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete the message from <strong style={{ color: '#f8fafc' }}>{senderName}</strong>? This cannot be undone.
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/messages')
      .then(r => r.json())
      .then(d => { setMessages(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: number, read: boolean) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: read ? 1 : 0 } : m));
    if (selected?.id === id) setSelected(s => s ? { ...s, read: read ? 1 : 0 } : null);
  };

  // Step 1: show confirm dialog
  const askDelete = (msg: Message) => setConfirmTarget(msg);

  // Step 2: user confirmed — actually delete
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`Message from "${confirmTarget.name}" deleted`);
        setMessages(m => m.filter(x => x.id !== confirmTarget.id));
        if (selected?.id === confirmTarget.id) setSelected(null);
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to delete');
      }
    } catch { toast.error('Network error'); }
    setDeleting(false);
    setConfirmTarget(null);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id, true);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminShell username="mauryatushar115">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
            Messages
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {messages.length} messages{' '}
            {unreadCount > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>• {unreadCount} unread</span>}
          </p>
        </div>

        {/* Inbox + Detail split */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' : '1fr', gap: 20 }}>

          {/* Inbox List */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>Loading...</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '2.5rem' }}>📭</span>
                <p>No messages yet. Share your portfolio!</p>
              </div>
            ) : (
              <div>
                {messages.map((msg, i) => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: i < messages.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      cursor: 'pointer',
                      background: selected?.id === msg.id
                        ? 'rgba(99,102,241,0.08)'
                        : !msg.read ? 'rgba(99,102,241,0.04)' : 'transparent',
                      borderLeft: !msg.read ? '3px solid #6366f1' : '3px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: msg.read ? 500 : 700, fontSize: '0.88rem', color: msg.read ? '#94a3b8' : '#f8fafc' }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#475569', flexShrink: 0 }}>
                        {new Date(msg.created_at * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.subject || 'No subject'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2 }}>
                      {msg.message.slice(0, 60)}{msg.message.length > 60 ? '…' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail Panel */}
          {selected && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: '1rem', flexShrink: 0,
                  }}>
                    {selected.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{selected.name}</div>
                    <a href={`mailto:${selected.email}`} style={{ fontSize: '0.82rem', color: '#6366f1', textDecoration: 'none' }}>
                      {selected.email}
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => markRead(selected.id, !selected.read)}
                  >
                    {selected.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => askDelete(selected)}
                    disabled={deleting}
                    id="delete-message-btn"
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
              </div>

              {/* Subject */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Subject
                </div>
                <div style={{ color: '#f8fafc', fontWeight: 600 }}>{selected.subject || 'No subject'}</div>
              </div>

              {/* Body */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Message
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </p>
              </div>

              {/* Timestamp */}
              <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                {new Date(selected.created_at * 1000).toLocaleString('en-IN')}
              </div>

              {/* Reply button */}
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your portfolio inquiry'}`}
                className="btn btn-primary btn-sm"
                style={{ alignSelf: 'flex-start' }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Reply via Email
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirm Delete Dialog */}
      {confirmTarget && (
        <ConfirmDialog
          senderName={confirmTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </AdminShell>
  );
}
