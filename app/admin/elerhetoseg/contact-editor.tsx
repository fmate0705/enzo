'use client';

import { useActionState } from 'react';
import { saveContact, type ActionState } from '../actions';
import { Checkbox, Field, FormBar, TextArea, TextInput } from '@/components/admin/ui';
import type { ContactContent } from '@/lib/store/types';

const initial: ActionState = { ok: false, message: '' };

export function ContactEditor({ contact }: { contact: ContactContent }) {
  const [state, formAction] = useActionState(saveContact, initial);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {/* ---- Address ---------------------------------------------------- */}
      <section aria-labelledby="cim" className="flex flex-col gap-5">
        <h2 id="cim" className="text-xs uppercase tracking-[0.16em] text-primary">
          Cím
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Utca, házszám" className="sm:col-span-2">
            <TextInput name="street" defaultValue={contact.street} required />
          </Field>
          <Field label="Irányítószám">
            <TextInput name="postalCode" defaultValue={contact.postalCode} required />
          </Field>
          <Field label="Város">
            <TextInput name="city" defaultValue={contact.city} required />
          </Field>
          <Field label="Ország">
            <TextInput name="country" defaultValue={contact.country} />
          </Field>
          <Field label="Telefon" hint="Ahogy megjelenik; a hívható link ebből készül.">
            <TextInput name="phoneDisplay" defaultValue={contact.phoneDisplay} required />
          </Field>
          <Field label="Szélesség" hint="Térkép és strukturált adat.">
            <TextInput
              name="latitude"
              type="number"
              step="0.0000001"
              defaultValue={contact.latitude}
            />
          </Field>
          <Field label="Hosszúság">
            <TextInput
              name="longitude"
              type="number"
              step="0.0000001"
              defaultValue={contact.longitude}
            />
          </Field>
        </div>
      </section>

      {/* ---- Hours ------------------------------------------------------- */}
      <section aria-labelledby="nyitva" className="flex flex-col gap-5">
        <h2 id="nyitva" className="text-xs uppercase tracking-[0.16em] text-primary">
          Nyitvatartás
        </h2>
        <ul className="flex flex-col divide-y divide-border/60 rounded-sm border border-border">
          {contact.hours.map((day, index) => (
            <li
              key={day.schemaDay}
              className="grid items-center gap-4 p-4 sm:grid-cols-[8rem_1fr_1fr_9rem]"
            >
              <span className="text-sm text-foreground">{day.day}</span>
              <Field label="Nyit">
                <TextInput
                  name={`opens.${index}`}
                  defaultValue={day.opens ?? '11:00'}
                  placeholder="11:00"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Zár">
                <TextInput
                  name={`closes.${index}`}
                  defaultValue={day.closes ?? '22:00'}
                  placeholder="22:00"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                  inputMode="numeric"
                />
              </Field>
              <Checkbox
                label="Zárva"
                name={`closed.${index}`}
                defaultChecked={day.opens === null}
              />
            </li>
          ))}
        </ul>
        <Field
          label="Kiszállítási megjegyzés"
          hint="A nyitvatartás alatt jelenik meg, ha a szállítás korábban zár."
        >
          <TextInput name="deliveryHoursNote" defaultValue={contact.deliveryHoursNote} />
        </Field>
      </section>

      {/* ---- Services and links ------------------------------------------ */}
      <section aria-labelledby="egyeb" className="flex flex-col gap-5">
        <h2 id="egyeb" className="text-xs uppercase tracking-[0.16em] text-primary">
          Szolgáltatások és hivatkozások
        </h2>
        <Field label="Szolgáltatások" hint="Soronként egy, például: Elvitel">
          <TextArea name="services" defaultValue={contact.services.join('\n')} rows={4} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Foodora" hint="Minden rendelés gomb ide mutat.">
            <TextInput name="foodoraUrl" type="url" defaultValue={contact.foodoraUrl} />
          </Field>
          <Field label="Facebook">
            <TextInput name="facebookUrl" type="url" defaultValue={contact.facebookUrl} />
          </Field>
          <Field label="Instagram">
            <TextInput name="instagramUrl" type="url" defaultValue={contact.instagramUrl} />
          </Field>
          <Field label="Turul Gasztronómia">
            <TextInput name="turulUrl" type="url" defaultValue={contact.turulUrl} />
          </Field>
        </div>
      </section>

      <FormBar state={state} />
    </form>
  );
}
