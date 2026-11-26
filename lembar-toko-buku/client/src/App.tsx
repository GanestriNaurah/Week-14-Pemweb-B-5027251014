import { useEffect, useMemo, useRef, useState } from "react";
import { createBook, deleteBook, getBooks, updateBook } from "./api";
import BookCard from "./components/BookCard";
import BookForm from "./components/BookForm";
import Cover from "./components/Cover";
import Modal from "./components/Modal";
import { GENRE } from "./types";
import type { Book, BookInput } from "./types";
import { btnDanger, btnGhost, btnPrimary } from "./ui";

type Urutan = "baru" | "judul" | "tahun";

const CONTOH = [
  { judul: "Buku pertamamu", penulis: "Kamu", genre: "Fiksi" },
  { judul: "Cerita baru", penulis: "Penulis favorit", genre: "Fantasi" },
  { judul: "Bacaan santai", penulis: "Siapa saja", genre: "Anak" },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [cari, setCari] = useState("");
  const [genreAktif, setGenreAktif] = useState("Semua");
  const [urut, setUrut] = useState<Urutan>("baru");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number>();

  function showToast(pesan: string) {
    setToast(pesan);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2800);
  }

  // GET: React -> Express -> Prisma -> Neon
  async function muatData() {
    try {
      setLoadError(null);
      setBooks(await getBooks());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  function bukaForm(book: Book | null) {
    setEditing(book);
    setFormOpen(true);
  }

  // POST atau PUT, tergantung ada tidaknya buku yang sedang diedit
  async function handleSubmit(data: BookInput) {
    if (editing) await updateBook(editing.id, data);
    else await createBook(data);
    setFormOpen(false);
    showToast("Buku disimpan");
    await muatData(); // perbarui daftar setelah berhasil
  }

  // DELETE
  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteBook(deleting.id);
      setDeleting(null);
      showToast("Buku dihapus");
      await muatData();
    } catch (err) {
      setDeleting(null);
      showToast(err instanceof Error ? err.message : "Buku belum terhapus.");
    }
  }

  const genreTersedia = useMemo(
    () => ["Semua", ...GENRE.filter((g) => books.some((b) => b.genre === g))],
    [books]
  );

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const hasil = books.filter(
      (b) =>
        (genreAktif === "Semua" || b.genre === genreAktif) &&
        (b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q))
    );
    if (urut === "judul") hasil.sort((a, b) => a.judul.localeCompare(b.judul, "id"));
    else if (urut === "tahun") hasil.sort((a, b) => b.tahun - a.tahun);
    else hasil.sort((a, b) => b.id - a.id);
    return hasil;
  }, [books, cari, genreAktif, urut]);

  const adaFilter = books.length > 0 && (cari.trim() !== "" || genreAktif !== "Semua");
  const heroBuku = books.length ? [...books].reverse().slice(0, 3) : CONTOH;

  return (
    <>
      {/* Navigasi */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b-2 border-ink bg-paper/90 px-4 py-3.5 backdrop-blur-md sm:px-8 lg:px-12">
        <a href="#" className="flex items-center gap-2 font-display text-[1.6rem] font-extrabold tracking-tight">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect x="3" y="4" width="8" height="20" rx="2" fill="#FF8A4C" />
            <rect x="11" y="2" width="8" height="22" rx="2" fill="#1D1B4C" />
            <rect x="19" y="6" width="6" height="18" rx="2" fill="#A8EBCB" transform="rotate(8 22 15)" />
          </svg>
          lembar
        </a>
        <label className="order-3 w-full sm:order-none sm:ml-auto sm:max-w-md sm:flex-1">
          <span className="sr-only">Cari buku</span>
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari judul atau penulis"
            className="w-full rounded-full border-2 border-ink bg-white px-[18px] py-[11px] placeholder:text-ink-soft"
          />
        </label>
        <button className={`${btnPrimary} ml-auto sm:ml-0`} onClick={() => bukaForm(null)}>
          Tambah buku
        </button>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-[1200px] items-center gap-6 px-4 pb-6 pt-10 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:pt-16 lg:px-12">
          <div>
            <h1 className="mb-4 font-display text-[clamp(2.4rem,6.2vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Bacaan seru,
              <br />
              rapi di satu rak.
            </h1>
            <p className="mb-4 max-w-[44ch] text-[1.1rem] text-ink-soft">
              Catat buku yang kamu punya, ubah kapan saja, dan temukan lagi dalam sekejap.
            </p>
            <p className="inline-block rounded-full border-2 border-ink bg-mint px-4 py-1.5 font-medium">
              <strong>{books.length}</strong> buku di rakmu
            </p>
          </div>
          <div className="stack relative h-[280px] md:h-[340px]" aria-hidden="true">
            {heroBuku.map((b, i) => (
              <Cover key={i} judul={b.judul} penulis={b.penulis} genre={b.genre} />
            ))}
          </div>
        </section>

        {/* Rak */}
        <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 lg:px-12" aria-labelledby="judul-rak">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 id="judul-rak" className="font-display text-[1.9rem] font-bold tracking-tight">
              Koleksi buku
            </h2>
            <label className="flex items-center gap-2 font-medium text-ink-soft">
              Urutkan
              <select
                value={urut}
                onChange={(e) => setUrut(e.target.value as Urutan)}
                className="cursor-pointer rounded-full border-2 border-ink bg-white px-3.5 py-2 text-ink"
              >
                <option value="baru">Terbaru</option>
                <option value="judul">Judul A–Z</option>
                <option value="tahun">Tahun terbit</option>
              </select>
            </label>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {genreTersedia.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenreAktif(g)}
                className={`cursor-pointer rounded-full border-2 border-ink px-4 py-1.5 text-[.9rem] font-semibold ${
                  g === genreAktif ? "bg-ink text-white" : "bg-white text-ink hover:bg-sun"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {loadError && (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-danger bg-white px-4 py-3 font-medium text-danger"
            >
              <span>{loadError}</span>
              <button className={btnGhost} onClick={muatData}>
                Coba lagi
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-ink-soft">Memuat buku...</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] sm:gap-x-7 sm:gap-y-10">
              {daftar.map((b) => (
                <BookCard key={b.id} book={b} onEdit={bukaForm} onDelete={setDeleting} />
              ))}
            </div>
          )}

          {!loading && !loadError && daftar.length === 0 && (
            <div className="px-4 py-14 text-center">
              <div className="mx-auto size-[120px] rounded-t-full rounded-b-[14px] border-2 border-ink bg-sun shadow-[5px_5px_0_var(--color-ink)]" />
              <h3 className="mb-1.5 mt-4 font-display text-2xl font-bold tracking-tight">
                {adaFilter ? "Buku tidak ditemukan" : "Rakmu masih kosong"}
              </h3>
              <p className="mb-5 text-ink-soft">
                {adaFilter
                  ? "Coba kata kunci atau genre lain."
                  : "Tambahkan buku pertamamu untuk mulai mengisi rak."}
              </p>
              {!adaFilter && (
                <button className={btnPrimary} onClick={() => bukaForm(null)}>
                  Tambah buku
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t-2 border-ink px-4 py-7 text-center text-[.9rem] text-ink-soft">
        Lembar · tugas CRUD Express, Prisma, Neon, dan React
      </footer>

      {/* Form tambah / edit */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <BookForm book={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>

      {/* Konfirmasi hapus */}
      <Modal open={deleting !== null} onClose={() => setDeleting(null)}>
        <h2 className="mb-3 font-display text-2xl font-bold tracking-tight">Hapus buku ini?</h2>
        <p className="text-ink-soft">“{deleting?.judul}” akan dihapus dari rakmu.</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button className={btnGhost} onClick={() => setDeleting(null)}>
            Batal
          </button>
          <button className={btnDanger} onClick={handleDelete}>
            Hapus buku
          </button>
        </div>
      </Modal>

      {/* Notifikasi */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-ink bg-ink px-[22px] py-3 font-semibold text-white shadow-[4px_4px_0_var(--color-mint)] transition ${
          toast ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
