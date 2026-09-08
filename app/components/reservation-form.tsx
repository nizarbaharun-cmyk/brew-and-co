"use client";

import { useActionState, useEffect, useRef, useSyncExternalStore } from "react";
import { reserveTable } from "@/app/actions/reserve";
import {
  MAX_PARTY,
  formatDateId,
  maxDateInBali,
  todayInBali,
  whatsappMessage,
  type ReservationState,
} from "@/app/lib/reservation";
import { SHOP } from "@/app/data/site";
import { Button, ButtonLink } from "./ui/button";
import { Field, Input } from "./ui/field";
import { CheckIcon } from "./icons";

const initialState: ReservationState = { status: "idle" };

/** The value is fixed for the session, so there is nothing to subscribe to. */
const neverChanges = () => () => {};
const serverUnknown = () => undefined;

export function ReservationForm() {
  const [state, formAction, pending] = useActionState(reserveTable, initialState);
  const summaryRef = useRef<HTMLDivElement>(null);

  // This page is statically prerendered, so a build-time date would go stale and
  // `min` would start allowing days in the past. Read the bounds on the client
  // instead: `Intl` with an explicit timeZone gives Bali's date in the browser
  // too, and the server snapshot returns undefined so there is no hydration
  // mismatch. Both snapshots return strings, which compare by value, so React
  // does not re-render in a loop.
  //
  // The Server Action re-validates against the real clock regardless — these
  // attributes are a convenience, never the guarantee.
  const today = useSyncExternalStore(neverChanges, todayInBali, serverUnknown);
  const latest = useSyncExternalStore(neverChanges, maxDateInBali, serverUnknown);

  // Move focus to the summary so a keyboard or screen-reader user is told what happened.
  useEffect(() => {
    if (state.status !== "idle") summaryRef.current?.focus();
  }, [state]);

  if (state.status === "sent") {
    const message = whatsappMessage(state);
    return (
      <div
        ref={summaryRef}
        tabIndex={-1}
        className="rounded-card border border-border bg-surface p-6"
      >
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <CheckIcon className="size-5 text-success" />
          Permintaan siap dikirim
        </h3>

        <dl className="mt-4 space-y-1 text-base text-ink-secondary">
          <div className="flex gap-2">
            <dt className="text-ink-muted">Nama</dt>
            <dd className="text-ink">{state.nama}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">Jumlah</dt>
            <dd className="numeric text-ink">{state.jumlah} orang</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">Waktu</dt>
            <dd className="text-ink">
              {formatDateId(state.tanggal)}, jam {state.waktu.replace(":", ".")}
            </dd>
          </div>
        </dl>

        {/* Honest about what just happened: nothing is booked yet. */}
        <p className="mt-4 max-w-(--measure-prose) text-sm text-ink-secondary">
          Meja belum ditahan. Kirim rinciannya lewat WhatsApp dan kami balas untuk memastikan
          mejanya ada — biasanya di bawah satu jam pada jam buka.
        </p>

        <ButtonLink
          href={`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          Kirim lewat WhatsApp
        </ButtonLink>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : undefined;
  const values = state.status === "invalid" ? state.values : undefined;
  const errorList = errors ? Object.values(errors) : [];

  return (
    <form action={formAction} className="rounded-card border border-border bg-surface p-6">
      <div ref={summaryRef} tabIndex={-1} aria-live="polite" className="focus-ring rounded-sm">
        {errorList.length > 0 && (
          <p className="mb-4 rounded-control bg-danger-surface px-3 py-2 text-sm text-danger-ink">
            Ada {errorList.length} isian yang perlu diperbaiki di bawah.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama" error={errors?.nama} required className="sm:col-span-2">
          {(a11y) => (
            <Input
              {...a11y}
              name="nama"
              autoComplete="name"
              defaultValue={values?.nama}
              placeholder="Nama yang kami panggil nanti"
            />
          )}
        </Field>

        <Field
          label="Jumlah orang"
          error={errors?.jumlah}
          helper={`Sampai ${MAX_PARTY} orang`}
          required
        >
          {(a11y) => (
            <Input
              {...a11y}
              name="jumlah"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_PARTY}
              step={1}
              defaultValue={values?.jumlah ?? "2"}
            />
          )}
        </Field>

        <Field label="Tanggal" error={errors?.tanggal} required>
          {(a11y) => (
            <Input
              {...a11y}
              name="tanggal"
              type="date"
              min={today}
              max={latest}
              defaultValue={values?.tanggal}
            />
          )}
        </Field>

        <Field
          label="Jam"
          error={errors?.waktu}
          helper="Sesuai jam buka hari itu"
          required
          className="sm:col-span-2"
        >
          {(a11y) => (
            <Input
              {...a11y}
              name="waktu"
              type="time"
              step={900}
              defaultValue={values?.waktu ?? "10:00"}
            />
          )}
        </Field>
      </div>

      <Button type="submit" size="lg" loading={pending} className="mt-6 w-full sm:w-auto">
        Pesan meja
      </Button>
    </form>
  );
}
