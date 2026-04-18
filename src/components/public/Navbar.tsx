'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '#about',    label: 'About'    },
  { href: '#skills',   label: 'Skills'   },
  { href: '#projects', label: 'Projects' },
  { href: '#contact',  label: 'Contact'  },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Scroll detection (glassmorphism trigger) ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ── */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.slice(1));

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        // Pick the section closest to the top of the viewport (most visible)
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveLink(`#${visible[0].target.id}`);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  /* ── Close mobile menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleMobileClick = () => setMobileOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>

        {/* ── Logo ── */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBracket}>[ </span>
          <span className={styles.logoText}>TM</span>
          <span className={styles.logoBracket}> ]</span>
          <span className={styles.logoDot} />
        </Link>

        {/* ── Desktop Links ── */}
        <ul className={styles.links}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${styles.link} ${activeLink === link.href ? styles.linkActive : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <a href="#contact" className="btn btn-primary btn-sm">
            Hire Me
          </a>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className={`${styles.bar} ${mobileOpen ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.mobileLink} ${activeLink === link.href ? styles.mobileLinkActive : ''}`}
            onClick={handleMobileClick}
          >
            <span style={{ color: 'rgba(0,245,255,0.3)', marginRight: 8 }}>//</span>
            {link.label}
          </a>
        ))}
        <div style={{ paddingTop: 16, paddingBottom: 8 }}>
          <a
            href="#contact"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleMobileClick}
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}
