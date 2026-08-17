'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import type { ActionState } from '@/app/admin/actions';
import { cn } from '@/lib/cn';

/** Shared field chrome so every admin form looks and behaves the same. */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-xs uppercase tracking-[0.14em] text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-relaxed text-muted/80">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  'w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/60';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(controlClass, 'resize-y', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, props.className)} />;
}

export function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input type="checkbox" {...props} className="h-4 w-4 accent-[rgb(var(--cef-primary-rgb))]" />
      {label}
    </label>
  );
}

/**
 * The save button.
 *
 * Disabled and relabelled while the action is in flight, so a slow disk cannot
 * be double-submitted into two writes.
 */
export function SubmitButton({ children = 'Mentés' }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? 'Mentés…' : children}
    </Button>
  );
}

/** The result of the last save, announced to assistive technology. */
export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-sm border px-4 py-3 text-sm',
        state.ok
          ? 'border-success/40 bg-success/10 text-success'
          : 'border-danger/40 bg-danger/10 text-danger',
      )}
    >
      {state.message}
    </p>
  );
}

/** A sticky action bar so Save is reachable from anywhere in a long form. */
export function FormBar({ state, children }: { state: ActionState; children?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-10 flex flex-wrap items-center gap-4 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md">
      <SubmitButton />
      {children}
      <div className="min-w-0 flex-1">
        <FormMessage state={state} />
      </div>
    </div>
  );
}
