import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

// Membungkus elemen <dialog> bawaan browser
export default function Modal({ open, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(440px,calc(100%-32px))] rounded-[22px] border-2 border-ink bg-white p-7 text-ink shadow-[8px_8px_0_var(--color-ink)] backdrop:bg-ink/45 backdrop:backdrop-blur-[3px]"
    >
      {open && children}
    </dialog>
  );
}
