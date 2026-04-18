'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', newPassword: '' });
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.username}! 🎉`);
        router.push('/admin');
        router.refresh();
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!forgotForm.email) { toast.error('Enter your email first'); return; }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotForm.email }),
      });
      if (res.ok) {
        toast.success('OTP sent to your email!');
        setOtpSent(true);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully! Please log in.');
        setShowForgot(false);
        setOtpSent(false);
        setForgotForm({ email: '', otp: '', newPassword: '' });
      } else {
        toast.error(data.error || 'Reset failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgGrid} />
      </div>

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoRing}>
            <span className={styles.logoText}>TM</span>
          </div>
          <h1 className={styles.title}>
            {showForgot ? 'Reset Password' : 'Admin Panel'}
          </h1>
          <p className={styles.subtitle}>
            {showForgot
              ? 'Enter your email to receive a one-time password'
              : 'Sign in to manage your portfolio'}
          </p>
        </div>

        {!showForgot ? (
          // ── LOGIN FORM ──────────────────────────────────
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                className={`input ${styles.input}`}
                placeholder="mauryatushar115"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className={`input ${styles.input}`}
                placeholder="••••••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </>
              )}
            </button>

            <Link href="/" className={styles.backLink}>
              ← Back to Portfolio
            </Link>
          </form>
        ) : (
          // ── FORGOT PASSWORD FORM ────────────────────────
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="forgot-email">Email Address</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="forgot-email"
                  type="email"
                  className={`input ${styles.input}`}
                  placeholder="mauryatushar115@gmail.com"
                  value={forgotForm.email}
                  onChange={e => setForgotForm(p => ({ ...p, email: e.target.value }))}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleSendOtp}
                  disabled={forgotLoading || otpSent}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {forgotLoading ? <span className={styles.spinner} /> : otpSent ? 'Sent ✓' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="forgot-otp">One-Time Password</label>
                  <input
                    id="forgot-otp"
                    type="text"
                    className={`input ${styles.input} font-mono`}
                    placeholder="123456"
                    maxLength={6}
                    value={forgotForm.otp}
                    onChange={e => setForgotForm(p => ({ ...p, otp: e.target.value }))}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="forgot-new-password">New Password</label>
                  <input
                    id="forgot-new-password"
                    type="password"
                    className={`input ${styles.input}`}
                    placeholder="••••••••••••"
                    value={forgotForm.newPassword}
                    onChange={e => setForgotForm(p => ({ ...p, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${styles.submitBtn}`}
                  disabled={forgotLoading}
                  id="forgot-submit"
                >
                  {forgotLoading ? <span className={styles.spinner} /> : 'Reset Password'}
                </button>
              </>
            )}

            <button
              type="button"
              className={styles.backLink}
              onClick={() => { setShowForgot(false); setOtpSent(false); }}
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
