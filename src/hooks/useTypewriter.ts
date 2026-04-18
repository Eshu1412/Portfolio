'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * useTypewriter — types out a string character by character.
 * Loops through `strings` array with a pause between cycles.
 */
export function useTypewriter(strings: string[], options?: {
  typeSpeed?: number;   // ms per character (default 60)
  deleteSpeed?: number; // ms per character when deleting (default 35)
  pauseDelay?: number;  // ms pause at end of each string (default 1800)
}) {
  const { typeSpeed = 60, deleteSpeed = 35, pauseDelay = 1800 } = options ?? {};
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const safeStrings = useMemo(() => strings.filter(Boolean), [strings]);
  const current = safeStrings.length ? safeStrings[idx % safeStrings.length] : '';

  useEffect(() => {
    if (!current) {
      return;
    }

    if (!isDeleting && displayed === current) {
      const t = setTimeout(() => setIsDeleting(true), pauseDelay);
      return () => clearTimeout(t);
    }

    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setIdx(i => i + 1);
      return;
    }

    const delay = isDeleting ? deleteSpeed : typeSpeed;
    const t = setTimeout(() => {
      setDisplayed(isDeleting
        ? current.slice(0, displayed.length - 1)
        : current.slice(0, displayed.length + 1)
      );
    }, delay);

    return () => clearTimeout(t);
  }, [current, displayed, isDeleting, idx, typeSpeed, deleteSpeed, pauseDelay]);

  return displayed;
}
