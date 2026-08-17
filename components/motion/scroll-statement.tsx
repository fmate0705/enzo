'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * A large statement whose words brighten in sequence as it scrolls through the
 * middle of the viewport.
 *
 * Used sparingly — twice on the whole site. It exists to slow the reader down at
 * the two moments the brand makes a claim, not to decorate every heading.
 *
 * The words are always present and always legible: the effect moves them from
 * muted to full foreground, never from invisible to visible. A visitor with
 * reduced motion, or without JavaScript, sees the finished state.
 */
export function ScrollStatement({
  text,
  className,
  /** Words rendered in the accent, by index. */
  accentWords = [],
  as: Tag = 'p',
  id,
}: {
  text: string;
  className?: string;
  accentWords?: readonly number[];
  as?: 'p' | 'h2' | 'blockquote';
  /** Required when the element labels a section via aria-labelledby. */
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 once it has
      // travelled to 35% — the band where the reader's eye actually is.
      const start = viewport * 0.85;
      const end = viewport * 0.35;
      const progress = (start - rect.top) / (start - end);
      node.style.setProperty('--statement-progress', String(Math.min(1, Math.max(0, progress))));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      data-statement=""
      className={cn('font-display', className)}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          data-statement-word=""
          className={cn(accentWords.includes(index) && 'text-primary')}
          style={{ '--word-index': index, '--word-count': words.length } as React.CSSProperties}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
