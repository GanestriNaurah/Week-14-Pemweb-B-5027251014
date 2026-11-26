// Kumpulan utility class yang dipakai berulang
const tombol =
  "cursor-pointer whitespace-nowrap rounded-full border-2 border-ink px-[22px] py-[11px] font-semibold transition";

export const btnPrimary =
  tombol +
  " bg-tang text-ink shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--color-ink)] disabled:opacity-60";
export const btnGhost = tombol + " bg-white text-ink hover:bg-lilac";
export const btnDanger =
  tombol + " bg-danger text-white shadow-[3px_3px_0_var(--color-ink)]";

export const chipKecil =
  "cursor-pointer rounded-full border-2 border-ink bg-white px-3 py-1 text-[.84rem] font-semibold text-ink";

export const inputForm =
  "rounded-xl border-2 border-ink bg-paper px-3.5 py-[11px] text-base font-normal text-ink";
