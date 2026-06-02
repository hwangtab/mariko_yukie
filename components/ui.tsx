import type { ReactNode } from "react";

/* 4-point 반짝이 별 */
export function Star({
  className = "",
  size = 16,
  twinkle = false,
}: {
  className?: string;
  size?: number;
  twinkle?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`star ${twinkle ? "twinkle" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/* 흩뿌린 반짝이 클러스터 (장식) */
export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none ${className}`}>
      <Star size={20} twinkle className="absolute left-0 top-0 text-yellow" />
      <Star size={12} className="twinkle-2 absolute left-6 top-7 text-cream" />
      <Star size={14} twinkle className="absolute left-10 top-1 text-pink" />
    </span>
  );
}

/* 픽셀 섹션 라벨 */
export function SectionLabel({
  children,
  tone = "navy",
}: {
  children: ReactNode;
  tone?: "navy" | "cream" | "coral";
}) {
  const color =
    tone === "cream"
      ? "text-cream/70"
      : tone === "coral"
        ? "text-coral-deep"
        : "text-navy-soft";
  return (
    <span
      className={`pixel inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${color}`}
    >
      <Star size={11} className="text-coral" />
      {children}
    </span>
  );
}

/* 빈티지 스탬프 배지 */
export function Stamp({
  children,
  tone = "coral",
}: {
  children: ReactNode;
  tone?: "coral" | "pink" | "blue" | "navy";
}) {
  const map = {
    coral: "border-coral text-coral",
    pink: "border-pink-deep text-pink-deep",
    blue: "border-blue-deep text-blue-deep",
    navy: "border-navy text-navy",
  } as const;
  return (
    <span
      className={`inline-flex -rotate-2 items-center rounded-full border-2 ${map[tone]} bg-cream/60 px-3 py-1 font-display text-xs`}
    >
      {children}
    </span>
  );
}

/* 리본 배너 */
export function Ribbon({ children }: { children: ReactNode }) {
  return <span className="ribbon rounded text-sm">{children}</span>;
}

/* 그루비 멀티컬러 캔디 스트라이프 디바이더 (크림 섹션 사이 리듬) */
export function GroovyWave({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <div
        className="h-7 border-y-2 border-navy md:h-9"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-coral) 0 22px, var(--color-yellow) 22px 44px, var(--color-pink) 44px 66px, var(--color-blue) 66px 88px, var(--color-teal) 88px 110px)",
        }}
      />
    </div>
  );
}

/* 무지개 물결 디바이더 — 5색 웨이브 스트로크 (사이키델릭) */
export function RainbowWave({ className = "" }: { className?: string }) {
  const colors = [
    "var(--color-coral)",
    "var(--color-yellow)",
    "var(--color-pink)",
    "var(--color-blue)",
    "var(--color-teal)",
  ];
  const d =
    "M0 18 C 160 2, 320 34, 480 18 S 800 2, 960 18 S 1280 34, 1440 18";
  return (
    <div aria-hidden className={`leading-[0] ${className}`}>
      <svg viewBox="0 0 1440 74" preserveAspectRatio="none" className="block h-11 w-full md:h-14">
        {colors.map((c, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={c}
            strokeWidth={8}
            strokeLinecap="round"
            transform={`translate(0 ${i * 11})`}
          />
        ))}
      </svg>
    </div>
  );
}

/* 해 두들 */
export function Sun({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden className={className}>
      <circle cx="22" cy="22" r="8" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="22"
          y1="22"
          x2="22"
          y2="4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${a} 22 22)`}
        />
      ))}
    </svg>
  );
}

/* 하트 두들 */
export function Heart({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 29" aria-hidden className={className}>
      <path
        d="M16 29S2 19 2 9C2 4 6 1 10 1c3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 10-14 20-14 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* 별 흩뿌림 (섹션 데코) — relative 부모 안에 절대배치 */
export function StarScatter() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Star size={22} twinkle className="absolute left-[6%] top-8 text-coral/70" />
      <Star size={14} className="twinkle-2 absolute right-[10%] top-12 text-pink/70" />
      <Star size={18} twinkle className="absolute right-[24%] top-4 text-yellow" />
      <Star size={12} className="twinkle-2 absolute left-[30%] top-2 text-blue/70" />
    </span>
  );
}

/* 물결 섹션 디바이더 */
export function WaveDivider({
  from = "var(--color-cream)",
  to = "var(--color-night)",
  flip = false,
}: {
  from?: string;
  to?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`relative -mb-px leading-[0] ${flip ? "wave-flip" : ""}`}
      style={{ background: from }}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[90px]"
      >
        <path
          fill={to}
          d="M0,40 C180,90 360,0 540,30 C720,60 900,95 1080,55 C1260,20 1380,45 1440,55 L1440,90 L0,90 Z"
        />
      </svg>
    </div>
  );
}
