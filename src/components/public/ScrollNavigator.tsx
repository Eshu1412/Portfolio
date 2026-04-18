'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

type SectionMeta = {
  id: string;
  label: string;
  accent: string;
  ambient: string;
};

const SECTIONS: SectionMeta[] = [
  {
    id: 'home',
    label: 'Home',
    accent: '#00f5ff',
    ambient:
      'radial-gradient(circle at 72% 38%, rgba(0,245,255,0.18), transparent 26%), radial-gradient(circle at 16% 70%, rgba(191,0,255,0.12), transparent 28%)',
  },
  {
    id: 'about',
    label: 'About',
    accent: '#6ee7ff',
    ambient:
      'radial-gradient(circle at 22% 42%, rgba(0,245,255,0.15), transparent 24%), radial-gradient(circle at 78% 62%, rgba(255,122,24,0.12), transparent 26%)',
  },
  {
    id: 'skills',
    label: 'Skills',
    accent: '#00ff88',
    ambient:
      'radial-gradient(circle at 24% 60%, rgba(0,255,136,0.14), transparent 24%), radial-gradient(circle at 80% 30%, rgba(0,245,255,0.12), transparent 28%)',
  },
  {
    id: 'projects',
    label: 'Projects',
    accent: '#bf00ff',
    ambient:
      'radial-gradient(circle at 76% 42%, rgba(191,0,255,0.18), transparent 24%), radial-gradient(circle at 22% 72%, rgba(255,0,128,0.12), transparent 26%)',
  },
  {
    id: 'contact',
    label: 'Contact',
    accent: '#ff7a18',
    ambient:
      'radial-gradient(circle at 18% 40%, rgba(255,122,24,0.16), transparent 24%), radial-gradient(circle at 78% 70%, rgba(0,245,255,0.11), transparent 26%)',
  },
];

export default function ScrollNavigator() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.18,
  });
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.55, 0.75],
        rootMargin: '-18% 0px -28% 0px',
      },
    );

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const activeMeta = SECTIONS.find(section => section.id === activeSection) ?? SECTIONS[0];

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMeta.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              background: activeMeta.ambient,
              mixBlendMode: 'screen',
            }}
          />
        </AnimatePresence>

        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${activeMeta.accent}, transparent)`,
            opacity: 0.45,
            scaleX: progress,
            transformOrigin: 'left center',
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: 26,
          transform: 'translateY(-50%)',
          zIndex: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 10,
          }}
          className="scroll-nav-desktop"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMeta.id}
              initial={{ opacity: 0, x: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.35 }}
              style={{
                minWidth: 118,
                padding: '10px 14px',
                borderRadius: 18,
                border: `1px solid ${activeMeta.accent}44`,
                background: 'rgba(5, 10, 24, 0.76)',
                boxShadow: `0 0 28px ${activeMeta.accent}22`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.55rem',
                  letterSpacing: '0.18em',
                  color: `${activeMeta.accent}bb`,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Current
              </div>
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  color: '#e5f4ff',
                  textTransform: 'uppercase',
                }}
              >
                {activeMeta.label}
              </div>
            </motion.div>
          </AnimatePresence>

          <div
            style={{
              position: 'relative',
              width: 2,
              height: 190,
              background: 'rgba(122,179,204,0.14)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${activeMeta.accent}, rgba(255,255,255,0.15))`,
                transformOrigin: 'top center',
                scaleY: progress,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SECTIONS.map(section => {
              const isActive = section.id === activeSection;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 10,
                    textDecoration: 'none',
                    pointerEvents: 'auto',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.58rem',
                      letterSpacing: '0.18em',
                      color: isActive ? section.accent : 'rgba(122,179,204,0.42)',
                      textTransform: 'uppercase',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {section.label}
                  </span>
                  <span
                    style={{
                      position: 'relative',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: `1px solid ${isActive ? section.accent : 'rgba(122,179,204,0.28)'}`,
                      background: isActive ? `${section.accent}22` : 'rgba(3,10,24,0.7)',
                      boxShadow: isActive ? `0 0 18px ${section.accent}66` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="scroll-nav-active-dot"
                        style={{
                          position: 'absolute',
                          inset: 2,
                          borderRadius: '50%',
                          background: section.accent,
                        }}
                      />
                    )}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${activeMeta.id}`}
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: 12,
            padding: '10px 16px',
            borderRadius: 999,
            border: `1px solid ${activeMeta.accent}33`,
            background: 'rgba(5, 10, 24, 0.8)',
            color: '#dff0ff',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 0 30px ${activeMeta.accent}18`,
            pointerEvents: 'none',
          }}
          className="scroll-nav-mobile"
        >
          {activeMeta.label}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
