import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { PageHeader } from './page-header';
import { DraftNotice } from './legal-layout';
import { Markdown } from '@/lib/markdown';
import { getSite, legalTokens } from '@/lib/site';
import type { LegalDocId } from '@/lib/store/types';
import { absoluteUrl } from '@/lib/site-url';

/**
 * Renders one legal document from the store.
 *
 * The four legal routes are now the same component with a different id. Their
 * title, lede, date, draft flag and full body all come from the store, so the
 * admin edits the text and the page changes — including the metadata, which is
 * generated from the same record rather than hard-coded beside it.
 *
 * The body goes through the constrained Markdown renderer, which never parses
 * or emits HTML. That is what makes it safe to let an authenticated editor
 * write text that appears on a public page.
 */
export async function LegalDocumentPage({ id }: { id: LegalDocId }) {
  const site = await getSite();
  const doc = site.content.legal[id];
  const tokens = legalTokens(site);

  return (
    <>
      <PageHeader title={doc.title} lede={doc.lede || undefined} />
      <Container className="pb-24 pt-20 md:pb-32 md:pt-28 lg:pt-32">
        <div className="legal-prose max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Utoljára frissítve: {doc.updated}
          </p>
          {doc.draft ? <DraftNotice /> : null}
          <Markdown source={doc.body} tokens={tokens} />
        </div>
      </Container>
    </>
  );
}

/**
 * Metadata for a legal route.
 *
 * The description is taken from the document's own lede so it tracks edits;
 * `fallbackDescription` covers documents whose lede is deliberately empty.
 */
export async function legalMetadata(
  id: LegalDocId,
  route: string,
  options: { fallbackDescription: string },
): Promise<Metadata> {
  const site = await getSite();
  const doc = site.content.legal[id];
  const description = (doc.lede || options.fallbackDescription).slice(0, 160);

  return {
    title: doc.title,
    description,
    alternates: { canonical: absoluteUrl(route) },
    openGraph: { url: absoluteUrl(route), title: `${doc.title} — ${site.name}`, description },
  };
}
