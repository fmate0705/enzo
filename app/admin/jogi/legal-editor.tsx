'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { saveLegalDoc, type ActionState } from '../actions';
import { Checkbox, Field, FormBar, TextArea, TextInput } from '@/components/admin/ui';
import type { LegalDoc, LegalDocId } from '@/lib/store/types';
import { cn } from '@/lib/cn';

const initial: ActionState = { ok: false, message: '' };

type Doc = LegalDoc & { id: LegalDocId; route: string; label: string };

/**
 * The legal editor.
 *
 * One document at a time, each with its own form, so a save writes exactly the
 * document on screen. The tabs are client state; switching remounts the form,
 * which is what keeps `defaultValue` in step with the selected document.
 *
 * The body is Markdown in the constrained subset from lib/markdown.tsx — not
 * rich text and not HTML. That is a security decision as much as an editorial
 * one: the body renders on a public page, so the editor must not be able to put
 * a script tag there. Pasted HTML appears as literal characters.
 */
export function LegalEditor({ docs }: { docs: Doc[] }) {
  const [activeId, setActiveId] = useState<LegalDocId>(docs[0]?.id ?? 'impresszum');
  const active = docs.find((doc) => doc.id === activeId) ?? docs[0];
  if (!active) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1 border-b border-border">
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setActiveId(doc.id)}
            aria-pressed={doc.id === activeId}
            className={cn(
              'border-b-2 px-4 py-3 text-sm transition-colors',
              doc.id === activeId
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground',
            )}
          >
            {doc.label}
            {doc.draft ? <span className="ml-2 text-warning">●</span> : null}
          </button>
        ))}
      </div>

      <DocForm key={active.id} doc={active} />
    </div>
  );
}

function DocForm({ doc }: { doc: Doc }) {
  const [state, formAction] = useActionState(saveLegalDoc, initial);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={doc.id} />

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={doc.route}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.14em] text-primary underline-offset-4 hover:underline"
        >
          Oldal megtekintése ↗
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cím">
          <TextInput name="title" defaultValue={doc.title} required />
        </Field>
        <Field label="Utoljára frissítve" hint="Szabad szöveg, például: 2026. augusztus 15.">
          <TextInput name="updated" defaultValue={doc.updated} />
        </Field>
      </div>

      <Field label="Bevezető" hint="A cím alatt jelenik meg. Üresen hagyható.">
        <TextArea name="lede" defaultValue={doc.lede} rows={2} />
      </Field>

      <Field
        label="Szöveg"
        hint="## nagy cím · ### kis cím · - felsorolás · **félkövér** · [link](/utvonal) · {{company.taxNumber}}"
      >
        <TextArea
          name="body"
          defaultValue={doc.body}
          rows={26}
          className="font-mono text-xs"
          spellCheck={false}
        />
      </Field>

      <div className="rounded-sm border border-warning/40 bg-warning/5 p-5">
        <Checkbox
          label="Tervezet — figyelmeztető sáv megjelenítése az oldalon"
          name="draft"
          defaultChecked={doc.draft}
        />
        <p className="mt-3 text-xs leading-relaxed text-muted">
          A jelölés levétele csak a figyelmeztető sávot tünteti el. Ez nem jogi jóváhagyás — a
          szöveget közzététel előtt jogi szakértőnek kell ellenőriznie.
        </p>
      </div>

      <FormBar state={state} />
    </form>
  );
}
