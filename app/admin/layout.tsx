import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { logout } from './actions';
import { Wordmark } from '@/components/site/wordmark';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: { default: 'Adminisztráció', template: '%s — Admin' },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin shell.
 *
 * Rendered dynamically on every request — an admin page must never be served
 * from a static cache, and the session is read per request. The public site's
 * navbar and footer are deliberately absent: this is a tool, not a page of the
 * restaurant's website, and mixing the two invites editing the wrong thing.
 */
export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Áttekintés' },
  { href: '/admin/etlap', label: 'Étlap' },
  { href: '/admin/elerhetoseg', label: 'Elérhetőség' },
  { href: '/admin/ceges-adatok', label: 'Céges adatok' },
  { href: '/admin/jogi', label: 'Jogi szövegek' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page renders inside this layout but without the chrome.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <Wordmark size="sm" href="/admin" descriptor={false} />
            <span className="rounded-sm border border-primary/40 px-2 py-0.5 text-[0.6875rem] uppercase tracking-[0.16em] text-primary">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              Oldal megtekintése ↗
            </Link>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Kilépés
              </Button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin navigáció" className="mx-auto max-w-6xl px-6">
          <ul className="-mb-px flex flex-wrap gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
