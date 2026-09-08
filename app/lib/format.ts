const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * The only place currency is formatted. Produces `Rp 18.000`.
 *
 * Intl emits a non-breaking space after `Rp`, which is what we want — a price
 * must never wrap between the symbol and the figure.
 */
export function formatRupiah(amount: number) {
  return rupiah.format(amount);
}
