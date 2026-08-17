import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Actionable styling for the whole site.
 *
 * Corners are near-square (the luxury preset's 2px radius) rather than pill or
 * heavily rounded — rounded rectangles everywhere is the single loudest tell of
 * a template. Emphasis is carried by the brass fill and by letter-spacing, not
 * by shadow or gradient.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-sm',
    'font-medium uppercase tracking-[0.14em] leading-none',
    'transition-[background-color,color,border-color,opacity] duration-normal ease-standard',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        /** The order / menu action. One per screen region at most. */
        primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
        /** Equal weight, lower heat — used beside a primary. */
        outline: 'border border-primary/50 text-primary hover:border-primary hover:bg-primary/10',
        /** For placement over photography, where a fill would fight the image. */
        onImage:
          'border border-foreground/35 text-foreground backdrop-blur-[2px] hover:bg-foreground/10 hover:border-foreground/60',
        ghost: 'text-foreground hover:text-primary',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-12 px-6 text-xs',
        lg: 'h-14 px-8 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Variants {}

/** An action button. Use `ButtonLink` for navigation, `ExternalButtonLink` for other origins. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export interface ButtonLinkProps extends Variants {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/** Internal navigation styled as a button. */
export function ButtonLink({ href, className, variant, size, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </Link>
  );
}

/**
 * A link that leaves the site — Foodora, Google Maps, social.
 *
 * Always carries rel="noopener noreferrer" and an accessible name that says where
 * it goes, so a screen-reader user is told they are being handed to another site
 * before they follow the link.
 */
export function ExternalButtonLink({
  href,
  className,
  variant,
  size,
  children,
  label,
}: ButtonLinkProps & { label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </a>
  );
}
