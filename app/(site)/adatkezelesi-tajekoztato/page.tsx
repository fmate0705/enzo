import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/site/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata('adatkezeles', '/adatkezelesi-tajekoztato', {
    fallbackDescription:
      'Az Enzo di Napoli weboldalának adatkezelési tájékoztatója: milyen adatokat kezelünk és milyen célból.',
  });
}

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage id="adatkezeles" />;
}
