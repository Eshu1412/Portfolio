'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorGlow — a smooth neon cursor follower that renders a
 * softly-glowing orb + a trailing dot behind the real cursor.
 * Gracefully hidden on touch/mobile devices.
 */
export default function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-primary devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let outerX = 0, outerY = 0;
    let innerX = 0, innerY = 0;
    let mouseX = 0, mouseY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      // Inner dot snaps fast
      innerX += (mouseX - innerX) * 0.35;
      innerY += (mouseY - innerY) * 0.35;
      // Outer ring lags behind for the "trail" feel
      outerX += (mouseX - outerX) * 0.085;
      outerY += (mouseY - outerY) * 0.085;

      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${innerX - 4}px, ${innerY - 4}px)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate(${outerX - 22}px, ${outerY - 22}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 44, height: 44,
          borderRadius: '50%',
          border: '1px solid rgba(0, 245, 255, 0.35)',
          boxShadow: '0 0 16px rgba(0,245,255,0.15), inset 0 0 8px rgba(0,245,255,0.05)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'opacity 0.3s',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
      {/* Inner sharp dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#00f5ff',
          boxShadow: '0 0 12px 3px rgba(0,245,255,0.5)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </>
  );
}
