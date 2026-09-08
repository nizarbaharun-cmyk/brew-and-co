import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { Tray } from "./components/tray";

// Variable fonts. `weight` is omitted on purpose — passing a weight array would
// download static instances and lose the axes. See docs/design/01-style-guide.md.
const display = Fraunces({
  variable: "--ff-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  variable: "--ff-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kedai Kopi — kopi, pastry, dan makan siang di Jembrana",
    template: "%s · Kedai Kopi",
  },
  description:
    "Kedai kopi lingkungan di Jembrana, Bali. Specialty coffee, pastry segar, makan siang ringan, open mic tiap Jumat malam, dan coffee tasting tiap Sabtu pagi.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EEF0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A0A03" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Ekstensi browser (mis. Trancy, Grammarly) menempelkan atribut ke <html>
    // sebelum React hydrate. `suppressHydrationWarning` hanya berlaku satu level,
    // jadi mismatch di dalam pohon tetap terlaporkan seperti biasa.
    <html
      lang="id"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <a
          href="#konten"
          className="sr-only rounded-control bg-primary px-4 text-primary-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-(--z-toast) focus:inline-flex focus:min-h-11 focus:items-center"
        >
          Lompat ke konten
        </a>

        <Tray>
          <SiteHeader />
          <main id="konten" className="scroll-mt-20">
            {children}
          </main>
          <SiteFooter />
        </Tray>
      </body>
    </html>
  );
}
