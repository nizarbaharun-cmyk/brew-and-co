/**
 * One source of truth for the shop's facts. The About page renders these and
 * the reservation validator checks against them — keeping them in one place is
 * what stops the hours shown and the hours enforced from drifting apart.
 */

export const SHOP = {
  name: "Kedai Kopi",
  street: "Jl. Ngurah Rai No. 88",
  area: "Negara, Jembrana",
  region: "Bali 82218",
  phone: "+62 812 3456 7890",
  whatsapp: "6281234567890",
  email: "halo@kedaikopi.example",
  mapsQuery: "Negara+Jembrana+Bali",
  /** IANA zone for Bali (WITA, UTC+8). Server clocks are UTC — never use raw new Date(). */
  timeZone: "Asia/Makassar",
} as const;

/** Indexed by JavaScript's Date#getDay(): 0 = Minggu. `null` means closed. */
export const HOURS: ReadonlyArray<{ day: string; open: string; close: string } | null> = [
  { day: "Minggu", open: "08:00", close: "21:00" },
  { day: "Senin", open: "06:00", close: "20:00" },
  { day: "Selasa", open: "06:00", close: "20:00" },
  { day: "Rabu", open: "06:00", close: "20:00" },
  { day: "Kamis", open: "06:00", close: "20:00" },
  { day: "Jumat", open: "06:00", close: "20:00" },
  { day: "Sabtu", open: "06:00", close: "20:00" },
];

/** Collapsed for display, so the About page does not list seven near-identical rows. */
export const HOURS_SUMMARY = [
  { days: "Senin – Sabtu", time: "06.00 – 20.00" },
  { days: "Minggu", time: "08.00 – 21.00" },
] as const;

export const FACILITIES = [
  "Wifi 100 Mbps, tanpa kata sandi",
  "Colokan di setiap meja",
  "Area bebas asap rokok di dalam",
  "Meja panjang untuk kerja kelompok",
  "Parkir motor di depan, mobil di seberang",
] as const;

/**
 * Recurring, not one-off. Showing a weekday instead of a date means the page
 * never goes stale and stays statically prerendered.
 */
export const EVENTS = [
  {
    id: "open-mic",
    name: "Open mic",
    when: "Setiap Jumat, 17.30 – 20.00",
    description:
      "Bawa gitar, puisi, atau apa saja yang mau dibacakan. Daftar di kasir mulai jam lima, satu orang dapat dua lagu. Tidak ada tiket masuk.",
    image: "/img/acara/open-mic.webp",
    imageAlt: "Seseorang memainkan gitar akustik di ruang kedai kopi",
  },
  {
    id: "coffee-tasting",
    name: "Coffee tasting",
    when: "Setiap Sabtu, 09.00 – 10.30",
    description:
      "Cupping tiga biji yang sedang kami sangrai, dipandu barista. Delapan kursi, gratis, datang lebih awal karena sering penuh.",
    image: "/img/acara/coffee-tasting.webp",
    imageAlt: "Meja cupping dengan beberapa cangkir dan sendok tasting",
  },
] as const;
