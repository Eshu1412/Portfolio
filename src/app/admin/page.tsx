'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from './admin.module.css';

interface Stats {
  projects: { total: number; completed: number; inProgress: number; pending: number };
  skills: { total: number };
  messages: { total: number; unread: number; recent: any[] };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.projects.total, icon: '📁', color: '#6366f1', sub: `${stats.projects.completed} completed` },
    { label: 'In Progress', value: stats.projects.inProgress, icon: '🔄', color: '#06b6d4', sub: `${stats.projects.pending} pending` },
    { label: 'Total Skills', value: stats.skills.total, icon: '⚡', color: '#8b5cf6', sub: 'across all categories' },
    { label: 'Unread Messages', value: stats.messages.unread, icon: '📧', color: '#f59e0b', sub: `${stats.messages.total} total` },
  ] : [];

  return (
    <AdminShell username="mauryatushar115">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Welcome back! Here's an overview of your portfolio.</p>
          </div>
          <div className={styles.headerTime}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stat Cards */}
        <div className={styles.statsGrid}>
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.statCard} style={{ height: 120, background: 'rgba(255,255,255,0.02)' }} />
          )) : statCards.map((card) => (
            <div key={card.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statIcon} style={{ background: `${card.color}15` }}>{card.icon}</span>
                <span className={styles.statValue} style={{ color: card.color }}>{card.value}</span>
              </div>
              <div className={styles.statLabel}>{card.label}</div>
              <div className={styles.statSub}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Messages */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Messages</h2>
            <a href="/admin/messages" className="btn btn-ghost btn-sm">View All →</a>
          </div>

          {loading ? (
            <div style={{ color: '#475569', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
          ) : stats?.messages.recent.length === 0 ? (
            <div className={styles.emptyState}>
              <span style={{ fontSize: '2.5rem' }}>📭</span>
              <p>No messages yet. Share your portfolio to get started!</p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {stats?.messages.recent.map((msg: any) => (
                <div key={msg.id} className={`${styles.messageItem} ${!msg.read ? styles.unread : ''}`}>
                  <div className={styles.messageAvatar}>{msg.name[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.messageName}>
                      {msg.name}
                      {!msg.read && <span className={styles.unreadDot} />}
                    </div>
                    <div className={styles.messageEmail}>{msg.email}</div>
                    <div className={styles.messageText}>{msg.message.slice(0, 100)}{msg.message.length > 100 ? '…' : ''}</div>
                  </div>
                  <div className={styles.messageTime}>
                    {new Date(msg.created_at * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 20 }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { href: '/admin/projects', label: '+ Add Project', icon: '📁' },
              { href: '/admin/skills', label: '+ Add Skill', icon: '⚡' },
              { href: '/admin/messages', label: 'View Messages', icon: '📧' },
              { href: '/admin/settings', label: 'Edit Profile', icon: '⚙️' },
            ].map(action => (
              <a key={action.href} href={action.href} className="btn btn-ghost">
                {action.icon} {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
