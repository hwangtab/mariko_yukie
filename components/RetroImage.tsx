import Image from "next/image";

/* 레트로 인쇄 톤 + 스티커 프레임 이미지 */
export default function RetroImage({
  src,
  alt,
  width,
  height,
  className = "",
  frame = "navy",
  rotate = 0,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  frame?: "navy" | "coral" | "pink" | "none";
  rotate?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const frameClass =
    frame === "none"
      ? ""
      : frame === "coral"
        ? "sticker sticker-coral"
        : frame === "pink"
          ? "sticker sticker-pink"
          : "sticker";
  return (
    <div
      className={`overflow-hidden rounded-card bg-cream ${frameClass} ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="print-tone h-full w-full object-cover"
      />
    </div>
  );
}
