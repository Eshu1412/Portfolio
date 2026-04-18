'use client';

import { useEffect, useState } from 'react';

/**
 * PageLoader — a full-screen cyberpunk boot/loading sequence shown
 * for ~1.8s on first page load, then fades out to reveal the site.
 */
export default function PageLoader({ isDataLoaded = true, onFade }: { isDataLoaded?: boolean, onFade?: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'fade' | 'done'>('boot');
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [timerReady, setTimerReady] = useState(false);

  const BOOT_LINES = [
    'INITIALIZING NEURAL INTERFACE...',
    'LOADING ASSET MANIFESTS...',
    'COMPILING SHADER PROGRAMS...',
    'ESTABLISHING SECURE CHANNEL...',
    'BOOT SEQUENCE COMPLETE.',
  ];

  useEffect(() => {
    let prog = 0;

    // Tick progress bar
    const progInterval = setInterval(() => {
      prog = Math.min(prog + Math.random() * 12 + 4, 100);
      setProgress(Math.round(prog));
      if (prog >= 100) clearInterval(progInterval);
    }, 90);

    // Add terminal lines sequentially
    const lineTimers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setLines(prev => [...prev, line]), i * 320 + 200)
    );

    // Minimum boot time before fading
    const timer = setTimeout(() => setTimerReady(true), 1900);

    return () => {
      clearInterval(progInterval);
      lineTimers.forEach(clearTimeout);
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timerReady && isDataLoaded && phase === 'boot') {
      setPhase('fade');
      if (onFade) {
        // Trigger the home page animation slightly after the wipe starts for impact
        setTimeout(onFade, 150); 
      }
      const doneTimer = setTimeout(() => setPhase('done'), 1000);
      return () => clearTimeout(doneTimer);
    }
  }, [timerReady, isDataLoaded, phase, onFade]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000308 100%)',
        backdropFilter: 'blur(30px)',
        transition: phase === 'fade' 
          ? 'clip-path 0.75s cubic-bezier(0.8, 0, 0.2, 1), transform 0.8s cubic-bezier(0.8, 0, 0.2, 1)' 
          : 'none',
        clipPath: phase === 'fade' 
          ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' 
          : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        transform: phase === 'fade' ? 'translateY(-2vh) scale(1.02)' : 'translateY(0) scale(1)',
        pointerEvents: phase === 'fade' ? 'none' : 'all',
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.012) 2px, rgba(0,245,255,0.012) 4px)',
      }} />

      {/* Corner decorations */}
      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(corner => (
        <div key={corner} style={{
          position: 'absolute',
          top: corner.startsWith('top') ? 24 : undefined,
          bottom: corner.startsWith('bottom') ? 24 : undefined,
          left: corner.endsWith('Left') ? 24 : undefined,
          right: corner.endsWith('Right') ? 24 : undefined,
          width: 40, height: 40,
          borderTop: corner.startsWith('top') ? '1px solid rgba(0,245,255,0.4)' : 'none',
          borderBottom: corner.startsWith('bottom') ? '1px solid rgba(0,245,255,0.4)' : 'none',
          borderLeft: corner.endsWith('Left') ? '1px solid rgba(0,245,255,0.4)' : 'none',
          borderRight: corner.endsWith('Right') ? '1px solid rgba(0,245,255,0.4)' : 'none',
        }} />
      ))}

      {/* Logo */}
      <div 
        className="splash-logo"
        style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
        fontWeight: 900,
        letterSpacing: '0.15em',
        background: 'linear-gradient(to right, #ffffff, #dff0ff, #00f5ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 4,
        textShadow: '0 0 40px rgba(0,245,255,0.4)',
        filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.2)) drop-shadow(0 0 40px rgba(191,0,255,0.2))',
      }}>
        TUSHAR<span style={{ color: '#bf00ff', WebkitTextFillColor: 'initial', filter: 'drop-shadow(0 0 10px #bf00ff)'}}>.</span>M
      </div>

      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.65rem',
        color: 'rgba(0,245,255,0.4)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginBottom: 48,
      }}>
        // PORTFOLIO SYSTEM v2.0
      </div>

      {/* Terminal lines */}
      <div style={{
        width: 'min(480px, 90vw)',
        marginBottom: 32,
        minHeight: 120,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.68rem',
            color: i === lines.length - 1 ? '#00f5ff' : 'rgba(0,245,255,0.35)',
            letterSpacing: '0.08em',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: '#bf00ff', flexShrink: 0 }}>&gt;</span>
            {line}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: 'min(480px, 90vw)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(0,245,255,0.4)',
          marginBottom: 8,
          letterSpacing: '0.1em',
        }}>
          <span>LOADING</span>
          <span>{progress}%</span>
        </div>
        <div style={{
          height: 2,
          background: 'rgba(0,245,255,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00f5ff, #bf00ff)',
            boxShadow: '0 0 12px rgba(0,245,255,0.6)',
            transition: 'width 0.15s ease',
            borderRadius: 1,
          }} />
        </div>
      </div>
    {/* Animation Styles */}
    <style>{`
      @keyframes splashPulse {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.02); filter: brightness(1.2); }
      }
      .splash-logo {
        animation: splashPulse 3s ease-in-out infinite;
      }
    `}</style>
    </div>
  );
}
