import type { Book } from "../types";
import { chipKecil } from "../ui";
import { rupiah } from "../utils";
import Cover from "./Cover";

type BookCardProps = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <article className="card flex flex-col gap-3.5">
      <Cover judul={book.judul} penulis={book.penulis} genre={book.genre} />
      <div>
        <h3 className="font-display text-[1.1rem] leading-tight tracking-tight [overflow-wrap:anywhere]">
          {book.judul}
        </h3>
        <p className="text-[.94rem] text-ink-soft">{book.penulis}</p>
        <p className="mt-1.5 font-bold">{rupiah(book.harga || 0)}</p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="rounded-full border-2 border-ink bg-lilac px-3 py-0.5 text-[.82rem] font-semibold">
            {book.tahun}
          </span>
          <div className="flex gap-1.5">
            <button className={`${chipKecil} hover:bg-sun`} onClick={() => onEdit(book)}>
              Edit
            </button>
            <button className={`${chipKecil} hover:bg-blush`} onClick={() => onDelete(book)}>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
