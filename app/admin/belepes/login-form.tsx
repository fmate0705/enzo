'use client';

import { useActionState } from 'react';
import { login, type ActionState } from '../actions';
import { Field, FormMessage, SubmitButton, TextInput } from '@/components/admin/ui';

const initial: ActionState = { ok: false, message: '' };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(login, initial);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <Field label="Felhasználónév">
        <TextInput
          name="username"
          autoComplete="username"
          required
          autoFocus
          spellCheck={false}
          autoCapitalize="none"
        />
      </Field>

      <Field label="Jelszó">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>

      <FormMessage state={state} />

      <div className="mt-2">
        <SubmitButton>Belépés</SubmitButton>
      </div>
    </form>
  );
}
