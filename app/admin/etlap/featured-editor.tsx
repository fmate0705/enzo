'use client';

import Image from 'next/image';
import { useActionState, useState } from 'react';
import { saveFeatured, type ActionState } from '../actions';
import { Field, FormBar, Select } from '@/components/admin/ui';
import { formatPrice, type MenuItem } from '@/content/menu';

const initial: ActionState = { ok: false, message: '' };

/**
 * Picks the pizzas the home page features, and their order.
 *
 * Three slots rather than a checkbox list, because order matters as much as
 * selection: the first slot leads the home page reel. A checkbox group answers
 * "which three" and has nothing to say about "in what order", which is the half
 * of the question that decides what a visitor sees first.
 *
 * Reordering is done with buttons rather than by dragging. Drag-and-drop needs a
 * keyboard path and a screen-reader story to be usable at all, and for three
 * items a pair of arrows is faster to operate, works on a phone, and is
 * accessible without any of that machinery.
 *
 * The live preview is the point of the whole panel: the operator is choosing
 * photographs, so showing the names alone would make them guess.
 */
export function FeaturedEditor({ items, selected }: { items: MenuItem[]; selected: string[] }) {
  const [state, formAction] = useActionState(saveFeatured, initial);
  // Padded to a fixed three so the slots are stable while editing; empty
  // entries are dropped on save rather than blocking it.
  const [slots, setSlots] = useState<string[]>(() =>
    [0, 1, 2].map((index) => selected[index] ?? ''),
  );

  const setSlot = (index: number, slug: string) =>
    setSlots((current) => current.map((value, i) => (i === index ? slug : value)));

  const move = (index: number, delta: number) =>
    setSlots((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });

  const chosen = (slug: string) => items.find((item) => item.slug === slug);

  return (
    <form action={formAction} className="border border-border bg-surface/30 p-6">
      <h2 className="font-display text-xl text-foreground">Kiemelt pizzák a főoldalon</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        A főoldal „Amiért érdemes bejönni.” szekciója ezt a hármat mutatja, ebben a sorrendben. Az
        első helyen álló pizza jelenik meg elsőként.
      </p>

      <ol className="mt-6 flex flex-col gap-4">
        {slots.map((slug, index) => {
          const item = chosen(slug);
          return (
            <li key={index} className="flex items-start gap-4 border-t border-border/60 pt-4">
              <span className="mt-3 w-6 shrink-0 text-sm tabular-nums text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="relative mt-1 size-16 shrink-0 overflow-hidden rounded-sm border border-border/60 bg-background">
                {item?.image ? (
                  <Image src={item.image} alt="" fill sizes="64px" className="object-contain" />
                ) : null}
              </span>

              <Field label={`${index + 1}. hely`} className="min-w-0 flex-1">
                <Select
                  name={`featured.${index}`}
                  value={slug}
                  onChange={(event) => setSlot(index, event.target.value)}
                >
                  <option value="">— nincs kiválasztva —</option>
                  {items.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.name} · {formatPrice(option.price)}
                    </option>
                  ))}
                </Select>
              </Field>

              <span className="mt-7 flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`${index + 1}. hely feljebb`}
                  className="border border-border px-2 py-1 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === slots.length - 1}
                  aria-label={`${index + 1}. hely lejjebb`}
                  className="border border-border px-2 py-1 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <FormBar state={state} />
    </form>
  );
}
