import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "../components/ui/text-link";
import { ButtonLink } from "../components/ui/button";
import { ClockIcon, PinIcon } from "../components/icons";
import { FACILITIES, HOURS_SUMMARY, SHOP } from "../data/site";

export const metadata: Metadata = {
  title: "Tentang kami",
  description:
    "Cerita di balik Kedai Kopi Jembrana — dua orang yang pulang kampung, satu mesin bekas, dan kebiasaan menyeduh sejak jam enam pagi.",
};

/**
 * NOTE: the founders below are invented for this demo site, with the client's
 * permission. Replace with the real people before this goes anywhere public.
 */
export default function TentangPage() {
  return (
    <div className="px-(--space-gutter) py-(--space-section)">
      <header className="max-w-(--measure-prose)">
        <h1 className="font-display text-display-sm font-semibold text-balance text-ink type-section">
          Dua orang, satu mesin bekas
        </h1>
        <p className="mt-4 text-lg text-pretty text-ink-secondary">
          Kedai Kopi buka tahun 2018 di ruko sempit dekat pasar Negara. Waktu itu cuma ada enam
          kursi dan satu mesin espresso bekas yang dibeli dari kafe yang tutup di Denpasar.
        </p>
      </header>

      <div className="mt-(--space-section) grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
        <div className="max-w-(--measure-prose) space-y-5 text-base text-pretty text-ink-secondary">
          <p>
            <strong className="font-semibold text-ink">Ketut Sudana</strong> besar di Perancak,
            lima belas menit dari sini. Sepuluh tahun dia jadi barista di Denpasar dan Ubud,
            sampai bapaknya sakit dan dia pulang. Rencananya cuma sebentar. Ternyata dia sadar
            tidak ada satu pun tempat di Negara yang menyeduh kopi per gelas.
          </p>
          <p>
            <strong className="font-semibold text-ink">Ayu Pramesti</strong> yang bikin semua
            yang keluar dari oven. Dia belajar bikin roti dari neneknya, lalu tiga tahun kerja
            di dapur hotel di Seminyak sebelum memutuskan bahwa bangun jam empat pagi untuk
            orang yang tidak dia kenal sama sekali tidak masuk akal.
          </p>
          <p>
            Mereka ketemu waktu Ayu jadi pelanggan tetap yang selalu protes kopinya terlalu
            asam. Ketut akhirnya menawarkan: kalau memang tahu, coba bikin sendiri. Setahun
            kemudian mereka patungan sewa ruko.
          </p>
          <p>
            Sekarang kami menyangrai sendiri tiap Selasa dan Jumat, biji dari Kintamani, Gayo,
            dan Toraja. Yang tidak berubah sejak hari pertama: kopi mulai diseduh jam enam,
            dan siapa pun boleh duduk lama tanpa ditanya mau pesan lagi atau tidak.
          </p>
          <p>
            Open mic mulai karena teman Ketut kelupaan bawa pulang gitarnya, lalu ada yang
            main, lalu jadi kebiasaan tiap Jumat. Coffee tasting Sabtu pagi mulai karena
            terlalu banyak yang bertanya kenapa Gayo dan Toraja rasanya beda padahal
            sama-sama kopi.
          </p>
        </div>

        <div className="space-y-4">
          <Image
            src="/img/tentang/ruang-depan.webp"
            alt="Ruang depan kedai dengan meja kayu dan bingkai foto di dinding"
            width={1200}
            height={800}
            className="aspect-[3/2] w-full rounded-card object-cover"
            sizes="(min-width: 1024px) 400px, 90vw"
          />
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/img/tentang/rak-dan-radio.webp"
              alt="Rak berisi toples kopi dan radio lama"
              width={1200}
              height={800}
              className="aspect-square w-full rounded-card object-cover"
              sizes="(min-width: 1024px) 190px, 45vw"
            />
            <Image
              src="/img/tentang/meja-panjang.webp"
              alt="Meja panjang dari kayu di sisi konter"
              width={1200}
              height={800}
              className="aspect-square w-full rounded-card object-cover"
              sizes="(min-width: 1024px) 190px, 45vw"
            />
          </div>
        </div>
      </div>

      <section className="mt-(--space-section)">
        <h2 className="font-display text-3xl font-semibold text-ink type-section">
          Kalau mau mampir
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-border p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
              <ClockIcon className="size-5 text-ink-muted" />
              Jam buka
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              {HOURS_SUMMARY.map((row) => (
                <div key={row.days} className="flex justify-between gap-4">
                  <dt className="text-ink-secondary">{row.days}</dt>
                  <dd className="numeric text-ink">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card border border-border p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
              <PinIcon className="size-5 text-ink-muted" />
              Alamat
            </h3>
            <p className="mt-4 text-sm text-ink-secondary">
              {SHOP.street}
              <br />
              {SHOP.area}
              <br />
              {SHOP.region}
            </p>
            <ExternalLink
              href={`https://maps.google.com/?q=${SHOP.mapsQuery}`}
              variant="inline"
              className="mt-4 inline-block text-sm"
            >
              Buka di peta
            </ExternalLink>
          </div>

          <div className="rounded-card border border-border p-6">
            <h3 className="text-base font-semibold text-ink">Yang ada di sini</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
              {FACILITIES.map((facility) => (
                <li key={facility}>{facility}</li>
              ))}
            </ul>
          </div>
        </div>

        <ButtonLink href="/#pesan-meja" className="mt-8">
          Pesan meja
        </ButtonLink>
      </section>
    </div>
  );
}
