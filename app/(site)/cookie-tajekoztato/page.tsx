import type { Metadata } from 'next';
import { LegalDocumentPage, legalMetadata } from '@/components/site/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata('cookie', '/cookie-tajekoztato', {
    fallbackDescription:
      'Milyen sütiket és tárolást használ az Enzo di Napoli weboldala, és hogyan módosítható a hozzájárulás.',
  });
}

export default function CookiePolicyPage() {
  return <LegalDocumentPage id="cookie" />;
}
