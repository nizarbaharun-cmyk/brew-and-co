import { HOURS, SHOP } from "@/app/data/site";

// No "use server" / "use client" here on purpose: both the browser and the
// Server Action import this, so there is exactly one set of rules.

export const MAX_PARTY = 8;
export const MAX_DAYS_AHEAD = 60;

export type ReservationErrors = Partial<
  Record<"nama" | "jumlah" | "tanggal" | "waktu", string>
>;

export type ReservationValues = {
  nama: string;
  jumlah: string;
  tanggal: string;
  waktu: string;
};

export type ReservationState =
  | { status: "idle" }
  | { status: "invalid"; errors: ReservationErrors; values: ReservationValues }
  | { status: "sent"; nama: string; jumlah: number; tanggal: string; waktu: string };

/**
 * Today in Bali as `YYYY-MM-DD`.
 *
 * A server clock is UTC. Using `new Date()` directly would put the server 8
 * hours behind Bali and reject valid same-day bookings every evening.
 */
export function todayInBali(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SHOP.timeZone }).format(now);
}

export function maxDateInBali(now = new Date()): string {
  const limit = new Date(now.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);
  return todayInBali(limit);
}

/** Formats `2026-09-12` as `Jumat, 12 September 2026`. Parsed as local noon to dodge DST edges. */
export function formatDateId(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d, 12));
}

function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12).getDay();
}

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validate(
  values: ReservationValues,
  now = new Date(),
): { ok: true; value: { nama: string; jumlah: number; tanggal: string; waktu: string } } | {
  ok: false;
  errors: ReservationErrors;
} {
  const errors: ReservationErrors = {};

  const nama = values.nama.trim();
  if (nama.length < 2) {
    errors.nama = "Isi nama supaya kami tahu meja ini untuk siapa.";
  } else if (nama.length > 60) {
    errors.nama = "Nama terlalu panjang, maksimal 60 karakter.";
  }

  const jumlah = Number(values.jumlah);
  if (!Number.isInteger(jumlah) || jumlah < 1) {
    errors.jumlah = "Isi jumlah orang, minimal 1.";
  } else if (jumlah > MAX_PARTY) {
    errors.jumlah = `Untuk lebih dari ${MAX_PARTY} orang, hubungi kami di ${SHOP.phone} supaya bisa kami atur.`;
  }

  const tanggal = values.tanggal;
  const today = todayInBali(now);
  const latest = maxDateInBali(now);
  if (!DATE.test(tanggal)) {
    errors.tanggal = "Pilih tanggal kedatangan.";
  } else if (tanggal < today) {
    errors.tanggal = "Tanggalnya sudah lewat. Pilih hari ini atau setelahnya.";
  } else if (tanggal > latest) {
    errors.tanggal = `Kami baru terima pesanan sampai ${MAX_DAYS_AHEAD} hari ke depan.`;
  }

  const waktu = values.waktu;
  if (!TIME.test(waktu)) {
    errors.waktu = "Pilih jam kedatangan.";
  } else if (!errors.tanggal) {
    const hours = HOURS[weekdayOf(tanggal)];
    if (!hours) {
      errors.waktu = "Kami tutup di hari itu.";
    } else if (waktu < hours.open || waktu > hours.close) {
      errors.waktu = `${hours.day} kami buka ${hours.open.replace(":", ".")} sampai ${hours.close.replace(":", ".")}.`;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { nama, jumlah, tanggal, waktu } };
}

/** The message the customer sends us, since nothing is stored on our side. */
export function whatsappMessage(v: {
  nama: string;
  jumlah: number;
  tanggal: string;
  waktu: string;
}): string {
  return `Halo Kedai Kopi, saya ${v.nama} mau pesan meja untuk ${v.jumlah} orang pada ${formatDateId(v.tanggal)} jam ${v.waktu.replace(":", ".")}.`;
}
