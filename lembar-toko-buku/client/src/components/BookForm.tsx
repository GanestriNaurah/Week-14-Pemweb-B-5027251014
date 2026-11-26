import { useState } from "react";
import type { FormEvent } from "react";
import { GENRE } from "../types";
import type { Book, BookInput, Genre } from "../types";
import { btnGhost, btnPrimary, inputForm } from "../ui";

type BookFormProps = {
  book: Book | null; // null = tambah, ada isi = edit
  onSubmit: (data: BookInput) => Promise<void>;
  onCancel: () => void;
};

const label = "flex flex-col gap-1.5 text-[.94rem] font-semibold";

export default function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const [judul, setJudul] = useState(book?.judul ?? "");
  const [penulis, setPenulis] = useState(book?.penulis ?? "");
  const [tahun, setTahun] = useState(book ? String(book.tahun) : "");
  const [genre, setGenre] = useState<Genre>(book?.genre ?? "Fiksi");
  const [harga, setHarga] = useState(book ? String(book.harga) : "");
  const [pesan, setPesan] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setPesan(null);
    try {
      await onSubmit({
        judul: judul.trim(),
        penulis: penulis.trim(),
        tahun: Number(tahun),
        genre,
        harga: Number(harga) || 0,
      });
    } catch (err) {
      setPesan(err instanceof Error ? err.message : "Buku belum tersimpan.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <h2 className="mb-1 font-display text-2xl font-bold tracking-tight">
        {book ? "Edit buku" : "Tambah buku"}
      </h2>

      <label className={label}>
        Judul
        <input
          className={inputForm}
          required
          maxLength={120}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Contoh: Laskar Pelangi"
        />
      </label>
      <label className={label}>
        Penulis
        <input
          className={inputForm}
          required
          maxLength={80}
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
          placeholder="Contoh: Andrea Hirata"
        />
      </label>
      <label className={label}>
        Tahun terbit
        <input
          className={inputForm}
          type="number"
          required
          min={1000}
          max={2100}
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          placeholder="2005"
        />
      </label>
      <label className={label}>
        Genre
        <select
          className={inputForm}
          value={genre}
          onChange={(e) => setGenre(e.target.value as Genre)}
        >
          {GENRE.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        Harga (Rp)
        <input
          className={inputForm}
          type="number"
          min={0}
          step={1000}
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          placeholder="89000"
        />
      </label>

      {pesan && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {pesan}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2.5">
        <button type="button" className={btnGhost} onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className={btnPrimary} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan buku"}
        </button>
      </div>
    </form>
  );
}
