'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Intercept internal anchor links to use custom SLOW Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      // If it's an internal link (e.g. href="#projects")
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        
        // Use a slow 2.2s duration with a majestic ease-out curve
        lenis.scrollTo(href, { 
          offset: -50, 
          duration: 2.2, 
          easing: (t: number) => 1 - Math.pow(1 - t, 4) // QuartOut easing
        });
      }
    };

    document.documentElement.addEventListener('click', handleAnchorClick);

    // Clean up on unmount
    return () => {
      document.documentElement.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
