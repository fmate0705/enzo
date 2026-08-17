import { getContent } from '@/lib/store/store';
import { ContactEditor } from './contact-editor';

export const metadata = { title: 'Elérhetőség' };
export const dynamic = 'force-dynamic';

export default async function AdminContactPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Elérhetőség és nyitvatartás</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Ezek az adatok jelennek meg a láblécen, a Megközelítés oldalon, a térkép hivatkozásain és
          a keresőknek küldött strukturált adatokban is. Egy helyen kell javítani őket.
        </p>
      </div>

      <ContactEditor contact={content.contact} />
    </div>
  );
}
