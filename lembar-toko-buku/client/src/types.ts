export const GENRE = [
  "Fiksi", "Fantasi", "Romantis", "Anak",
  "Sains", "Teknologi", "Sejarah", "Motivasi",
] as const;

export type Genre = (typeof GENRE)[number];

// Bentuk data dari backend Week 10 (model Book di Prisma)
export type Book = {
  id: number;
  judul: string;
  penulis: string;
  tahun: number;
  genre: Genre;
  harga: number;
};

// Data yang dikirim saat POST / PUT
export type BookInput = {
  judul: string;
  penulis: string;
  tahun: number;
  genre: Genre;
  harga: number;
};
