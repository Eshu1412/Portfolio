'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorGlow — A cinematic, multi-layered cybernetic cursor follower.
 * Features:
 * 1. Giant soft aura (flashlight effect)
 * 2. Rotating tech-ring wrapper
 * 3. Intense bright-white core
 */
export default function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-primary devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let outerX = 0, outerY = 0;
    let auraX = 0, auraY = 0;
    let innerX = 0, innerY = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let visible = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        if (outerRef.current) outerRef.current.style.opacity = '1';
        if (auraRef.current) auraRef.current.style.opacity = '1';
        if (innerRef.current) innerRef.current.style.opacity = '1';
      }
    };

    const tick = () => {
      // Core snaps almost instantly
      innerX += (mouseX - innerX) * 0.4;
      innerY += (mouseY - innerY) * 0.4;
      
      // Ring lags slightly
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;

      // Aura lags heavily
      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${innerX}px, ${innerY}px)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerX}px, ${outerY}px)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate(${auraX}px, ${auraY}px)`;
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
      <style>{`
        @keyframes cyberSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* 1. Giant Flashlight Aura */}
      <div
        ref={auraRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 0, height: 0,
          pointerEvents: 'none', zIndex: 99997,
          opacity: 0, transition: 'opacity 0.6s ease',
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute', top: -150, left: -150,
          width: 300, height: 300,
          background: 'radial-gradient(circle closest-side, rgba(0, 245, 255, 0.08) 0%, rgba(191, 0, 255, 0.02) 50%, transparent 100%)',
          borderRadius: '50%',
          mixBlendMode: 'screen',
        }} />
      </div>

      {/* 2. Rotating Tech Ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 0, height: 0, overflow: 'visible',
          pointerEvents: 'none', zIndex: 99998,
          opacity: 0, transition: 'opacity 0.4s',
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute', top: -20, left: -20,
          width: 40, height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(0, 245, 255, 0.1)',
          borderRight: '1.5px solid rgba(0, 245, 255, 0.8)',
          borderLeft: '1.5px solid rgba(191, 0, 255, 0.8)', // Dual-tone accent
          animation: 'cyberSpin 3s linear infinite',
          boxShadow: '0 0 15px rgba(0, 245, 255, 0.2), inset 0 0 10px rgba(191, 0, 255, 0.15)'
        }} />
      </div>

      {/* 3. Scorching Core Dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 0, height: 0, overflow: 'visible',
          pointerEvents: 'none', zIndex: 99999,
          opacity: 0, transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute', top: -4, left: -4,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 0 8px 2px #00f5ff, 0 0 16px 4px rgba(191,0,255,0.5)',
        }} />
      </div>
    </>
  );
}
