import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const CHARS = '-./*!?#%&@$€()[]{}<>~0123456789abcdefghijklmnopqrstuvwxyz';
const FRAME_MS = 40;
const DURATION_MS = 1100; // whole reveal, regardless of how long the text is

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/**
 * Scrambled-text reveal for the hero headline.
 *
 * Replaces `use-dencrypt-effect`, which took ~14s to settle on this text — far
 * too long for a visitor's first impression of a name.
 *
 * Progress is driven by elapsed wall-clock time rather than a frame counter:
 * browsers throttle timers hard on a busy main thread, so a frame-counted
 * reveal crawls on slower machines. This always finishes in DURATION_MS, and
 * shows the final text immediately when the visitor asks for reduced motion.
 */
export const TextDecrypt = ({ text = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [result, setResult] = useState(prefersReducedMotion ? text : '');

  useEffect(() => {
    if (prefersReducedMotion || !text) {
      setResult(text);
      return undefined;
    }

    const start = performance.now();

    const id = setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / DURATION_MS);

      if (progress >= 1) {
        setResult(text);
        clearInterval(id);
        return;
      }

      const revealed = Math.floor(progress * text.length);
      setResult(
        text
          .split('')
          .map((char, i) => (i < revealed || char === ' ' ? char : randomChar()))
          .join('')
      );
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [text, prefersReducedMotion]);

  return <p>{result}&nbsp;</p>;
};
