import { Container } from '@/components/ui/container';
import { PageHeader } from './page-header';

/**
 * The shell every legal page uses: a readable measure, a consistent type
 * hierarchy, and a "last reviewed" date the client can keep current.
 */
export function LegalLayout({
  title,
  lede,
  updated,
  children,
}: {
  title: string;
  lede?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} lede={lede} />
      <Container className="pb-24 pt-20 md:pb-32 md:pt-28 lg:pt-32">
        <div className="legal-prose max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Utoljára frissítve: {updated}
          </p>
          {children}
        </div>
      </Container>
    </>
  );
}

/**
 * Marks a value only the business can supply.
 *
 * These are rendered visibly rather than filled with a plausible-looking
 * invention: a made-up company registration number on a published privacy policy
 * is a legal problem, not a placeholder. Every instance is listed in
 * docs/CONTENT-INVENTORY.md, and `pnpm run check:pending` fails the build gate
 * while any remain.
 */
export function PendingData({ children }: { children: React.ReactNode }) {
  return (
    <mark
      data-pending-client-data=""
      className="mx-0.5 rounded-sm border border-warning/40 bg-warning/10 px-1.5 py-0.5 text-warning"
    >
      {children}
    </mark>
  );
}

/** The banner that tells a reader — and the client — that the page is a draft. */
export function DraftNotice() {
  return (
    <aside
      role="note"
      className="not-prose my-10 border-l-2 border-warning bg-warning/5 p-6 text-sm leading-relaxed text-muted"
    >
      <p className="font-medium text-warning">Ellenőrzésre váró dokumentum</p>
      <p className="mt-2">
        Ez a tájékoztató sablon alapján készült, és a kiemelt mezők kitöltése, valamint jogi
        szakértői jóváhagyás nélkül nem tekinthető véglegesnek. A sárgával jelölt adatokat az
        üzemeltetőnek kell megadnia.
      </p>
    </aside>
  );
}
