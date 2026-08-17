'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button, ButtonLink } from '@/components/ui/button';
import { restaurant } from '@/content/restaurant';

/**
 * The unexpected-error boundary.
 *
 * Reports the failure honestly, offers a retry, and — because this is a
 * restaurant — keeps the phone number reachable even when the page has broken.
 * The error is logged rather than swallowed; its message is never printed to the
 * visitor, since it can carry internal detail and means nothing to them.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error', error);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] items-center py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display mt-6 text-4xl text-foreground md:text-5xl">
            Valami <span className="text-primary">félresült.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Az oldal betöltése közben hiba történt. Próbálja meg újra — ha továbbra sem működik,
            telefonon bármikor elérhetőek vagyunk.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={reset} size="lg">
              Újratöltés
            </Button>
            <ButtonLink href="/" variant="outline" size="lg">
              Főoldal
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-muted">
            <a
              href={restaurant.phone.href}
              className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {restaurant.phone.display}
            </a>
          </p>

          {error.digest ? (
            <p className="mt-6 text-xs text-muted/70">Hibaazonosító: {error.digest}</p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
