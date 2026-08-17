import { cn } from '@/lib/cn';

/**
 * Horizontal frame for page content.
 *
 * `wide` exists for full-bleed editorial rows (the gallery, the signature rail)
 * that need more room than the reading measure without going edge to edge.
 */
export function Container({
  className,
  children,
  wide = false,
}: {
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 sm:px-8 lg:px-12',
        wide ? 'max-w-[110rem]' : 'max-w-container',
        className,
      )}
    >
      {children}
    </div>
  );
}
