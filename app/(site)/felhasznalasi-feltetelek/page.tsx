import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/site/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata('feltetelek', '/felhasznalasi-feltetelek', {
    fallbackDescription:
      'Az Enzo di Napoli weboldalának használatára vonatkozó feltételek: tartalom, árak és felelősség.',
  });
}

export default function TermsPage() {
  return <LegalDocumentPage id="feltetelek" />;
}
