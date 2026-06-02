import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/content";

const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.2];
const frames = ["sticker", "sticker sticker-coral", "sticker sticker-pink"];

export default function Gallery({
  items,
  locale,
}: {
  items: GalleryItem[];
  locale: Locale;
}) {
  return (
    <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
      {items.map((it, i) => (
        <figure
          key={it.file}
          className={`group break-inside-avoid overflow-hidden rounded-card bg-cream ${frames[i % frames.length]}`}
          style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
        >
          <div className="relative overflow-hidden">
            <Image
              src={it.file}
              alt={it.caption[locale]}
              width={1280}
              height={720}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="print-tone h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <figcaption className="flex items-center gap-2 border-t-2 border-navy/10 px-3 py-2 font-hand text-lg font-bold text-navy">
            <span className="star inline-block h-3 w-3 shrink-0 text-coral" />
            {it.caption[locale]}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
