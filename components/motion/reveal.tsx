'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Reveals its children once, when they first enter the viewport.
 *
 * Three rules this component exists to enforce:
 *
 * 1. It never hides content from a visitor without JavaScript. The hidden state
 *    is scoped to `html.js`, a class set by a one-line script in the document, so
 *    if the script never runs the content is simply visible.
 * 2. It never replays. Content that re-animates every time it scrolls past is
 *    noise, and it makes long pages feel unstable.
 * 3. It obeys prefers-reduced-motion by revealing immediately, and the observer
 *    is skipped entirely.
 *
 * Only opacity and transform are animated — both composited, neither triggering
 * layout.
 */
export function Reveal({
  children,
  className,
  /** Stagger within a group. Kept small; long cascades read as a slideshow. */
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'section' | 'span';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      node.setAttribute('data-revealed', '');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      // Fire a little before the element is fully on screen, so the motion has
      // finished by the time the visitor is actually reading it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
