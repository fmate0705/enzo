import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/site/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata('impresszum', '/impresszum', {
    fallbackDescription: 'Az Enzo di Napoli weboldalának üzemeltetői és elérhetőségi adatai.',
  });
}

export default function ImpressumPage() {
  return <LegalDocumentPage id="impresszum" />;
}
