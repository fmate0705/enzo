import { cn } from '@/lib/cn';
import { Container } from './container';

/**
 * A page section. Vertical rhythm lives here and nowhere else, so every band on
 * every page breathes identically.
 */
export function Section({
  className,
  children,
  id,
  size = 'md',
  as: Tag = 'section',
  'aria-labelledby': labelledBy,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  as?: 'section' | 'div' | 'article';
  'aria-labelledby'?: string;
}) {
  const padding = {
    sm: 'py-16 md:py-20',
    md: 'py-20 md:py-28 lg:py-32',
    lg: 'py-24 md:py-36 lg:py-44',
  }[size];

  return (
    <Tag id={id} aria-labelledby={labelledBy} className={cn('relative', padding, className)}>
      {children}
    </Tag>
  );
}

/**
 * The section opener: editorial headline, optional lede.
 *
 * Used by every section so hierarchy is identical site-wide. `id` is wired to the
 * section's aria-labelledby, which is why the heading always renders an id.
 */
export function SectionHeading({
  title,
  lede,
  id,
  align = 'left',
  level = 2,
  className,
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  id: string;
  align?: 'left' | 'center';
  level?: 1 | 2;
  className?: string;
}) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <Heading
        id={id}
        className={cn(
          'font-display text-3xl text-foreground md:text-4xl',
          align === 'center' && 'max-w-3xl',
        )}
      >
        {title}
      </Heading>
      {lede ? (
        <p
          className={cn(
            'max-w-2xl text-lg leading-relaxed text-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

export { Container };
