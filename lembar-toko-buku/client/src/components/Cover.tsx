import type { CSSProperties } from "react";
import { ART } from "../art";
import { PALET, hash } from "../utils";

type CoverProps = {
  judul: string;
  penulis: string;
  genre: string;
};

export default function Cover({ judul, penulis, genre }: CoverProps) {
  const h = hash(judul);
  const p = PALET[h % PALET.length];
  const style = { "--c1": p.c1, "--c2": p.c2, "--fg": p.fg } as CSSProperties;

  return (
    <div className={`cover pat${h % 4}`} style={style}>
      <span className="cover-title">{judul}</span>
      <svg
        className="cover-art"
        viewBox="0 0 100 100"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: ART[genre] ?? ART.Fiksi }}
      />
      <span className="cover-author">{penulis}</span>
    </div>
  );
}
