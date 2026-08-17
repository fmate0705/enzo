import { getContent } from '@/lib/store/store';
import { LEGAL_DOCS } from '@/lib/store/types';
import { LegalEditor } from './legal-editor';

export const metadata = { title: 'Jogi szövegek' };
export const dynamic = 'force-dynamic';

export default async function AdminLegalPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Jogi szövegek</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          A négy jogi dokumentum teljes szövege szerkeszthető. A <code>{'{{...}}'}</code> jelölések
          automatikusan a Céges adatok és az Elérhetőség lapon megadott értékekre cserélődnek — így
          az adószámot elég egyszer megadni.
        </p>
      </div>

      <LegalEditor docs={LEGAL_DOCS.map((doc) => ({ ...doc, ...content.legal[doc.id] }))} />
    </div>
  );
}
