export const rupiah = (n: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// Hash sederhana dari judul, dipakai untuk memilih warna sampul
export function hash(str: string): number {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export const PALET = [
  { c1: "#FF8A4C", c2: "#FFD95A", fg: "#1D1B4C" },
  { c1: "#A8EBCB", c2: "#D9CCFF", fg: "#1D1B4C" },
  { c1: "#FFB6D5", c2: "#FF8A4C", fg: "#1D1B4C" },
  { c1: "#1D1B4C", c2: "#5B5990", fg: "#FFFFFF" },
  { c1: "#D9CCFF", c2: "#FFB6D5", fg: "#1D1B4C" },
  { c1: "#FFD95A", c2: "#A8EBCB", fg: "#1D1B4C" },
];
