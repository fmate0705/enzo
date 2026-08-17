import Link from 'next/link';
import { getContent } from '@/lib/store/store';
import { COMPANY_FIELDS, LEGAL_DOCS } from '@/lib/store/types';

export const dynamic = 'force-dynamic';

/**
 * The dashboard.
 *
 * Leads with what is unfinished rather than with vanity counts: the number of
 * company fields still blank and the documents still marked draft are the two
 * things standing between this site and launch, so they are the first thing the
 * operator sees every time they sign in.
 */
export default async function AdminHome() {
  const content = await getContent();

  const missing = COMPANY_FIELDS.filter(({ key }) => content.company[key].trim() === '');
  const drafts = LEGAL_DOCS.filter((doc) => content.legal[doc.id].draft);
  const withoutPhoto = content.menu.filter((item) => item.image === null);
  const updated =
    content.updatedAt === new Date(0).toISOString()
      ? 'Még nem szerkesztették'
      : new Intl.DateTimeFormat('hu-HU', { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(content.updatedAt),
        );

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-foreground">Áttekintés</h1>
        <p className="mt-3 text-sm text-muted">Utolsó mentés: {updated}</p>
      </div>

      {/* ---- What is outstanding ---------------------------------------- */}
      <section aria-labelledby="todo" className="rounded-sm border border-border p-6">
        <h2 id="todo" className="text-xs uppercase tracking-[0.16em] text-primary">
          Indulás előtt
        </h2>

        <ul className="mt-5 flex flex-col gap-4 text-sm">
          <li className="flex flex-wrap items-baseline gap-x-3">
            <span className={missing.length === 0 ? 'text-success' : 'text-warning'}>
              {missing.length === 0 ? '✔' : '●'}
            </span>
            <span className="text-foreground">
              Céges adatok —{' '}
              {missing.length === 0 ? 'minden mező kitöltve' : `${missing.length} hiányzik`}
            </span>
            {missing.length > 0 ? (
              <>
                <Link
                  href="/admin/ceges-adatok"
                  className="text-primary underline underline-offset-4"
                >
                  Kitöltés
                </Link>
                <span className="w-full text-xs text-muted">
                  {missing.map((f) => f.label).join(', ')}
                </span>
              </>
            ) : null}
          </li>

          <li className="flex flex-wrap items-baseline gap-x-3">
            <span className={drafts.length === 0 ? 'text-success' : 'text-warning'}>
              {drafts.length === 0 ? '✔' : '●'}
            </span>
            <span className="text-foreground">
              Jogi szövegek —{' '}
              {drafts.length === 0
                ? 'mind jóváhagyva'
                : `${drafts.length} még tervezetként jelenik meg`}
            </span>
            {drafts.length > 0 ? (
              <Link href="/admin/jogi" className="text-primary underline underline-offset-4">
                Áttekintés
              </Link>
            ) : null}
          </li>

          <li className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-muted">●</span>
            <span className="text-foreground">
              {withoutPhoto.length === 0
                ? 'Minden tételhez van fotó'
                : `${withoutPhoto.length} tételhez nincs fotó`}
            </span>
            {withoutPhoto.length > 0 ? (
              <span className="w-full text-xs text-muted">
                {withoutPhoto.map((i) => i.name).join(', ')} — ezek szöveges kártyaként jelennek
                meg.
              </span>
            ) : null}
          </li>
        </ul>

        <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted">
          A jogi szövegeket közzététel előtt jogi szakértőnek kell jóváhagynia. A „tervezet” jelölés
          levétele csak a figyelmeztető sávot tünteti el az oldalról — nem jelent jogi ellenőrzést.
        </p>
      </section>

      {/* ---- Quick links ------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/etlap', title: 'Étlap', detail: `${content.menu.length} tétel` },
          {
            href: '/admin/elerhetoseg',
            title: 'Elérhetőség',
            detail: `${content.contact.street}, ${content.contact.city}`,
          },
          {
            href: '/admin/ceges-adatok',
            title: 'Céges adatok',
            detail: `${COMPANY_FIELDS.length - missing.length}/${COMPANY_FIELDS.length} kitöltve`,
          },
          {
            href: '/admin/jogi',
            title: 'Jogi szövegek',
            detail: `${LEGAL_DOCS.length} dokumentum`,
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-sm border border-border p-5 transition-colors hover:border-primary/50"
          >
            <p className="font-display text-xl text-foreground transition-colors group-hover:text-primary">
              {card.title}
            </p>
            <p className="mt-2 text-xs text-muted">{card.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
