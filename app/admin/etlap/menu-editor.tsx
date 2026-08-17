'use client';

import Image from 'next/image';
import { useActionState, useState } from 'react';
import { saveMenu, type ActionState } from '../actions';
import { Checkbox, Field, FormBar, Select, TextArea, TextInput } from '@/components/admin/ui';
import { categories, formatPrice, type MenuItem } from '@/content/menu';
import { cn } from '@/lib/cn';

const initial: ActionState = { ok: false, message: '' };

/**
 * The menu editor.
 *
 * One <form> for the whole menu rather than one per row: an operator fixing
 * prices touches eight rows and expects one Save, not eight. Fields are named
 * `field.index` and the row count travels with the form, which is what lets the
 * action rebuild the list without a client-side data model.
 *
 * Deletion is staged, not immediate — a row marked for removal stays visible,
 * struck through and undoable, until Save. Nothing is destroyed by a misclick.
 */
export function MenuEditor({ items, images }: { items: MenuItem[]; images: string[] }) {
  const [state, formAction] = useActionState(saveMenu, initial);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('mind');

  const toggleRemoved = (id: string) => {
    setRemoved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter === 'mind' || item.category === filter);

  return (
    <form action={formAction}>
      <input type="hidden" name="count" value={items.length} />

      {/* Category filter — 29 rows is a lot to scroll past to reach the drinks. */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border pb-3">
        {[{ id: 'mind', name: 'Mind' }, ...categories].map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setFilter(category.id)}
            aria-pressed={filter === category.id}
            className={cn(
              'px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors',
              filter === category.id ? 'text-primary' : 'text-muted hover:text-foreground',
            )}
          >
            {category.name}
            <span className="ml-2 text-muted/70">
              {category.id === 'mind'
                ? items.length
                : items.filter((i) => i.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="flex flex-col">
        {visible.map(({ item, index }) => {
          const isRemoved = removed.has(item.id);
          return (
            <li
              key={item.id}
              className={cn('border-b border-border/60 py-7', isRemoved && 'opacity-45')}
            >
              {/* Hidden so the action can match this row even when filtered out
                  of view — every row is submitted, not just the visible ones. */}
              <input type="hidden" name={`id.${index}`} defaultValue={item.id} />
              {isRemoved ? <input type="hidden" name="remove" value={item.id} /> : null}

              <div className="grid gap-5 lg:grid-cols-[7rem_minmax(0,1fr)]">
                {/* ---- Thumbnail ------------------------------------------ */}
                <div className="relative aspect-square w-full max-w-[7rem] overflow-hidden rounded-sm border border-border bg-surface">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="112px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center px-2 text-center text-[0.6875rem] text-muted">
                      Nincs fotó
                    </span>
                  )}
                </div>

                {/* ---- Fields --------------------------------------------- */}
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Név" className="sm:col-span-2">
                      <TextInput
                        name={`name.${index}`}
                        defaultValue={item.name}
                        disabled={isRemoved}
                        className={cn(isRemoved && 'line-through')}
                      />
                    </Field>

                    <Field label="Kategória">
                      <Select
                        name={`category.${index}`}
                        defaultValue={item.category}
                        disabled={isRemoved}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label={`Ár (Ft) — most ${formatPrice(item.price)}`}>
                      <TextInput
                        name={`price.${index}`}
                        type="number"
                        min={0}
                        step={10}
                        inputMode="numeric"
                        defaultValue={item.price}
                        disabled={isRemoved}
                      />
                    </Field>
                  </div>

                  <Field label="Leírás / összetevők">
                    <TextArea
                      name={`description.${index}`}
                      defaultValue={item.description}
                      rows={2}
                      disabled={isRemoved}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Fotó">
                      <Select
                        name={`image.${index}`}
                        defaultValue={item.image ?? ''}
                        disabled={isRemoved}
                      >
                        <option value="">— nincs fotó —</option>
                        {images.map((path) => (
                          <option key={path} value={path}>
                            {path.replace('/images/', '')}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label="Webcím (slug)" hint={`/etlap/${item.slug}`}>
                      <TextInput
                        name={`slug.${index}`}
                        defaultValue={item.slug}
                        disabled={isRemoved}
                        spellCheck={false}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Checkbox
                      label="„-tól” ár"
                      name={`priceFrom.${index}`}
                      defaultChecked={item.priceFrom}
                      disabled={isRemoved}
                    />
                    <Checkbox
                      label="Népszerű"
                      name={`popular.${index}`}
                      defaultChecked={item.popular}
                      disabled={isRemoved}
                    />
                    <Checkbox
                      label="Kiemelt a főoldalon"
                      name={`signature.${index}`}
                      defaultChecked={item.signature}
                      disabled={isRemoved}
                    />

                    <button
                      type="button"
                      onClick={() => toggleRemoved(item.id)}
                      className={cn(
                        'ml-auto text-xs uppercase tracking-[0.14em] underline-offset-4 hover:underline',
                        isRemoved ? 'text-primary' : 'text-danger',
                      )}
                    >
                      {isRemoved ? 'Mégsem törlöm' : 'Törlés'}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <FormBar state={state}>
        {removed.size > 0 ? (
          <span className="text-sm text-danger">
            {removed.size} tétel törlésre jelölve — mentéskor véglegesül.
          </span>
        ) : null}
      </FormBar>
    </form>
  );
}
