import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { getContent } from '@/lib/store/store';
import { addMenuItem } from '../actions';
import { MenuEditor } from './menu-editor';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Étlap' };
export const dynamic = 'force-dynamic';

/**
 * Lists the photographs already in the project.
 *
 * The admin picks from these rather than uploading, so there is no upload
 * endpoint to defend — no content-type sniffing, no size caps, no filename
 * sanitising, no writable image volume. Adding a photograph is a developer
 * task, which for a menu that changes a few times a year is the right trade.
 */
async function availableImages(): Promise<string[]> {
  const roots = [
    { dir: join(process.cwd(), 'public/images/etelek'), prefix: '/images/etelek' },
    { dir: join(process.cwd(), 'public/images/etterem'), prefix: '/images/etterem' },
  ];
  const found: string[] = [];
  for (const root of roots) {
    try {
      const files = await readdir(root.dir);
      for (const file of files) {
        if (/\.(jpe?g|png|webp|avif)$/i.test(file)) found.push(`${root.prefix}/${file}`);
      }
    } catch {
      // A missing directory just means no options from it.
    }
  }
  return found.sort();
}

export default async function AdminMenuPage() {
  const [content, images] = await Promise.all([getContent(), availableImages()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Étlap</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {content.menu.length} tétel. A mentés után a nyilvános oldalak azonnal frissülnek. A
            „-tól” jelölés akkor kell, ha a Foodorán feláras feltétekkel bővíthető a tétel.
          </p>
        </div>
        <form action={addMenuItem}>
          <Button type="submit" variant="outline" size="sm">
            + Új tétel
          </Button>
        </form>
      </div>

      <MenuEditor items={content.menu} images={images} />
    </div>
  );
}
