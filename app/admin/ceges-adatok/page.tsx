import { getContent } from '@/lib/store/store';
import { CompanyEditor } from './company-editor';

export const metadata = { title: 'Céges adatok' };
export const dynamic = 'force-dynamic';

export default async function AdminCompanyPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Céges adatok</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Ezek a mezők az impresszumba és az adatkezelési tájékoztatóba kerülnek. Amíg üresek, a
          jogi oldalakon sárgával kiemelve jelenik meg, hogy hiányzik az adat — sosem találunk ki
          helyette semmit.
        </p>
      </div>

      <CompanyEditor company={content.company} />
    </div>
  );
}
