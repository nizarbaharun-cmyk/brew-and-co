import fs from "node:fs";
import path from "node:path";
import { parseCsvRecords } from "@/app/lib/csv";

export const CATEGORIES = [
  { id: "espresso drinks", label: "Espresso", blurb: "Ditarik dari mesin, satu shot 18 gram." },
  { id: "brewed coffee", label: "Seduh manual", blurb: "Diseduh per gelas, digiling saat dipesan." },
  { id: "cold drinks", label: "Dingin", blurb: "Es batu dari air matang, dibikin tiap pagi." },
  { id: "pastries", label: "Pastry", blurb: "Dipanggang ulang tiap pagi jam setengah enam." },
  { id: "sandwiches", label: "Makan siang", blurb: "Dibuat saat dipesan, siap sekitar sepuluh menit." },
  { id: "coffee beans", label: "Biji untuk di rumah", blurb: "Disangrai tiap Selasa dan Jumat." },
] as const;

export type Category = (typeof CATEGORIES)[number]["id"];
export type Badge = "populer" | "favorit" | "baru";

export type MenuItem = {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: number;
  badge?: Badge;
  /** Resolved from the id; the loader proves the file exists at build time. */
  image: string;
};

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));
const BADGES = new Set<string>(["populer", "favorit", "baru"]);

function loadMenu(): MenuItem[] {
  const csvPath = path.join(process.cwd(), "docs", "menu-items.csv");
  const records = parseCsvRecords(fs.readFileSync(csvPath, "utf8"));

  return records.map((row, index) => {
    const where = `docs/menu-items.csv baris ${index + 2} (${row.name || row.id || "?"})`;

    if (!row.id) throw new Error(`${where}: kolom 'id' kosong`);
    if (!CATEGORY_IDS.has(row.category)) {
      throw new Error(
        `${where}: kategori '${row.category}' tidak dikenal. ` +
          `Pilihannya: ${[...CATEGORY_IDS].join(", ")}`,
      );
    }
    if (row.badge && !BADGES.has(row.badge)) {
      throw new Error(`${where}: badge '${row.badge}' tidak dikenal. Pilihannya: ${[...BADGES].join(", ")}`);
    }

    const price = Number(row.price);
    if (!Number.isInteger(price) || price <= 0) {
      throw new Error(`${where}: harga '${row.price}' harus bilangan bulat rupiah, mis. 18000`);
    }

    // A missing photo must fail the build, not render a broken image in production.
    const image = `/img/menu/${row.id}.webp`;
    if (!fs.existsSync(path.join(process.cwd(), "public", image))) {
      throw new Error(`${where}: foto tidak ada di public${image}`);
    }

    return {
      id: row.id,
      category: row.category as Category,
      name: row.name,
      description: row.description,
      price,
      ...(row.badge ? { badge: row.badge as Badge } : {}),
      image,
    };
  });
}

/**
 * Read once at module load. Both pages that use it are statically prerendered,
 * so this runs at build time and never at request time.
 */
export const MENU: readonly MenuItem[] = loadMenu();

/** Items the shop wants shown on the home page, in CSV order. */
export const POPULAR: readonly MenuItem[] = MENU.filter((item) => item.badge);

export function byCategory(category: Category): MenuItem[] {
  return MENU.filter((item) => item.category === category);
}
