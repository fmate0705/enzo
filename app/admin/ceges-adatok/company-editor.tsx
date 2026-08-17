'use client';

import { useActionState } from 'react';
import { saveCompany, type ActionState } from '../actions';
import { Field, FormBar, TextInput } from '@/components/admin/ui';
import { COMPANY_FIELDS, type CompanyContent } from '@/lib/store/types';

const initial: ActionState = { ok: false, message: '' };

export function CompanyEditor({ company }: { company: CompanyContent }) {
  const [state, formAction] = useActionState(saveCompany, initial);
  const missing = COMPANY_FIELDS.filter(({ key }) => company[key].trim() === '').length;

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {missing > 0 ? (
        <p className="rounded-sm border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          {missing} mező még üres. Amíg nincs kitöltve, az oldal nem publikálható.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {COMPANY_FIELDS.map(({ key, label, hint }) => {
          const empty = company[key].trim() === '';
          return (
            <Field key={key} label={empty ? `${label} — hiányzik` : label} hint={hint}>
              <TextInput
                name={key}
                defaultValue={company[key]}
                aria-invalid={empty || undefined}
                className={empty ? 'border-warning/50' : undefined}
              />
            </Field>
          );
        })}
      </div>

      <FormBar state={state} />
    </form>
  );
}
