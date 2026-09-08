"use server";

import {
  validate,
  type ReservationState,
  type ReservationValues,
} from "@/app/lib/reservation";

/**
 * Validates a table request.
 *
 * This does NOT store a booking. There is no database, no email, and no
 * availability check — the shop confirms over WhatsApp. The success state says
 * so plainly rather than implying a table is held.
 *
 * Expected errors are returned as values, not thrown, per the Next.js docs
 * (01-getting-started/10-error-handling.md).
 */
export async function reserveTable(
  _prevState: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const values: ReservationValues = {
    nama: String(formData.get("nama") ?? ""),
    jumlah: String(formData.get("jumlah") ?? ""),
    tanggal: String(formData.get("tanggal") ?? ""),
    waktu: String(formData.get("waktu") ?? ""),
  };

  const result = validate(values);
  if (!result.ok) {
    // Echo the values back so a submit without JavaScript does not clear the form.
    return { status: "invalid", errors: result.errors, values };
  }

  return { status: "sent", ...result.value };
}
