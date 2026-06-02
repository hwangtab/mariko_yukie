import Link from "next/link";
import { Star } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="night relative flex min-h-[75vh] flex-col items-center justify-center px-5 text-center">
      <Star size={26} className="twinkle absolute left-1/4 top-16 text-pink" />
      <Star size={18} className="twinkle-2 absolute right-1/4 top-24 text-blue" />
      <span className="font-display text-7xl text-yellow text-shadow-pop">404</span>
      <p className="mt-4 font-display text-2xl text-cream">
        페이지를 찾을 수 없습니다 · ページが見つかりません
      </p>
      <Link
        href="/ko"
        className="sticker sticker-coral mt-8 rounded-full bg-coral px-6 py-3 font-display text-cream transition hover:-translate-y-1"
      >
        홈으로 · ホームへ →
      </Link>
    </section>
  );
}
